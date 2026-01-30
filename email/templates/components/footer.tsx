import { SEO_CONFIG } from '@/config';
import { Section, Link, Text } from '@react-email/components';

export interface FooterProps {
  url?: string;
}

export default function Footer({ url }: FooterProps) {
  const brandName = SEO_CONFIG?.name || 'Our Company';
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;

  const privacyPolicyUrl = `${effectiveBaseUrl}/privacy-policy`;
  const termsUrl = `${effectiveBaseUrl}/terms-of-service`;

  return (
    <Section className="text-xs text-gray-500 px-6 py-8 text-center leading-relaxed">
      <Text>
        &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
      </Text>

      <Text className="mt-2">
        For more information, please review our{' '}
        <Link
          href={privacyPolicyUrl}
          target="_blank"
          className="text-blue-600 underline"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href={termsUrl}
          target="_blank"
          className="text-blue-600 underline"
        >
          Terms of Service
        </Link>.
      </Text>

      <Text className="mt-4 italic text-gray-400">
        This is an automated message. Please do not reply directly to this email.
      </Text>
    </Section>
  );
}
