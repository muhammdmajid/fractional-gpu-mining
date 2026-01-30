import { Button } from "@/ui/primitives/button";
import { FormLabel } from "@/ui/primitives/form";
import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { PAYMENT_WITHDRAWAL_POLICY } from "@/config";

interface WalletInfoProps {
  isWithdrawal?: boolean; // pass true or false
}

export function WalletInfo({ isWithdrawal = false }: WalletInfoProps) {
  const [copied, setCopied] = useState(false);
  const walletNumber = PAYMENT_WITHDRAWAL_POLICY.FINANCE_ACCOUNT_NUMBER;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Network */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <FormLabel className="text-gray-800 dark:text-gray-200 font-medium w-full sm:w-1/5 text-left">
            Network
          </FormLabel>
          <p className="text-sm sm:text-base font-mono text-gray-800 dark:text-gray-200 break-all rounded-md w-full sm:w-4/5">
            {PAYMENT_WITHDRAWAL_POLICY.FINANCE_ACCOUNT_NAME}
          </p>
        </div>

        {/* Wallet Address */}
        {!isWithdrawal && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <FormLabel className="text-gray-800 dark:text-gray-200 font-medium w-full sm:w-1/5 text-left">
              Wallet Address
            </FormLabel>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-4/5">
              <p className="text-sm sm:text-base font-mono text-gray-700 dark:text-gray-300 break-all bg-gray-100 dark:bg-gray-700 rounded-md p-2 w-full sm:flex-1">
                {walletNumber}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 w-full sm:w-auto justify-center"
                onClick={() => copyToClipboard(walletNumber)}
              >
                {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
