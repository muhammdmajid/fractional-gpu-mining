"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import useIsTouchDevice from "@/lib/hooks/use-touch-device";
import { Investment } from "@/types/mining-plans";

type Props = {
  plans?: Investment[] | null;
  selectedId?: string;
  onChange?: (planId: string) => void;
  className?: string;
};

export function PlanSelect({
  plans = [],
  selectedId,
  onChange,
  className,
}: Props) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);

  // Memoize options safely
  const options = useMemo(() => (Array.isArray(plans) ? plans : []), [plans]);

  // Guard: no plans available
  if (options.length === 0) {
    return (
      <div className={cn("w-full text-sm text-red-500 dark:text-red-400", className)}>
        ⚠️ No plans available
      </div>
    );
  }

  // Touch devices: use native select
  if (isTouch) {
    return (
      <div className={cn("w-full", className)}>
        <label className="sr-only">Mining Plan</label>
        <select
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm transition capitalize",
            "border-gray-300 focus:ring-2 focus:ring-primary/70 focus:border-primary",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
            "dark:focus:ring-primary/80 dark:focus:border-primary"
          )}
          value={options.some((p) => p.id === selectedId) ? selectedId : ""}
          onChange={(e) => {
            try {
              onChange?.(e.target.value);
            } catch (err) {
              console.error("Failed to handle plan change:", err);
            }
          }}
        >
          <option value="" disabled className="text-gray-400 dark:text-gray-500">
            Please select a plan
          </option>
          {options.map((plan) => (
            <option
              key={plan.id}
              value={plan.id}
              className="text-gray-900 dark:text-gray-100 capitalize"
            >
              {plan.plan?.title ?? `${plan.id}`}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Desktop: use custom Select component (shadcn/ui)
  return (
    <div className={cn("w-full", className)}>
      <Select
        value={options.some((p) => p.id === selectedId) ? selectedId : undefined}
        onValueChange={(val) => {
          try {
            onChange?.(val);
          } catch (err) {
            console.error("Failed to handle plan change:", err);
          }
        }}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="w-full rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 capitalize">
          <SelectValue placeholder="Please select a plan" />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[9999] rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <SelectGroup>
            <SelectLabel className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
              Available Plans
            </SelectLabel>
            {options.map((plan) => (
              <SelectItem
                key={plan.id}
                value={plan.id}
                className="cursor-pointer capitalize focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {plan.plan?.title ?? `Plan ${plan.id}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
