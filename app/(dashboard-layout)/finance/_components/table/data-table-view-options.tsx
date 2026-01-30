"use client";

import { Table } from "@tanstack/react-table";
import { Check, ChevronsUpDown, Settings2 } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/primitives/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/primitives/popover";
import { cn } from "@/lib/utils";
import * as React from "react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Toggle columns"
          role="combobox"
          variant="outline"
          size="sm"
          className={cn(
            "ml-auto hidden h-8 lg:flex",
            "text-slate-700 border-slate-300 bg-white hover:bg-slate-100",
            "dark:text-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          )}
        >
          <Settings2 />
          View
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className={cn(
          "w-44 p-0 border",
          "border-slate-200 bg-white text-slate-900",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        )}
      >
        <Command
          className={cn(
            "bg-white text-slate-900",
            "dark:bg-slate-900 dark:text-slate-100"
          )}
        >
          <CommandInput
            placeholder="Search columns..."
            className={cn(
              "placeholder:text-slate-400",
              "dark:placeholder:text-slate-500"
            )}
          />
          <CommandList>
            <CommandEmpty
              className={cn("text-slate-500", "dark:text-slate-400")}
            >
              No columns found.
            </CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                  className={cn(
                    "hover:bg-slate-100",
                    "dark:hover:bg-slate-800"
                  )}
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto w-4 h-4 shrink-0 text-slate-700",
                      "dark:text-slate-200",
                      column.getIsVisible() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
