"use client";

import { Wallet, User, CalendarDays } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";

interface StepWalletUserProps {
  walletName: string;
  walletBalance: number;
  walletCurrency: string;
  displayUser: string;
  userEmail: string;
  userRole: string;
  date: string | number | Date;
}

export default function StepWalletUser({
  walletName,
  walletBalance,
  walletCurrency,
  displayUser,
  userEmail,
  userRole,
  date,
}: StepWalletUserProps) {
  return (
    <div className="w-full  space-y-4">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Wallet Overview
        </CardTitle>
      </CardHeader>
      <CardContent className=" text-sm space-y-4">
        {/* Wallet Section */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">{walletName}</p>
            <p className="text-muted-foreground">
              Balance: <span className="font-semibold">{walletBalance}</span> {walletCurrency}
            </p>
          </div>
        </div>

        <Separator />

        {/* User Section */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-full bg-secondary/10 text-secondary-foreground">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium capitalize">{displayUser}</p>
            <p className="text-muted-foreground">{userEmail}</p>
            <Badge variant="outline" className="capitalize mt-1">
              {userRole}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Date Section */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(date).toLocaleString()}</span>
        </div>
      </CardContent>
    </div>
  );
}
