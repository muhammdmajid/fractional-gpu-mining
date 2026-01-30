"use client"

import { ScrollArea } from "@/ui/primitives/scroll-area"
import { Timeline } from "@/ui/primitives/timeline"
import { TransactionTimelineItem } from "./trantaction-timeline-item"
import { SelectTransactionPublic } from "@/types/transaction"


export function TransactionTimelineList({
  transactions,
}: {
  transactions:SelectTransactionPublic[];
}) {
  return (
    <ScrollArea className="min-h-[200px] pr-4 ">
      {transactions.length ? (
        <Timeline>
          {transactions.map((tx, index) => {
            const isLast = index !== transactions.length - 1
            return (
              <TransactionTimelineItem
                key={tx.id??"" + index}
                transaction={tx}
                isLast={isLast}
              />
            )
          })}
        </Timeline>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      )}
    </ScrollArea>
  )
}
