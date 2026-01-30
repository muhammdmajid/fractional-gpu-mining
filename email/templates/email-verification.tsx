import {
  Heading,
  Link,
  Section,
  Text,
} from '@react-email/components';
import Wrapper from './components/wrapper';
import { SEO_CONFIG } from '@/config';

export interface EmailVerifiedTemplateProps {
  name: string;
  url?: string;
}

export function EmailVerifiedTemplate({
  name = 'there',
  url = SEO_CONFIG.seo.baseUrl,
}: EmailVerifiedTemplateProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const signInUrl = `${effectiveBaseUrl}`;

  return (<Wrapper
    title="Email Verification"
    previewText="Your email has been successfully verified"
    url={url}
  >


    {/* Greeting and Message */}
    <Section className="p-10">
      <Heading className="text-2xl font-bold text-[#050038]">
        Email Successfully Verified
      </Heading>
      <Text className="text-base text-[#050038] opacity-70 mt-4">
        Hi {name},
      </Text>
      <Text className="text-base text-[#050038] opacity-70 mt-2">
        We&apos;re happy to let you know that your email address has been successfully verified. You can now access all the features and manage your account from your dashboard.
      </Text>
    </Section>

    {/* CTA Button */}
    <Section className="py-4 text-center">
      <Link
        href={signInUrl}
        className="inline-block bg-[#3b82f6] text-white font-medium text-base px-6 py-3 rounded-md no-underline hover:bg-[#2563eb] transition"
      >
        Go to Sign In
      </Link>
    </Section>


    {/* Additional Note */}
    <Section className="pt-4 px-10">
      <Text className="text-base text-[#050038] opacity-70">
        If you didn’t request this verification, no further action is required—you can safely ignore this email.
      </Text>
    </Section>

  </Wrapper>
  );
}
