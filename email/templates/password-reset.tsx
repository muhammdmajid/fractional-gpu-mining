import {
  Heading,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import Wrapper from "./components/wrapper"; // ✅ Consistent layout wrapper
import { SEO_CONFIG } from "@/config/index";

export interface ResetPasswordTemplateProps {
  email: string;
  name: string | null;
  url: string;
}

export const PasswordResetEmail = ({
  name = "User",
  url,
}: ResetPasswordTemplateProps) => {
  const previewText = `Password reset confirmation from ${SEO_CONFIG.name}`;
  const Url = url?.trim() || SEO_CONFIG.seo.baseUrl;

  return (
    <Wrapper
      title="Password Reset Successful"
      previewText={previewText}
      url={Url}
    >
      {/* Title & Greeting */}
      <Section className="p-10">
        <Heading className="text-2xl font-bold text-[#050038]">
          Password Reset Successful
        </Heading>
        <Text className="text-base text-[#050038] opacity-80 mt-4 leading-relaxed">
          Hi <span className="font-semibold">{name}</span>,<br />
          Your password has been updated successfully. You can now sign in to your account using your new password.
        </Text>
      </Section>

      {/* CTA Button */}
      <Section className="text-center pb-6">
        <Link
          href={`${Url}/auth/sign-in?step=initial`}
          className="inline-block bg-[#050038] text-white font-medium text-base px-6 py-3 rounded-md no-underline hover:bg-[#1f1f5e] transition"
        >
          Sign In
        </Link>
      </Section>

      {/* Additional Security Note */}
      <Section className="pt-4 px-10">
        <Text className="text-base text-[#050038] opacity-70 leading-relaxed">
          If you did not request this change, please <span className="font-medium">reset your password immediately</span> to secure your account, or contact our support team for assistance.
        </Text>
      </Section>
    </Wrapper>
  );
};

export default PasswordResetEmail;
