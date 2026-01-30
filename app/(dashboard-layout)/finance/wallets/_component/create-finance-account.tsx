 
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Input } from "@/ui/primitives/input";
import { Button } from "@/ui/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/ui/primitives/form";
import { toast } from "sonner";

import {
  AccountInfo,
  FinancialAccountsBundle,
  InsertUserWalletAccount,
} from "@/types/user-wallet-account";

import { insertUserWalletAccountSchema } from "@/validation/user-wallet-account";
import { createFinanceAccount } from "@/actions/transaction/create-finance-account";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { PAYMENT_WITHDRAWAL_POLICY } from "@/config/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/primitives/popover";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { ServerResponse } from "@/types";
import { CreditCard, Loader2 } from "lucide-react";

interface CreateFinanceAccountProps {
  onSuccess?: (account: AccountInfo | null) => void;
}

export default function CreateFinanceAccount({
  onSuccess,
}: CreateFinanceAccountProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const form = useForm<InsertUserWalletAccount>({
    resolver: zodResolver(insertUserWalletAccountSchema),
    defaultValues: {
      name: "USER_WALLET",
      currency: "USDT",
    },
  });

  const handleSubmit = async (data: InsertUserWalletAccount) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: ServerResponse<FinancialAccountsBundle> =
        await createFinanceAccount(data);

      if (response.success) {
        const msg = response.message ?? "Finance account created successfully!";
        toast.success(msg);
        setSuccessMessage(msg);
        // ✅ Pass new account to parent
        const newAccount = response?.data?.accounts?.[0] ?? null;
        onSuccess?.(newAccount);
        form.reset({ name: "FINANCE_ACCOUNT", currency: "USDT" });
      } else {
        const msg = response.message ?? "Failed to create account";
        toast.error(msg);
        setErrorMessage(msg);

        if (response.error && typeof response.error === "object") {
          Object.values(response.error).forEach((msg) =>
            toast.error(String(msg))
          );
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while creating account");
      toast.error("Something went wrong while creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="rounded-2xl shadow-xl border border-amber-300/40 
      bg-gradient-to-b from-amber-50 via-emerald-50 to-teal-50 
      dark:from-[#1A1500] dark:via-[#15372C] dark:to-[#0F2C26]
      p-6 max-w-md mx-auto transition-colors duration-500"
    >
      <CardHeader className="pb-4 border-b border-amber-200/40 dark:border-amber-600/30">
        <CardTitle
          className="text-xl font-semibold text-center 
          text-amber-700 dark:text-amber-300 tracking-wide"
        >
          Create Finance Account
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">
                    Account Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account name"
                      {...field}
                      className="bg-white dark:bg-[#102720] text-gray-900 dark:text-gray-100 
                      border border-amber-200 dark:border-emerald-700 
                      focus:border-amber-400 dark:focus:border-teal-400 
                      focus:ring-1 focus:ring-amber-300 dark:focus:ring-teal-500 
                      transition-colors"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    Give your finance account a clear, descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <FormLabel className="text-gray-800 dark:text-gray-200">
                      Currency
                    </FormLabel>
                    <FormControl>
                      {!isMobile ? (
                        // Desktop/Tablet Select
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className="w-full sm:w-40 bg-white dark:bg-[#102720] 
                            text-gray-900 dark:text-gray-100 
                            border border-amber-200 dark:border-emerald-700 
                            focus:border-amber-400 dark:focus:border-teal-400 
                            focus:ring-1 focus:ring-amber-300 dark:focus:ring-teal-500 
                            transition-colors"
                          >
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_WITHDRAWAL_POLICY.CURRENCIES.map(
                              (currency: string) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                       
                        <Popover >
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full p-2 rounded-md border 
                              border-amber-200 dark:border-emerald-700 
                              bg-white dark:bg-[#102720] text-left 
                              text-gray-900 dark:text-gray-100"
                            >
                              {field.value || "Select currency"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[90vw] max-w-sm p-2">
                            <div className="space-y-1">
                              {PAYMENT_WITHDRAWAL_POLICY.CURRENCIES.map(
                                (currency: string) => (
                                  <div
                                    key={currency}
                                    onClick={() => {
                                      field.onChange(currency);
                                  
                                    }}
                                    className={`cursor-pointer rounded-md px-3 py-2 
                                      hover:bg-amber-100 dark:hover:bg-emerald-800 
                                      ${
                                        field.value === currency
                                          ? "bg-amber-200 dark:bg-emerald-700 font-medium"
                                          : ""
                                      }`}
                                  >
                                    {currency}
                                  </div>
                                )
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </FormControl>
                  </div>
                  <FormDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    Choose the currency for this account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error / Success Messages */}
            {errorMessage && (
              <ErrorMessage error={errorMessage} className="my-3" />
            )}
            {successMessage && (
              <SuccessMessage message={successMessage} className="my-3" />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-full text-white px-4 py-2 rounded-lg
                bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-600
                hover:from-amber-500 hover:via-emerald-600 hover:to-teal-700
                dark:from-[#B88A1D] dark:via-[#178C7E] dark:to-[#116E60]
                dark:hover:from-[#C49A29] dark:hover:via-[#1A9B8B] dark:hover:to-[#1330006E]
                shadow-md hover:shadow-lg transition-all
                disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CreditCard className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
