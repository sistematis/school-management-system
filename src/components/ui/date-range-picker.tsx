// src/components/ui/date-range-picker.tsx

"use client";

import { useState, useMemo, useEffect } from "react";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface DateRange {
  from?: string;
  to?: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a Date object as YYYY-MM-DD in local time (not UTC)
 * Avoids timezone conversion issues with toISOString()
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format date range for preset display as "2 Feb - 8 Feb 2026"
 * Single day shows as "2 Feb 2026"
 * Year only shown on the end date if same year
 */
function formatPresetDateRange(from: string, to: string): string {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const dayMonth = fromDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const year = fromDate.getFullYear();

  // If same day (Today, Yesterday), show single date: "2 Feb 2026"
  if (from === to) {
    return `${dayMonth} ${year}`;
  }

  const dayMonthTo = toDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const yearTo = toDate.getFullYear();

  // If same year, show "2 Feb - 8 Feb 2026"
  if (fromDate.getFullYear() === toDate.getFullYear()) {
    return `${dayMonth} - ${dayMonthTo} ${yearTo}`;
  }

  // Different years, show "2 Feb 2025 - 8 Feb 2026"
  return `${dayMonth} ${year} - ${dayMonthTo} ${yearTo}`;
}

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  return { firstDay, lastDay, daysInMonth, startDayOfWeek };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isInRange(
  date: Date,
  from: Date | undefined,
  to: Date | undefined,
): boolean {
  if (!from || !to) return false;
  return date >= from && date <= to;
}

// =============================================================================
// Presets
// =============================================================================

const PRESETS = [
  { label: "Today", range: () => getTodayRange() },
  { label: "Yesterday", range: () => getYesterdayRange() },
  { label: "This week", range: () => getThisWeekRange() },
  { label: "Last week", range: () => getLastWeekRange() },
  { label: "This month", range: () => getThisMonthRange() },
  { label: "Last month", range: () => getLastMonthRange() },
  { label: "This year", range: () => getThisYearRange() },
  { label: "Last year", range: () => getLastYearRange() },
  { label: "All time", range: () => getAllTimeRange() },
];

function getTodayRange(): DateRange {
  const today = new Date();
  const dateStr = toLocalDateString(today);
  return { from: dateStr, to: dateStr };
}

function getYesterdayRange(): DateRange {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = toLocalDateString(yesterday);
  return { from: dateStr, to: dateStr };
}

function getThisWeekRange(): DateRange {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Week starts on Monday (day 1), so diff is the number of days since Monday
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  return {
    from: toLocalDateString(monday),
    to: toLocalDateString(today),
  };
}

function getLastWeekRange(): DateRange {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - diff);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(thisMonday);
  lastSunday.setDate(thisMonday.getDate() - 1);
  return {
    from: toLocalDateString(lastMonday),
    to: toLocalDateString(lastSunday),
  };
}

function getThisMonthRange(): DateRange {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    from: toLocalDateString(firstOfMonth),
    to: toLocalDateString(lastOfMonth),
  };
}

function getLastMonthRange(): DateRange {
  const today = new Date();
  const firstOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  );
  const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return {
    from: toLocalDateString(firstOfLastMonth),
    to: toLocalDateString(lastOfLastMonth),
  };
}

function getThisYearRange(): DateRange {
  const today = new Date();
  const firstOfYear = new Date(today.getFullYear(), 0, 1);
  const lastOfYear = new Date(today.getFullYear(), 11, 31);
  return {
    from: toLocalDateString(firstOfYear),
    to: toLocalDateString(lastOfYear),
  };
}

function getLastYearRange(): DateRange {
  const today = new Date();
  const firstOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  const lastOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
  return {
    from: toLocalDateString(firstOfLastYear),
    to: toLocalDateString(lastOfLastYear),
  };
}

function getAllTimeRange(): DateRange {
  const today = new Date();
  // Beginning of data - using 2020-01-01 as a reasonable start date
  const beginningOfData = new Date(2020, 0, 1);
  return {
    from: toLocalDateString(beginningOfData),
    to: toLocalDateString(today),
  };
}

// =============================================================================
// Calendar Component
// =============================================================================

interface CalendarProps {
  month: number;
  year: number;
  value?: DateRange;
  onMonthChange: (month: number, year: number) => void;
  onDateSelect: (dateStr: string) => void;
}

function Calendar({
  month,
  year,
  value,
  onMonthChange,
  onDateSelect,
}: CalendarProps) {
  const today = new Date();
  const { daysInMonth, startDayOfWeek } = getMonthData(year, month);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const prevMonth = () => {
    if (month === 0) {
      onMonthChange(11, year - 1);
    } else {
      onMonthChange(month - 1, year);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      onMonthChange(0, year + 1);
    } else {
      onMonthChange(month + 1, year);
    }
  };

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = toLocalDateString(date);
    onDateSelect(dateStr);
  };

  const isDateSelected = (day: number): boolean => {
    const date = new Date(year, month, day);
    const dateStr = toLocalDateString(date);
    return dateStr === value?.from || dateStr === value?.to;
  };

  const isDateInRange = (day: number): boolean => {
    const date = new Date(year, month, day);
    const fromDate = value?.from ? new Date(value.from) : undefined;
    const toDate = value?.to ? new Date(value.to) : undefined;
    return isInRange(date, fromDate, toDate);
  };

  const isCurrentDate = (day: number): boolean => {
    return isSameDay(new Date(year, month, day), today);
  };

  // Build calendar grid
  const days = [];
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Adjust for Monday start

  // Empty cells before first day
  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = toLocalDateString(date);
    const selected = isDateSelected(day);
    const inRange = isDateInRange(day);
    const isCurrent = isCurrentDate(day);

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        className={cn(
          "h-8 w-8 text-sm font-medium rounded-md transition-colors",
          "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected && "bg-primary text-primary-foreground hover:bg-primary/90",
          inRange && !selected && "bg-primary/10",
          isCurrent && !selected && "border-2 border-primary",
        )}
      >
        {day}
      </button>,
    );
  }

  return (
    <div className="w-full">
      {/* Month Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {monthNames[month]} {year}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-6 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function DateRangePicker({
  value,
  onChange,
  align = "start",
  side = "bottom",
  sideOffset = 4,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [toCalendarMonth, setToCalendarMonth] = useState(new Date().getMonth());
  const [toCalendarYear, setToCalendarYear] = useState(
    new Date().getFullYear(),
  );
  // Track pending selection that hasn't been confirmed yet
  const [pendingValue, setPendingValue] = useState<DateRange>({});

  // Current value to use - pendingValue if set, otherwise actual value
  const currentValue = useMemo(() => {
    if (pendingValue?.from || pendingValue?.to) {
      return pendingValue;
    }
    return value || {};
  }, [pendingValue, value]);

  // Sync calendar states with value when popover opens or value changes
  useEffect(() => {
    if (open && value?.from) {
      const fromDate = new Date(value.from);
      setCalendarMonth(fromDate.getMonth());
      setCalendarYear(fromDate.getFullYear());

      if (value?.to) {
        const toDate = new Date(value.to);
        setToCalendarMonth(toDate.getMonth());
        setToCalendarYear(toDate.getFullYear());
      }
    }
  }, [open, value?.from, value?.to]);

  const displayValue = useMemo(() => {
    if (currentValue?.from && currentValue?.to) {
      return `${formatDisplayDate(currentValue.from)} - ${formatDisplayDate(currentValue.to)}`;
    }
    if (currentValue?.from) {
      return `${formatDisplayDate(currentValue.from)} - ...`;
    }
    return "Select date range";
  }, [currentValue]);

  const handleFromDateSelect = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    // Update "from" calendar to show the selected date's month
    setCalendarMonth(selectedDate.getMonth());
    setCalendarYear(selectedDate.getFullYear());

    // Update pending "from" date
    setPendingValue((prev) => ({
      ...prev,
      from: dateStr,
      to: prev?.to || value?.to,
    }));
  };

  const handleToDateSelect = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    // Update "to" calendar to show the selected date's month
    setToCalendarMonth(selectedDate.getMonth());
    setToCalendarYear(selectedDate.getFullYear());

    // Update pending "to" date
    setPendingValue((prev) => ({
      ...prev,
      from: prev?.from || value?.from,
      to: dateStr,
    }));
  };

  const handlePresetClick = (preset: (typeof PRESETS)[0]) => {
    const range = preset.range();
    // Update pending value
    setPendingValue(range);
    // Update both calendars to show the relevant months
    if (range.from) {
      const fromDate = new Date(range.from);
      setCalendarMonth(fromDate.getMonth());
      setCalendarYear(fromDate.getFullYear());
    }
    if (range.to) {
      const toDate = new Date(range.to);
      setToCalendarMonth(toDate.getMonth());
      setToCalendarYear(toDate.getFullYear());
    }
  };

  const handleClear = () => {
    setPendingValue({});
  };

  const handleCancel = () => {
    // Reset pending value and close
    setPendingValue({});
    setOpen(false);
  };

  const handleConfirm = () => {
    // Apply the pending value when confirming
    if (pendingValue?.from || pendingValue?.to) {
      onChange?.(pendingValue);
    }
    setOpen(false);
    setPendingValue({});
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && (pendingValue?.from || pendingValue?.to)) {
          // User closed popover without confirming - reset pending value
          setPendingValue({});
        }
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between gap-2 px-3 py-2 text-sm",
            "border border-gray-300 rounded-md bg-white",
            "hover:bg-gray-50 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "w-full min-w-[200px]",
          )}
        >
          <span className={cn(!value?.from && !value?.to && "text-gray-500")}>
            {displayValue}
          </span>
          <svg
            className="w-4 h-4 text-gray-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <div className="flex">
          {/* Left Panel: Quick Presets */}
          <div className="flex flex-col space-y-1 border-r border-gray-200 p-2 min-w-[140px]">
            {PRESETS.map((preset) => {
              const range = preset.range();
              const rangeText =
                range.from && range.to
                  ? formatPresetDateRange(range.from, range.to)
                  : range.from
                    ? formatDisplayDate(range.from)
                    : "";
              const isSelected =
                currentValue?.from === range?.from &&
                currentValue?.to === range?.to;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "grid grid-cols-[auto_1fr] gap-2 px-2 py-1.5 text-sm font-medium text-left rounded-md transition-colors",
                    "hover:bg-accent",
                    !isSelected && "hover:text-accent-foreground",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  <span className="font-medium text-left whitespace-nowrap">
                    {preset.label}
                  </span>
                  {rangeText && (
                    <span
                      className={cn(
                        "text-xs text-left transition-colors truncate",
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {rangeText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section: Calendars and Actions */}
          <div className="flex">
            {/* From Date Calendar */}
            <div className="border-r border-gray-200 p-3 min-w-[220px]">
              <Calendar
                month={calendarMonth}
                year={calendarYear}
                value={currentValue}
                onMonthChange={setCalendarMonth}
                onDateSelect={handleFromDateSelect}
              />
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="p-2 border border-gray-200 rounded-md text-center">
                  <div className="text-sm text-foreground">
                    {currentValue?.from
                      ? formatDisplayDate(currentValue.from)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* To Date Calendar */}
            <div className="p-3 min-w-[220px]">
              <Calendar
                month={toCalendarMonth}
                year={toCalendarYear}
                value={currentValue}
                onMonthChange={setToCalendarMonth}
                onDateSelect={handleToDateSelect}
              />
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="p-2 border border-gray-200 rounded-md text-center">
                  <div className="text-sm text-foreground">
                    {currentValue?.to
                      ? formatDisplayDate(currentValue.to)
                      : "-"}
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="px-3"
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirm} className="px-3">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
