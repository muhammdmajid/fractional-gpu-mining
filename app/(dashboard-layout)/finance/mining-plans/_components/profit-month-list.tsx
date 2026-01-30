"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Button } from "@/ui/primitives/button";
import { cn } from "@/lib/utils";
import { CalendarDays, DollarSign, Lock, Unlock } from "lucide-react";
import dayjs from "dayjs";
import { GpuMiningMonthly } from "@/types/fractional-mining-profit";

interface ProfitMonthListProps {
  allMonths: (Omit<GpuMiningMonthly, "monthStart" | "monthEnd"> & {
      monthEnd: string;
      monthStart: string;
    })[];
}

const ProfitMonthList: FC<ProfitMonthListProps> = ({ allMonths }) => {
  const [currentMonth, setCurrentMonth] = useState<(Omit<GpuMiningMonthly, "monthStart" | "monthEnd"> & {
      monthEnd: string;
      monthStart: string;
    }) | null>(null);

  return (
    <div className="w-full">
      {/* 🖥️ Header (Desktop) */}
      <div className="hidden md:grid grid-cols-5 gap-4 items-center px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
        <div>Start</div>
        <div>End</div>
        <div>Profit</div>
        <div>Status</div>
        <div className="text-right">Action</div>
      </div>

      <AnimatePresence>
        {allMonths.map((month) => {
          const startDate = dayjs(month.monthStart).format("MMM YYYY");
          const endDate = dayjs(month.monthEnd).format("MMM YYYY");

          return (
            <motion.div
              key={month.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCurrentMonth(month)}
              className={cn(
                "w-full border-b border-border cursor-pointer transition hover:bg-muted/50 rounded-xl",
                currentMonth?.id === month.id ? "bg-primary/5" : ""
              )}
            >
              {/* 📱 Mobile Card */}
              <Card className="block md:hidden p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">
                    {startDate} → {endDate}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(month);
                    }}
                  >
                    View
                  </Button>
                </div>

                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>${month.profit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>
                      {startDate} → {endDate}
                    </span>
                  </div>
                  <Badge
                    variant={month.locked ? "destructive" : "secondary"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {month.locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    {month.withdrawable
                      ? "Withdrawable"
                      : month.locked
                      ? "Locked"
                      : "Pending"}
                  </Badge>
                </div>
              </Card>

              {/* 🖥️ Desktop Row */}
              <div className="hidden md:grid grid-cols-5 gap-4 items-center px-4 py-3 text-sm">
                <div>{startDate}</div>
                <div>{endDate}</div>
                <div className="text-green-600 dark:text-green-400 font-medium">
                  ${month.profit}
                </div>
                <div>
                  <Badge
                    variant={month.locked ? "destructive" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {month.locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    {month.withdrawable
                      ? "Withdrawable"
                      : month.locked
                      ? "Locked"
                      : "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(month);
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ProfitMonthList;
