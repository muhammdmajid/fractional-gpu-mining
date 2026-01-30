"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/ui/primitives/select";
import { cn } from "@/lib/utils";
import { MiningPlanFull } from "@/types/mining-plans";
import useIsTouchDevice from "@/lib/hooks/use-touch-device";

// ✅ Extract reusable helper
function getCustomPlans(plans: MiningPlanFull[]): MiningPlanFull[] {
  return plans.filter((plan) => plan.custom);
}

interface CustomEnterprisePlanSelectProps {
  plans: MiningPlanFull[];
  selectedId?: string;
  onChange: (planId: string) => void;
  className?: string;
}

export function CustomEnterprisePlanSelect({
  plans,
  selectedId,
  onChange,
  className,
}: CustomEnterprisePlanSelectProps) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => getCustomPlans(plans), [plans]);

  // ✅ Mobile (native <select>)
  if (isTouch) {
    return (
      <div
        className={cn(
          "w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0",
          className
        )}
      >
        <div className="flex-1">
          <label htmlFor="custom-plan" className="sr-only">
            Custom Enterprise Plan
          </label>
          <select
            id="custom-plan"
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm transition",
              "border-gray-300 focus:ring-2 focus:ring-primary/70 focus:border-primary",
              "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
              "dark:focus:ring-primary/80 dark:focus:border-primary"
            )}
            value={selectedId ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Please select a custom plan
            </option>
            {options.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // ✅ Desktop (Shadcn Select)
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0",
        className
      )}
    >
      <div className="flex-1">
        <Select
          value={selectedId ?? ""}
          onValueChange={onChange}
          open={open}
          onOpenChange={setOpen}
        >
          <SelectTrigger className="w-full rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder="Please select a custom plan" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            sideOffset={8}
            className={cn(
              "z-[9999] rounded-lg border bg-white shadow-md",
              "border-gray-200 dark:border-gray-700",
              "dark:bg-gray-900 dark:text-gray-100"
            )}
          >
            <SelectGroup>
              <SelectLabel className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                Available Custom Plans
              </SelectLabel>
              {options.map((plan) => (
                <SelectItem
                  key={plan.id}
                  value={plan.id}
                  className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {plan.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
