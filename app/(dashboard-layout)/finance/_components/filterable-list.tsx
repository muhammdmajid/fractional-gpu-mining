"use client";

import { useState } from "react";
import { Button } from "@/ui/primitives/button";
import { cn } from "@/lib/utils";

interface StatusConfig {
  [key: string]: {
    label: string;
    icon?: React.ReactNode;
    colorClass?: string; // Full Tailwind classes for bg, text, hover, dark mode
  };
}

interface FilterableListProps<T> {
  data: T[];
  statusConfig: StatusConfig;
  getStatus: (item: T) => string;
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
    header?: React.ReactNode; 
}

export function FilterableList<T>({
  data,
  statusConfig,
  getStatus,
  renderRow,
  emptyMessage = "No items found.",
  className,header=null
}: FilterableListProps<T>) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter((item) => getStatus(item) === statusFilter);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* "All" button */}
        <Button
          size="sm"
          onClick={() => setStatusFilter("all")}
          className={cn(
            "flex items-center gap-1 border",
            statusFilter === "all"
              ? "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-300"
              : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          All
        </Button>

        {/* Dynamic Status Buttons */}
        {Object.keys(statusConfig).map((status) => (
          <Button
            key={status}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "flex items-center gap-1 border",
              statusFilter === status
                ? statusConfig[status]?.colorClass ||
                  "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {statusConfig[status].icon}
            {statusConfig[status].label}
          </Button>
        ))}
      </div>


      {/* List */}
      <div className="rounded-lg border overflow-hidden">
           {/* ✅ Optional Header */}
        {header && <div>{header}</div>}
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col",
                index < filteredData.length - 1 ? "divide-y border-b" : ""
              )}
            >
              {renderRow(item)}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
