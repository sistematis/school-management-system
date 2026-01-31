// src/components/data-table/data-table-faceted-filter.tsx

"use client";

import { useState } from "react";

import { Calendar, Check, PlusCircle, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { ActiveFilter, FilterFieldMetadata, FilterSchema, ODataOperator } from "@/lib/data-table/filter.types";
import { cn } from "@/lib/utils";

export interface DataTableFacetedFilterProps {
  schema: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
}

export function DataTableFacetedFilter({ schema, activeFilters, onFiltersChange }: DataTableFacetedFilterProps) {
  const [open, setOpen] = useState(false);
  const [openDateFilter, setOpenDateFilter] = useState<string | null>(null);
  const activeCount = activeFilters.length;

  // Group fields by their group ID
  const groupedFields = schema.groups.reduce(
    (acc, group) => {
      acc[group.id] = {
        title: group.title,
        fields: group.fields.map((fieldName) => ({
          name: fieldName,
          metadata: schema.metadata[fieldName],
        })),
      };
      return acc;
    },
    {} as Record<
      string,
      {
        title: string;
        fields: Array<{ name: string; metadata: FilterFieldMetadata }>;
      }
    >,
  );

  const toggleFilter = (field: string, value: string, operator: ODataOperator) => {
    const existingIndex = activeFilters.findIndex((f) => f.field === field && f.value === value);

    let newFilters: ActiveFilter[];
    if (existingIndex >= 0) {
      newFilters = activeFilters.filter((_, i) => i !== existingIndex);
    } else {
      newFilters = [...activeFilters, { field, operator, value }];
    }

    onFiltersChange(newFilters);
  };

  const isFilterActive = (field: string, value: string) => {
    return activeFilters.some((f) => f.field === field && f.value === value);
  };

  // Get date range filters for a field
  const getDateRangeValues = (field: string) => {
    const fieldFilters = activeFilters.filter((f) => f.field === field);
    const fromValue = fieldFilters.find((f) => f.operator === "ge")?.value || "";
    const toValue = fieldFilters.find((f) => f.operator === "le")?.value || "";
    return { fromValue, toValue, hasRange: fromValue || toValue };
  };

  const handleDateChange = (field: string, operator: "ge" | "le", value: string) => {
    const otherFilters = activeFilters.filter((f) => !(f.field === field && f.operator === operator));
    if (value) {
      onFiltersChange([...otherFilters, { field, operator, value }]);
    } else {
      onFiltersChange(otherFilters);
    }
  };

  const clearDateRange = (field: string) => {
    onFiltersChange(activeFilters.filter((f) => f.field !== field));
  };

  const clearAll = () => {
    onFiltersChange([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {activeCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {activeCount > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeCount} selected
                  </Badge>
                ) : (
                  activeFilters.map((filter) => (
                    <Badge
                      key={`${filter.field}-${filter.value}`}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {schema.metadata[filter.field]?.label || filter.field}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-1">
          {Object.entries(groupedFields).map(([groupId, group]) => (
            <div key={groupId} className="pb-4 last:pb-0">
              <h4 className="px-2 py-1 font-semibold text-muted-foreground text-xs">{group.title}</h4>
              <div className="space-y-1">
                {group.fields.map(({ name, metadata }) => {
                  // For date fields, show date range picker
                  if (metadata.type === "date") {
                    const { fromValue, toValue, hasRange } = getDateRangeValues(name);

                    return (
                      <div key={name} className="px-2 py-1.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{metadata.label}</span>
                          </div>
                          {hasRange && (
                            <button
                              type="button"
                              onClick={() => clearDateRange(name)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <DateRangePicker
                          value={{ from: fromValue, to: toValue }}
                          onChange={(range) => {
                            if (range.from) handleDateChange(name, "ge", range.from);
                            if (range.to) handleDateChange(name, "le", range.to);
                          }}
                        />
                      </div>
                    );
                  }

                  // For boolean fields, show as toggle
                  if (metadata.type === "boolean") {
                    return (
                      <button
                        key={name}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                          isFilterActive(name, "true") && "bg-accent",
                        )}
                        onClick={() => toggleFilter(name, "true", "eq")}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isFilterActive(name, "true") ? "bg-primary text-primary-foreground" : "opacity-50",
                          )}
                        >
                          {isFilterActive(name, "true") && <Check className="h-3 w-3" />}
                        </div>
                        <span className="flex-1 text-left">{metadata.label}</span>
                      </button>
                    );
                  }

                  // For enum/reference fields, show options
                  if (metadata.options) {
                    return metadata.options.map((option: { label: string; value: string }) => (
                      <button
                        key={`${name}-${option.value}`}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                          isFilterActive(name, option.value) && "bg-accent",
                        )}
                        onClick={() => toggleFilter(name, option.value, "eq")}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isFilterActive(name, option.value) ? "bg-primary text-primary-foreground" : "opacity-50",
                          )}
                        >
                          {isFilterActive(name, option.value) && <Check className="h-3 w-3" />}
                        </div>
                        <span className="flex-1 text-left">{option.label}</span>
                      </button>
                    ));
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
        {activeCount > 0 && (
          <>
            <Separator />
            <div className="p-1">
              <Button variant="ghost" className="w-full justify-start text-sm" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
