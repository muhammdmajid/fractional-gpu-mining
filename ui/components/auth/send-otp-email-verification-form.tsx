/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { MdAlternateEmail, MdErrorOutline } from "react-icons/md";
import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ui/primitives/form";
import IconInput from "../form/icon-input";
import SubmitButton from "../form/submit-button";
import { insertUserSchema } from "@/validation/user";
import { useAuthStep } from "@/providers/auth-steps-provider";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// ✅ Extract only required fields from schema
export const sendOtpEmail = insertUserSchema.pick({
  email: true,
});

type sendOtpEmailVerificationFormValues = z.infer<typeof sendOtpEmail>;

interface SendOtpEmailVerificationFormProps {}

export function SendOtpEmailVerificationForm({}: SendOtpEmailVerificationFormProps) {
  const { query } = useAuthStep();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<sendOtpEmailVerificationFormValues>({
    resolver: zodResolver(sendOtpEmail),
    defaultValues: { email: "" },
  });

  const { errors } = form.formState;

  const [loading, setLoading] = useState(false);

  async function onSubmit(input: sendOtpEmailVerificationFormValues) {
    try {
      setLoading(true);

      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: input.email.trim(),
        type: "email-verification", // updated type
      });

      if (data?.success) {
        setSuccessMessage(
          "A one-time password (OTP) has been sent to your email address for verification."
        );
        setErrorMessage(null);

        toast.success(
          "A one-time password (OTP) has been sent to your email address for verification."
        );
        // Redirect to the OTP verification page
        router.push(
          `/auth/verify-otp?step=verifyOtp&email=${encodeURIComponent(
            input.email.trim()
          )}`
        );
      } else {
        console.error(
          "Failed to send OTP for email verification:",
          error?.message ?? ""
        );
        setSuccessMessage(null);
        setErrorMessage(
          error?.message ||
            "Unable to send the verification code. Please try again."
        );
        toast.error(
          error?.message || "Failed to send OTP. Please try again later."
        );
      }
    } catch (error) {
      console.error(
        "Unexpected error during OTP email verification request:",
        error
      );
      const errMsg =
        "An unexpected error occurred while sending the verification code. Please try again shortly.";
      setErrorMessage(errMsg);
      setSuccessMessage(null);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (query?.email) {
      const decodedEmail = decodeURIComponent(query.email);
      const currentEmail = form.getValues("email");

      if (decodedEmail !== currentEmail) {
        form.setValue("email", decodedEmail, { shouldValidate: true });
      }
    }
  }, [query?.email, form]);

  return (
    <>
      {errorMessage ? (
        <ErrorMessage error={errorMessage} className="my-3" />
      ) : null}
      {successMessage ? (
        <SuccessMessage message={successMessage} className="my-3" />
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-start">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
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

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <SubmitButton
            loading={loading}
            text="Send OTP Email"
            loadingText="Sending..."
            errorText="Failed to Send – Retry"
            disabledText="Send OTP Email"
            BtnIcon={Send}
            className="mt-4"
          />
        </form>
      </Form>
    </>
  );
}
