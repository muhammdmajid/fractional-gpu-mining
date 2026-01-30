import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/types/transaction";
import { Badge } from "@/ui/primitives/badge";
import { AlertCircle, CheckCircle, XCircle, Ban } from "lucide-react";
import { JSX } from "react";

export const statusConfig: Record<
  TransactionStatus,
  {
    label: string;
    icon: JSX.Element;
    variant: "default" | "secondary" | "destructive" | "outline";
    colorClass: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: (
      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1" />
    ),
    variant: "secondary",
    colorClass:
      "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-300",
  },
  completed: {
    label: "Completed",
    icon: (
      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1" />
    ),
    variant: "default",
    colorClass:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300",
  },
  failed: {
    label: "Failed",
    icon: (
      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1" />
    ),
    variant: "destructive",
    colorClass:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: (
      <Ban className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1" />
    ),
    variant: "outline",
    colorClass:
      "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-300",
  },
};

export default function StatusBadgeTransaction({
  status,
  className = "",
}: {
  status?: string;
  className?: string;
}) {
  if (!status) {
    return (
      <Badge
        className="flex items-center gap-1 
        px-1.5 sm:px-2 md:px-3 
        py-0.5 sm:py-1 
        text-[10px] sm:text-xs md:text-sm 
        font-medium rounded-full shadow-sm 
        m-0.5 sm:m-1 md:m-2 
        bg-gray-300 text-gray-700 
        dark:bg-gray-700 dark:text-gray-200"
      >
        Unknown
      </Badge>
    );
  }

  // Normalize input to match keys in statusConfig
  const normalized = status.toLowerCase() as TransactionStatus;

  const cfg = statusConfig[normalized];

  if (!cfg) {
    return (
      <Badge
        className={cn(
          "flex items-center gap-1 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs md:text-sm font-medium rounded-full shadow-sm m-0.5 sm:m-1 md:m-2 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
          className
        )}
      >
        Unknown
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        `flex items-center gap-0.5 sm:gap-1 
        px-1.5 sm:px-2 md:px-3 
        py-0.5 sm:py-1 
        text-[10px] sm:text-xs md:text-sm 
        font-medium rounded-full shadow-sm 
        m-0.5 sm:m-1 md:m-2 
        transition-colors ${cfg.colorClass}`,
        className
      )}
    >
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}
