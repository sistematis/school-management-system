// src/components/data-table/data-table-skeleton.tsx

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton({ rowCount = 10, columnCount = 6 }: { rowCount?: number; columnCount?: number }) {
  return (
    <Card className="p-4">
      {/* Toolbar skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
        <Skeleton className="h-9 w-[100px]" />
      </div>

      {/* Header skeleton */}
      <div className="mb-2 flex gap-4 px-4">
        <Skeleton className="h-10 w-10 shrink-0" />
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10 flex-1" />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-4 border-b px-4 py-3 last:border-0">
          <Skeleton className="h-10 w-10 shrink-0" />
          {Array.from({ length: columnCount }).map((_, j) => (
            <Skeleton key={`cell-${i}-${j}`} className="h-10 flex-1" />
          ))}
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <Skeleton className="h-9 w-[150px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>
    </Card>
  );
}
