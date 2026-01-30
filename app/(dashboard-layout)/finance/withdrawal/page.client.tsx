 
 
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpToLine } from "lucide-react";

import {
  AccountInfo,
  FinancialAccountsResponse,
} from "@/types/user-wallet-account";
import { SelectTransactionPublic } from "@/types/transaction";
import { UserRole } from "@/types/user";

import AccountSelector from "../wallets/_component/account-selector";
import CreateFinanceAccount from "../wallets/_component/create-finance-account";
import TransactionHistory from "../_components/transaction-history";
import TableView from "../_components/table-view";
import {
  getTransactionAmountRange,
  getTransactions,
  getTransactionStatusCounts,
} from "@/actions/transaction/get-transactions";
import { CardDescription, CardHeader, CardTitle } from "@/ui/primitives/card";
import { WithdrawalForm } from "./_components/withdrawal-form";
import { useRouter } from "next/navigation";

interface WithdrawalClientProps {
  financialAccountsData: FinancialAccountsResponse | null;
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTransactions>>,
      Awaited<ReturnType<typeof getTransactionStatusCounts>>,
      Awaited<ReturnType<typeof getTransactionAmountRange>>,
    ]
  >;
}

export default function WithdrawalClient({
  financialAccountsData,
  promises,
}: WithdrawalClientProps) {
  const router = useRouter();
  // Extract role safely with fallback
  const role: UserRole = useMemo(() => {
    const userRole = financialAccountsData?.user?.role;
    if (userRole && ["admin", "register"].includes(userRole)) {
      return userRole as UserRole;
    }
    return "register";
  }, [financialAccountsData?.user?.role]);

  // Determine available accounts (for register/admin only)
  const accounts: AccountInfo[] = useMemo(() => {
    if (role === "register" || role === "admin") {
      return (
        financialAccountsData?.financialAccounts.flatMap(
          (bundle) => bundle.accounts
        ) ?? []
      );
    }
    return [];
  }, [role, financialAccountsData]);

  // Current selected account
  const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(
    accounts.length > 0 ? accounts[0] : null
  );

  // Transactions for the current account
  const [transactions, setTransactions] = useState<SelectTransactionPublic[]>(
    currentAccount?.transactions ?? []
  );

  // Keep transactions and balance in sync with selected account
  useEffect(() => {
    setTransactions(currentAccount?.transactions ?? []);
  }, [currentAccount, accounts]);

  useEffect(() => {}, [accounts, currentAccount]);
  // -------------------- UI States --------------------

  if (!financialAccountsData) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Failed to load financial accounts. Please try again later.
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-6 w-full">
        <CreateFinanceAccount
          key={currentAccount?.id || "create-finance-account"}
          onSuccess={(newAccount: AccountInfo | null) => {
            setCurrentAccount(newAccount); // ✅ set as active
            router.refresh();
          }}
        />
      </div>
    );
  }

  if (!currentAccount || !currentAccount.id) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ No valid account found. Please refresh or create a new one.
      </div>
    );
  }

  // Admin view → TableView
  if (role === "admin") {
    return (
      <div className="p-6">
        <CardHeader className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 px-0 pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold sm:font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug sm:leading-snug md:leading-tight">
            Withdrawal Transaction History
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm md:text-base lg:text-lg font-normal text-slate-600 dark:text-slate-400 leading-relaxed sm:leading-relaxed md:leading-loose tracking-normal">
            This table displays the withdrawal transactions of all users,
            including transaction ID, user email, amount, date, status, and
            linked wallet details. Use the search and sort features to quickly
            filter transactions by ID, email, date, or status.
          </CardDescription>
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 italic tracking-wide">
            Tip: Use the search bar to quickly find specific transactions.
          </p>
        </CardHeader>

        <TableView promises={promises} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <AccountSelector
        accountInfo={accounts}
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
      />

      <WithdrawalForm
        currentAccount={currentAccount}
        transactions={transactions}
        setTransactions={setTransactions}
      />

      <TransactionHistory
        transactions={transactions}
        title="Withdrawal History"
        type="withdrawal"
        Icon={ArrowUpToLine}
        role={role}
      />
    </div>
  );
}
