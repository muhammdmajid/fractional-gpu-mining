"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import useIsTouchDevice from "@/lib/hooks/use-touch-device";
import { MiningPlanFull } from "@/types/mining-plans";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { Button } from "@/ui/primitives/button";
import PlansDetailDialog from "./plans-detail-dialog";

type Props = {
  plans?: MiningPlanFull[] | null;
  selectedPlanId?: string;
  selectedOptionId?: string;
  onPlanChange?: (planId: string) => void;
  onOptionChange?: (optionId: string) => void;
  className?: string;
};

export function PlanAndBillingCycleSelect({
  plans = [],
  selectedPlanId,
  selectedOptionId,
  onPlanChange,
  onOptionChange,
  className,
}: Props) {
  const isTouch = useIsTouchDevice();
  const [openDetails, setOpenDetails] = useState(false);

  const [selectedInvestment, setSelectedInvestment] = useState<{
    plan: MiningPlanFull;
    optionId?: string;
  } | null>(null);

  const planOptions = useMemo(() => (Array.isArray(plans) ? plans : []), [plans]);
  const selectedPlan = planOptions.find((p) => p.id === selectedPlanId);
  const cycleOptions = useMemo(() => selectedPlan?.options ?? [], [selectedPlan]);

  if (planOptions.length === 0) {
    return (
      <div
        className={cn(
          "w-full text-sm font-medium rounded-lg px-3 py-2 border transition-all duration-300",
          "bg-gradient-to-r from-rose-50 via-red-50 to-rose-100 text-red-700 border-red-200",
          "dark:from-[#2b0c0c] dark:via-[#3a1010] dark:to-[#4a1414] dark:text-red-300 dark:border-red-800 shadow-sm",
          className
        )}
      >
        ⚠️ No plans available
      </div>
    );
  }

  const handleViewDetails = (plan: MiningPlanFull, optionId?: string) => {
    try {
      setSelectedInvestment({ plan, optionId });
      setOpenDetails(true);
    } catch (err) {
      console.error("Failed to open plan details:", err);
    }
  };

  // === Mobile / Touch version ===
  if (isTouch) {
    return (
      <div className={cn("w-full space-y-3", className)}>
        {/* Plan select */}
        <div>
          <label className="sr-only">Mining Plan</label>
          <select
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm capitalize transition-all duration-300 shadow-sm",
              "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-gray-900 border-emerald-200",
              "focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400",
              "dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:text-emerald-100 dark:border-[#155c4a] dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            )}
            value={planOptions.some((p) => p.id === selectedPlanId) ? selectedPlanId : ""}
            onChange={(e) => onPlanChange?.(e.target.value)}
          >
            <option value="" disabled className="text-gray-400 dark:text-gray-500">
              Please select a plan
            </option>
            {planOptions.map((plan) => (
              <option key={plan.id} value={plan.id} className="capitalize">
                {plan.title ?? `Plan ${plan.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Billing cycle select */}
        {selectedPlanId && (
          <div>
            <label className="sr-only">Billing cycle</label>
            <select
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-sm capitalize transition-all duration-300 shadow-sm",
                "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-gray-900 border-emerald-200",
                "focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400",
                "dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:text-emerald-100 dark:border-[#155c4a] dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
              )}
              value={selectedOptionId ?? ""}
              onChange={(e) => onOptionChange?.(e.target.value)}
            >
              <option value="" disabled className="text-gray-400 dark:text-gray-500">
                Please select billing cycle
              </option>
              {cycleOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="capitalize">
                  {opt.type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Details button */}
        {selectedPlanId && selectedOptionId && (
          <Button
            variant="outline"
            className="w-full text-sm font-medium border-emerald-300 text-emerald-800 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-100 shadow-sm 
            hover:from-emerald-100 hover:to-teal-200 hover:text-emerald-900 
            dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:text-emerald-100 dark:border-[#155c4a] 
            dark:hover:from-[#145c4c] dark:hover:to-[#0b3d33] transition-all duration-300"
            onClick={() => {
              if (selectedPlan) handleViewDetails(selectedPlan, selectedOptionId);
            }}
          >
            View Details
          </Button>
        )}

        {selectedInvestment && (
          <PlansDetailDialog
            open={openDetails}
            onOpenChange={setOpenDetails}
            plan={selectedInvestment.plan}
            optionId={selectedInvestment.optionId}
          />
        )}
      </div>
    );
  }

  // === Desktop version (shadcn/ui Selects) ===
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Plan select */}
      <Select
        value={planOptions.some((p) => p.id === selectedPlanId) ? selectedPlanId : undefined}
        onValueChange={(val) => onPlanChange?.(val)}
      >
        <SelectTrigger
          className="w-full rounded-lg border text-sm capitalize shadow-sm
          bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-emerald-200 text-gray-900
          dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:border-[#155c4a] dark:text-emerald-100
          transition-all duration-300"
        >
          <SelectValue placeholder="Please select a plan" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[9999] rounded-lg border border-emerald-200 shadow-md
          bg-gradient-to-b from-emerald-50 to-teal-100 
          dark:from-[#081a16] dark:to-[#09342c] dark:border-[#155c4a] dark:text-emerald-100"
        >
          <SelectGroup>
            <SelectLabel className="text-xs font-medium text-gray-600 dark:text-emerald-300">
              Available Plans
            </SelectLabel>
            {planOptions.map((plan) => (
              <SelectItem
                key={plan.id}
                value={plan.id}
                className="capitalize hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-200 dark:hover:from-[#145c4c] dark:hover:to-[#0b3d33] rounded-md transition-all"
              >
                {plan.title ?? `Plan ${plan.id}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Billing cycle select */}
      {selectedPlanId && (
        <Select
          value={selectedOptionId ?? undefined}
          onValueChange={(val) => onOptionChange?.(val)}
        >
          <SelectTrigger
            className="w-full rounded-lg border text-sm capitalize shadow-sm
            bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-emerald-200 text-gray-900
            dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:border-[#155c4a] dark:text-emerald-100
            transition-all duration-300"
          >
            <SelectValue placeholder="Please select billing cycle" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={8}
            className="z-[9999] rounded-lg border border-emerald-200 shadow-md
            bg-gradient-to-b from-emerald-50 to-teal-100 
            dark:from-[#081a16] dark:to-[#09342c] dark:border-[#155c4a] dark:text-emerald-100"
          >
            <SelectGroup>
              <SelectLabel className="text-xs font-medium text-gray-600 dark:text-emerald-300">
                Billing Cycles
              </SelectLabel>
              {cycleOptions.map((opt) => (
                <SelectItem
                  key={opt.id}
                  value={opt.id}
                  className="capitalize hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-200 dark:hover:from-[#145c4c] dark:hover:to-[#0b3d33] rounded-md transition-all"
                >
                  {opt.type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* Details button */}
      {selectedPlanId && selectedOptionId && (
        <Button
          variant="outline"
          className="w-full text-sm font-medium border-emerald-300 text-emerald-800 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-100 shadow-sm 
          hover:from-emerald-100 hover:to-teal-200 hover:text-emerald-900 
          dark:bg-gradient-to-r dark:from-[#0e2e27] dark:via-[#124034] dark:to-[#0b2621] dark:text-emerald-100 dark:border-[#155c4a] 
          dark:hover:from-[#145c4c] dark:hover:to-[#0b3d33] transition-all duration-300"
          onClick={() => {
            if (selectedPlan) handleViewDetails(selectedPlan, selectedOptionId);
          }}
        >
          View Details
        </Button>
      )}

      {selectedInvestment && (
        <PlansDetailDialog
          open={openDetails}
          onOpenChange={setOpenDetails}
          plan={selectedInvestment.plan}
          optionId={selectedInvestment.optionId}
        />
      )}
    </div>
  );
}
