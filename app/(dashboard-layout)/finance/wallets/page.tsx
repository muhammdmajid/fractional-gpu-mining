import { SEO_CONFIG, } from "@/config/index";
import type { Metadata, Viewport } from "next";
import WalletsDashboard from "./page.client";

import { fetchServerData } from "@/lib/fetch-utils";
import ErrorMessage from "@/ui/components/default/error-message"
import {  FinancialAccountsBundle } from "@/types/user-wallet-account";
import { getTransactionsByUserId } from "@/actions/transaction/get-transactions-by-userId";
import { Investment } from "@/types/mining-plans";
import { getAllInvestments } from "@/actions/mining-plans/get-all-investments";

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Wallet Overview`,
  description:
    "Track wallet balances, withdrawals, and transaction history.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Wallet Overview`,
    description:
      "View wallet balance, withdrawals, and transaction history for Bitcoin mining.",
    url: SEO_CONFIG.seo.baseUrl + "/dashboards/wallet",
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Wallet Overview`,
    description:
      "Manage your Bitcoin mining wallet: balance, withdrawals, and history.",
  },
};

// ✅ Move viewport to a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};


export default async function WalletPage() {
  const { data: financialAccounts, message: transactionsError } =
    await fetchServerData<FinancialAccountsBundle>(
      () => getTransactionsByUserId(),
      "get-transactions-by-user-id"
    );
    
  return (
    <>
      {transactionsError? (
        <ErrorMessage error={transactionsError} className="my-3" />
      ) : (
        <WalletsDashboard   financialAccounts={financialAccounts} />
      )}
    </>
  );
}
