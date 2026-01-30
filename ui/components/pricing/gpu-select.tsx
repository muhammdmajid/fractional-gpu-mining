"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MiningPlanGpu } from "@/types/mining-plans"; 
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
import { Input } from "@/ui/primitives/input";

type Props = {
  gpus: MiningPlanGpu[];
  selectedId?: string;
  quantity?: number;
  onChange: (gpuId: string, qty: number) => void;
  className?: string;
};

export function GpuSelect({
  gpus,
  selectedId,
  quantity = 1,
  onChange,
  className,
}: Props) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => gpus ?? [], [gpus]);

  // ✅ Mobile / Touch: use native <select>
  if (isTouch) {
    return (
      <div
        className={cn(
          "w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0",
          className
        )}
      >
        <div className="flex-1">
          <label className="sr-only">GPU Plan</label>
          <select
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm transition capitalize",
              "border-gray-300 focus:ring-2 focus:ring-primary/70 focus:border-primary",
              "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
              "dark:focus:ring-primary/80 dark:focus:border-primary"
            )}
            value={selectedId ?? ""}
            onChange={(e) => onChange(e.target.value, quantity)}
          >
            <option
              value=""
              disabled
              className="text-gray-400 dark:text-gray-500"
            >
              Please select GPU
            </option>
            {options.map((gpu) => (
              <option
                key={gpu.id}
                value={gpu.id}
                className="text-gray-900 dark:text-gray-100 capitalize"
              >
                {gpu.model} – {gpu.memory} – ${gpu.pricePerGpu}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity input */}
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onChange(selectedId ?? "", Number(e.target.value))}
          className="w-full sm:w-28 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          placeholder="Qty"
        />
      </div>
    );
  }

  // ✅ Desktop: Shadcn Select
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0",
        className
      )}
    >
      <div className="flex-1">
        <Select
          value={selectedId ?? undefined}
          onValueChange={(val: string) => onChange(val, quantity)}
          open={open}
          onOpenChange={setOpen}
        >
          <SelectTrigger className="w-full rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 capitalize">
            <SelectValue placeholder="Please select GPU" />
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
                Available GPUs
              </SelectLabel>
              {options.map((gpu) => (
                <SelectItem
                  key={gpu.id}
                  value={gpu.id}
                  className="cursor-pointer capitalize focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  {gpu.model} – {gpu.memory} – ${gpu.pricePerGpu}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity input */}
      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => onChange(selectedId ?? "", Number(e.target.value))}
        className="w-full sm:w-28 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        placeholder="Qty"
      />
    </div>
  );
}
