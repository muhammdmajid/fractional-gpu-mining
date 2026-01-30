import { SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";
import { UserPlanFinancialReport } from "@/types/fractional-mining-profit";
import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message";
import { getAllMonthsForUser } from "@/actions/mining-plans/get-all-months-for-user";
import ProfitDashboard from "./page.client";
import { FinancialAccountsBundle, FinancialAccountsResponse } from "@/types/user-wallet-account";
import { getTransactionsForAllUsers } from "@/actions/transaction/get-transactions-for-all-users";
import { getTransactionsByUserId } from "@/actions/transaction/get-transactions-by-userId";

// ✅ Updated Metadata for SEO
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Mining Profit Dashboard `,
  description:
    "Track your mining profits, monthly earnings, and investment performance on our detailed dashboard.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Mining Profit Dashboard `,
    description:
      "Track your mining profits, monthly earnings, and investment performance on our detailed dashboard.",
    url: SEO_CONFIG.seo.baseUrl + "/dashboard/mining-profit",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Mining Profit Dashboard `,
    description:
      "Track your mining profits, monthly earnings, and investment performance on our detailed dashboard.",
  },
};

// ✅ Viewport must be separate
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function ProfitPage() {
  // Fetch all months for the user
  const { data: plansReport, message: monthsError } =
    await fetchServerData<UserPlanFinancialReport>(
      () => getAllMonthsForUser(),
      "get-all-months"
    );

  // Fetch financial accounts for all users
  const { data: financialAccounts, message: transactionsError } =
    await fetchServerData<FinancialAccountsBundle>(
      () => getTransactionsByUserId(),
      "get-transactions-by-user-id"
    );

  return (
    <>
      {monthsError || transactionsError ? (
        <ErrorMessage
          error={monthsError || transactionsError}
          className="my-3"
        />
      ) : (
        <ProfitDashboard
          plansReport={plansReport}
          financialAccounts={financialAccounts}
        />
      )}
    </>
  );
}
