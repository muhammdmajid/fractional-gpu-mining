"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GrUpdate } from "react-icons/gr";
import { MdAlternateEmail, MdErrorOutline } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";
import IconInput from "../form/icon-input";
import { OTPInput } from "../form/otp-input";
import SubmitButton from "../form/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/primitives/form";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { useAuthStep } from "@/providers/auth-steps-provider";
import { authClient } from "@/lib/auth-client";
import { insertUserSchema } from "@/validation/user";
import { OTP_LENGTH } from "@/lib/constants";


// Base schema: only email
const baseSchema = insertUserSchema.pick({ email: true });

// Extend schema to include OTP
const verifyOtpEmailVerificationSchema = baseSchema.extend({
  otpCode: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
});

export type VerifyOtpEmailVerificationFormValues = z.infer<
  typeof verifyOtpEmailVerificationSchema
>;

interface VerifyOtpEmailVerificationFormProps {
  resendHref?: string;
}

export default function VerifyOtpEmailVerificationForm({
  resendHref,
}: VerifyOtpEmailVerificationFormProps) {
  const router = useRouter();
  const fontSize = useResponsiveFont();
  const { query } = useAuthStep();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form with validation
  const form = useForm<VerifyOtpEmailVerificationFormValues>({
    resolver: zodResolver(verifyOtpEmailVerificationSchema),
    defaultValues: {
      email: "",
      otpCode: "",
    },
  });

  const { watch } = form;

  // Update form values if query params change
  useEffect(() => {
    const currentValues = form.getValues();

    if (query.email && query.email !== currentValues.email) {
      form.setValue(
        "email",
        decodeURIComponent(decodeURIComponent(query.email))
      );
      form.trigger("email");
    }

    if (query.otpCode && query.otpCode !== currentValues.otpCode) {
      form.setValue("otpCode", query.otpCode);
      form.trigger("otpCode");
    }
  }, [form, query]);

  // Clear error/success messages when form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const { errors } = form.formState;

  /**
   * Verify email OTP using authClient
   * Memoized with useCallback to prevent unnecessary re-creations
   */
  const handleOtpVerification = useCallback(
    async (data: VerifyOtpEmailVerificationFormValues) => {
      const { email, otpCode } = data;
      try {
        setLoading(true);

        const { data: response, error } = await authClient.emailOtp.verifyEmail({
          email: email.trim(),
          otp: otpCode.trim(),
        });

        if (response) {
          // OTP verified successfully
          setSuccessMessage(
            "Your email address has been successfully verified. You can now sign in to your account."
          );
          setErrorMessage(null);

          toast.success(
            "Your email address has been successfully verified. You can now sign in."
          );

          // Redirect to sign-in page
          router.push("/auth/sign-in?step=initial");
        } else {
          // OTP verification failed
          console.error(
            "Failed to verify OTP for email verification:",
            error?.message ?? ""
          );
          setSuccessMessage(null);
          setErrorMessage(
            error?.message ||
              "The OTP you entered is invalid or has expired. Please request a new one."
          );
          toast.error(
            error?.message ||
              "Failed to verify OTP. Please check the code or request a new one."
          );
        }
      } catch (err) {
        // Unexpected errors
        console.error("Unexpected error during OTP verification:", err);
        const errMsg =
          "An unexpected error occurred while verifying the OTP. Please try again shortly.";
        setErrorMessage(errMsg);
        setSuccessMessage(null);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const email = watch("email");

  return (
    <>
      {/* Display error or success messages */}
      {errorMessage && <ErrorMessage error={errorMessage} className="my-3" />}
      {successMessage && (
        <SuccessMessage message={successMessage} className="my-3" />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)} className="text-start">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  E-mail
                </FormLabel>
                <FormControl>
                  <IconInput
                    LeftIcon={MdAlternateEmail}
                    RightIcon={MdErrorOutline}
                    placeholder="name@example.com"
                    errors={errors?.email}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("email");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("email");
                    }}
                  />
                </FormControl>

                {/* Resend OTP link */}
                <div className="flex flex-row items-center justify-between text-center text-muted-foreground space-y-2">
                  <p
                    className="text-start mt-1"
                    style={{ fontSize: `${0.8 * fontSize}px` }}
                  >
                    Didn’t receive the OTP?
                  </p>
                  <Link
                    href={`${resendHref || "/email-verification"}?step=sendOtp${
                      email?.trim()
                        ? `&email=${encodeURIComponent(email.trim())}`
                        : ""
                    }`}
                    className="no-underline font-bold hover:text-primary"
                  >
                    Resend OTP
                  </Link>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* OTP Field */}
          <FormField
            control={form.control}
            name="otpCode"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  One-Time Password (OTP)
                </FormLabel>
                <FormControl>
                  <OTPInput
                    {...field}
                    placeholder="XXXXX"
                    required
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("otpCode");
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("otpCode");
                    }}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <SubmitButton
            loading={loading}
            text="Verify Email"
            loadingText="Verifying..."
            errorText="Failed — Retry"
            disabledText="Verify Email"
            BtnIcon={GrUpdate}
            className="mt-4"
          />
        </form>
      </Form>
    </>
  );
}
