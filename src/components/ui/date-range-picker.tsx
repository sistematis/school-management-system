// src/components/ui/date-range-picker.tsx

"use client";

import { useState, useMemo } from "react";

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
    days.push(<div key={`empty-${i}`} className="h-10" />);
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
          "h-10 w-10 text-sm font-medium rounded-md transition-colors",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50",
          selected && "bg-blue-500 text-white hover:bg-blue-600",
          inRange && !selected && "bg-blue-100",
          isCurrent && !selected && "border-2 border-pink-500",
        )}
      >
        {day}
      </button>,
    );
  }

  return (
    <div className="w-full">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 text-gray-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-lg font-semibold">
          {monthNames[month]} {year}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 text-gray-500 hover:text-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600"
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
  const [toCalendarYear, setToCalendarYear] = useState(new Date().getFullYear());
  // Track pending selection that hasn't been confirmed yet
  const [pendingValue, setPendingValue] = useState<DateRange>(value || {});

  const displayValue = useMemo(() => {
    // Use pendingValue for display (if set), otherwise use actual value
    const currentValue =
      pendingValue?.from || pendingValue?.to ? pendingValue : value;
    if (currentValue?.from && currentValue?.to) {
      return `${formatDisplayDate(currentValue.from)} - ${formatDisplayDate(currentValue.to)}`;
    }
    if (currentValue?.from) {
      return `${formatDisplayDate(currentValue.from)} - ...`;
    }
    return "Select date range";
  }, [value, pendingValue]);

  const handleFromDateSelect = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    // Update "from" calendar to show the selected date's month
    setCalendarMonth(selectedDate.getMonth());
    setCalendarYear(selectedDate.getFullYear());

    // Update pending "from" date
    setPendingValue((prev) => ({ ...prev, from: dateStr, to: prev?.to || value?.to }));
  };

  const handleToDateSelect = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    // Update "to" calendar to show the selected date's month
    setToCalendarMonth(selectedDate.getMonth());
    setToCalendarYear(selectedDate.getFullYear());

    // Update pending "to" date
    setPendingValue((prev) => ({ ...prev, from: prev?.from || value?.from, to: dateStr }));
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

  const currentValue = pendingValue?.from || pendingValue?.to ? pendingValue : value;

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
        className="w-auto p-4 max-w-4xl"
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <div className="grid grid-cols-[140px_1fr_1fr] grid-rows-[auto_auto_auto_auto] gap-0">
          {/* Top Row: Left Panel, Center Top, Right Top */}
          {/* Left Panel: Quick Presets - spans all rows */}
          <div className="flex flex-col gap-2 border-r border-gray-200 pr-4 row-span-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="px-3 py-2 text-xs font-medium text-left text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Center Top: From Date Calendar */}
          <div className="flex flex-col border-r border-gray-200 pr-4 row-span-3">
            <Calendar
              month={calendarMonth}
              year={calendarYear}
              value={currentValue}
              onMonthChange={setCalendarMonth}
              onDateSelect={handleFromDateSelect}
            />
          </div>

          {/* Right Top: To Date Calendar */}
          <div className="flex flex-col row-span-3">
            <Calendar
              month={toCalendarMonth}
              year={toCalendarYear}
              value={currentValue}
              onMonthChange={setToCalendarMonth}
              onDateSelect={handleToDateSelect}
            />
          </div>

          {/* Bottom Row: Center Bottom + Right Bottom */}
          {/* Center Bottom: From Date & To Date Fields (side by side) */}
          <div className="col-start-2 row-start-4 border-t border-gray-200 pt-4 pr-4 pl-4">
            <div className="flex items-center gap-2">
              {/* From Date Field */}
              <div className="flex-1">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-center">
                  <div className="text-sm text-gray-900 text-center">
                    {currentValue?.from ? formatDisplayDate(currentValue.from) : "-"}
                  </div>
                </div>
              </div>
              {/* Separator */}
              <span className="text-gray-400 font-medium">-</span>
              {/* To Date Field */}
              <div className="flex-1">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-center">
                  <div className="text-sm text-gray-900 text-center">
                    {currentValue?.to ? formatDisplayDate(currentValue.to) : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Bottom: Action Buttons */}
          <div className="col-start-3 row-start-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col justify-end h-full">
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  className="px-4"
                >
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
