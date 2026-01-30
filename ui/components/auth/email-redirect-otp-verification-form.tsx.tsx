/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { useAuthStep } from "@/providers/auth-steps-provider";
import ErrorMessage from "../default/error-message";
import SuccessMessage from "../default/success-message";
import { authClient } from "@/lib/auth-client";

interface EmailRedirectOtpVerificationFormProps {}

/**
 * Component to automatically verify email using a secure link
 * This component handles:
 *  - Auto verification if `email` and `otpCode` query params exist
 *  - Displaying loading state while verifying
 *  - Showing success or error messages
 */
export default function EmailRedirectOtpVerificationForm(
  {}: EmailRedirectOtpVerificationFormProps
) {
  const fontSize = useResponsiveFont();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { query } = useAuthStep();

  /**
   * Verify email OTP using authClient
   * Memoized with useCallback to prevent unnecessary re-creations
   */
  const handleOtpVerification = useCallback(
    async (email: string, otpCode: string) => {
      try {
        setLoading(true);

        const { data, error } = await authClient.emailOtp.verifyEmail({
          email: email,
          otp: otpCode
        });

        if (data) {
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
      } catch (error) {
        // Unexpected errors during verification
        console.error("Unexpected error during OTP verification:", error);
        const errMsg =
          "An unexpected error occurred while verifying the OTP. Please try again shortly.";
        setErrorMessage(errMsg);
        setSuccessMessage(null);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [router] // Dependencies: router
  );

  /**
   * useEffect to automatically handle verification
   *  - Redirects to home if step is not `verifyLink`
   *  - Clears messages on valid step
   *  - Auto-verifies if both email and otpCode are present in query params
   */
  useEffect(() => {
    if (query?.step !== "verifyLink") {
      router.push("/");
      return;
    }

    // Clear previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    // Auto-verify if email and OTP exist
    const email = query?.email as string | undefined;
    const otpCode = query?.otpCode as string | undefined;

    if (email && otpCode) {
      handleOtpVerification(
        decodeURIComponent(email),
        decodeURIComponent(otpCode)
      );
    }
  }, [
    query?.step,
    query?.email,
    query?.otpCode,
    router,
    handleOtpVerification,
  ]);

  // Render nothing if not the correct step
  if (query?.step !== "verifyLink") return null;

  return (
    <>
      {/* Display error or success messages */}
      {errorMessage && <ErrorMessage error={errorMessage} className="my-3" />}
      {successMessage && (
        <SuccessMessage message={successMessage} className="my-3" />
      )}

      {/* Loading / verification indicator */}
      {(loading || (!errorMessage && !successMessage)) && (
        <div className="w-full mx-auto flex flex-col items-center justify-center space-y-4 px-4">
          <div
            className="flex flex-col items-center gap-2 text-primary font-medium"
            style={{ fontSize: `${0.8 * fontSize}px` }}
          >
            <Loader2
              className="animate-spin text-primary"
              style={{
                width: `${4 * fontSize}px`,
                height: `${4 * fontSize}px`,
              }}
            />
            Verifying your email...
          </div>

          <p
            className="text-muted-foreground text-center leading-relaxed"
            style={{ fontSize: `${0.75 * fontSize}px` }}
          >
            Please wait while we validate your email using the secure link you
            clicked.
          </p>
        </div>
      )}
    </>
  );
}
