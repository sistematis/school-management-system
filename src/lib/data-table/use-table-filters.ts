// src/lib/data-table/use-table-filters.ts

"use client";

import { useCallback, useMemo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import type { ActiveFilter, FilterSchema } from "./filter.types";

const FILTER_PARAM_PREFIX = "f";
const SEARCH_PARAM = "q";

export interface UseTableFiltersOptions {
  schema: FilterSchema;
  searchableField?: string;
}

export interface UseTableFiltersReturn {
  /** Filters parsed from URL */
  activeFilters: ActiveFilter[];
  /** Search query parsed from URL */
  searchQuery: string;
  /** Update filters and sync to URL */
  setActiveFilters: (filters: ActiveFilter[]) => void;
  /** Update search query and sync to URL */
  setSearchQuery: (query: string) => void;
  /** Clear all filters and search */
  resetAll: () => void;
  /** Check if specific filter is active */
  isFilterActive: (field: string, value: string) => boolean;
}

/**
 * Hook for managing table filters with bi-directional URL sync
 */
export function useTableFilters({ schema }: UseTableFiltersOptions): UseTableFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith(`${FILTER_PARAM_PREFIX}[`) || key.startsWith(`${FILTER_PARAM_PREFIX}%5B`)) {
        // Decode URL-encoded keys and extract field name and operator
        const decodedKey = decodeURIComponent(key);
        // Match patterns like f[Created] or f[Created][ge] or f[Created][le]
        const match = decodedKey.match(/\[([^\]]+)\](?:\[([^\]]+)\])?/);
        if (match) {
          const field = match[1];
          const operator = match[2] || schema.metadata[field]?.operators?.[0] || "eq";
          filters.push({
            field,
            operator: operator as ActiveFilter["operator"],
            value,
          });
        }
      }
    });
    return filters;
  }, [searchParams, schema]);

  const searchQuery = useMemo(() => {
    return searchParams.get(SEARCH_PARAM) || "";
  }, [searchParams]);

  const setActiveFilters = useCallback(
    (filters: ActiveFilter[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Remove existing filter params (both encoded and unencoded forms)
      params.forEach((_, key) => {
        const decodedKey = decodeURIComponent(key);
        if (decodedKey.startsWith(`${FILTER_PARAM_PREFIX}[`)) {
          params.delete(key);
        }
      });

      // Group filters by field to determine if we need operator suffix
      const fieldGrouping = new Map<string, ActiveFilter[]>();
      filters.forEach((filter) => {
        if (!fieldGrouping.has(filter.field)) {
          fieldGrouping.set(filter.field, []);
        }
        fieldGrouping.get(filter.field)?.push(filter);
      });

      // Add new filter params
      filters.forEach((filter) => {
        const fieldFilters = fieldGrouping.get(filter.field) || [];
        const defaultOperator = schema.metadata[filter.field]?.operators?.[0] || "eq";
        const needsOperatorSuffix = fieldFilters.length > 1 || filter.operator !== defaultOperator;

        if (needsOperatorSuffix) {
          params.set(`${FILTER_PARAM_PREFIX}[${filter.field}][${filter.operator}]`, String(filter.value));
        } else {
          params.set(`${FILTER_PARAM_PREFIX}[${filter.field}]`, String(filter.value));
        }
      });

      // Use replace instead of push to avoid adding to history and causing remounts
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, schema],
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set(SEARCH_PARAM, query);
      } else {
        params.delete(SEARCH_PARAM);
      }

      // Use replace instead of push to avoid adding to history and causing remounts
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const resetAll = useCallback(() => {
    const params = new URLSearchParams();

    // Keep only non-filter params (if any in future)
    router.push(params.size > 0 ? `?${params.toString()}` : "?", {
      scroll: false,
    });
  }, [router]);

  const isFilterActive = useCallback(
    (field: string, value: string): boolean => {
      return activeFilters.some((f) => f.field === field && String(f.value) === value);
    },
    [activeFilters],
  );

  return {
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
    isFilterActive,
  };
}
