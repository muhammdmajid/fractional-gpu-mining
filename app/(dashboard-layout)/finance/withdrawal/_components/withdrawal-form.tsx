"use client";

import { FC, useState, useMemo } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/ui/primitives/form";
import { Separator } from "@/ui/primitives/separator";
import { WalletInfo } from "../../_components/wallet-info";
import { ServerResponse } from "@/types";
import { SelectTransaction, SelectTransactionPublic } from "@/types/transaction";
import { AccountInfo } from "@/types/user-wallet-account";
import { sendWithdrawalRequest } from "@/actions/transaction/send-withdrawal-request";
import { toast } from "sonner";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { ArrowUpToLine } from "lucide-react";
import { PAYMENT_WITHDRAWAL_POLICY } from "@/config";

// -------------------------------
// Form validation schema
// -------------------------------
const withdrawalSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  thirdpartyWithdrawalAddress: z.string().min(5, "Withdrawal address is required"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

// -------------------------------
// Utility function to calculate net withdrawal
// -------------------------------
const calculateWithdrawal = (amount: number, balance: number) => {
  const maxWithdrawal = Math.min(balance, PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL);
  const clampedAmount = Math.min(Math.max(amount, 0), maxWithdrawal);
  const netWithdrawal = clampedAmount - clampedAmount * PAYMENT_WITHDRAWAL_POLICY.WITHDRAWAL_CHARGE;
  const isEligible = clampedAmount > 0 && clampedAmount <= balance;
  return { netWithdrawal, maxWithdrawal, isEligible };
};

// -------------------------------
// WithdrawalForm Component
// -------------------------------
export const WithdrawalForm: FC<{
  currentAccount: AccountInfo;
  transactions: SelectTransactionPublic[];
  setTransactions: React.Dispatch<React.SetStateAction<SelectTransactionPublic[]>>;
}> = ({ currentAccount, transactions, setTransactions }) => {
  const methods = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      thirdpartyWithdrawalAddress: "",
    },
  });

  const { handleSubmit, formState, reset, watch, setValue } = methods;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const thirdpartyWithdrawalAddress = watch("thirdpartyWithdrawalAddress") || "[Please specify]";
  const amount = watch("amount") || 0;

  // -------------------------------
  // Memoized withdrawal calculation
  // -------------------------------
  const { netWithdrawal, maxWithdrawal, isEligible } = useMemo(
    () => calculateWithdrawal(amount, Number(currentAccount.balance)),
    [amount, currentAccount.balance]
  );

  // -------------------------------
  // Handle amount input changes with clamping
  // -------------------------------
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      if (numValue > Number(currentAccount.balance)) numValue = Number(currentAccount.balance);
      if (numValue > PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL) numValue = PAYMENT_WITHDRAWAL_POLICY.MAX_WITHDRAWAL;
      if (numValue < 0) numValue = 0;
      value = numValue.toString();
    }

    setValue("amount", parseFloat(value));
  };

  // -------------------------------
  // Handle Withdrawal Submission
  // -------------------------------
  const handleWithdrawalRequest: SubmitHandler<WithdrawalFormValues> = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: ServerResponse<SelectTransaction> = await sendWithdrawalRequest(
        currentAccount.id,
        data.amount,
        thirdpartyWithdrawalAddress
      );

      if (response.success && response.data) {
        setTransactions([...transactions, response.data]);
        reset({ thirdpartyWithdrawalAddress: "", amount: 0 });
        const msg = response.message ?? "Withdrawal request created successfully!";
        toast.success(msg);
        setSuccessMessage(msg);
      } else {
        const msg = response.message ?? "Failed to create withdrawal request";
        toast.error(msg);
        setErrorMessage(msg);
        if (response.error && typeof response.error === "object") {
          Object.values(response.error).forEach((errMsg) => toast.error(String(errMsg)));
        }
      }
    } catch (error) {
      console.error("❌ Withdrawal request failed:", error);
      const msg = "Something went wrong while creating the withdrawal request";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Card className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-t-2xl">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            <div className="flex items-center gap-2">
              <ArrowUpToLine className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <span>New Withdrawal</span>
            </div>
            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Current Balance:{" "}
              <span className="font-semibold">
                {currentAccount.balance.toLocaleString()} {currentAccount.currency??"USDT"}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-4 w-full">
          {/* Wallet Information */}
          <WalletInfo isWithdrawal={true} />

          <Separator className="my-4" />

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Withdrawal Address */}
            <FormField
              control={methods.control}
              name="thirdpartyWithdrawalAddress"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                    Withdrawal Address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter wallet/crypto withdrawal address" className="mt-1" />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-red-500 mt-1">{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Withdrawal Amount */}
            <FormField
              control={methods.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                    Amount ({currentAccount.currency??"USDT"})
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder={`Enter amount in ${currentAccount.currency??"USDT"}`}
                      value={field.value || ""}
                      onChange={handleAmountChange}
                      className="mt-1"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-red-500 mt-1">{fieldState.error.message}</FormMessage>
                  )}
                  {/* Show net withdrawal info */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Net Withdrawal: {netWithdrawal.toFixed(2)} {currentAccount.currency??"USDT"} (Max: {maxWithdrawal.toFixed(2)})
                  </p>
                </FormItem>
              )}
            />
          </div>

          {/* Inline Error / Success Messages */}
          {errorMessage && <ErrorMessage error={errorMessage} className="my-3" />}
          {successMessage && <SuccessMessage message={successMessage} className="my-3" />}

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit(handleWithdrawalRequest)}
            disabled={formState.isSubmitting || loading || !isEligible}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {formState.isSubmitting || loading ? "Processing..." : "Withdraw"}
          </Button>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
