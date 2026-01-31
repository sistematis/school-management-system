// src/components/ui/date-range-picker.tsx

"use client";

import { useState, useMemo } from "react";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
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

function isInRange(date: Date, from: Date | undefined, to: Date | undefined): boolean {
  if (!from || !to) return false;
  return date >= from && date <= to;
}

// =============================================================================
// Presets
// =============================================================================

const PRESETS = [
  { label: "Today", range: () => getTodayRange() },
  { label: "Yesterday", range: () => getYesterdayRange() },
  { label: "WTD", range: () => getWeekToDateRange() },
  { label: "Last Week", range: () => getLastWeekRange() },
  { label: "MTD", range: () => getMonthToDateRange() },
  { label: "Last Month", range: () => getLastMonthRange() },
];

function getTodayRange(): DateRange {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  return { from: dateStr, to: dateStr };
}

function getYesterdayRange(): DateRange {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];
  return { from: dateStr, to: dateStr };
}

function getWeekToDateRange(): DateRange {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  return {
    from: monday.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
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
    from: lastMonday.toISOString().split("T")[0],
    to: lastSunday.toISOString().split("T")[0],
  };
}

function getMonthToDateRange(): DateRange {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    from: firstOfMonth.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  };
}

function getLastMonthRange(): DateRange {
  const today = new Date();
  const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return {
    from: firstOfLastMonth.toISOString().split("T")[0],
    to: lastOfLastMonth.toISOString().split("T")[0],
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

function Calendar({ month, year, value, onMonthChange, onDateSelect }: CalendarProps) {
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
    const dateStr = date.toISOString().split("T")[0];
    onDateSelect(dateStr);
  };

  const isDateSelected = (day: number): boolean => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
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
    const dateStr = date.toISOString().split("T")[0];
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
        <div className="text-lg font-semibold">{monthNames[month]} {year}</div>
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
          <div key={day} className="text-center text-sm font-medium text-gray-600">
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

export function DateRangePicker({ value, onChange, align = "start" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectingFrom, setSelectingFrom] = useState(true);

  const displayValue = useMemo(() => {
    if (value?.from && value?.to) {
      return `${formatDisplayDate(value.from)} - ${formatDisplayDate(value.to)}`;
    }
    if (value?.from) {
      return `${formatDisplayDate(value.from)} - ...`;
    }
    return "Select date range";
  }, [value]);

  const handleDateSelect = (dateStr: string) => {
    let newValue: DateRange;

    if (selectingFrom) {
      // Setting "from" date
      newValue = { from: dateStr, to: value?.to };
      setSelectingFrom(false);
    } else {
      // Setting "to" date
      const fromDate = value?.from ? new Date(value.from) : new Date(dateStr);
      const toDate = new Date(dateStr);

      // Ensure to date is after from date
      if (toDate < fromDate) {
        newValue = { from: dateStr, to: value?.from };
      } else {
        newValue = { from: value?.from, to: dateStr };
      }
      setSelectingFrom(true);
    }

    onChange?.(newValue);
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    onChange?.(preset.range());
  };

  const handleClear = () => {
    onChange?.({});
    setSelectingFrom(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectingFrom(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between gap-2 px-4 py-2 text-sm",
            "border border-gray-300 rounded-md bg-white",
            "hover:bg-gray-50 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "min-w-[280px]",
          )}
        >
          <span className={cn(!value?.from && !value?.to && "text-gray-500")}>{displayValue}</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align={align}>
        <div className="space-y-4">
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="pt-2 border-t">
            <Calendar
              month={calendarMonth}
              year={calendarYear}
              value={value}
              onMonthChange={setCalendarMonth}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
            <Button size="sm" onClick={handleClose}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
