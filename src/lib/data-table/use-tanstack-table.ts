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
  onSortingChange,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount: number;
  state?: { pagination?: PaginationState; sorting?: SortingState; columnVisibility?: VisibilityState };
  onSortingChange?: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
}) {
  // Do NOT memoize options - TanStack Table handles this internally with its own memoization
  // Memoizing can prevent proper updates when data or state changes
  return useReactTable({
    data,
    columns,
    pageCount,
    state,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableColumnResizing: false,
    enableHiding: true,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });
}
