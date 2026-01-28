// src/lib/data-table/index.ts

/**
 * Data Table Utilities
 *
 * Central exports for all data table utilities and hooks.
 * Import from this index for cleaner imports:
 *
 * ```ts
 * import {
 *   useODataQuery,
 *   useTanStackTable,
 *   type FilterField,
 *   type ODataQueryParams
 * } from "@/lib/data-table";
 * ```
 */

export * from "./build-odata-filter";
export * from "./filter.types";
export * from "./generate-filter-schema";
export * from "./use-odata-query";
export * from "./use-table-filters";
export * from "./use-tanstack-table";
