"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MiningPlanFull, MiningPlanOptionWithGpus } from "@/types/mining-plans";
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

type Props = {
  miningPlan: MiningPlanFull;
  selectedId?: string;
  onChange: (id: string) => void;
  className?: string;
};

export function BillingCycleSelect({
  miningPlan,
  selectedId,
  onChange,
  className,
}: Props) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => miningPlan.options ?? [], [miningPlan.options]);

  // ✅ Native select fallback on mobile/touch
  if (isTouch) {
    return (
      <div className={cn("w-full capitalize", className)}>
        <label className="sr-only">Billing cycle</label>
        <select
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm outline-none transition",
            " border-gray-300",
            "focus:ring-1 focus:ring-primary focus:border-gray-200",
            // Dark mode styles
            "",
            "dark:focus:ring-primary dark:focus:border-primary capitalize"
          )}
          value={selectedId ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option
            value=""
            disabled
            className="text-gray-400 dark:text-gray-500"
          >
            Please select billing cycle
          </option>
          {options.map((opt) => (
            <option
              key={opt.id}
              value={opt.id}
              className="text-gray-900 dark:text-gray-100 capitalize"
            >
              {opt.type}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ✅ Shadcn Select (desktop)
  return (
    <div
      className={cn(
        "w-full",
        open ? "transform-none will-change-auto" : "",
        className
      )}
    >
      <Select
        value={selectedId ?? undefined}
        onValueChange={(val) => onChange(val)}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 capitalize">
          <SelectValue placeholder="Please select billing cycle" />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[9999] dark:bg-gray-900 dark:text-gray-100"
        >
          <SelectGroup>
            <SelectLabel>Billing Cycles</SelectLabel>
            {options.map((opt) => (
              <SelectItem
                key={opt.id}
                value={opt.id}
                className="cursor-pointer capitalize"
              >
                {opt.type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
