"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { createParser, useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/ui/primitives/button"
import { Calendar } from "@/ui/primitives/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/primitives/popover"

const parseAsDate = createParser({
  parse(queryValue) {
    return new Date(queryValue)
  },
  serialize(value) {
    return format(value, "yyyy-MM-dd")
  },
})

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  // dateRange?: DateRange

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  // dayCount?: number

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string
}

export function DateRangePicker({
  // dateRange,
  // dayCount,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  className,
  ...props
}: DateRangePickerProps) {
  const [fromDate, setFromDate] = useQueryState(
    "from",
    parseAsDate.withOptions({ shallow: false, history: "push" })
  )
  const [toDate, setToDate] = useQueryState(
    "to",
    parseAsDate.withOptions({ shallow: false, history: "push" })
  )

  const from = fromDate ?? undefined
  const to = toDate ?? undefined

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start truncate text-left font-normal",
              !fromDate && !toDate && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {fromDate ? (
              toDate ? (
                <>
                  {format(fromDate, "LLL dd, y")} -{" "}
                  {format(toDate, "LLL dd, y")}
                </>
              ) : (
                format(fromDate, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            disabled={(date) => date > new Date()}
            onSelect={(value) => {
               
              setFromDate(value?.from ?? null)
               
              setToDate(value?.to ?? null)
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
