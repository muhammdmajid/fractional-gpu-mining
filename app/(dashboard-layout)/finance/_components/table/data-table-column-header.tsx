"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className, "dark:text-slate-100")}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-1.5 flex w-full h-8 items-center justify-between gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground dark:hover:bg-slate-700 dark:text-slate-100",
          className
        )}
        {...props}
      >
        <span className="flex-1 text-start">{title}</span>

        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-28 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
      >
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 dark:hover:bg-slate-700 dark:text-slate-100 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground dark:[&_svg]:text-slate-400"
              checked={column.getIsSorted() === "asc"}
              onCheckedChange={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 dark:hover:bg-slate-700 dark:text-slate-100 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground dark:[&_svg]:text-slate-400"
              checked={column.getIsSorted() === "desc"}
              onCheckedChange={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="pl-2 dark:hover:bg-slate-700 dark:text-slate-100 [&_svg]:text-muted-foreground dark:[&_svg]:text-slate-400"
                onClick={() => column.clearSorting()}
              >
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="relative pr-8 pl-2 dark:hover:bg-slate-700 dark:text-slate-100 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground dark:[&_svg]:text-slate-400"
            checked={column.getIsVisible()}
            onCheckedChange={() => column.toggleVisibility(!column.getIsVisible())}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
