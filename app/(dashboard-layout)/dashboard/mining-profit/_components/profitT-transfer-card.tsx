
"use client";

import { Wallet, DollarSign, ArrowRightLeft, Loader2 } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";
import AccountSelector from "@/app/(dashboard-layout)/finance/wallets/_component/account-selector";
import { AccountInfo } from "@/types/user-wallet-account";
import { MonthlyData } from "@/types/fractional-mining-profit";
import { filterWithdrawable } from "@/lib/utils";
import { toast } from "sonner";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { SelectTransaction } from "@/types/transaction";
import { sendTransferProfitRequest } from "@/actions/transaction/tansfer-profit-request";
import { ServerResponse } from "@/types";
import { motion } from "framer-motion";

interface ProfitTransferCardProps {
  accountInfo: AccountInfo[];
  currentAccount: AccountInfo | null;
  setCurrentAccount: (account: AccountInfo | null) => void;
  monthlyData?: MonthlyData[] | null;

}

const ProfitTransferCard: FC<ProfitTransferCardProps> = ({
  accountInfo,
  currentAccount,
  setCurrentAccount,
  monthlyData,
}) => {
  // Calculate available profit
const [filteredData, setFilteredData] = useState<MonthlyData[]>([]);
const [availableProfit, setAvailableProfit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

useEffect(() => {
  if (!monthlyData) {
    setFilteredData([]);
    setAvailableProfit(0);
    return;
  }

  const data = filterWithdrawable(monthlyData);
  setFilteredData(data);

  const total = data.reduce((sum, item) => sum + parseFloat(item.profit), 0);
  setAvailableProfit(total);
}, [monthlyData]);


const onTransfer = async () => {
  setLoading(true);
  setErrorMessage(null);
  setSuccessMessage(null);

  try {
    // Check prerequisites first
    if (!currentAccount?.id) {
      const msg = "No valid account selected for transfer";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
      const msg = "No valid investment found to transfer profit from";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!filteredData[0].planId) {
      const msg = "Selected investment is invalid";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    // Call updated API
    const response = await sendTransferProfitRequest(
      currentAccount.id,      // wallet/account to transfer profit into
      filteredData[0].planId  // investment to pull profit from
    );

    if (response.success && response.data) {
      const msg = response.message ?? "Profit transfer completed successfully!";
      toast.success(msg);
      setSuccessMessage(msg);
    } else {
      const msg = response.message ?? "Failed to complete transfer";
      toast.error(msg);
      setErrorMessage(msg);
    }
  } catch (error) {
    console.error(error);
    const msg = "Something went wrong while processing transfer";
    setErrorMessage(msg);
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="w-full transition-colors">
 

      <CardContent className="text-sm space-y-4 ">
        {/* Account Selector */}
        <AccountSelector
          accountInfo={accountInfo}
          currentAccount={currentAccount}
          setCurrentAccount={setCurrentAccount}
          isNewCreate={false}
        />

        <Separator className="dark:border-gray-700" />

        {/* Account Details */}
        {currentAccount ? (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {currentAccount.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  ID: {currentAccount.id}
                </p>
                <p className="text-muted-foreground text-xs flex items-center gap-1">
                  Currency:
                  <Badge
                    variant="outline"
                    className="ml-1 capitalize dark:border-gray-600 dark:text-gray-300"
                  >
                    {currentAccount.currency ?? "N/A"}
                  </Badge>
                </p>
                <p className="text-muted-foreground text-xs">
                  Balance:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {parseFloat(currentAccount.balance).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            No account selected
          </div>
        )}

        <Separator className="dark:border-gray-700" />

        {/* Profit Info */}
        <div className="flex items-center gap-3 pb-3">
          <div className="flex-shrink-0 p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Available Profit
            </p>
            <p className="text-muted-foreground text-sm">
              {availableProfit.toFixed(2)} {currentAccount?.currency ?? "N/A"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-3">
                  {errorMessage && <ErrorMessage error={errorMessage}  className="my-3"/>}
                  {successMessage && <SuccessMessage message={successMessage} className="my-3" />}
      <Button
      onClick={onTransfer}
      disabled={!currentAccount || availableProfit <= 0 || loading}
      className="
        w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md shadow-sm
        bg-gradient-to-r from-blue-600 to-indigo-500 text-white
        hover:from-blue-700 hover:to-indigo-600
        dark:from-blue-500 dark:to-indigo-400 dark:text-gray-900
        dark:hover:from-blue-600 dark:hover:to-indigo-500
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="h-5 w-5" />
        </motion.div>
      ) : (
        <ArrowRightLeft className="h-5 w-5" />
      )}
      {loading ? "Transferring..." : "Transfer Profit"}
    </Button>
      </CardFooter>
    </div>
  );
};

export default ProfitTransferCard;
