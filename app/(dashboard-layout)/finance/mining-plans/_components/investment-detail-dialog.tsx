"use client";

import { FC, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Investment } from "@/types/mining-plans";
import { cn } from "@/lib/utils";
import { statusConfig } from "./all-plans";
import dayjs from "dayjs";

interface InvestmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment;
}

// 📌 Responsive Detail Row
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 py-2 sm:py-3 items-start">
    <dt className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base">
      {label}
    </dt>
    <dd className="text-gray-900 dark:text-gray-100 break-words capitalize text-xs sm:text-sm md:text-base">
      {value}
    </dd>
  </div>
);

const InvestmentDetailDialog: FC<InvestmentDetailDialogProps> = ({
  open,
  onOpenChange,
  investment,
}) => {
  // 🗓️ Compute End Date (startDate + months)
  const endDate = useMemo(() => {
    if (!investment.startDate || !investment.miningCycle) return null;
    return dayjs(investment.startDate)
      .add(investment.miningCycle, "month")
      .format("MMM D, YYYY");
  }, [investment.startDate, investment.miningCycle]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-3xl max-h-[90vh] overflow-auto rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
            {investment.plan?.title ?? `Plan #${investment.planId}`}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
            Detailed view of this investment plan.
          </DialogDescription>
        </DialogHeader>

        {/* Details */}
        <dl className="divide-y divide-gray-200 dark:divide-gray-700 mt-2 sm:mt-3 md:mt-4">
          <DetailRow label="Plan ID" value={investment.planId} />
          <DetailRow label="Deposit Amount" value={investment.depositAmount} />
          <DetailRow
            label="Mining Cycle"
            value={`${investment.miningCycle} Month${investment.miningCycle > 0 ? "s" : ""}`}
          />
          <DetailRow label="Option" value={investment.option?.type ?? "N/A"} />
          <DetailRow
            label="Status"
            value={
              <span
                className={cn(
                  statusConfig[investment.status].colorClass,
                  "inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs md:text-sm font-medium"
                )}
              >
                {statusConfig[investment.status].icon}{" "}
                <span className="ml-1">{statusConfig[investment.status].label}</span>
              </span>
            }
          />
          {investment.status === "active" && (
            <>
              <DetailRow
                label="Start Date"
                value={
                  investment.startDate
                    ? dayjs(investment.startDate).format("MMM D, YYYY")
                    : "N/A"
                }
              />
              <DetailRow label="End Date" value={endDate} />
            </>
          )}
        </dl>

        <DialogFooter className="mt-4 sm:mt-5 md:mt-6">
          <Button
            variant="default"
            className="w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 sm:py-2.5"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDetailDialog;
