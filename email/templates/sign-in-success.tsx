import {
  Heading,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import Wrapper from './components/wrapper';
import { SEO_CONFIG } from '@/config';

export interface SignInSuccessTemplateProps {
  name: string;
  email: string;
  image?: string;
  url?: string;
}

export default function SignInSuccessTemplate({
  name = 'there',
  email,
  image,
  url = SEO_CONFIG.seo.baseUrl ,
}: SignInSuccessTemplateProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const dashboardUrl = `${effectiveBaseUrl}/dashboard`;

  return (
    <Wrapper
      title="Sign-In Successful"
      previewText="You have successfully signed in to your account"
      url={url}
    >
      <Section className="p-10 bg-white">
        <Heading className="text-2xl font-bold text-[#050038]">
          Sign-In Successful
        </Heading>

        {image && (
          <Img
            src={image}
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-full mt-6 mb-6"
          />
        )}

        <Text className="text-base text-[#050038] opacity-80 mt-4">
          Hi {name},
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          You have successfully signed in with the email <strong>{email}</strong>.
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          If this wasn’t you, please take action to secure your account immediately.
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          You can now access your dashboard and manage your profile or continue using our services.
        </Text>
      </Section>

      {/* CTA Button */}
      <Section className="py-6 text-center">
        <Link
          href={dashboardUrl}
          className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] transition-colors duration-200 text-white font-semibold text-base px-8 py-3 rounded-md no-underline"
        >
          Go to Dashboard
        </Link>
      </Section>

    </Wrapper>
  );
}
