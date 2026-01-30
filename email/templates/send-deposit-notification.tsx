import { Heading, Link, Section, Text } from "@react-email/components";
import Wrapper from "./components/wrapper";
import { SEO_CONFIG } from "@/config/index";

export interface DepositNotificationEmailProps {
  amount: number;
  transactionId?: string;
  subject?: string;
  message?: string;
  url?: string;
  accountName?: string;
  accountId?: string;
  currency?: string;
  senderName?: string;
  thirdpartyTransactionId?: string;
  miningPlanId?: string;
  billingOptionId?: string;
}

export function DepositNotificationEmail({
  amount,
  transactionId,
  subject = "Deposit Request Submitted",
  message = "We have received your deposit request and our team is currently processing it.",
  url = SEO_CONFIG.seo.baseUrl,
  accountName,
  accountId,
  currency,
  senderName,
  thirdpartyTransactionId,
  miningPlanId,
  billingOptionId,
}: DepositNotificationEmailProps) {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;
  const dashboardUrl = `${effectiveBaseUrl}/finance/deposit`;

  return (
    <Wrapper
      title={subject}
      previewText={`Your deposit of ${amount.toFixed(2)} has been successfully submitted.`}
      url={url}
    >
      {/* Main Body */}
      <Section className="p-8">
        {/* Greeting */}
        <Heading as="h2" className="text-xl font-semibold mb-4 text-[#050038]">
          Dear Admin,
        </Heading>

        <Text className="text-base text-[#050038] opacity-80 mb-6">
          I am submitting a deposit request with the following details:
        </Text>

        {/* Account Information */}
        {(accountName || accountId || currency) && (
          <Section className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Heading
              as="h3"
              className="text-lg font-semibold mb-2 text-[#050038]"
            >
              Account Information
            </Heading>
            {accountName && (
              <Text className="text-base text-[#050038] opacity-90">
                <strong>Account Name:</strong> {accountName}
              </Text>
            )}
            {accountId && (
              <Text className="text-base text-[#050038] opacity-90">
                <strong>Account ID:</strong> {accountId}
              </Text>
            )}
            {currency && (
              <Text className="text-base text-[#050038] opacity-90">
                <strong>Currency:</strong> {currency}
              </Text>
            )}
          </Section>
        )}

        {/* Plan Details */}
        {(miningPlanId || billingOptionId) && (
          <Section className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Heading
              as="h3"
              className="text-lg font-semibold mb-2 text-[#050038]"
            >
              Plan Details
            </Heading>
            {miningPlanId && (
              <Text className="text-base text-[#050038] opacity-90">
                <strong>Mining Plan ID:</strong> {miningPlanId}
              </Text>
            )}
            {billingOptionId && (
              <Text className="text-base text-[#050038] opacity-90">
                <strong>Billing Option ID:</strong> {billingOptionId}
              </Text>
            )}
          </Section>
        )}

        {/* Deposit Details */}
        <Section className="mb-6 p-4 bg-gray-100 rounded-lg">
          <Heading
            as="h3"
            className="text-lg font-semibold mb-2 text-[#050038]"
          >
            Deposit Details
          </Heading>

          {transactionId && (
            <Text className="text-base text-[#050038] opacity-90">
              <strong>Transaction ID:</strong> {transactionId}
            </Text>
          )}

          {thirdpartyTransactionId && (
            <Text className="text-base text-[#050038] opacity-90">
              <strong>Third-Party Transaction ID:</strong> {thirdpartyTransactionId}
            </Text>
          )}

          <Text className="text-base text-[#050038] opacity-90">
            <strong>Amount:</strong> ${amount.toFixed(2)}
          </Text>
        </Section>

        {/* Message */}
        <Section className="mb-6 p-4 bg-gray-100 rounded-lg">
          <Text className="text-base text-[#050038] opacity-80 whitespace-pre-line">
            {message}
          </Text>
        </Section>

        <Text className="text-base text-[#050038] opacity-80 mt-4">
          Kindly review the above information and process this deposit request
          at your earliest convenience.
          <br />
          Thank you for your assistance.
        </Text>

        {/* Sender Signature */}
        {senderName && (
          <Text className="text-base text-[#050038] opacity-80 mt-4">
            Best regards, <br /> {senderName}
          </Text>
        )}
      </Section>

      {/* CTA Button */}
      <Section className="py-6 text-center">
        <Link
          href={dashboardUrl}
          className="inline-block bg-[#3b82f6] text-white font-medium text-base px-6 py-3 rounded-lg no-underline hover:bg-[#2563eb] transition"
        >
          View Deposit Status
        </Link>
      </Section>

      {/* Security Note */}
      <Section className="pt-6 px-8">
        <Text className="text-sm text-[#050038] opacity-70">
          If you did not initiate this deposit request, please contact our
          support team immediately.
        </Text>
      </Section>
    </Wrapper>
  );
}
