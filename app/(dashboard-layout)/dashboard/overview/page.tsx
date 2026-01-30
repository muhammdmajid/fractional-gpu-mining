import { SEO_CONFIG } from "@/config/index";
import type { Metadata, Viewport } from "next";
import ErrorMessage from "@/ui/components/default/error-message";
import MiningDashboard from "../mining-stats/page.client";
import { fetchServerData } from "@/lib/fetch-utils";
import { MiningStatusStream } from "@/types/fractional-mining-profit";
import getMiningStatus from "@/actions/mining-plans/get-mining-status";
import { FinancialAccountsBundle } from "@/types/user-wallet-account";
import { getTransactionsByUserId } from "@/actions/transaction/get-transactions-by-userId";
import WalletsDashboard from "../../finance/wallets/page.client";
import { Investment } from "@/types/mining-plans";
import { getAllInvestments } from "@/actions/mining-plans/get-all-investments";
import InvestmentDashboard from "../../finance/mining-plans/page.client";
import { ReferralData } from "@/types/referrals";
import { getReferralStatsForUser } from "@/actions/referral/get-referral-stats";
import ReferEarnClientDashboard from "../../refer-earn/earnings/page.client";


// ✅ SEO Metadata
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Overview `,
  description: "Mining dashboard overview with key stats and earnings.",
  robots: "index, follow",
  alternates: {
    canonical: SEO_CONFIG.seo.baseUrl + "/dashboard/overview",
  },
  openGraph: {
    title: `${SEO_CONFIG.name} | Overview `,
    description: "Mining dashboard overview with key stats and earnings.",
    url: SEO_CONFIG.seo.baseUrl + "/dashboard/overview",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Overview `,
    description: "Mining dashboard overview with key stats and earnings.",
  },
};

// ✅ Viewport for responsive scaling
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function OverviewPage() {
  // ⛏️ Fetch Mining Status
  const { data: miningStatus, message: miningError } = await fetchServerData<
    MiningStatusStream[]
  >(() => getMiningStatus(), "get-mining-status");

  // 💳 Fetch Wallet Transactions
  const { data: financialAccounts, message: transactionsError } =
    await fetchServerData<FinancialAccountsBundle>(
      () => getTransactionsByUserId(),
      "get-transactions-by-user-id"
    );

  // 📊 Fetch Investments
  const { data: investments, message: investmentsError } =
    await fetchServerData<Investment[]>(
      () => getAllInvestments(),
      "get-all-investments"
    );

       // 🔹 Fetch referral stats (replace with real userId/auth)
        const { data: referralStats, message: referralError } =
          await fetchServerData<ReferralData>(
            () => getReferralStatsForUser(),
            "get-referral-stats"
          );
  return (
    <>
      {/* 💳 Wallet Dashboard */}
      {transactionsError ? (
        <ErrorMessage error={transactionsError} className="my-4 sm:my-6" />
      ) : (
        <WalletsDashboard
          financialAccounts={financialAccounts}
          isOverview={true}
        />
      )}
      {/* ⛏️ Mining Dashboard */}
      {miningError ? (
        <ErrorMessage error={miningError} className="my-4 sm:my-6" />
      ) : (
        miningStatus && (
          <MiningDashboard miningStatus={miningStatus} isOverview={true} />
        )
      )}
      {/* 📊 Investments Dashboard */}
      {investmentsError ? (
        <ErrorMessage error={investmentsError} className="my-4 sm:my-6" />
      ) : (
        <InvestmentDashboard
          investments={investments ?? []}
          isOverview={true}
        />
      )}


            {/*   Render client dashboard with fetched referral data*/}
      {referralError ? (
        <ErrorMessage error={referralError} className="my-4 sm:my-6" />
      ) : (<ReferEarnClientDashboard referralData={referralStats} isOverview={true} />
      
      )}
    </>
  );
}
