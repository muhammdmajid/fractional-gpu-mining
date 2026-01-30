"use client"

import { useState } from "react"
import { Button } from "@/ui/primitives/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/primitives/dialog"
import { Input } from "@/ui/primitives/input"
import { Badge } from "@/ui/primitives/badge"

type WithdrawalStatus =
  | "idle"
  | "request_sent"
  | "request_received"
  | "in_process"
  | "pending"
  | "complete"

interface WithdrawalAmountProps {
  currentBalance: number
}

export default function WithdrawalAmount({ currentBalance }: WithdrawalAmountProps) {
  const [open, setOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")
  const [status, setStatus] = useState<WithdrawalStatus>("idle")

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount)

    if (!amount || amount <= 0) {
      alert("Enter a valid amount")
      return
    }
    if (amount > currentBalance) {
      alert("Amount exceeds current balance")
      return
    }

    setStatus("request_sent")

    // simulate status flow
    setTimeout(() => setStatus("request_received"), 1000)
    setTimeout(() => setStatus("in_process"), 2000)
    setTimeout(() => setStatus("pending"), 300081)
    setTimeout(() => setStatus("complete"), 5000)

    setOpen(false)
    setWithdrawAmount("")
  }

  const renderStatus = () => {
    switch (status) {
      case "idle":
        return <Badge variant="outline">No request</Badge>
      case "request_sent":
        return <Badge>Request Sent</Badge>
      case "request_received":
        return <Badge className="bg-blue-500 text-white">Request Received</Badge>
      case "in_process":
        return <Badge className="bg-yellow-500 text-white">In Process</Badge>
      case "pending":
        return <Badge className="bg-orange-500 text-white">Pending</Badge>
      case "complete":
        return <Badge className="bg-green-600 text-white">Complete</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Withdrawal Status:</p>
        {renderStatus()}
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>
        Withdraw
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the amount you want to withdraw (Available: $
              {currentBalance.toFixed(2)})
            </p>

            <Input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
