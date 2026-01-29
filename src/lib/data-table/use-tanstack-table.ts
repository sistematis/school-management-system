// src/lib/data-table/use-tanstack-table.ts

import {
  type ColumnDef,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

export function useTanStackTable<TData>({
  data,
  columns,
  pageCount,
  state,
  onPaginationChange,
  onSortingChange,
  onColumnVisibilityChange,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount: number;
  state?: { pagination?: PaginationState; sorting?: SortingState; columnVisibility?: VisibilityState };
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  onSortingChange?: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  onColumnVisibilityChange?: (visibility: VisibilityState | ((old: VisibilityState) => VisibilityState)) => void;
}) {
  return useReactTable({
    data,
    columns,
    pageCount,
    state,
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // We handle pagination on the server
    manualSorting: true, // We handle sorting on the server
    enableColumnResizing: false,
  });
}
