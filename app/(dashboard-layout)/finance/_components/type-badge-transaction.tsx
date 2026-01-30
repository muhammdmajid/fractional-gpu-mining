import { TransactionType } from "@/types/transaction";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React, { JSX } from "react";

const typeConfig: Record<
  TransactionType,
  {
    label: string;
    icon: JSX.Element;
    iconColor: string;
    bgColor: string;
    textColor: string;
  }
> = {
  deposit: {
    label: "Deposit",
    icon: <ArrowDownCircle className="w-4 h-4" />,
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-800 dark:text-green-200",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: <ArrowUpCircle className="w-4 h-4" />,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-800 dark:text-red-200",
  },
};

export default function TypeBadgeTransaction({ type }: { type?: string }) {
  const normalized = type?.toLowerCase() as TransactionType | undefined;
  const cfg = normalized ? typeConfig[normalized] : undefined;

  if (!cfg) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
        Unknown
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${cfg.bgColor} ${cfg.textColor}`}
    >
      {React.cloneElement(cfg.icon, { className: `w-4 h-4 ${cfg.iconColor}` })}
      {cfg.label}
    </div>
  );
}
