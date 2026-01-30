import type { Metadata, Viewport } from "next";
import DepositClient from "./page.client"; // Client-side component for deposits
import { fetchServerData } from "@/lib/fetch-utils";
import { FinancialAccountsResponse } from "@/types/user-wallet-account";
import ErrorMessage from "@/ui/components/default/error-message";
import { getTransactionsForAllUsers } from "@/actions/transaction/get-transactions-for-all-users";
import { SEO_CONFIG } from "@/config/index";
import {
  getTransactionAmountRange,
  getTransactions,
  getTransactionStatusCounts,
} from "@/actions/transaction/get-transactions";
import { SearchParams } from "@/types/data-table";
import { transactionSearchParamsCache } from "@/validation/table-transaction-validations";
import { getValidFilters } from "@/lib/data-table";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Deposit - GPU Based Cryptocurrency Mining`,
  description:
    "Deposit funds securely to start your GPU-based cryptocurrency mining investment plan. Manage your wallet and monitor mining performance effortlessly.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Deposit - GPU Based Cryptocurrency Mining`,
    description:
      "Deposit funds securely to start your GPU-based cryptocurrency mining investment plan. Manage your wallet and monitor mining performance effortlessly.",
    url: `${SEO_CONFIG.seo.baseUrl}/finance/deposit`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Deposit - GPU Based Cryptocurrency Mining`,
    description:
      "Deposit funds securely to start your GPU-based cryptocurrency mining investment plan. Manage your wallet and monitor mining performance effortlessly.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * DepositPage component - server-side rendering
 * Handles fetching transactions, financial account data, and passing them to the client component
 */
export default async function DepositPage(props: IndexPageProps) {
  // Await search parameters from URL or context
  const searchParams = await props.searchParams;

  // Validate and parse search params
  const search = transactionSearchParamsCache.parse(searchParams);

  // Extract valid filters (removes empty or invalid filters)
  const validFilters = getValidFilters(search.filters);

  // Run multiple async queries in parallel:
  // 1. Get filtered transactions
  // 2. Get transaction status counts
  // 3. Get transaction amount range
  const promises = Promise.all([
    getTransactions({ ...search, filters: validFilters }, "deposit"),
    getTransactionStatusCounts(),
    getTransactionAmountRange(),
  ]);

  // Fetch financial accounts for all users
  const { data: financialAccounts, message: transactionsError } =
    await fetchServerData<FinancialAccountsResponse>(
      () => getTransactionsForAllUsers(),
      "get-financial-accounts-details"
    );

  return (
    <>
      {transactionsError ? (
        <ErrorMessage error={transactionsError} className="my-3" />
      ) : (
        <DepositClient
          financialAccountsData={financialAccounts}
          promises={promises || Promise.resolve([])}
        />
      )}
    </>
  );
}
