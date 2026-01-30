import {
  Heading,
  Link,
  Section,
  Text,
} from '@react-email/components';
import Wrapper from './components/wrapper';
import { SEO_CONFIG } from "@/config/index";

export interface OTPPasswordForgotTemplateProps {
  code: string;
  url: string;
  email: string;
  remainingTime: string; // e.g. "10 minutes"
}

export function OTPPasswordForgotTemplate({
  code,
  url,
  email,
  remainingTime,
}: OTPPasswordForgotTemplateProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const resetUrl = `${effectiveBaseUrl}/auth/forget-password?step=verifyOtp&email=${encodeURIComponent(
    email
  )}&otpCode=${encodeURIComponent(code)}`;

  return (
    <Wrapper
      title="Reset Your Password"
      previewText="Use the OTP below to securely reset your password"
      url={url}
    >
      {/* Title & Introduction */}
      <Section className="p-10">
        <Heading className="text-2xl font-bold text-[#050038]">
          Reset Your Password
        </Heading>
        <Text className="text-base text-[#050038] opacity-70 mt-4">
          We received a request to reset the password associated with your
          account. Please use the following one-time password (OTP) to continue.
        </Text>
        <Text className="text-base text-[#050038] opacity-70 mt-2">
          ⚠️ This code will expire in <strong>{remainingTime}</strong>.
        </Text>
      </Section>

      {/* OTP Display */}
      <Section className="px-10">
        <Section className="bg-[#f3f4f8] h-32 text-[40px] font-bold text-[#050038] text-center leading-[128px] rounded-lg tracking-widest">
          {code}
        </Section>
      </Section>

      {/* Quick Reset Option */}
      <Section className="pt-4 px-10">
        <Text className="text-base font-bold text-[#050038] opacity-80">
          Want a faster way? Click the button below to reset your password directly:
        </Text>
      </Section>

      {/* Reset Password Button */}
      <Section className="py-4 text-center">
        <Link
          href={resetUrl}
          className="inline-block bg-[#050038] text-white font-medium text-base px-6 py-3 rounded-md no-underline hover:bg-[#1f1f5e] transition"
        >
          Reset Password
        </Link>
      </Section>

      {/* Additional Note */}
      <Section className="pt-4 px-10">
        <Text className="text-base text-[#050038] opacity-70">
          If you didn’t request a password reset, no further action is required—you can safely ignore this email.
        </Text>
      </Section>
    </Wrapper>
  );
}
