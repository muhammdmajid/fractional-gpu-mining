// ================= Client form =================
"use client";

import Image from "next/image";
import { AuthStep, useAuthStep } from "@/providers/auth-steps-provider";
import AuthCardWrapper from "@/ui/components/auth/auth-card-wrapper";
import AuthCardHeader from "@/ui/components/auth/auth-card-header";
import { CardContent } from "@/ui/primitives/card";
import { SendOtpEmailVerificationForm } from "@/ui/components/auth/send-otp-email-verification-form";
import VerifyOtpEmailVerificationForm from "@/ui/components/auth/verify-otp-email-verification-form";
import AuthCardFooter from "@/ui/components/auth/auth-card-footer";
import { useMemo } from "react";
import EmailRedirectOtpVerificationForm from "@/ui/components/auth/email-redirect-otp-verification-form.tsx";
import { OTP_LENGTH } from "@/lib/constants";

interface StepDetails {
  key: AuthStep;
  title: string;
  description: string;
}

const verificationSteps: StepDetails[] = [
  {
    key: "sendOtp",
    title: "Email Verification Required",
    description:
      "Enter your registered email to receive a one-time password (OTP) for email verification.",
  },
  {
    key: "verifyLink",
    title: "Email Link Verification",
    description: "We are verifying your email via the secure link...",
  },
  {
    key: "verifyOtp",
    title: "Verify Your Email",
    description: `A ${OTP_LENGTH ?? 4}-digit code verification code has been sent to your email. Please enter it confirm your identity.`,
  },

];

export default function VerifyOtpClient() {
  const { query } = useAuthStep();

  // ✅ useMemo to avoid recalculating on every render
  const currentStep = useMemo(
    () => verificationSteps.find((s) => s.key === query.step) ?? null,
    [query.step]
  );

  if (!currentStep) return null;

  return (
    <div className="grid min-h-screen  w-full md:grid-cols-2">
      {/* Left side - Image */}
      <div className="relative hidden  p-5 md:p-0 md:flex md:justify-center md:items-center">
        <div className="relative w-[60%] h-auto">
          <Image
            alt="Sign-in background image"
            className="w-full h-auto object-contain rounded-lg"
            width={0} // these will be overridden by Tailwind sizing
            height={0}
            sizes="60vw"
            priority
            src="/img/auth.png"
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <AuthCardWrapper>
          <AuthCardHeader
            title={currentStep.title}
            subText={currentStep.description}
          />

          <CardContent className="my-0">
            {query.step === "sendOtp" && <SendOtpEmailVerificationForm />}
            {query.step === "verifyLink" && <EmailRedirectOtpVerificationForm />}
            {query.step === "verifyOtp" && (
              <VerifyOtpEmailVerificationForm resendHref="/auth/verify-otp" />
            )}
          </CardContent>

          <AuthCardFooter
            message={"Don’t have an account?"}
            linkHref={"/auth/sign-up"}
            linkText="Sign up"
          />
        </AuthCardWrapper>
      </div>
    </div>
  );
}
