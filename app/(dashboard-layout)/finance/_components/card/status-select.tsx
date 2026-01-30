"use client";

import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/ui/primitives/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/ui/primitives/popover";
import { Button } from "@/ui/primitives/button";
import { TRANSACTION_STATUSES } from "@/db/schema";

interface StatusSelectProps {
  name: string;
  defaultStatus?: string;
}

const statusColorMap: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  processing:
    "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  failed:
    "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled:
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200",
};

export function StatusSelect({ name, defaultStatus }: StatusSelectProps) {
  const { control } = useFormContext();
  const isMobile = useIsMobile();

  const initialStatus = defaultStatus || TRANSACTION_STATUSES[0] || "pending";

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initialStatus}
      render={({ field: { value, onChange } }) => {
        const currentValue = value || initialStatus;
        const isCompleted = currentValue === "completed";

        const handleChange = (newStatus: string) => {
          if (!isCompleted) onChange(newStatus);
        };

        // 📱 Mobile/Tablet: use Popover
        if (isMobile) {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full capitalize font-medium rounded-lg",
                    statusColorMap[currentValue] || ""
                  )}
                  disabled={isCompleted}
                >
                  {currentValue || "Change status"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-full p-2"
              >
                <div className="flex flex-col gap-2 w-full">
                  {TRANSACTION_STATUSES.map((s) => (
                    <Button
                      key={s}
                      variant={s === currentValue ? "default" : "ghost"}
                      className={cn(
                        "w-full capitalize font-medium rounded-lg",
                        statusColorMap[s] || ""
                      )}
                      onClick={() => handleChange(s)}
                      disabled={isCompleted}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        // 💻 Desktop: use Select
        return (
          <Select
            value={currentValue}
            onValueChange={handleChange}
            disabled={isCompleted}
          >
            <SelectTrigger
              className={cn(
                "w-full capitalize font-medium rounded-lg",
                statusColorMap[currentValue] || ""
              )}
            >
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent
              className="w-full max-h-[300px] overflow-y-auto z-[9999]"
              side="bottom"
            >
              {TRANSACTION_STATUSES.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className={cn(
                    "w-full capitalize font-medium rounded-lg",
                    statusColorMap[s] || ""
                  )}
                  disabled={isCompleted}
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    />
  );
}
