"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import useIsTouchDevice from "@/lib/hooks/use-touch-device";
import { AccountInfo } from "@/types/user-wallet-account";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/ui/primitives/select";
import { Button } from "@/ui/primitives/button";
import { Plus, Wallet } from "lucide-react";
import CreateFinanceAccount from "./create-finance-account";

interface AccountSelectorProps {
  accountInfo: AccountInfo[];
  currentAccount: AccountInfo | null;
  setCurrentAccount: (account: AccountInfo | null) => void;
  isNewCreate?:boolean;
  className?: string;
}

export default function AccountSelector({
  accountInfo,
  currentAccount,
  setCurrentAccount,
  className,isNewCreate=true
}: AccountSelectorProps) {
  const isTouch = useIsTouchDevice();
  const [error, setError] = useState<string | null>(null);
  const [isNewAccount, setNewAccount] = useState(false);

  const accounts = useMemo(() => (Array.isArray(accountInfo) ? accountInfo : []), [accountInfo]);

  // validate incoming accounts
  useEffect(() => {
    try {
      accounts.forEach((acc, i) => {
        if (!acc.id || !acc.name) {
          throw new Error(`Invalid account data at index ${i}`);
        }
      });
      setError(null);
    } catch (err) {
      console.error("AccountSelector error:", err);
      setError("Invalid account data provided.");
    }
  }, [accounts]);

  const handleAddNewAccount = () => setNewAccount((prev) => !prev);

  if (error) {
    return (
      <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30 rounded-lg">
        {error}
      </div>
    );
  }

  if (accounts.length === 0 && !isNewAccount) {
    return (
      <div className="p-3 text-sm font-medium text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30 rounded-lg">
        No accounts available.
      </div>
    );
  }

  if (isNewAccount) {
    return (
      <CreateFinanceAccount
        key={currentAccount?.id || "create-finance-account"}
        onSuccess={(newAccount: AccountInfo | null) => {
          setCurrentAccount(newAccount);
          setNewAccount(false);
        }}
      />
    );
  }

  // --- Mobile / Touch (native selects) ---
  if (isTouch) {
    return (
      <div className={cn("w-full space-y-3", className)}>
        {/* Toggle new wallet button */}
       { isNewCreate?<Button
          onClick={handleAddNewAccount}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 w-full"
        >
          <Plus className="w-4 h-4" />
          <span>New Wallet</span>
          <Wallet className="w-4 h-4 ml-auto" />
        </Button>:null}

        {/* Account info card */}
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm w-full">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold">
            {currentAccount?.name?.[0] ?? "A"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {currentAccount?.name ?? "No Account Selected"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentAccount?.id ?? "—"}
            </span>
          </div>
        </div>

        {/* Account select */}
        <select
          className="w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100"
          value={currentAccount?.id ?? ""}
          onChange={(e) => {
            const selected = accounts.find((acc) => acc.id === e.target.value);
            setCurrentAccount(selected ?? null);
          }}
        >
          <option value="" disabled>
            Please select account
          </option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // --- Desktop (shadcn Selects) ---
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Toggle new wallet button */}
       { isNewCreate?<Button
        variant="default"
        onClick={handleAddNewAccount}
        className="ml-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Wallet</span>
        <Wallet className="w-4 h-4" />
      </Button>:null}

      {/* Account info card */}
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-bold">
          {currentAccount?.name?.[0] ?? "A"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {currentAccount?.name ?? "No Account Selected"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentAccount?.id ?? "—"}
          </span>
        </div>
      </div>

      {/* Account select */}
      <Select
        value={currentAccount?.id ?? undefined}
        onValueChange={(val) => {
          const selected = accounts.find((acc) => acc.id === val);
          setCurrentAccount(selected ?? null);
        }}
      >
        <SelectTrigger className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <SelectValue placeholder="Please select account" />
        </SelectTrigger>
        <SelectContent className="z-[9999] rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <SelectGroup>
            <SelectLabel className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Available Accounts
            </SelectLabel>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
