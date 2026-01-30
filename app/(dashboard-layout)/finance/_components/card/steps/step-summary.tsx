"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import StatusBadgeTransaction from "../../status-badge-transaction";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import ErrorMessage from "@/ui/components/default/error-message";
import SuccessMessage from "@/ui/components/default/success-message";
import { TransactionStatus, TransactionType } from "@/types/transaction";

interface StepSummaryProps {
  walletCurrency: string;
  isEdit?: boolean;
  prevStep: () => void;
  loading?: boolean;
  status: TransactionStatus;
  successMessage: string | null;
  errorMessage: string | null;
  transactionId: string;
  type: TransactionType;
  description: string;
  title: string;

  // ✅ new props for plan + billing option
  miningPlanTitle?: string | null;
  miningPlanDescription?: string | null;
  billingOptionType?: string | null;
  billingOptionCycle?: number | null;
}

export default function StepSummary({
  walletCurrency,
  isEdit,
  prevStep,
  status: oldStatus,
  loading = false,
  successMessage,
  errorMessage,
  transactionId,
  type,
  description,
  title,
  miningPlanTitle,
  miningPlanDescription,
  billingOptionType,
  billingOptionCycle,
}: StepSummaryProps) {
  const { watch } = useFormContext();

  const status = watch("status");
  const amount = watch("amount");
  const thirdpartyTransactionId = watch("thirdpartyTransactionId");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h3 className="text-lg font-semibold tracking-tight">Summary</h3>

      {/* Details */}
      <div className="grid gap-4 text-sm">
        {oldStatus === "completed" ? (
          <>
            <SummaryItem label="Title">
              <span className="capitalize font-semibold">{title || "-"}</span>
            </SummaryItem>

            <SummaryItem label="Description">
              <span className="capitalize font-semibold">
                {description || "-"}
              </span>
            </SummaryItem>
          </>
        ) : null}

        <SummaryItem
          label={type === "deposit" ? "Third-Party ID" : "Transaction Id"}
        >
          <Badge variant="outline" className="font-mono text-xs w-fit">
            {type === "deposit"
              ? thirdpartyTransactionId || "-"
              : transactionId || "-"}
          </Badge>
        </SummaryItem>

        <SummaryItem label="Status">
          <StatusBadgeTransaction status={status} className="m-0" />
        </SummaryItem>

        <SummaryItem label="Amount">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-sm font-semibold tracking-tight",
                amount >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {amount}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {walletCurrency}
            </span>
          </div>
        </SummaryItem>

        {/* ✅ Mining Plan details */}
        {miningPlanTitle || miningPlanDescription ? (
          <SummaryItem label="Mining Plan">
            <div className="flex flex-col gap-1">
              {miningPlanTitle && (
                <span className="font-semibold">{miningPlanTitle}</span>
              )}
              {miningPlanDescription && (
                <span className="text-muted-foreground text-xs">
                  {miningPlanDescription}
                </span>
              )}
            </div>
          </SummaryItem>
        ) : null}

        {/* ✅ Billing Option details */}
        {billingOptionType || billingOptionCycle ? (
          <SummaryItem label="Billing Option">
            <div className="flex flex-col gap-1">
              {billingOptionType && (
                <span className="capitalize">{billingOptionType}</span>
              )}
              {billingOptionCycle && (
                <span className="text-muted-foreground text-xs">
                  {billingOptionCycle} months
                </span>
              )}
            </div>
          </SummaryItem>
        ) : null}
      </div>

      {/* Inline error / success messages */}
      {errorMessage && <ErrorMessage error={errorMessage} className="my-2" />}
      {successMessage && (
        <SuccessMessage message={successMessage} className="my-2" />
      )}

      {/* Actions */}
      <div
        className={`flex ${
          isEdit ? "justify-between" : "justify-start"
        } pt-4`}
      >
        <Button type="button" variant="secondary" onClick={prevStep}>
          Back
        </Button>

        {isEdit && oldStatus !== "completed" ? (
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Confirm & Save"
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/* -----------------------------------
 * Subcomponent: SummaryItem
 * Keeps a consistent label/value style
 * ----------------------------------- */
function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3 bg-muted/30">
      <div className="text-xs font-medium text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
