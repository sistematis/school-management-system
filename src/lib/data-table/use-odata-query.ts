// src/lib/data-table/use-odata-query.ts

"use client";

import { useMemo } from "react";

import type { SortingState } from "@tanstack/react-table";

import { buildODataFilter } from "./build-odata-filter";
import type { FilterSchema } from "./filter.types";
import { useTableFilters } from "./use-table-filters";

export interface UseODataQueryOptions {
  schema: FilterSchema;
  searchableField?: string;
  pageSize?: number;
  currentPage?: number;
  sorting?: SortingState;
  /** Map camelCase field names to PascalCase API field names */
  fieldNameMap?: Record<string, string>;
  /** Optional pending filters that override URL filters (for real-time data refresh without URL updates) */
  pendingFilters?: import("./filter.types").ActiveFilter[];
  /** Optional version number to trigger query recalculation when pending filters change */
  pendingFiltersVersion?: number;
}

export interface ODataQueryParams {
  $filter?: string;
  $orderby: string;
  $top: number;
  $skip: number;
}

/**
 * Build OData query parameters from current filter state
 * Returns params ready for iDempiere REST API
 */
export function useODataQuery({
  schema,
  searchableField,
  pageSize = 10,
  currentPage = 1,
  sorting = [],
  fieldNameMap = {},
  pendingFilters,
  pendingFiltersVersion = 0,
}: UseODataQueryOptions) {
  const { activeFilters, searchQuery, setActiveFilters, setSearchQuery, resetAll } = useTableFilters({
    schema,
    searchableField,
  });

  // Use pending filters for query building when available (real-time data refresh without URL updates)
  const effectiveFilters = pendingFilters ?? activeFilters;

  // Build complete OData query params
  const queryParams = useMemo((): ODataQueryParams => {
    const params: ODataQueryParams = {
      $orderby: "Name asc", // Default sort
      $top: pageSize,
      $skip: (currentPage - 1) * pageSize,
    };

    // Build $orderby from sorting state
    if (sorting.length > 0) {
      const sortClause = sorting
        .map((sort) => {
          // Map camelCase field name to PascalCase API field name
          const apiFieldName = fieldNameMap[sort.id] || sort.id;
          const direction = sort.desc ? "desc" : "asc";
          return `${apiFieldName} ${direction}`;
        })
        .join(", ");
      params.$orderby = sortClause;
    }

    // Build $filter from active filters
    const filterClauses: string[] = [];

    // Add search filter (if searchable field exists)
    if (searchQuery && searchableField) {
      const metadata = schema.metadata[searchableField];
      if (metadata?.searchable) {
        filterClauses.push(`contains(${searchableField},'${searchQuery}')`);
      }
    }

    // Add effective filters (pending or URL-based)
    const filterString = buildODataFilter(effectiveFilters, schema.metadata);
    if (filterString) {
      filterClauses.push(filterString);
    }

    // Combine with AND
    if (filterClauses.length > 0) {
      params.$filter = filterClauses.join(" and ");
    }

    return params;
  }, [effectiveFilters, searchQuery, searchableField, schema, pageSize, currentPage, sorting, fieldNameMap]);

  return {
    queryParams,
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
  };
}
