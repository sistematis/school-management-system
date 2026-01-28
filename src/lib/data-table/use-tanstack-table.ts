// src/lib/data-table/use-tanstack-table.ts

import { type ColumnDef, getCoreRowModel, type PaginationState, useReactTable } from "@tanstack/react-table";

export function useTanStackTable<TData>({
  data,
  columns,
  pageCount,
  state,
  onPaginationChange,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount: number;
  state?: { pagination?: PaginationState };
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
}) {
  return useReactTable({
    data,
    columns,
    pageCount,
    state,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // We handle pagination on the server
  });
}
