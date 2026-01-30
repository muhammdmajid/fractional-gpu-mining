/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  SelectTransactionPublic,
  TransactionStatus,
} from "@/types/transaction";
import {
  TimelineContent,
  TimelineDot,
  TimelineDotProps,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/ui/primitives/timeline";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CardContent } from "@/ui/primitives/card";
import TypeBadgeTransaction from "../../_components/type-badge-transaction";
import StatusBadgeTransaction from "../../_components/status-badge-transaction";

// Mapping of predefined status → icon & class
const statusIconMap: Record<
  TransactionStatus | "current",
  { iconName: TimelineDotProps["customIconName"]; className?: string }
> = {
  current: { iconName: "Activity" },
  pending: { iconName: "AlarmClock", className: "bg-yellow-500 text-white" },
  completed: { iconName: "Airplay", className: "bg-green-500 text-white" },
  failed: { iconName: "AirVent", className: "bg-red-500 text-white" },
  cancelled: { iconName: "Accessibility", className: "bg-gray-500 text-white" },
};

interface TransactionTimelineItemProps {
  transaction: SelectTransactionPublic | null | undefined;
  isLast: boolean;
}

export function TransactionTimelineItem({
  transaction: txn,
  isLast,
}: TransactionTimelineItemProps) {
  if (!txn) {
    return (
      <TimelineItem>
        <TimelineContent className="text-sm text-red-500">
          Error: Transaction data is missing
        </TimelineContent>
      </TimelineItem>
    );
  }

  const status = txn.status || "Idle";
  const statusIcon = statusIconMap[status];

  let formattedDate = "Invalid date";
  try {
    formattedDate = txn.date
      ? format(new Date(txn.date), "MMM d, yyyy HH:mm")
      : "Date not available";
  } catch (err) {
    console.error("Error formatting transaction date:", err);
  }

  return (
    <TimelineItem>
      {/* Timeline Dot */}
      <TimelineDot
        customIconName={(statusIcon?.iconName as any) || "Activity"}
        customStatusName={status}
        iconClassName={`size-6 p-1 text-white ${statusIcon?.className || ""}`}
      />
      {!isLast && <TimelineLine />}

      {/* Content Card */}
      <TimelineContent className="pl-2 w-full">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="border-b ">
            <CardContent className="p-4 space-y-3">
            
              {/* Header: Title + Date */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2">
  <TimelineHeading 
    className="text-base font-semibold text-slate-900 dark:text-slate-100 break-words"
    style={{
    wordWrap: "break-word",
    width: "100%",
  }}
    >
  {txn?.title || "Untitled Transaction"}
</TimelineHeading>

  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
    {formattedDate}
  </span>
</div>

{/* Amount & Type */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
  <span className="text-sm text-slate-700 dark:text-slate-300 mb-1 sm:mb-0">
    Amount:{" "}
    <span className="font-semibold text-slate-900 dark:text-slate-100">
      {txn?.amount}
    </span>
  </span>
  <TypeBadgeTransaction type={txn?.type} />
</div>

              {/* Status */}
              <div className="flex items-center">
                <StatusBadgeTransaction status={txn?.status} />
              </div>

              {/* Description */}
              {txn?.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {txn.description}
                </p>
              )}

              {/* Third-Party Transaction ID */}
              {txn?.thirdpartyTransactionId && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                  Ref ID: {txn.thirdpartyTransactionId}
                </p>
              )}
            </CardContent>
          </div>
        </motion.div>
      </TimelineContent>
    </TimelineItem>
  );
}
