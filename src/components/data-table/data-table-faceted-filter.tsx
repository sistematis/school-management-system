// src/components/data-table/data-table-faceted-filter.tsx

"use client";

import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { Calendar, Check, Loader2, PlusCircle, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { ActiveFilter, FilterFieldMetadata, FilterSchema, ODataOperator } from "@/lib/data-table/filter.types";
import { useReferenceOptions } from "@/lib/data-table/use-reference-options";
import { cn } from "@/lib/utils";

export interface DataTableFacetedFilterProps {
  schema: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  /** Callback for real-time data refresh while filter popover is open */
  onPendingFiltersChange?: (filters: ActiveFilter[]) => void;
}

export interface DataTableFacetedFilterRef {
  getPendingFilters: () => ActiveFilter[];
  clearPendingFilters: () => void;
  isOpen: () => boolean;
}

const DataTableFacetedFilterComponent = forwardRef<DataTableFacetedFilterRef, DataTableFacetedFilterProps>(
  function DataTableFacetedFilter(
    { schema, activeFilters, onFiltersChange, onPendingFiltersChange }: DataTableFacetedFilterProps,
    ref,
  ) {
    const [open, setOpen] = useState(false);
    // Track pending filters for real-time data refresh - managed entirely within this component
    const [pendingFilters, setPendingFilters] = useState<ActiveFilter[]>([]);
    const [_isPending, startTransition] = useTransition();

    const activeCount = open ? pendingFilters.length : activeFilters.length;

    // Use a ref to persist the "should be open" state across re-renders
    const shouldBeOpenRef = useRef(false);

    // Expose methods to parent through ref
    useImperativeHandle(ref, () => ({
      getPendingFilters: () => pendingFilters,
      clearPendingFilters: () => {
        setPendingFilters([]);
      },
      isOpen: () => open,
    }));

    // Synchronously restore open state after re-renders if it should be open
    useLayoutEffect(() => {
      if (shouldBeOpenRef.current && !open) {
        setOpen(true);
      }
    });

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
      // Mark that the popover should stay open
      shouldBeOpenRef.current = true;

      // Update pending filters
      const existingIndex = pendingFilters.findIndex((f) => f.field === field && f.value === value);

      let newFilters: ActiveFilter[];
      if (existingIndex >= 0) {
        newFilters = pendingFilters.filter((_, i) => i !== existingIndex);
      } else {
        newFilters = [...pendingFilters, { field, operator, value }];
      }

      // Use startTransition to mark this as a non-urgent update
      // This prevents it from blocking urgent updates like keeping the Popover open
      startTransition(() => {
        setPendingFilters(newFilters);
      });
    };

    const isFilterActive = (field: string, value: string) => {
      return pendingFilters.some((f) => f.field === field && f.value === value);
    };

    // Get date range filters for a field
    const getDateRangeValues = (field: string) => {
      const fieldFilters = pendingFilters.filter((f) => f.field === field);
      const fromValue = (fieldFilters.find((f) => f.operator === "ge")?.value as string) || "";
      const toValue = (fieldFilters.find((f) => f.operator === "le")?.value as string) || "";
      return { fromValue, toValue, hasRange: fromValue || toValue };
    };

    const clearDateRange = (field: string) => {
      shouldBeOpenRef.current = true;
      const newFilters = pendingFilters.filter((f) => f.field !== field);
      startTransition(() => {
        setPendingFilters(newFilters);
      });
    };

    const clearAll = () => {
      const emptyFilters: ActiveFilter[] = [];
      setPendingFilters(emptyFilters);
      onFiltersChange(emptyFilters);
      setOpen(false);
    };

    // Handle popover open/close - sync filters when closing
    const handleOpenChange = (newOpen: boolean) => {
      if (newOpen) {
        // When opening, initialize pending filters from activeFilters
        setPendingFilters(activeFilters);
        setOpen(true);
        shouldBeOpenRef.current = false;
      } else {
        // When closing, sync pending filters back to parent (triggers URL update)
        // Only update if pending filters differ from current active filters
        const pendingJson = JSON.stringify(pendingFilters);
        const activeJson = JSON.stringify(activeFilters);
        if (pendingJson !== activeJson) {
          onFiltersChange(pendingFilters);
          // Sync pendingFilters to match what we just sent to parent
          // This ensures getPendingFilters() returns the correct value after sync
          setPendingFilters(pendingFilters);
        }
        setOpen(false);
        shouldBeOpenRef.current = false; // Reset flag when actually closing
      }
    };

    // Immediately reopen popover if it was closed but should have stayed open
    useEffect(() => {
      if (!open && shouldBeOpenRef.current) {
        setOpen(true);
      }
    }, [open]);

    // Notify parent of pending filters changes for real-time data refresh
    useEffect(() => {
      if (open && onPendingFiltersChange) {
        onPendingFiltersChange(pendingFilters);
      }
    }, [pendingFilters, open, onPendingFiltersChange]);

    // Component for reference fields with dynamic options
    const ReferenceFieldFilter = ({ name, metadata }: { name: string; metadata: FilterFieldMetadata<"reference"> }) => {
      const { options, isLoading, error } = useReferenceOptions(metadata.reference);

      if (isLoading) {
        return (
          <div key={name} className="px-2 py-1.5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Loading {metadata.label}...</span>
            </div>
          </div>
        );
      }

      if (error || options.length === 0) {
        return (
          <div key={name} className="px-2 py-1.5">
            <div className="text-muted-foreground text-sm">
              {error ? `Error: ${error}` : `No ${metadata.label} options available`}
            </div>
          </div>
        );
      }

      return (
        <>
          {options.map((option) => (
            <button
              key={`${name}-${option.value}`}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                isFilterActive(name, option.value) && "bg-accent",
              )}
              onClickCapture={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFilter(name, option.value, "eq");
              }}
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
          ))}
        </>
      );
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
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
                  {activeCount > 5 ? (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {activeCount} selected
                    </Badge>
                  ) : (
                    (() => {
                      const filters = open ? pendingFilters : activeFilters;
                      // Group date range filters by field to show single badge
                      const dateRangeGroups = new Map<string, { from?: string; to?: string }>();
                      const nonDateFilters: typeof filters = [];

                      filters.forEach((filter) => {
                        const metadata = schema.metadata[filter.field];
                        if (metadata?.type === "date") {
                          if (!dateRangeGroups.has(filter.field)) {
                            dateRangeGroups.set(filter.field, {});
                          }
                          const group = dateRangeGroups.get(filter.field);
                          if (group) {
                            if (filter.operator === "ge") {
                              group.from = filter.value as string;
                            } else if (filter.operator === "le") {
                              group.to = filter.value as string;
                            }
                          }
                        } else {
                          nonDateFilters.push(filter);
                        }
                      });

                      return (
                        <>
                          {nonDateFilters.map((filter) => (
                            <Badge
                              key={`${filter.field}-${filter.operator}-${filter.value}`}
                              variant="secondary"
                              className="rounded-sm px-1 font-normal"
                            >
                              {schema.metadata[filter.field]?.label || filter.field}
                            </Badge>
                          ))}
                          {Array.from(dateRangeGroups.entries()).map(([field, range]) => (
                            <Badge
                              key={`${field}-date-range`}
                              variant="secondary"
                              className="rounded-sm px-1 font-normal"
                            >
                              {schema.metadata[field]?.label || field}
                              {range.from && range.to && range.from !== range.to
                                ? `: ${range.from} - ${range.to}`
                                : range.from && range.to
                                  ? `: ${range.from}`
                                  : range.from
                                    ? `: ≥${range.from}`
                                    : range.to
                                      ? `: ≤${range.to}`
                                      : ""}
                            </Badge>
                          ))}
                        </>
                      );
                    })()
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-1">
            {Object.entries(groupedFields)
              .filter(([_, group]) => group.fields.length > 0) // Only show groups with fields
              .map(([groupId, group]) => (
                <div key={groupId} className="pb-4 last:pb-0">
                  <h4 className="px-2 py-1 font-semibold text-muted-foreground text-xs">{group.title}</h4>
                  <div className="space-y-1">
                    {group.fields.map(({ name, metadata }) => {
                      // For date fields, show date range picker
                      if (metadata.type === "date") {
                        const { fromValue, toValue, hasRange } = getDateRangeValues(name);

                        return (
                          <div key={name} className="px-2 py-1.5">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium text-sm">{metadata.label}</span>
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
                              value={
                                {
                                  from: fromValue || undefined,
                                  to: toValue || undefined,
                                } as const
                              }
                              side="bottom"
                              align="center"
                              sideOffset={4}
                              onChange={(range) => {
                                // Mark that the popover should stay open for real-time refresh
                                shouldBeOpenRef.current = true;

                                const otherFilters = pendingFilters.filter((f) => f.field !== name);
                                const newFilters: typeof pendingFilters = [];

                                if (range.from) {
                                  newFilters.push({
                                    field: name,
                                    operator: "ge",
                                    value: range.from,
                                  });
                                }
                                if (range.to) {
                                  newFilters.push({
                                    field: name,
                                    operator: "le",
                                    value: range.to,
                                  });
                                }

                                const updatedFilters = [...otherFilters, ...newFilters];
                                setPendingFilters(updatedFilters);
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
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleFilter(name, "true", "eq");
                            }}
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

                      // For enum fields with static options, show options
                      if (metadata.type === "enum" && metadata.options) {
                        return metadata.options.map((option: { label: string; value: string }) => (
                          <button
                            key={`${name}-${option.value}`}
                            type="button"
                            className={cn(
                              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                              isFilterActive(name, option.value) && "bg-accent",
                            )}
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleFilter(name, option.value, "eq");
                            }}
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isFilterActive(name, option.value)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50",
                              )}
                            >
                              {isFilterActive(name, option.value) && <Check className="h-3 w-3" />}
                            </div>
                            <span className="flex-1 text-left">{option.label}</span>
                          </button>
                        ));
                      }

                      // For reference fields with dynamic options
                      if (metadata.type === "reference") {
                        return (
                          <ReferenceFieldFilter
                            key={name}
                            name={name}
                            metadata={metadata as FilterFieldMetadata<"reference">}
                          />
                        );
                      }

                      // For string fields, show text input with contains operator
                      if (metadata.type === "string") {
                        const currentValue = (pendingFilters.find((f) => f.field === name)?.value as string) || "";
                        return (
                          <div key={name} className="px-2 py-1.5">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium text-sm">{metadata.label}</span>
                              {currentValue && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    shouldBeOpenRef.current = true;
                                    const newFilters = pendingFilters.filter((f) => f.field !== name);
                                    startTransition(() => setPendingFilters(newFilters));
                                  }}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder={`Search ${metadata.label}...`}
                              value={currentValue}
                              onChange={(e) => {
                                shouldBeOpenRef.current = true;
                                const value = e.target.value;
                                if (!value) {
                                  const newFilters = pendingFilters.filter((f) => f.field !== name);
                                  startTransition(() => setPendingFilters(newFilters));
                                } else {
                                  const newFilters = pendingFilters.filter((f) => f.field !== name);
                                  newFilters.push({ field: name, operator: "contains" as const, value });
                                  startTransition(() => setPendingFilters(newFilters));
                                }
                              }}
                              className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-muted placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                          </div>
                        );
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
  },
);

DataTableFacetedFilterComponent.displayName = "DataTableFacetedFilter";

// Memoize to prevent re-renders when parent re-renders due to pendingFiltersVersion changes
export const DataTableFacetedFilter = memo(DataTableFacetedFilterComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.schema === nextProps.schema &&
    JSON.stringify(prevProps.activeFilters) === JSON.stringify(nextProps.activeFilters) &&
    prevProps.onFiltersChange === nextProps.onFiltersChange
  );
});

DataTableFacetedFilter.displayName = "DataTableFacetedFilter";
