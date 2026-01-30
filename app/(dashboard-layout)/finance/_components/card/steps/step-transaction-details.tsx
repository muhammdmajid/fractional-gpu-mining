"use client";

import { Hash, Copy, Check, FileText } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/primitives/tooltip";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/ui/primitives/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { TransactionStatus, TransactionType } from "@/types/transaction";
import { toast } from "sonner";

interface StepTransactionDetailsProps {
  transactionId: string;
  walletCurrency: string;
  type: TransactionType;
  status: TransactionStatus;
  copiedId: string | null;
  handleCopy: (id: string, key: string) => void;
  walletBalance: number;

}

export default function StepTransactionDetails({
  transactionId,
  walletCurrency,
  walletBalance,
  type,
  copiedId,
  status: status,
  handleCopy,
}: StepTransactionDetailsProps) {
  const form = useFormContext();
  const isCompleted = status === "completed";

  // Usage inside useEffect

  return (
    <div className="w-full space-y-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Transaction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Transaction ID (read-only) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 w-full">
          {/* Label */}
          <span className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">
            Transaction #
          </span>

          {/* Badge with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full px-3 py-1 text-xs sm:text-sm font-medium flex items-center gap-1",
                  isCompleted
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                )}
              >
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                {transactionId}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="text-sm text-gray-600 dark:text-gray-300">
              ID: {transactionId}
            </TooltipContent>
          </Tooltip>
        </div>



        {/* Third-party Transaction ID */}
        {type === "deposit" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm mt-3 w-full">
            <FormField
              control={form.control}
              name="thirdpartyTransactionId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Third-Party Transaction ID</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter third-party transaction ID"
                        disabled={isCompleted}
                      />
                    </FormControl>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-accent"
                      onClick={() =>
                        handleCopy(
                          form.getValues("thirdpartyTransactionId"),
                          "thirdpartyTransactionId"
                        )
                      }
                      disabled={isCompleted}
                    >
                      {copiedId === "thirdpartyTransactionId" ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : null}

        {/* Third-party Withdrawal Address */}
        {type === "withdrawal" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm mt-3 w-full">
            <FormField
              control={form.control}
              name="thirdpartyWithdrawalAddress"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Third-Party Withdrawal Address</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter third-party withdrawal address"
                        disabled={isCompleted}
                      />
                    </FormControl>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-accent"
                      onClick={() =>
                        handleCopy(
                          form.getValues("thirdpartyWithdrawalAddress"),
                          "thirdpartyWithdrawalAddress"
                        )
                      }
                      disabled={isCompleted}
                    >
                      {copiedId === "thirdpartyWithdrawalAddress" ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : null}

        {/* Amount */}
        <div className="mt-3">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <div
                  className={cn(
                    "flex items-center gap-1 font-bold w-full text-sm",
                    form.watch("amount") >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => {
                        const rawValue = Number(e.target.value);

                        // Disallow negatives (but allow 0)
                        if (rawValue < 0) {
                          toast.error("Amount cannot be negative");
                          form.setError("amount", {
                            type: "manual",
                            message: "Amount cannot be negative",
                          });
                          return;
                        }

                        if (type === "withdrawal") {
                          if (rawValue > Number(walletBalance)) {
                            field.onChange(0);
                            toast.error(
                              "You cannot enter more than your current balance"
                            );
                            form.setError("amount", {
                              type: "manual",
                              message:
                                "You cannot enter more than your current balance",
                            });
                            return; // stop updating the field
                          } else {
                          }
                        }

                        // Clear error if valid
                        form.clearErrors("amount");
                        field.onChange(rawValue);
                      }}
                      placeholder="Enter amount"
                      disabled={isCompleted}
                    />
                  </FormControl>

                  <span className="ml-1">{walletCurrency}</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </div>
  );
}
