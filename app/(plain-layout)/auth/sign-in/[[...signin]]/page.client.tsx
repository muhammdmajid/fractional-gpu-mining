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
import SignInForm from "@/ui/components/auth/sign-in-form";
import { OTP_LENGTH } from "@/lib/constants";

interface StepDetails {
  key: AuthStep;
  title: string;
  description: string;
}

// All sign-in steps
const signInSteps: StepDetails[] = [
  {
    key: "initial",
    title: "Welcome Back!",
    description: "Sign in to your account to continue.",
  },
  {
    key: "sendOtp",
    title: "Email Verification Required",
    description:
      "Enter your registered email to receive a one-time password (OTP) for verification.",
  },
  {
    key: "verifyOtp",
    title: "Verify Your Email",
    description: `A ${OTP_LENGTH ?? 4}-digit verification code has been sent to your email. Please enter it to confirm your identity.`,
  },
];

export const AuthCard: React.FC = () => {
  const { query } = useAuthStep();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const currentStep = useMemo(
    () => signInSteps.find((s) => s.key === query.step) ?? null,
    [query.step]
  );

  if (!currentStep || !query.step) return null;

  // ------------------- SOCIAL LOGIN HANDLERS -------------------
  const handleSocialLogin = async (
    provider: "github" | "google" | "facebook"
  ) => {
    setLoading(true);
    try {
      const result = await signIn.social({ provider });
      if (!result || result.error) {
        setError(
          result?.error?.message ||
            `Failed to sign in with ${provider}. Please try again.`
        );
      }
    } catch (err) {
      setError(
        `Unexpected error during ${provider} login. Please try again later.`
      );
      console.error(`${provider} login error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardWrapper>
      {/* Header */}
      <AuthCardHeader
        title={currentStep.title}
        subText={currentStep.description}
      />

      <CardContent className="my-0">
        {/* Initial step: standard sign-in form + social login */}
        {query.step === "initial" && (
          <>
            <SignInForm />
            <div className="relative mt-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-xs uppercase px-1">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Error message */}
            {error && <ErrorMessage error={error} className="my-3" />}

            {/* Social login buttons */}
            <SocialLoginButtons
              loading={loading}
              onGitHubLogin={() => handleSocialLogin("github")}
              onGoogleLogin={() => handleSocialLogin("google")}
              onFacebookLogin={() => handleSocialLogin("facebook")}
            />
          </>
        )}

        {/* Step: send OTP */}
        {query.step === "sendOtp" && <SendOtpEmailVerificationForm />}

        {/* Step: verify OTP */}
        {query.step === "verifyOtp" && (
          <VerifyOtpEmailVerificationForm resendHref="/auth/sign-in" />
        )}
      </CardContent>

      {/* Footer */}
      <AuthCardFooter
        message="Don’t have an account?"
        linkHref="/auth/sign-up"
        linkText="Sign up"
      />
    </AuthCardWrapper>
  );
};

export function SignInPageClient() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-2">
      {/* Left side image */}
      <div className="relative hidden md:flex md:justify-center md:items-center p-5 md:p-0">
        <div className="relative w-[60%] h-auto">
          <Image
            alt="Sign-in background image"
            className="w-full h-auto object-contain rounded-lg"
            width={600} // must be non-zero for Next.js
            height={400}
            sizes="60vw"
            priority
            src="/img/auth.png"
          />
        </div>
      </div>

      {/* Right side - Authentication form */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <AuthCard />
      </div>
    </div>
  );
}
