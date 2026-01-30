"use client";

import { User, Mail } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";
import { ReferrerInfo } from "@/types/referrals";

interface ReferrerCardProps {
  referrerInfo: ReferrerInfo;

}

export default function ReferrerCard({
  referrerInfo,
}: ReferrerCardProps) {
  return (
    <div className="w-full space-y-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Referrer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        {/* Name & Referral Code */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">{referrerInfo.name}</p>
            <p className="text-muted-foreground">
              Referral Code: <span className="font-semibold">{referrerInfo.referralCode}</span>
            </p>
          </div>
        </div>

        <Separator />

        {/* Email */}
        {referrerInfo.email && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-secondary/10 text-secondary-foreground">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-muted-foreground">{referrerInfo.email}</p>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
