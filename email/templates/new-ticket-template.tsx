import {
  Heading,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import Wrapper from './components/wrapper';
import { SEO_CONFIG } from '@/config';

export interface NewTicketTemplateProps {
  name: string;
  email: string;
  ticketId: string;
  subject: string;
  message: string;
  url?: string;
}

export default function NewTicketTemplate({
  name = 'there',
  email,
  ticketId,
  subject,
  message,
  url = SEO_CONFIG.seo.baseUrl,
}: NewTicketTemplateProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const ticketUrl = `${effectiveBaseUrl}/support/tickets/${ticketId}`;

  return (
    <Wrapper
      title="New Support Ticket Created"
      previewText={`Your ticket "${subject}" has been created successfully.`}
      url={url}
    >
      <Section className="p-10 bg-white">
        <Heading className="text-2xl font-bold text-[#050038]">
          New Support Ticket Created
        </Heading>

        <Text className="text-base text-[#050038] opacity-80 mt-4">
          Hi {name},
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          Your support ticket has been successfully created with the following details:
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          <strong>Ticket ID:</strong> {ticketId}
        </Text>

        <Text className="text-base text-[#050038] opacity-80 mt-2">
          <strong>Subject:</strong> {subject}
        </Text>
<Text className="text-base text-[#050038] opacity-80 mt-2">
  <strong>Message:</strong>
</Text>
     <Text
  className="text-base text-[#050038] opacity-80 mt-2"
  dangerouslySetInnerHTML={{ __html: message }}
/>

        <Text className="text-base text-[#050038] opacity-80 mt-3">
          Our support team will get back to you as soon as possible.
        </Text>
      </Section>

      {/* CTA Button */}
      <Section className="py-6 text-center">
        <Link
          href={ticketUrl}
          className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] transition-colors duration-200 text-white font-semibold text-base px-8 py-3 rounded-md no-underline"
        >
          View Ticket
        </Link>
      </Section>
    </Wrapper>
  );
}
