/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  DollarSign,
  Clock,
  Check,
  User,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { FaWallet } from "react-icons/fa";
import { TRANSACTION_STATUSES } from "@/db/schema";
import { DataTableColumnHeader } from "./table/data-table-column-header";
import { TransactionStatus, TransactionType } from "@/types/transaction";
import { DataShape } from "./table-view";
import StatusBadgeTransaction from "./status-badge-transaction";
import { TransactionActions } from "./data-table-action-bar";
import { Badge } from "@/ui/primitives/badge";
import { cn } from "@/lib/utils";

interface GetTransactionTableColumnsProps {
  transactionsData: DataShape["transactionsData"];
  statusCounts: DataShape["statusCounts"];
  amountRange: DataShape["amountRange"];
  setData: React.Dispatch<React.SetStateAction<DataShape | null>>;
}

export function getTransactionTableColumns({
  transactionsData,
  statusCounts,
  amountRange,
  setData,
}: GetTransactionTableColumnsProps): ColumnDef<any>[] {
  return [
    // 📌 View / Action Column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <TransactionActions
              row={row} // ✅ only current row
              setData={setData}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },

    // 📝 Title
    {
      id: "transactionId",
      accessorKey: "transactionId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction Id" />
      ),
      cell: ({ row }) => (
        <div className="font-medium max-w-[250px] truncate">
          {row.getValue("transactionId")}
        </div>
      ),
      meta: {
        label: "Transaction Id",
        placeholder: "Search transaction id...",
        variant: "text",
      },
      enableColumnFilter: true,
    },


    {
      id: "userEmail",
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue("userEmail")}</span>
        </div>
      ),
      meta: {
        label: "Email",
        icon: Mail,

        variant: "text",
        placeholder: "Search email...",
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    // 💰 Amount
    {
      id: "amount",
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const rawAmount = row.getValue<any>("amount");
        const amount = Number(rawAmount);
        const type = row.original.type as TransactionType;
    const currency = row.original.walletCurrency as string;
        const amountColor =
          type === "deposit"
            ? "text-green-600 dark:text-green-400"
            : type === "withdrawal"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-800 dark:text-gray-300";

        const displayAmount =
          type === "deposit"
            ? `+${amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : type === "withdrawal"
              ? `-${amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

        return (
        <div
  className={cn(
    "flex items-center gap-1 px-3  rounded-xl border shadow-sm transition-colors duration-300",
    "bg-white dark:bg-gray-800",
    "border-gray-200 dark:border-gray-700",
    "hover:bg-gray-50 dark:hover:bg-gray-900",
    amountColor // dynamic text color based on amount type
  )}
>
  <span className="font-semibold text-sm sm:text-base">{displayAmount}</span>
  <span className="text-xs sm:text-sm font-medium">{currency}</span>
</div>
        );
      },

      meta: {
        label: "Amount",
      },

      enableSorting: true,
    },

    // ⏱️ Date
    {
      id: "date",
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return (
          <span>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      },
      meta: {
        label: "Date",
        variant: "date",
        icon: Clock,
      },
      enableColumnFilter: true,
      enableSorting: true,
    },

    // ✅ Status
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<TransactionStatus>();
        return <StatusBadgeTransaction status={status} />;
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        icon: Check,
        options: TRANSACTION_STATUSES.map((status) => ({
          label: status,
          value: status,
          count: statusCounts[status],
        })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    },

    // 👛 Wallet Info
    {
      id: "walletId",
      accessorKey: "walletId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wallet ID" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <FaWallet className="text-muted-foreground" />
          <span>{row.getValue("walletId")}</span>
        </div>
      ),
      meta: {
        label: "Wallet ID",
        icon: FaWallet,
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: "walletBalance",
      accessorKey: "walletBalance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wallet Balance" />
      ),
      cell: ({ row }) => {
        const balance = Number(row.getValue("walletBalance"));

        const currency = row.original.walletCurrency as string;
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 
             py-1 px-2 justify-between rounded-md flex gap-1
             border border-blue-200 dark:border-gray-700 
             shadow-sm dark:shadow-md
             transition-colors duration-300"
          >
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {currency}
            </span>
          </Badge>
        );
      },
      meta: { label: "Wallet Balance", icon: DollarSign },
    },

    {
      id: "walletAvailableAt",
      accessorKey: "walletAvailableAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Available At" />
      ),
      cell: ({ row }) => {
        const rawValue = row.getValue("walletAvailableAt");

        // ✅ Check if it's a string or number before creating Date
        const date =
          typeof rawValue === "string" || typeof rawValue === "number"
            ? new Date(rawValue)
            : null;

        return (
          <span>
            {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "N/A"}
          </span>
        );
      },
      meta: { label: "Wallet Available At", icon: Calendar },
    }
  ];
}
