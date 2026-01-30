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
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// ✅ Extract only required fields from schema
export const sendOtpPasswordResetSchema = insertUserSchema.pick({
  email: true,
});

type SendOtpPasswordResetFormValues = z.infer<
  typeof sendOtpPasswordResetSchema
>;

interface SendOtpPasswordResetFormProps {}

export function SendOtpPasswordResetForm({}: SendOtpPasswordResetFormProps) {
  const { query } = useAuthStep();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SendOtpPasswordResetFormValues>({
    resolver: zodResolver(sendOtpPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const { errors } = form.formState;

  const [loading, setLoading] = useState(false);

  async function onSubmit(input: SendOtpPasswordResetFormValues) {
    try {
      setLoading(true);

      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: input.email.trim(),
        type: "forget-password",
      });

      if (data?.success) {
        setSuccessMessage(
          "A one-time password (OTP) has been sent to your email address for password reset."
        );
        setErrorMessage(null);

        toast.success(
          "A one-time password (OTP) has been sent to your email address for password reset."
        );

        router.push(
          `/auth/forget-password?step=verifyOtp&email=${encodeURIComponent(
            input.email.trim()
          )}`
        );
      } else {
        console.error(
          "Failed to send OTP for password reset:",
          error?.message ?? ""
        );
        setSuccessMessage(null);
        setErrorMessage(
          error?.message ||
            "Unable to send the password reset code. Please try again."
        );
        toast.error(
          error?.message || "Failed to send OTP. Please try again later."
        );
      }
    } catch (error) {
      console.error(
        "Unexpected error during OTP password reset request:",
        error
      );
      const errMsg =
        "An unexpected error occurred while sending the reset code. Please try again shortly.";
      setErrorMessage(errMsg);
      setSuccessMessage(null);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Clear messages when user types
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Autofill email from query if present
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            text="Send Reset OTP"
            loadingText="Sending..."
            errorText="Failed to Send – Retry"
            disabledText="Send Reset OTP"
            BtnIcon={Send}
            className="mt-4"
          />
        </form>
      </Form>
    </>
  );
}
