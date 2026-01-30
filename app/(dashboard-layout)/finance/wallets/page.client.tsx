"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { ArrowDown, ArrowDownCircle, ArrowUp, ArrowUpCircle, DollarSign, Minus, Plus } from "lucide-react";

import { TransactionTimeline } from "./_component/transaction-timeline";
import { SelectTransactionPublic } from "@/types/transaction";
import {
  AccountInfo,
  FinancialAccountsBundle,
} from "@/types/user-wallet-account";
import AccountSelector from "./_component/account-selector";
import CreateFinanceAccount from "./_component/create-finance-account";
import DepositFormWithPlans from "../deposit/_components/deposit-form-with-plan";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { fetchServerData } from "@/lib/fetch-utils";
import { getTransactionsByUserId } from "@/actions/transaction/get-transactions-by-userId";

/**
 * Compute totals and monthly breakdown for last 12 months
 * @param transactions Array of transactions
 * @returns totals and formatted monthly data for charts
 */
export function getTotalsLast12Months(transactions: SelectTransactionPublic[]) {
  const now = new Date();

  // Build last 12 months array
  const last12MonthDates: Date[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    last12MonthDates.unshift(date); // earliest month first
  }

  // Initialize monthly data map
  const monthlyMap: Record<
    string,
    { month: string; deposit: number; withdrawal: number }
  > = {};
  last12MonthDates.forEach((date) => {
    const key = format(date, "yyyy-MM");
    monthlyMap[key] = {
      month: format(date, "MMM yy"),
      deposit: 0,
      withdrawal: 0,
    };
  });

  // Totals
  let totalDeposit = 0;
  let totalWithdrawal = 0;

  // Process transactions safely
  transactions.forEach((txn) => {
    try {
      if (!txn || txn.status !== "completed") return;

      const txnDate = new Date(txn.date);
      if (isNaN(txnDate.getTime())) return;

      const monthKey = format(txnDate, "yyyy-MM");
      const amount = parseFloat(txn.amount);
      if (isNaN(amount)) return;

      if (txn.type === "deposit") {
        totalDeposit += amount;
        if (monthlyMap[monthKey]) monthlyMap[monthKey].deposit += amount;
      } else if (txn.type === "withdrawal") {
        totalWithdrawal += amount;
        if (monthlyMap[monthKey]) monthlyMap[monthKey].withdrawal += amount;
      }
    } catch (error) {
      console.error("Error processing transaction:", txn, error);
    }
  });

  // Convert map to array in chronological order
  const monthlyData = last12MonthDates.map(
    (date) => monthlyMap[format(date, "yyyy-MM")]
  );

  // Determine period for display
  const period = `(${monthlyData[0]?.month || ""} - ${monthlyData[monthlyData.length - 1]?.month || ""})`;

  return { totalDeposit, totalWithdrawal, monthlyData, period };
}

/**
 * Safely extract numeric amount from a string description
 */
export function extractAmount(desc: string): number {
  const match = desc.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

interface WalletsDashboardProps {
  financialAccounts: FinancialAccountsBundle | null;
  isOverview?: boolean;
}

export default function WalletsDashboard({
  financialAccounts,
  isOverview = false,
}: WalletsDashboardProps) {
  const { miningPlansData } = useGPUPlans();

  // Client-side state for financial accounts
  const [financialAccountsClient, setFinancialAccounts] =
    useState<FinancialAccountsBundle | null>(financialAccounts);
  const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(
    financialAccountsClient?.accounts?.[0] ?? null
  );
  const [transactions, setTransactions] = useState<SelectTransactionPublic[]>(
    currentAccount?.transactions ?? []
  );

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

  // Accounts list derived from state
  const accounts = useMemo(
    () => financialAccountsClient?.accounts ?? [],
    [financialAccountsClient]
  );

  // Current formatted date
  const currentDate = format(new Date(), "MMM dd, yyyy");

  // Totals and chart data (memoized)
  const { totalDeposit, totalWithdrawal, monthlyData, period } = useMemo(() => {
    return getTotalsLast12Months(currentAccount?.transactions ?? []);
  }, [currentAccount]);

  // ---------------------------
  // Fetch transactions from server
  // ---------------------------
  const loadTransactions = async () => {
    setLoading(true);
    setTransactionsError(null);

    try {
      const { data, message } = await fetchServerData<FinancialAccountsBundle>(
        () => getTransactionsByUserId(),
        "get-transactions-by-user-id"
      );

      if (!data) {
        setTransactionsError(message || "No transactions found");
        setFinancialAccounts(null);
        setTransactions([]);
        return;
      }

      setFinancialAccounts(data);

      // Sync transactions for current account
      const selectedAccount = currentAccount?.id
        ? data.accounts.find((acc) => acc.id === currentAccount.id)
        : data.accounts[0];

      setCurrentAccount(selectedAccount ?? null);
      setTransactions(selectedAccount?.transactions ?? []);
      setTransactionsError(message || null);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactionsError("Failed to load transactions. Please try again.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Sync transactions when current account changes
  // ---------------------------
  useEffect(() => {
    setTransactions(currentAccount?.transactions ?? []);
  }, [currentAccount]);

  // ---------------------------
  // Handle no accounts scenario
  // ---------------------------
  if (accounts.length === 0) {
    return (
      <div className="p-6 w-full">
        <CreateFinanceAccount
          key={currentAccount?.id || "create-finance-account"}
          onSuccess={(newAccount: AccountInfo | null) => {
            setCurrentAccount(newAccount); // Set newly created account as active
            loadTransactions(); // Refresh transactions
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {!isOverview ? (
        <>
          {/* 🔹 Loading state */}
          {loading && (
            <div className="p-4 text-center">Loading transactions...</div>
          )}

          {/* 🔹 Error state */}
          {!loading && transactionsError && (
            <div className="p-4 text-center text-red-500">
              {transactionsError}
            </div>
          )}
        </>
      ) : null}

      {/* 🔹 Main UI (only render if not loading and no error) */}
      {!loading && !transactionsError && (
        <>
          {isOverview &&
          currentAccount &&
          !isNaN(Number(currentAccount.balance)) &&
          Number(currentAccount.balance) === 0 &&
          transactions?.length < 2 ? (
            transactions?.length === 0 ? (
              <DepositFormWithPlans
                plans={miningPlansData ?? []}
                currentAccount={currentAccount}
                transactions={transactions}
                setTransactions={setTransactions}
              />
            ) : (
              <TransactionTimeline transactions={transactions ?? []} />
            )
          ) : (
            <>
              {/* Account Selector */}
              <AccountSelector
                accountInfo={accounts}
                currentAccount={currentAccount}
                setCurrentAccount={setCurrentAccount}
              />

              {currentAccount && (
                <>
                  {/* Summary Cards */}
                  <Card className="rounded-2xl shadow-sm md:col-span-1">
                    <CardHeader className="flex flex-row justify-between gap-4">
                      <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Summary {period}
                      </CardTitle>
<div className="flex flex-row gap-2">
      {/* Deposit Button */}
      <Button
        size="sm"
        asChild
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-md shadow-sm
          bg-gradient-to-r from-green-600 to-emerald-500 text-white
          hover:from-green-700 hover:to-emerald-600
          dark:from-green-500 dark:to-emerald-400 dark:text-gray-900
          dark:hover:from-green-600 dark:hover:to-emerald-500
          transition-all duration-200
        "
      >
        <Link href="/finance/deposit">
          {/* Leading icon (action) */}
          <ArrowDownCircle className="w-4 h-4" />
          <span className="hidden sm:inline font-medium tracking-wide">
            Add Deposit
          </span>
          {/* Trailing icon (confirmation/plus) */}
          <Plus className="w-3 h-3" />
        </Link>
      </Button>

      {/* Withdraw Button */}
      <Button
        size="sm"
        asChild
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-md shadow-sm
          bg-gradient-to-r from-red-600 to-rose-500 text-white
          hover:from-red-700 hover:to-rose-600
          dark:from-red-500 dark:to-rose-400 dark:text-gray-900
          dark:hover:from-red-600 dark:hover:to-rose-500
          transition-all duration-200
        "
      >
        <Link href="/finance/withdrawal">
          {/* Leading icon (action) */}
          <ArrowUpCircle className="w-4 h-4" />
          <span className="hidden sm:inline font-medium tracking-wide">
            Withdraw
          </span>
          {/* Trailing icon (minus sign) */}
          <Minus className="w-3 h-3" />
        </Link>
      </Button>
    </div>

                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Current Balance */}
                      <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                        <div className="flex items-center space-x-4">
                          <DollarSign className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Current Balance
                            </p>
                            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                              {Number(currentAccount.balance ?? 0).toFixed(2)}{" "}
                              {currentAccount.currency ?? "USDT"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-4">
                          {currentDate}
                        </p>
                      </div>

                      {/* Total Deposit */}
                      <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                        <div className="flex items-center space-x-4">
                          <ArrowDown className="w-10 h-10 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Total Deposit
                            </p>
                            <p className="text-xl font-extrabold text-green-600 dark:text-green-400">
                              {totalDeposit.toFixed(2)}{" "}
                              {currentAccount.currency ?? "USDT"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-end">
                          Last 12 months
                        </p>
                      </div>

                      {/* Total Withdrawal */}
                      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                        <div className="flex items-center space-x-4">
                          <ArrowUp className="w-10 h-10 text-red-600 dark:text-red-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Total Withdrawn
                            </p>
                            <p className="text-xl font-extrabold text-red-600 dark:text-red-400">
                              {totalWithdrawal.toFixed(2)}{" "}
                              {currentAccount.currency ?? "USDT"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-end">
                          Last 12 months
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Extra Overview (only if not isOverview) */}
                  {!isOverview && (
                    <>
                      {/* Monthly Bar Chart */}
                      <Card className="rounded-2xl shadow-sm md:col-span-1">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            Monthly Overview (Last 12 Months)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                              />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip
                                cursor={{ fill: "hsl(var(--muted))" }}
                                contentStyle={{ borderRadius: "8px" }}
                              />
                              <Legend />
                              <Bar
                                dataKey="deposit"
                                fill="hsl(var(--success))"
                                radius={[4, 4, 0, 0]}
                                name="Deposit"
                              />
                              <Bar
                                dataKey="withdrawal"
                                fill="hsl(var(--destructive))"
                                radius={[4, 4, 0, 0]}
                                name="Withdrawal"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Transaction Timeline */}
                      <TransactionTimeline transactions={transactions ?? []} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
