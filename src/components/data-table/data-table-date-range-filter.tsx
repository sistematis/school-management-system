// src/components/data-table/data-table-date-range-filter.tsx

"use client";

import { useState } from "react";

import { CalendarDays, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ActiveFilter, FilterFieldMetadata } from "@/lib/data-table/filter.types";
import { cn } from "@/lib/utils";

export interface DataTableDateRangeFilterProps {
  field: string;
  metadata: FilterFieldMetadata;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
}

/**
 * Reusable date range filter component
 * Allows filtering by date range (from/to) for date fields like Created, Updated
 */
export function DataTableDateRangeFilter({
  field,
  metadata,
  activeFilters,
  onFiltersChange,
}: DataTableDateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  // Get active filters for this field
  const fieldFilters = activeFilters.filter((f) => f.field === field);

  // Find from/to values
  const fromFilter = fieldFilters.find((f) => f.operator === "ge");
  const toFilter = fieldFilters.find((f) => f.operator === "le");

  const hasActiveRange = fromFilter || toFilter;

  const handleDateChange = (operator: "ge" | "le", value: string) => {
    // Remove existing filter with same operator
    const otherFilters = activeFilters.filter((f) => !(f.field === field && f.operator === operator));

    if (value) {
      onFiltersChange([...otherFilters, { field, operator, value }]);
    } else {
      onFiltersChange(otherFilters);
    }
  };

  const clearRange = () => {
    onFiltersChange(activeFilters.filter((f) => f.field !== field));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-8", hasActiveRange && "border-primary")}>
          <CalendarDays className="mr-2 h-4 w-4" />
          {metadata.label}
          {hasActiveRange && (
            <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-1 font-bold text-[10px] text-primary-foreground">
              ✓
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{metadata.label} Range</h4>
            {hasActiveRange && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearRange}>
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* From Date */}
            <div className="space-y-1.5">
              <label htmlFor={`date-from-${field}`} className="text-muted-foreground text-xs">
                From (or equal to)
              </label>
              <input
                id={`date-from-${field}`}
                type="date"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                  "file:border-0 file:bg-transparent file:font-medium file:text-sm",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
                value={fromFilter?.value || ""}
                onChange={(e) => handleDateChange("ge", e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="space-y-1.5">
              <label htmlFor={`date-to-${field}`} className="text-muted-foreground text-xs">
                To (or equal to)
              </label>
              <input
                id={`date-to-${field}`}
                type="date"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                  "file:border-0 file:bg-transparent file:font-medium file:text-sm",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
                value={toFilter?.value || ""}
                onChange={(e) => handleDateChange("le", e.target.value)}
              />
            </div>
          </div>

          {hasActiveRange && (
            <div className="flex flex-wrap gap-1 border-t pt-3">
              {fromFilter && (
                <Badge variant="secondary" className="text-xs">
                  From: {fromFilter.value}
                </Badge>
              )}
              {toFilter && (
                <Badge variant="secondary" className="text-xs">
                  To: {toFilter.value}
                </Badge>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
