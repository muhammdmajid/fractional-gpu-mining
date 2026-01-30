import {
  Heading,
  Link,
  Section,
  Text,
} from '@react-email/components';
import { SEO_CONFIG } from "@/config/index";
import Wrapper from './components/wrapper';

export interface OTPEmailVerificationTemplateProps {
  code: string;
  url: string;
  email: string;
  remainingTime:string;
}

export function OTPEmailVerificationTemplate({
  code,
  url,
  email,remainingTime
}: OTPEmailVerificationTemplateProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const emailVerificationUrl = `${effectiveBaseUrl}/auth/verify-otp?step=verifyLink&email=${encodeURIComponent(
    email
  )}&otpCode=${encodeURIComponent(code)}`;

  return (
    <Wrapper
      title="Verify Your Email"
      previewText="Complete your sign-up by verifying your email address"
      url={url}
    >
      {/* Title & Instructions */}
      <Section className="p-10">
        <Heading className="text-2xl font-bold text-[#050038]">
          Verify Your Email Address
        </Heading>
        <Text className="text-base text-[#050038] opacity-70 mt-4">
          Thank you for signing up! To complete your registration, please verify your email address by either entering the one-time password (OTP) below or clicking the verification button.
        </Text>
      </Section>

      {/* OTP Code Display */}
      <Section className="px-10">
        <Section className="bg-[#f3f4f8] h-32 text-[40px] font-bold text-[#050038] text-center leading-[128px] rounded-lg tracking-widest">
          {code}
        </Section>
        <Text className="text-sm text-gray-600 mt-6 text-right">
          This OTP will expire in{' '}
          <span className="font-bold text-gray-900">
           {remainingTime}
          </span>.
        </Text>
      </Section>

      {/* Quick Verification Option */}
      <Section className="pt-4 px-10">
        <Text className="text-base font-bold text-[#050038] opacity-80">
          Prefer a faster way? Click the button below to verify your email instantly:
        </Text>
      </Section>

      {/* Verification Button */}
      <Section className="py-4 text-center">
        <Link
          href={emailVerificationUrl}
          className="inline-block bg-[#050038] text-white font-medium text-base px-6 py-3 rounded-md no-underline hover:bg-[#1f1f5e] transition"
        >
          Verify Email Address
        </Link>
      </Section>

      {/* Security Note */}
      <Section className="pt-4 px-10">
        <Text className="text-base text-[#050038] opacity-70">
          If you didn’t request this verification email, no further action is required—you can safely ignore this message.
        </Text>
      </Section>
    </Wrapper>
  );
}
