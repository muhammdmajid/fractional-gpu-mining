/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Row, RowData } from "@tanstack/react-table";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CardContent } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import StepWalletUser from "./step-wallet-user";
import StepTransactionDetails from "./step-transaction-details";
import StepStatusType from "./step-status-type";
import StepSummary from "./step-summary";
import { TRANSACTION_STATUSES } from "@/db/schema";
import { ServerResponse } from "@/types";
import { approveDepositRequest } from "@/actions/transaction/approve-deposit-request";
import { SelectTransaction, TransactionType } from "@/types/transaction";
import { toast } from "sonner";
import { DataShape } from "@/app/(dashboard-layout)/finance/_components/table-view";
import { approveWithdrawalRequest } from "@/actions/transaction/approve-withdrawal-request";
import StepMiningPlan from "./step-mining-plan";

/* ---------------- Validation ---------------- */
const schema = z.object({
  status: z.enum(TRANSACTION_STATUSES).optional(),
  amount: z.number().min(0, "Amount must be positive"),
  thirdpartyTransactionId: z.string().optional(),
  thirdpartyWithdrawalAddress: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface RowCardContentProps<TData extends RowData> {
  transaction: Row<TData>;
  isEdit?: boolean;
  setData: React.Dispatch<React.SetStateAction<DataShape | null>>;
}

export function RowCardContent<TData extends RowData>({
  transaction,
  isEdit = false,
  setData,
}: RowCardContentProps<TData>) {
  const {
    transactionId,
    date,
    title,
    description,
    type,
    status,
    amount,
    thirdpartyTransactionId,
    thirdpartyWithdrawalAddress,
    walletName,
    walletBalance,
    walletCurrency,
    userName,
    userEmail,
    userFirstName,
    userLastName,
    userRole,

    // Mining Plan info
    miningPlanId,
    miningPlanTitle,
    miningPlanDescription,

    // Billing Option info
    billingOptionId,
    billingOptionType,
    billingOptionCycle,
  } = transaction.original as any;

  const hasPlanOrBilling = Boolean(miningPlanId || billingOptionId);

  const displayUser =
    userName || `${userFirstName ?? ""} ${userLastName ?? ""}`.trim();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: status ?? TRANSACTION_STATUSES[0],
      amount: Number(amount ?? 0),
      thirdpartyTransactionId: thirdpartyTransactionId ?? "",
      thirdpartyWithdrawalAddress: thirdpartyWithdrawalAddress ?? "",
    },
    mode: "all",
  });

  // Memoized defaults
  const transactionDefaults = useMemo(
    () => ({
      status: status ?? TRANSACTION_STATUSES[0],
      amount: Number(amount ?? 0),
      thirdpartyTransactionId: thirdpartyTransactionId ?? "",
      thirdpartyWithdrawalAddress: thirdpartyWithdrawalAddress ?? "",
    }),
    [status, amount, thirdpartyTransactionId, thirdpartyWithdrawalAddress]
  );

  // Reset to step 1 whenever edit mode changes
  useEffect(() => {
    setStep(1);
  }, [isEdit]);

  // Reset when transaction changes
  const prevId = useRef<string | number>(transactionId);
  useEffect(() => {
    if (prevId.current !== transactionId) {
      methods.reset(transactionDefaults);
      setStep(1);
      prevId.current = transactionId;
    }
  }, [transactionId, transactionDefaults, methods]);

  /* ---------------- Step Navigation ---------------- */
  const nextStep = useCallback(() => {
    if (!isEdit) {
      setStep(hasPlanOrBilling ? 5 : 4); // jump to summary depending on plan existence
      return;
    }

    if (step === 3 && !methods.formState.isValid) {
      methods.trigger();
      return;
    }

    setStep((prev) => {
      // Mining plan is now Step 2 → if no plan, skip directly to Step 3
      if (prev === 2 && !hasPlanOrBilling) return 3;
      return Math.min(prev + 1, 5);
    });
  }, [isEdit, step, methods, hasPlanOrBilling]);

  const prevStep = useCallback(() => {
    if (!isEdit) {
      setStep(1);
      return;
    }
    setStep((prev) => Math.max(prev - 1, 1));
  }, [isEdit]);

  /* ---------------- Helpers ---------------- */
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const handleCopy = async (id: string, key: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      alert("Unable to copy ID. Please try manually.");
    }
  };


const onSubmit = async (dataValues: FormValues, transactionId: string,type:TransactionType) => {
  setLoading(true);
  setErrorMessage(null);
  setSuccessMessage(null);

  try {
    // 🔹 Step 1: Call the correct server action (deposit or withdrawal)
    const response: ServerResponse<SelectTransaction> =
      type === "deposit"
        ? await approveDepositRequest({
            transactionId,
            amount: dataValues.amount,
            thirdpartyTransactionId: dataValues.thirdpartyTransactionId ?? "",
            status: dataValues?.status ?? "pending"
          })
        : await approveWithdrawalRequest({
            transactionId,
            amount: dataValues.amount,
            status: dataValues?.status ?? "pending",
            thirdpartyWithdrawalAddress:dataValues?.thirdpartyWithdrawalAddress??""
          });

    // 🔹 Step 2: Handle success response
    if (response.success && response.data) {
      // Update local state with new transaction details
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          transactionsData: prevData.transactionsData.map((item) =>
            item.transactionId === response.data?.id
              ? {
                  ...item,
                  transactionId: response.data.id,
                  title: response.data.title,
                  description: response.data.description,
                  date: response.data.date,
                  type: response.data.type,
                  status: response.data.status,
                  amount: response.data.amount,
                  thirdpartyTransactionId:
                    response.data.thirdpartyTransactionId,
                }
              : item
          ),
        };
      });

      // Show toast if transaction is fully completed
      if (dataValues.status === "completed") {
        toast.success("✅ Transaction Completed", {
          description: `Transaction ${transactionId} has been successfully processed.`,
        });
      }

      // Build dynamic success message
      const msg =
        response.message ??
        `✅ ${type === "deposit" ? "Deposit" : "Withdrawal"} request approved successfully!`;
      toast.success(msg);
      setSuccessMessage(msg);

      // Reset form with updated transaction data
      methods.reset({
        status: response.data.status ?? TRANSACTION_STATUSES[0],
        amount: Number(response.data.amount ?? 0),
        thirdpartyTransactionId: response.data.thirdpartyTransactionId ?? "",
      });

      setStep(1);
    } else {
      // 🔹 Step 3: Handle server-side failure
      const msg =
        response.message ??
        `❌ Failed to approve ${type === "deposit" ? "deposit" : "withdrawal"} request.`;
      toast.error(msg);
      setErrorMessage(msg);

      // Display detailed error messages if available
      if (response.error) {
        if (typeof response.error === "object") {
          Object.values(response.error).forEach((errMsg) =>
            toast.error(String(errMsg))
          );
        } else {
          toast.error(String(response.error));
        }
      }
    }
  } catch (err) {
    // 🔹 Step 4: Handle unexpected errors
    console.error("❌ Transaction approval error:", err);
    const fallbackMsg = `Unexpected error occurred while processing ${type} request. Please try again.`;
    setErrorMessage(fallbackMsg);
    toast.error(fallbackMsg);
  } finally {
    // 🔹 Step 5: Always stop loading spinner
    setLoading(false);
  }
};

  /* ---------------- Render ---------------- */
  try {
    return (
      <CardContent className="flex flex-col gap-4 p-0 m-0">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((props) =>
              onSubmit(props, transactionId, type)
            )}
            className="flex flex-col gap-4"
            onClick={stop}
            onPointerDown={stop}
          >
            {/* Step 1: Wallet + User Info */}
            {step === 1 && (
              <StepWalletUser
                walletName={walletName}
                walletBalance={walletBalance}
                walletCurrency={walletCurrency}
                displayUser={displayUser}
                userEmail={userEmail}
                userRole={userRole}
                date={date}
              />
            )}

            {/* Step 2: Mining Plan + Billing Option */}
            {isEdit && step === 2 && hasPlanOrBilling && (
              <StepMiningPlan
                miningPlanTitle={miningPlanTitle}
                miningPlanDescription={miningPlanDescription}
                billingOptionType={billingOptionType}
                billingOptionCycle={billingOptionCycle}
              />
            )}

            {/* Step 3: Transaction Details */}
            {isEdit && step === 3 && (
              <StepTransactionDetails
                transactionId={transactionId}
                walletCurrency={walletCurrency}
                walletBalance={walletBalance}
                type={type as TransactionType}
                copiedId={copiedId}
                status={status}
                handleCopy={handleCopy}
              />
            )}

            {/* Step 4: Status + Type */}
            {isEdit && step === 4 && (
              <StepStatusType status={status} type={type} />
            )}

            {/* Step 5: Summary */}
            {step === 5 && (
              <StepSummary
                walletCurrency={walletCurrency}
                prevStep={prevStep}
                isEdit={isEdit}
                loading={loading}
                status={status}
                transactionId={transactionId}
                type={type as TransactionType}
                errorMessage={errorMessage}
                successMessage={successMessage}
                title={title}
                description={description}
                miningPlanTitle={miningPlanTitle}
                miningPlanDescription={miningPlanDescription}
                billingOptionType={billingOptionType}
                billingOptionCycle={billingOptionCycle}
              />
            )}

            {/* Navigation */}
            {step !== 5 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between mt-4 gap-2"
              >
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  variant="default"
                  onClick={nextStep}
                  className="bg-blue-600 ml-auto text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {step === (hasPlanOrBilling ? 4 : 3) ? "Summary" : "Next"}
                </Button>
              </motion.div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    );
  } catch (err) {
    console.error("Unexpected error in RowCardContent:", err);
    return (
      <CardContent className="text-red-600 p-4">
        <p>Something went wrong while loading this transaction.</p>
      </CardContent>
    );
  }
}
