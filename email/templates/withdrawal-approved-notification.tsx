import { Heading, Link, Section, Text } from "@react-email/components";
import Wrapper from "./components/wrapper";
import { SEO_CONFIG } from "@/config/index";
import { TransactionStatus } from "@/types/transaction";

export interface WithdrawalApprovedNotificationProps {
  name: string;
  amount: number;
  subject: string; // ✅ required
  message: string; // ✅ required
  url?: string;
  transactionId?: string;
  status?: TransactionStatus;
  thirdpartyWithdrawalAddress?: string; // 🆕 optional
}

export function WithdrawalApprovedNotification({
  name,
  amount,
  subject,
  message,
  url = SEO_CONFIG.seo.baseUrl,
  transactionId,
  status = "pending",
  thirdpartyWithdrawalAddress, // 🆕
}: WithdrawalApprovedNotificationProps) {
  const dashboardUrl = `${url}/finance/withdrawal`;

  const statusStyles: Record<
    TransactionStatus,
    {
      color: string;
      bg: string;
      showCTA?: boolean;
    }
  > = {
    pending: {
      color: "#b45309",
      bg: "bg-amber-100 text-amber-700",
      showCTA: true,
    },
    completed: {
      color: "#047857",
      bg: "bg-green-100 text-green-700",
      showCTA: true,
    },
    failed: {
      color: "#b91c1c",
      bg: "bg-red-100 text-red-700",
    },
    cancelled: {
      color: "#374151",
      bg: "bg-gray-100 text-gray-700",
    },
  } as const;

  const { color, bg, showCTA } = statusStyles[status];

  const details = [
    { label: "Title", value: subject },
    { label: "Description", value: message },
    { label: "Amount", value: `${amount.toFixed(2)}` },
    { label: "Transaction ID", value: transactionId },
    { label: "Withdrawal Address", value: thirdpartyWithdrawalAddress }, // 🆕 added
  ].filter((d) => d.value);

  return (
    <Wrapper title={subject} previewText={subject} url={url}>
      {/* Header */}
     <Section className="px-8 pt-8 pb-4">
        <Heading className="text-2xl font-bold mb-2" style={{ color }}>
          {subject}
        </Heading>
        <Text className="text-base text-gray-700 mt-4">Hi {name},</Text>

      </Section>

      {/* Transaction Details */}
      <Section className="px-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          {details.map(({ label, value }) => (
            <Text key={label} className="text-sm text-gray-600 mb-2">
              <strong className="text-gray-800">{label}:</strong> {value}
            </Text>
          ))}
          <Text
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bg}`}
          >
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </div>
      </Section>

      {/* CTA Button */}
      {showCTA && (
        <Section className="py-6 text-center">
          <Link
            href={dashboardUrl}
            className="inline-block bg-blue-600 text-white font-medium text-base px-6 py-3 rounded-md no-underline hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </Section>
      )}

      {/* Footer Note */}
      <Section className="pt-6 px-8">
        <Text className="text-sm text-gray-500">
          If you didn’t request this withdrawal, please contact our support team
          immediately.
        </Text>
      </Section>
    </Wrapper>
  );
}
