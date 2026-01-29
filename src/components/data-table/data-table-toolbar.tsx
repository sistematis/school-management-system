// src/components/data-table/data-table-toolbar.tsx

"use client";

import type { Table, VisibilityState } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActiveFilter, FilterSchema } from "@/lib/data-table/filter.types";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterSchema?: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  searchableField?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (columnId: string, value: boolean) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterSchema,
  activeFilters,
  onFiltersChange,
  searchableField,
  searchValue,
  onSearchChange,
  columnVisibility,
  onColumnVisibilityChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = activeFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={
            searchableField && filterSchema
              ? `Search by ${filterSchema.metadata[searchableField]?.label || "name"}...`
              : "Search..."
          }
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterSchema && (
          <DataTableFacetedFilter
            schema={filterSchema}
            activeFilters={activeFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => onFiltersChange([])} className="h-8 px-2 lg:px-3">
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
