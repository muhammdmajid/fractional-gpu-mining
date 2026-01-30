"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { CardContent } from "@/ui/primitives/card";
import ErrorMessage from "@/ui/components/default/error-message";
import SocialLoginButtons from "@/ui/components/auth/social-login-buttons";
import AuthCardHeader from "@/ui/components/auth/auth-card-header";
import AuthCardWrapper from "@/ui/components/auth/auth-card-wrapper";
import AuthCardFooter from "@/ui/components/auth/auth-card-footer";
import { SendOtpEmailVerificationForm } from "@/ui/components/auth/send-otp-email-verification-form";
import VerifyOtpEmailVerificationForm from "@/ui/components/auth/verify-otp-email-verification-form";

import { AuthStep, useAuthStep } from "@/providers/auth-steps-provider";
import { OTP_LENGTH } from "@/lib/constants";
import SignUpForm from "@/ui/components/auth/sign-up-form";
import { ReferrerInfo } from "@/types/referrals";

interface StepDetails {
  key: AuthStep;
  title: string;
  description: string;
}

// Define all signup steps
const signUpSteps: StepDetails[] = [
  {
    key: "initial",
    title: "Create Your Account",
    description: "Sign up to access all features and start your journey.",
  },
  {
    key: "sendOtp",
    title: "Verify Your Email",
    description:
      "Enter your email to receive a one-time password (OTP) for account verification.",
  },
  {
    key: "verifyOtp",
    title: "Confirm Your Email",
    description: `A ${OTP_LENGTH ?? 4}-digit verification code has been sent to your email. Enter it to activate your account.`,
  },
];

interface SignUpPageClientProps {
  referrerInfo:  ReferrerInfo | null ;
}

export function SignUpPageClient({ referrerInfo }: SignUpPageClientProps) {

  const [error, setError] = useState(""); // Error messages for social login
  const [loading, setLoading] = useState(false); // Loading state for social login

  const { query } = useAuthStep();

  // Determine current step
  const currentStep = useMemo(
    () => signUpSteps.find((s) => s.key === query.step) ?? null,
    [query.step]
  );

  if (!currentStep || !query.step) return null;

  // ------------------- SOCIAL LOGIN HANDLERS -------------------
  const handleGitHubLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn.social({ provider: "github" });
      if (!result || result.error) {
        setError(result?.error?.message || "Failed to sign up with GitHub.");
      }
    } catch (err) {
      setError("Unexpected error during GitHub signup.");
      console.error("GitHub signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn.social({ provider: "google" });
      if (!result || result.error) {
        setError(result?.error?.message || "Failed to sign up with Google.");
      }
    } catch (err) {
      setError("Unexpected error during Google signup.");
      console.error("Google signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn.social({ provider: "facebook" });
      if (!result || result.error) {
        setError(result?.error?.message || "Failed to sign up with Facebook.");
      }
    } catch (err) {
      setError("Unexpected error during Facebook signup.");
      console.error("Facebook signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- JSX RENDER -------------------
  return (
    <div className="grid min-h-screen  w-full md:grid-cols-2">
      {/* Left side image */}
      <div className="relative hidden md:flex md:justify-center md:items-center p-5 md:p-0">
        <div className="relative w-[60%] h-auto">
          <Image
            alt="Sign-up background image"
            className="w-full h-auto object-contain rounded-lg"
            width={0}
            height={0}
            sizes="60vw"
            priority
            src="/img/auth.png"
          />
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <AuthCardWrapper>
          <AuthCardHeader title={currentStep.title} subText={currentStep.description} />

          <CardContent className="my-0">
            {/* Step: initial signup form + social login */}
            {query.step === "initial" && (
              <>
                <SignUpForm    referrerInfo={referrerInfo}/>
                <div className="relative mt-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-xs uppercase px-1">Or continue with</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {error && <ErrorMessage error={error} className="my-3" />}

                <SocialLoginButtons
                  loading={loading}
                  onGitHubLogin={handleGitHubLogin}
                  onGoogleLogin={handleGoogleLogin}
                  onFacebookLogin={handleFacebookLogin}
                />
              </>
            )}

            {/* Step: send OTP */}
            {query.step === "sendOtp" && <SendOtpEmailVerificationForm />}

            {/* Step: verify OTP */}
            {query.step === "verifyOtp" && (
              <VerifyOtpEmailVerificationForm resendHref="/auth/sign-up" />
            )}
          </CardContent>

          {/* Footer with sign-in link */}
          <AuthCardFooter
            message="Already have an account?"
            linkHref="/auth/sign-in"
            linkText="Sign in"
          />
        </AuthCardWrapper>
      </div>
    </div>
  );
}
