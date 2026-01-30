import type { Metadata, Viewport } from "next";
import WithdrawalClient from "./page.client"; // Client-side component for withdrawals
import { fetchServerData } from "@/lib/fetch-utils";
import { FinancialAccountsResponse } from "@/types/user-wallet-account";
import ErrorMessage from "@/ui/components/default/error-message";
import { getTransactionsForAllUsers } from "@/actions/transaction/get-transactions-for-all-users";
import { SEO_CONFIG } from "@/config/index";
import {
  getTransactions,
  getTransactionStatusCounts,
  getTransactionAmountRange,
} from "@/actions/transaction/get-transactions";
import { SearchParams } from "@/types/data-table";
import { transactionSearchParamsCache } from "@/validation/table-transaction-validations";
import { getValidFilters } from "@/lib/data-table";

/**
 * ✅ Metadata for SEO and Social Sharing
 */
export const metadata: Metadata = {
  title: `${SEO_CONFIG.name} | Withdraw Funds`,
  description:
    "Manage withdrawals, track progress, and view your wallet balance overview.",
  robots: "index, follow",
  openGraph: {
    title: `${SEO_CONFIG.name} | Withdraw Funds`,
    description:
      "Manage withdrawals, track progress, and view your wallet balance overview.",
    url: `${SEO_CONFIG.seo.baseUrl}/finance/withdrawal`,
    siteName: SEO_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.name} | Withdraw Funds`,
    description:
      "Manage withdrawals, track progress, and view your wallet balance overview.",
  },
};

/**
 * ✅ Viewport settings for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export interface WithdrawalPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * WithdrawalPage component - server-side rendering
 * Handles fetching transactions, financial account data, and passing them to the client component
 */
export default async function WithdrawalPage(props: WithdrawalPageProps) {
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
    getTransactions({ ...search, filters: validFilters }, "withdrawal"),
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
        <WithdrawalClient
          financialAccountsData={financialAccounts}
          promises={promises || Promise.resolve([])}
        />
      )}
    </>
  );
}
