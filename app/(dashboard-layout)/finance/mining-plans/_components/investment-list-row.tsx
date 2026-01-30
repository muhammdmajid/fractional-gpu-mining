"use client";

import { FC, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { Investment } from "@/types/mining-plans";
import { cn } from "@/lib/utils";
import { statusConfig } from "./all-plans";
import dayjs from "dayjs";
import { CalendarDays, DollarSign, FileText } from "lucide-react";
import InvestmentDetailDialog from "./investment-detail-dialog";

interface InvestmentListRowProps {
  investment: Investment;
  currentInvestmentPlan: Investment | null;
  setCurrentInvestmentPlan: (plan: Investment) => void;
  showHeader?: boolean;
}

const InvestmentListRow: FC<InvestmentListRowProps> = ({
  investment,
  currentInvestmentPlan,
  setCurrentInvestmentPlan,
}) => {
  const [open, setOpen] = useState(false);

  // 🗓️ Start / End Dates
  const startDate = useMemo(() => {
    if (!investment.startDate) return null;
    return dayjs(investment.startDate).format("MMM D, YYYY");
  }, [investment.startDate]);

  const endDate = useMemo(() => {
    if (!investment.startDate || !investment.miningCycle) return null;
    return dayjs(investment.startDate)
      .add(investment.miningCycle, "month")
      .format("MMM D, YYYY");
  }, [investment.startDate, investment.miningCycle]);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setCurrentInvestmentPlan(investment)}
        className={cn(
          "w-full border-b cursor-pointer transition  ",
          currentInvestmentPlan?.id === investment.id ? "bg-primary/5" : ""
        )}
      >
        {/* 📱 Mobile Card Layout */}
        <div className="block md:hidden p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground text-sm sm:text-base md:text-lg">
              {investment.plan?.title ?? `Plan #${investment.planId}`}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <FileText className="h-4 w-4 mr-1" /> Details
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs sm:text-sm">
                {investment.depositAmount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm">
                {investment.miningCycle} Month
                {investment.miningCycle > 1 ? "s" : ""}
              </span>
            </div>
            {startDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs sm:text-sm">Start: {startDate}</span>
              </div>
            )}
            {endDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-xs sm:text-sm">End: {endDate}</span>
              </div>
            )}

            <Badge
              variant="secondary"
              className={cn(
                "mt-1 text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1",
                statusConfig[investment.status].colorClass
              )}
            >
              {statusConfig[investment.status].icon}
              <span className="ml-1">
                {statusConfig[investment.status].label}
              </span>
            </Badge>
          </div>
        </div>

        {/* 💻 Tablet/Desktop Row */}
        <div className="hidden md:grid grid-cols-6 lg:grid-cols-8 gap-3 lg:gap-6 items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm lg:text-base">
          <div className="font-medium truncate text-foreground">
            {investment.plan?.title ?? `Plan #${investment.planId}`}
          </div>
          <div className="text-muted-foreground">{investment.depositAmount}</div>
          <div className="hidden md:block text-muted-foreground">
            {investment.miningCycle} Month
            {investment.miningCycle > 1 ? "s" : ""}
          </div>
          <div className="hidden md:block text-muted-foreground">
            {startDate ?? "--"}
          </div>
          <div className="hidden md:block text-muted-foreground">
            {endDate ?? "--"}
          </div>
          <div className="hidden lg:flex">
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1",
                statusConfig[investment.status].colorClass
              )}
            >
              {statusConfig[investment.status].icon}
              <span className="ml-1">
                {statusConfig[investment.status].label}
              </span>
            </Badge>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <FileText className="h-4 w-4 mr-1" /> Details
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 🪟 Detail Dialog */}
      <InvestmentDetailDialog
        open={open}
        onOpenChange={setOpen}
        investment={investment}
      />
    </>
  );
};

export default InvestmentListRow;
