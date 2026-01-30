"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { MonthlyData } from "@/types/fractional-mining-profit";
import {
  Calendar,
  DollarSign,
  Lock,
  Unlock,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatMonth = (value: string | number) => {
  const date = dayjs.utc(value);
  return date.isValid() ? date.local().format("MMM YYYY") : "Invalid Date";
};

interface MonthlyProfitListProps {
  monthlyData?: MonthlyData[] | null;
}

type FilterType =
  | "all"
  | "locked"
  | "unlocked"
  | "withdrawable"
  | "notWithdrawable"
  | "transferred"
  | "pending";

export default function MonthlyProfitList({
  monthlyData,
}: MonthlyProfitListProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const safeData = useMemo(() => monthlyData ?? [], [monthlyData]);

  const filteredData = useMemo(() => {
    const baseData = (() => {
      switch (filter) {
        case "locked":
          return safeData.filter((m) => m.locked);
        case "unlocked":
          return safeData.filter((m) => !m.locked);
        case "withdrawable":
          return safeData.filter((m) => m.withdrawable);
        case "notWithdrawable":
          return safeData.filter((m) => !m.withdrawable);
        case "transferred":
          return safeData.filter((m) => m.isTransferred);
        case "pending":
          return safeData.filter((m) => !m.isTransferred);
        default:
          return safeData;
      }
    })();

    // ✅ Sort by monthEnd descending (most recent first)
    return [...baseData].sort(
      (a, b) => dayjs(a.monthEnd).valueOf() - dayjs(b.monthEnd).valueOf()
    );
  }, [safeData, filter]);

  const visibleMonths = showAll ? filteredData : filteredData.slice(0, 6);

  if (!safeData.length) {
    return (
      <Card
        className="w-full p-6 sm:p-10 text-center border border-dashed shadow-sm 
                       bg-white dark:bg-gray-900"
      >
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
            No monthly profit data available.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // 🎨 Filter color mapping
  const filterColors: Record<FilterType, string> = {
    all: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    locked: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    unlocked:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    withdrawable:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    notWithdrawable:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    transferred:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <>
      <div className="w-full">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              { key: "all", label: "All", icon: null },
              {
                key: "locked",
                label: "Locked",
                icon: <Lock className="w-4 h-4" />,
              },
              {
                key: "unlocked",
                label: "Unlocked",
                icon: <Unlock className="w-4 h-4" />,
              },
              {
                key: "withdrawable",
                label: "Withdrawable",
                icon: <CheckCircle className="w-4 h-4" />,
              },
              {
                key: "notWithdrawable",
                label: "Not Withdrawable",
                icon: <XCircle className="w-4 h-4" />,
              },
              {
                key: "transferred",
                label: "Transferred",
                icon: <CheckCircle className="w-4 h-4" />,
              },
              {
                key: "pending",
                label: "Pending",
                icon: <ArrowRightLeft className="w-4 h-4" />,
              },
            ] as { key: FilterType; label: string; icon: React.ReactNode }[]
          ).map(({ key, label, icon }) => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              onClick={() => setFilter(key)}
              className={cn(
                "gap-1 px-3 py-1 text-xs sm:text-sm rounded-lg border transition-colors",
                filter === key
                  ? cn(
                      filterColors[key],
                      "border-transparent font-semibold shadow-sm"
                    )
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-muted/20"
              )}
            >
              {icon} {label}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMonths.map((month) => (
            <Card
              key={month.id ?? month.monthStart}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
                       shadow-sm hover:shadow-md hover:border-primary/40 
                       transition-all duration-200 flex flex-col"
            >
              {/* HEADER */}
              <CardHeader
                className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 
                       bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Month */}
                  <div className="flex items-center gap-1.5 text-primary font-semibold">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <CardTitle
                      className="text-xs sm:text-sm lg:text-base font-semibold 
                            tracking-tight text-gray-900 dark:text-gray-50"
                    >
                      {formatMonth(month.monthStart)}
                    </CardTitle>
                  </div>

                  {/* Profit */}
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <DollarSign
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 
                             text-gray-900 dark:text-gray-50"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1 leading-tight">
                      <span
                        className="text-base sm:text-lg lg:text-xl font-extrabold 
                         text-gray-900 dark:text-gray-50 tracking-tight"
                      >
                        {isNaN(Number(month.profit))
                          ? "N/A"
                          : Number(month.profit).toFixed(2)}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs lg:text-sm font-medium 
                         text-gray-600 dark:text-gray-400"
                      >
                        {month.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* STATUS */}
              <CardContent className="p-4 sm:p-5 flex-1">
                <div className="flex flex-wrap gap-2">
                  {[
                    month.locked
                      ? {
                          label: "Locked",
                          icon: <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
                          className:
                            "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
                        }
                      : {
                          label: "Unlocked",
                          icon: (
                            <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ),
                          className:
                            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
                        },

                    month.withdrawable
                      ? {
                          label: "Withdrawable",
                          icon: (
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ),
                          className:
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
                        }
                      : {
                          label: "Not Withdrawable",
                          icon: (
                            <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ),
                          className:
                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                        },

                    month.isTransferred
                      ? {
                          label: "Transferred",
                          icon: (
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ),
                          className:
                            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                        }
                      : {
                          label: "Pending Transfer",
                          icon: (
                            <ArrowRightLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ),
                          className:
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
                        },
                  ].map((status, i) => (
                    <Badge
                      key={i}
                      className={cn(
                        "gap-1 px-2 py-1 text-[10px] sm:text-xs",
                        status.className
                      )}
                    >
                      {status.icon} {status.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More */}
        {filteredData.length > 6 && (
          <div className="pt-6 sm:pt-8 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs sm:text-sm lg:text-base hover:underline"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : "Show All Months"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
