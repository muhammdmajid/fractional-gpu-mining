"use client";

import { FC, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { ArrowDownToLine, LucideIcon } from "lucide-react";
import { FilterableList } from "./filterable-list";
import { SelectTransactionPublic, TransactionType } from "@/types/transaction";
import TransactionCard from "./transaction-card";
import { statusConfig } from "./status-badge-transaction";
import { UserRole } from "@/types/user";

// Constants
const DEFAULT_SHOW_MONTHS = 3; // Show last 3 months
const DEFAULT_SHOW_LIMIT = 15; // Show last 15 transactions by default

// Props Interface
interface TransactionHistoryProps {
  transactions: SelectTransactionPublic[];
  title?: string;
  type: TransactionType;
  Icon: LucideIcon;
  role:UserRole
}

const TransactionHistory: FC<TransactionHistoryProps> = ({
  title = "Transaction History",
  transactions,
  type = "deposit",
  Icon=ArrowDownToLine
}) => {
  const [showAll, setShowAll] = useState(false);

  /**
   * Groups transactions by month and applies filters:
   * - Only deposits
   * - Sort by date descending
   * - Limit by `showLimit` unless `showAll` is true
   */
  const groupedTransactions = useMemo(() => {
    try {
      // Filter only deposits
      const deposits = transactions.filter((tx) => tx.type === type);

      // Sort descending by date
      const sortedDeposits = [...deposits].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Apply limit if showAll is false
      const limitedDeposits = showAll
        ? sortedDeposits
        : sortedDeposits.slice(0, DEFAULT_SHOW_LIMIT);

      // Calculate cutoff date for filtering old transactions
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - DEFAULT_SHOW_MONTHS);

      // Group deposits by month/year
      return limitedDeposits.reduce<Record<string, SelectTransactionPublic[]>>(
        (acc, tx) => {
          const txDate = new Date(tx.date);

          // Skip transactions older than cutoff if not showing all
          if (!showAll && txDate < cutoffDate) return acc;

          const monthKey = txDate.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });

          acc[monthKey] = acc[monthKey] ?? [];
          acc[monthKey].push(tx);

          return acc;
        },
        {}
      );
    } catch (error) {
      console.error("Error grouping transactions:", error);
      return {};
    }
  }, [transactions, showAll, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border rounded-2xl bg-white dark:bg-gray-900 px-0 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between mb-3 sm:mb-4 md:mb-5">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
            {title}
          </CardTitle>

          {/* Show All / Show Less button */}
          {Object.keys(groupedTransactions).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2"
            >
              {showAll ? "Show Less" : "View All"}
            </Button>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent>
          {Object.keys(groupedTransactions).length === 0 ? (
            <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
              No transactions found.
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              {Object.entries(groupedTransactions).map(
                ([month, txList], idx) => (
                  <div
                    key={month}
                    className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4 `}
                  >
                    {/* Month Label */}
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 dark:text-gray-300">
                      {month}
                    </h4>

                    {/* Transaction List */}
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <FilterableList
                        data={txList.slice(
                          0,
                          showAll ? txList.length : DEFAULT_SHOW_LIMIT
                        )}
                        statusConfig={statusConfig}
                        getStatus={(transaction) => transaction.status}
                        renderRow={(transaction) => (
                          <TransactionCard
                            key={transaction.id}
                            tx={transaction}
                          />
                        )}
                        emptyMessage="No transactions found for this status."
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionHistory;
