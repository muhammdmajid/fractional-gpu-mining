"use client";

import { useState } from "react";
import { TransactionTimelineList } from "./transaction-timeline-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { SelectTransactionPublic } from "@/types/transaction";

type TransactionTimelineProps = {
  transactions?: SelectTransactionPublic[];
};

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Card className="rounded-2xl shadow-sm md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            Something went wrong while loading transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No transaction data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  let recentTransactions: SelectTransactionPublic[] = [];
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    recentTransactions = transactions
      .filter((transaction): transaction is SelectTransactionPublic => {
        if (!transaction?.date) return false;
        const transactionDate = new Date(transaction.date);
        return !isNaN(transactionDate.getTime()) && transactionDate >= threeMonthsAgo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
  } catch (error) {
    console.error("Error filtering transactions:", error);
    setHasError(true);
  }

  const transactionsToDisplay = showFullTimeline
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : recentTransactions;

  try {
    return (
      <Card className="rounded-2xl shadow-sm md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction Timeline {showFullTimeline ? "(Full)" : "(Last 3 Months, Max 15)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsToDisplay.length > 0 ? (
            <>
              <TransactionTimelineList transactions={transactionsToDisplay} />
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullTimeline((prev) => !prev)}
                >
                  {showFullTimeline ? "Show Last 3 Months" : "View Full Timeline"}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent transactions found.
            </p>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error rendering transactions:", error);
    setHasError(true);
    return null;
  }
}
