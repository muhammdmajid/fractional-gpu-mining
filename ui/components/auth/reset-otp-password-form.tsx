/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ✅ Icons
import { Eye, EyeOff } from "lucide-react";
import { GrUpdate } from "react-icons/gr";
import { MdAlternateEmail, MdErrorOutline } from "react-icons/md";
import { HiKey } from "react-icons/hi";

// ✅ UI & Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/primitives/form";
import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";
import IconInput from "../form/icon-input";
import { OTPInput } from "../form/otp-input";
import SubmitButton from "../form/submit-button";

// ✅ Hooks & Utils
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { useAuthStep } from "@/providers/auth-steps-provider";
import { authClient } from "@/lib/auth-client";

// ✅ Validation & Types
import { resetPasswordSchema } from "@/validation/user";
import { ResetPasswordInput } from "@/types/user";
import { sendMail } from "@/email";
import { EmailTemplate } from "@/email/email-template";
import { getUserByEmail } from "@/actions/user/get-user-by-email";
import { SEO_CONFIG } from "@/config/index";

interface ResetOtpPasswordFormProps {}

/**
 * ResetOtpPasswordForm
 * - Allows a user to reset their password using email + OTP.
 * - Includes validation, error/success handling, and form state management.
 */
export default function ResetOtpPasswordForm({}: ResetOtpPasswordFormProps) {
  const router = useRouter();
  const fontSize = useResponsiveFont();

  // ✅ UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Auth step query params (email + otp prefill)
  const { query } = useAuthStep();

  // ✅ Form setup
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otpCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const email = watch("email");
  const { errors } = form.formState;

  // ✅ Reset messages on form value change
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // ✅ Prefill form from query params (email + otpCode)
  useEffect(() => {
    const currentValues = form.getValues();

    if (query.email && query.email !== currentValues.email) {
      form.setValue("email", decodeURIComponent(decodeURIComponent(query.email)));
      form.trigger("email");
    }

    if (query.otpCode && query.otpCode !== currentValues.otpCode) {
      form.setValue("otpCode", query.otpCode);
      form.trigger("otpCode");
    }
  }, [form, query]);

  /**
   * Handle form submission
   * - Calls backend API to reset password
   * - Manages loading, success, and error states
   */
  async function onSubmit(input: ResetPasswordInput) {
    try {
      setLoading(true);

      const { data, error } = await authClient.emailOtp.resetPassword({
        email: input.email.trim(),
        otp: input.otpCode.trim(),
        password: input.newPassword.trim(),
      });

      if (data?.success) {
          const user=await getUserByEmail(email)
           // 🔹 Password reset OTP
           if(user)
                  await sendMail(email, EmailTemplate.PasswordReset, {
                    name:user.name,
                    url:SEO_CONFIG.seo.baseUrl,
                    email,
                  });
        // ✅ Success case
        setSuccessMessage("Your password has been updated successfully.");
        setErrorMessage(null);

        toast.success("Password updated successfully. Please sign in with your new password.");

        // Redirect user back to sign-in page
        router.push(`/auth/sign-in?step=initial`);
      } else {
        // ❌ Expected API error (invalid OTP, expired code, etc.)
        console.error("Password reset failed:", error?.message ?? "");
        setSuccessMessage(null);
        setErrorMessage(
          error?.message ||
            "Unable to reset your password. Please check your OTP and try again."
        );

        toast.error(
          error?.message || "Password reset failed. Please try again later."
        );
      }
    } catch (error) {
      // ❌ Unexpected runtime error
      console.error("Unexpected error during password reset:", error);
      const errMsg =
        "Something went wrong while resetting your password. Please try again shortly.";
      setErrorMessage(errMsg);
      setSuccessMessage(null);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Global error/success messages */}
      {errorMessage && <ErrorMessage error={errorMessage} className="my-3" />}
      {successMessage && <SuccessMessage message={successMessage} className="my-3" />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-start">
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
                  Email Address
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
                    href={`/auth/forget-password?step=initial${
                      email && email.trim()
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
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("otpCode");
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("otpCode");
                    }}
                    placeholder="123456"
                    required
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  New Password
                </FormLabel>

                <FormControl>
                  <IconInput
                    type={showPassword ? "text" : "password"}
                    LeftIcon={HiKey}
                    RightIcon={showPassword ? Eye : EyeOff}
                    onRightIconClick={() => setShowPassword((prev) => !prev)}
                    placeholder="********"
                    errors={errors?.newPassword}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("newPassword");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("newPassword");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel
                  className="mb-1 font-bold text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${0.8 * fontSize}px` }}
                >
                  Confirm Password
                </FormLabel>

                <FormControl>
                  <IconInput
                    type={showConfirmPassword ? "text" : "password"}
                    LeftIcon={HiKey}
                    RightIcon={showConfirmPassword ? Eye : EyeOff}
                    onRightIconClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    placeholder="********"
                    errors={errors?.confirmPassword}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      form.trigger("confirmPassword");
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      form.trigger("confirmPassword");
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
            text="Reset Password"
            loadingText="Resetting Password..."
            errorText="Unable to reset password"
            disabledText="Reset Password"
            BtnIcon={GrUpdate}
             className="mt-4"
          />
        </form>
      </Form>
    </>
  );
}
