"use client"

import type * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-0", // Remove month spacing
        caption: "hidden", // Hide built-in caption
        nav: "hidden", // Hide built-in navigation
        table: "w-full border-separate border-spacing-0",
        head_row: "hidden", // Hide built-in day headers
        row: "flex w-full mt-0 justify-between", // Adjust row spacing
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal text-sm text-gray-700"
        ),
        day_selected: "bg-purple-600 text-white hover:bg-purple-700",
        day_today: "border border-purple-300 text-purple-600",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => null, // Hide navigation icons
        IconRight: ({ ...props }) => null,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }