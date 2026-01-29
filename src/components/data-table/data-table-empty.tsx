// src/components/data-table/data-table-empty.tsx

"use client";

import { useRouter } from "next/navigation";

import { FilterX, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface DataTableEmptyProps {
  hasFilters: boolean;
  hasSearch: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state message when no results found
 * Shows different messages based on whether filters/search are active
 */
export function DataTableEmpty({ hasFilters, hasSearch, onClearFilters }: DataTableEmptyProps) {
  const router = useRouter();

  const handleAddStudent = () => {
    router.push("/academic/students/new");
  };

  return (
    <Card className="flex flex-col items-center justify-center rounded-none p-12 text-center">
      {hasFilters || hasSearch ? (
        <>
          <FilterX className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">No results found</h3>
          <p className="mb-4 max-w-sm text-muted-foreground">
            {hasFilters && hasSearch
              ? "Try adjusting your filters or search term"
              : hasFilters
                ? "Try adjusting your filters"
                : "Try a different search term"}
          </p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Clear all filters
            </Button>
          )}
        </>
      ) : (
        <>
          <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">No students yet</h3>
          <p className="mb-4 text-muted-foreground">Get started by adding your first student</p>
          <Button onClick={handleAddStudent}>Add Student</Button>
        </>
      )}
    </Card>
  );
}
