"use client";

import { Package, FileText, Receipt } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/ui/primitives/card";
import { Separator } from "@/ui/primitives/separator";
import { Badge } from "@/ui/primitives/badge";

interface StepMiningPlanProps {
  miningPlanTitle?: string | null;
  miningPlanDescription?: string | null;
  billingOptionType?: string | null;
  billingOptionCycle?: number | null;
}

export default function StepMiningPlan({
  miningPlanTitle,
  miningPlanDescription,
  billingOptionType,
  billingOptionCycle,
}: StepMiningPlanProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Mining Plan Overview
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="text-sm space-y-4">
        {/* Plan Section */}
        {miningPlanTitle || miningPlanDescription ? (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              {miningPlanTitle && (
                <p className="font-medium">{miningPlanTitle}</p>
              )}
              {miningPlanDescription && (
                <p className="text-muted-foreground text-xs">
                  {miningPlanDescription}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {(miningPlanTitle || miningPlanDescription) &&
          (billingOptionType || billingOptionCycle) && <Separator />}

        {/* Billing Option Section */}
        {billingOptionType || billingOptionCycle ? (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-secondary/10 text-secondary-foreground">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              {billingOptionType && (
                <Badge variant="outline" className="capitalize">
                  {billingOptionType}
                </Badge>
              )}
              {billingOptionCycle && (
                <p className="text-muted-foreground text-xs">
                  Cycle: {billingOptionCycle} months
                </p>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </div>
  );
}
