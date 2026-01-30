// src/components/data-table/index.ts

/**
 * Data Table Components
 *
 * Central exports for all data table UI components.
 * Import from this index for cleaner imports:
 *
 * ```ts
 * import { DataTable, DataTableToolbar, DataTableStats } from "@/components/data-table";
 * ```
 */

export { DataTable } from "./data-table";
export { DataTableColumnHeader } from "./data-table-column-header";
export { DataTableEmpty } from "./data-table-empty";
export { DataTableFacetedFilter } from "./data-table-faceted-filter";
export { DataTablePagination } from "./data-table-pagination";
export { DataTableSkeleton } from "./data-table-skeleton";
export { DataTableStats } from "./data-table-stats";
export { DataTableToolbar } from "./data-table-toolbar";
export { DataTableViewOptions } from "./data-table-view-options";
// Generic column builders
export {
  type ActionItem,
  type ActionsColumnConfig,
  createBadgeColumn,
  createEntityColumns,
  createTextColumn,
  type GenericColumnsConfig,
  type ProfileColumnConfig,
  type StatusColumnConfig,
} from "./generic-columns";
