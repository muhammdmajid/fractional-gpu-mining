"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

// ✅ UI Components
import ErrorMessage from "@/ui/components/default/error-message";
import AuthCardHeader from "@/ui/components/auth/auth-card-header";
import AuthCardWrapper from "@/ui/components/auth/auth-card-wrapper";
import AuthCardFooter from "@/ui/components/auth/auth-card-footer";
import { CardContent } from "@/ui/primitives/card";

// ✅ Auth Logic
import { AuthStep, useAuthStep } from "@/providers/auth-steps-provider";

// ✅ Forms
import { SendOtpPasswordResetForm } from "@/ui/components/auth/send-otp-password-reset-form";
import ResetOtpPasswordForm from "@/ui/components/auth/reset-otp-password-form";

interface StepDetails {
  key: AuthStep;
  title: string;
  description: string;
}

// ✅ Steps for Forgot/Reset Password Flow
const forgotPasswordSteps: StepDetails[] = [
  {
    key: "initial",
    title: "Forgot Your Password",
    description:
      "Enter your registered email address to receive a one-time password (OTP) for resetting your password.",
  },
  {
    key: "verifyOtp",
    title: "Verify OTP",
    description: "Enter your email and the OTP you received to continue.",
  },
];

export function PasswordForgotPageClient() {
  const [error] = useState(""); // ❌ Placeholder error state (replace with real error handling if needed)
  const {
    query: { step },
  } = useAuthStep();

  // ✅ Get step details dynamically
  const currentStep = useMemo(
    () => forgotPasswordSteps.find((s) => s.key === step) ?? null,
    [step]
  );

  // ✅ Prevent rendering invalid steps
  if (!currentStep || !step) return null;

  return (
    <div className="grid min-h-screen  w-full md:grid-cols-2">
      {/* 🔹 Left Side - Illustration */}
      <div className="relative hidden p-5 md:p-0 md:flex md:justify-center md:items-center">
        <div className="relative w-[60%] h-auto">
          <Image
            alt="Authentication illustration"
            className="w-full h-auto object-contain rounded-lg"
            width={0} // Overridden by Tailwind sizing
            height={0}
            sizes="60vw"
            priority
            src="/img/auth.png"
          />
        </div>
      </div>

      {/* 🔹 Right Side - Dynamic Form */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <AuthCardWrapper>
          {/* Header - Title & Subtitle */}
          <AuthCardHeader
            title={currentStep.title}
            subText={currentStep.description}
          />

          {/* Form Content */}
          <CardContent className="my-0">
            {/* Global Error Display (optional, API/network errors) */}
            {error && <ErrorMessage error={error} className="my-3" />}

            {/* Step 1: Request OTP */}
            {step === "initial" && <SendOtpPasswordResetForm />}

            {/* Step 2: Verify OTP */}
            {step === "verifyOtp" && <ResetOtpPasswordForm />}
          </CardContent>

          {/* Footer - Back to Login */}
          <AuthCardFooter
            message="Remembered your password?"
            linkHref="/auth/sign-in"
            linkText="Sign in"
          />
        </AuthCardWrapper>
      </div>
    </div>
  );
}
