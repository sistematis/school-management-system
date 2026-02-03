// src/components/data-table/data-table-toolbar.tsx

"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import type { Table, VisibilityState } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActiveFilter, FilterSchema } from "@/lib/data-table/filter.types";

import { DataTableFacetedFilter, type DataTableFacetedFilterRef } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterSchema?: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  filterRef?: React.MutableRefObject<DataTableFacetedFilterRef | null>;
  searchableField?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (columnId: string, value: boolean) => void;
  /** Pending filters from filter component for real-time data refresh */
  pendingFilters?: ActiveFilter[];
  /** Callback to receive pending filters from filter component */
  onPendingFiltersChange?: (filters: ActiveFilter[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterSchema,
  activeFilters,
  onFiltersChange,
  filterRef,
  searchableField,
  searchValue,
  onSearchChange,
  columnVisibility,
  onColumnVisibilityChange,
  _pendingFilters,
  onPendingFiltersChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = activeFilters.length > 0;
  const [_isPending, startTransition] = useTransition();

  // Local state for immediate input updates (prevents focus loss)
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  // Save cursor position before URL update
  const saveSelection = useCallback(() => {
    if (inputRef.current) {
      selectionRef.current = {
        start: inputRef.current.selectionStart || 0,
        end: inputRef.current.selectionEnd || 0,
      };
    }
  }, []);

  // Restore cursor position after URL update
  const restoreSelection = useCallback(() => {
    if (inputRef.current && selectionRef.current) {
      inputRef.current.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    }
  }, []);

  // Sync local state when external value changes (e.g., URL param changes)
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Restore focus and selection after component updates
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current && localSearchValue === searchValue) {
      inputRef.current.focus();
      restoreSelection();
    }
  }, [searchValue, localSearchValue, restoreSelection]);

  // Handle input change with debouncing
  const handleSearchChange = (value: string) => {
    // Save cursor position before update
    saveSelection();

    // Update local state immediately for smooth typing
    setLocalSearchValue(value);

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the URL update to reduce navigation triggers
    debounceRef.current = setTimeout(() => {
      // Use startTransition to defer the URL update and maintain input focus
      startTransition(() => {
        onSearchChange(value);
      });
    }, 300); // 300ms debounce
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          ref={inputRef}
          placeholder={
            searchableField && filterSchema
              ? `Search by ${filterSchema.metadata[searchableField]?.label || "name"}...`
              : "Search..."
          }
          value={localSearchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterSchema && (
          <DataTableFacetedFilter
            key={JSON.stringify(activeFilters)}
            ref={filterRef}
            schema={filterSchema}
            activeFilters={activeFilters}
            onFiltersChange={onFiltersChange}
            onPendingFiltersChange={onPendingFiltersChange}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              // Clear pending filters in the filter component
              if (filterRef?.current) {
                filterRef.current.clearPendingFilters();
              }
              // Clear active filters via the provided callback
              onFiltersChange([]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions
        table={table}
        columnVisibility={columnVisibility || {}}
        onVisibilityChange={onColumnVisibilityChange}
      />
    </div>
  );
}
