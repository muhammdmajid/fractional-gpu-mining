 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { Separator } from "@/ui/primitives/separator";
import { Badge } from "@/ui/primitives/badge";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { Investment } from "@/types/mining-plans";
import { calculatePlansTotals } from "@/lib/utils";
import { useGPUPlans } from "@/providers/gpu-plans-provider";
import { getErrorMessage } from "@/lib/handle-error";

import { createMiningInvestment } from "@/actions/mining-plans/create-mining-investment";
import { ServerResponse } from "@/types";
import { AccountInfo } from "@/types/user-wallet-account";

interface CheckoutProps {
  currentAccount: AccountInfo | null;
}

const Checkout: FC<CheckoutProps> = ({ currentAccount }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { selectedPlan, clearGPUPlans } = useGPUPlans();

  const { grandTotal } = useMemo(
    () => calculatePlansTotals(selectedPlan),
    [selectedPlan]
  );

  const planName = selectedPlan?.title ?? "N/A";
  const optionType = selectedPlan?.selectedOption?.type ?? "N/A";
  const miningCycle = selectedPlan?.selectedOption?.miningCycle ?? 0;

  // Remaining balance after deduction
  const remainingBalance = Number(currentAccount?.balance ?? 0) - grandTotal;

  const handleConfirm = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation checks
    if (!selectedPlan?.id || !selectedPlan?.selectedOption?.id) {
      const msg = "Please select a valid plan and option before continuing.";
      setErrorMessage(msg);
      toast.error(getErrorMessage(msg));
      return;
    }

    if ((selectedPlan?.selectedOption?.selectedgpus?.length ?? 0) === 0) {
      const msg =
        "You must select at least one GPU to proceed with the investment.";
      setErrorMessage(msg);
      toast.error(getErrorMessage(msg));
      return;
    }
 if(!currentAccount?.id)
  {
      const msg = "Account not exist . Please create account  to continue.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (remainingBalance < 0) {
      const msg = "Insufficient balance. Please add funds to continue.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        planId: selectedPlan.id,
        optionId: selectedPlan.selectedOption.id,
        depositAmount: grandTotal,

      };

      const gpus = selectedPlan.selectedOption.selectedgpus.map((gpu) => ({
        id: gpu.id,
      }));

      const result: ServerResponse<Investment> = await createMiningInvestment(
        gpus,
        payload,
        currentAccount?.id??""
      );

      if (!result.success) {
        const msg =
          typeof result.message === "string"
            ? result.message
            : (result.message ?? "Unable to confirm Mining. Please try again.");
        console.error("Mining confirmation error:", msg);
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        clearGPUPlans();
        setErrorMessage(null);
        const successMsg =
          result.message ?? "Your Mining has been successfully confirmed!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);

        setTimeout(() => {
          router.push("/finance/mining-plans");
        }, 300081);
      }
    } catch (err: any) {
      const msg =
        err?.message ?? "An unexpected error occurred. Please try again.";
      console.error("Unexpected error:", msg);
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mt-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Checkout Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Plan Name
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {planName}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Option Type
            </span>
            <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">
              {optionType}
            </span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Mining Cycle
            </span>
            <Badge
              variant="secondary"
              className="dark:bg-gray-800 dark:text-gray-200"
            >
              {miningCycle} Month{miningCycle > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Current Balance
            </span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {Number(currentAccount?.balance ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Mining Amount
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {grandTotal.toFixed(2)}
            </span>
          </div>

          <Separator className="my-2 dark:bg-gray-700" />

          <div className="flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Remaining Balance
            </span>
            <span
              className={`text-lg font-bold ${
                remainingBalance < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {remainingBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && <ErrorMessage error={errorMessage} className="my-2" />}
        {successMessage && (
          <SuccessMessage message={successMessage} className="my-2" />
        )}

        {/* Action Button */}
        {remainingBalance < 0 ? (
          <Button
            onClick={() => router.push("/finance/deposit")}
            className="w-full mt-4 rounded-xl font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
            size="lg"
          >
            Deposit Funds
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            className="w-full mt-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            size="lg"
            disabled={loading || !selectedPlan}
          >
            {loading ? "Processing..." : "Confirm Mining"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Checkout;
