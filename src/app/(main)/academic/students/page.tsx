// src/app/(main)/academic/students/page.tsx

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import type { PaginationState, SortingState, VisibilityState } from "@tanstack/react-table";
import { Plus, Users } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableStats } from "@/components/data-table/data-table-stats";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { StudentDetailDrawer } from "@/components/students";
import { Button } from "@/components/ui/button";
import type { CBPartner } from "@/lib/api/idempiere/models/c-bpartner";
import { studentFilterSchema } from "@/lib/api/idempiere/models/c-bpartner";
import type { ActiveFilter } from "@/lib/data-table/filter.types";
import { useODataQuery } from "@/lib/data-table/use-odata-query";
import { useTanStackTable } from "@/lib/data-table/use-tanstack-table";
import { useStudentStats, useStudents } from "@/lib/hooks/use-students";

import { getStudentColumns } from "./columns";

/**
 * Page size for table pagination
 */
const PAGE_SIZE = 10;

/**
 * Students Page - Table view with dynamic filtering
 */
export default function StudentsPage() {
  const router = useRouter();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [_selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<CBPartner | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Field name mapping: camelCase (frontend) -> PascalCase (API)
  const fieldNameMap: Record<string, string> = {
    name: "Name",
    value: "Value",
    isActive: "IsActive",
    email: "EMail",
  };

  // Build OData query params from URL filters
  const { queryParams, activeFilters, searchQuery, setActiveFilters, setSearchQuery, resetAll } = useODataQuery({
    schema: studentFilterSchema,
    searchableField: "Name",
    pageSize: pageSize,
    currentPage,
    sorting,
    fieldNameMap,
  });

  // Fetch students with filters
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useStudents({
    queryParams,
  });

  // Fetch stats (reflects filtered data)
  const { data: stats, isLoading: isLoadingStats } = useStudentStats(queryParams.$filter);

  // Calculate total pages from response
  const totalPages = studentsData?.totalPages || 1;

  // Transform response to table data - track studentsData changes to force re-render on new data
  const tableData = useMemo(() => studentsData?.records || [], [studentsData]);

  // Sorting handler - directly update the state with correct values
  const handleSortChange = useCallback((columnId: string, desc: boolean) => {
    console.log("[handleSortChange] Column:", columnId, "Desc:", desc);
    setSorting([{ id: columnId, desc }]);
  }, []);

  // Column visibility handler - directly update the state with correct value
  const handleColumnVisibilityChange = useCallback((columnId: string, value: boolean) => {
    console.log("[handleColumnVisibilityChange] Column:", columnId, "Value:", value);
    setColumnVisibility((old) => ({
      ...old,
      [columnId]: value,
    }));
  }, []);

  // Column hide handler - hide a column by setting visibility to false
  const handleHideColumn = useCallback((columnId: string) => {
    console.log("[handleHideColumn] Column:", columnId);
    setColumnVisibility((old) => ({
      ...old,
      [columnId]: false,
    }));
  }, []);

  // Ref to access filter component methods
  const filterRef = useRef<import("@/components/data-table/data-table-faceted-filter").DataTableFacetedFilterRef>(null);

  // Handle filter changes from the filter component
  const handleFiltersChange = useCallback(
    (filters: ActiveFilter[]) => {
      // Sync to URL (called when filters change)
      setActiveFilters(filters);
    },
    [setActiveFilters],
  );

  // View details handler - fetch student details with expanded relations
  const handleViewDetails = useCallback(async (studentId: string) => {
    setSelectedStudentId(studentId);
    setDrawerOpen(true);
    setIsLoadingDetails(true);

    try {
      const { getBusinessPartnerService } = await import("@/lib/api/idempiere/services/business-partner.service");
      const service = getBusinessPartnerService();

      // Convert string ID to number for API call
      const details = await service.getStudentByIdWithExpand(Number(studentId));

      if (details) {
        // Set student details directly (already has id: number)
        setStudentDetails(details as unknown as CBPartner);
      } else {
        setStudentDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch student details:", error);
      setStudentDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Edit student handler
  const handleEditStudent = useCallback(
    (studentId: string) => {
      router.push(`/academic/students/${studentId}/edit`);
    },
    [router],
  );

  // Delete student handler
  const handleDeleteStudent = useCallback(async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const { getBusinessPartnerService } = await import("@/lib/api/idempiere/services/business-partner.service");
      const service = getBusinessPartnerService();

      const success = await service.deleteStudent(Number(studentId));

      if (success) {
        // Refresh the table data by refetching
        window.location.reload();
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student");
    }
  }, []);

  // Drawer close handler
  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    // Clear data after animation
    setTimeout(() => {
      setSelectedStudentId(null);
      setStudentDetails(null);
    }, 300);
  }, []);

  // Memoize columns to prevent table recreation on every render
  const memoizedColumns = useMemo(
    () =>
      getStudentColumns(handleSortChange, handleHideColumn, handleViewDetails, handleEditStudent, handleDeleteStudent),
    [handleSortChange, handleHideColumn, handleViewDetails, handleEditStudent, handleDeleteStudent],
  );

  // Build table state object - memoized to prevent unnecessary table recreation
  const tableState = useMemo(
    () => ({
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      } as PaginationState,
      sorting,
      columnVisibility,
    }),
    [currentPage, pageSize, sorting, columnVisibility],
  );

  // Build table
  const table = useTanStackTable({
    data: tableData,
    columns: memoizedColumns,
    pageCount: totalPages,
    state: tableState,
  });

  // Sync column visibility with TanStack Table when it changes
  useEffect(() => {
    if (table && columnVisibility) {
      // Update table's column visibility state
      Object.entries(columnVisibility).forEach(([columnId, visible]) => {
        const column = table.getColumn(columnId);
        if (column) {
          column.toggleVisibility(!!visible);
        }
      });
      // Force table re-render by updating state
      table.setOptions((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          columnVisibility,
        },
      }));
    }
  }, [columnVisibility, table]);

  // Stats cards configuration
  const statCards = [
    {
      title: "Total Students",
      value: stats?.total || 0,
      icon: Users,
    },
    {
      title: "Active",
      value: stats?.active || 0,
    },
  ];

  // Loading state - matches actual UI structure
  if (isLoadingStudents && !tableData.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Students</h1>
            <p className="text-muted-foreground">Manage student records and information</p>
          </div>
          <Button onClick={() => router.push("/academic/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <DataTableStats stats={statCards} isLoading={true} />
        {/* Data Table Skeleton - matches actual UI structure with border container */}
        <div className="flex flex-col gap-0 rounded-md border bg-card">
          {/* Toolbar skeleton */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="h-8 w-[150px] lg:w-[250px] animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-[120px] animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-8 w-[100px] animate-pulse rounded-md bg-muted" />
          </div>

          {/* Table skeleton */}
          <div className="relative w-full overflow-auto">
            <div className="border-b">
              {/* Header row */}
              <div className="flex gap-4 border-b px-4 py-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
              </div>
              {/* Data rows */}
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={`row-${i}`} className="flex gap-4 border-b px-4 py-3 last:border-0">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="border-t p-4 flex items-center justify-between">
            <div className="h-9 w-[150px] animate-pulse rounded-md bg-muted" />
            <div className="flex gap-2">
              <div className="h-9 w-[80px] animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-[80px] animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (studentsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Students</h1>
            <p className="text-muted-foreground">Error</p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Error loading students: {studentsError.message}
        </div>
      </div>
    );
  }

  const isEmpty = !tableData.length && !isLoadingStudents;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Button onClick={() => router.push("/academic/students/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards - Reflect Filtered Data */}
      <DataTableStats stats={statCards} isLoading={isLoadingStats} />

      {/* Data Table */}
      <div className="flex flex-col gap-0 rounded-md border bg-card">
        {/* Toolbar with Search and Filters */}
        <div className="border-b p-4">
          <DataTableToolbar
            table={table}
            filterSchema={studentFilterSchema}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            filterRef={filterRef}
            searchableField="Name"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </div>

        {/* Table Content */}
        {/* key includes sorting and columnVisibility to ensure table updates */}
        {isEmpty ? (
          <DataTableEmpty hasFilters={activeFilters.length > 0} hasSearch={!!searchQuery} onClearFilters={resetAll} />
        ) : (
          <DataTable
            key={`table-${pageSize}-${sorting.map((s) => `${s.id}-${s.desc}`).join("-")}-${Object.entries(
              columnVisibility,
            )
              .map(([k, v]) => `${k}-${v}`)
              .join("-")}`}
            table={table}
            columns={memoizedColumns}
          />
        )}

        {/* Pagination */}
        <div className="border-t p-4">
          <DataTablePagination
            table={table}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSizeChange={(newPageSize) => {
              console.log("[Pagination] onPageSizeChange:", { old: pageSize, new: newPageSize });
              setPageSize(newPageSize);
              setCurrentPage(1);
            }}
            onPageChange={(newPage) => {
              console.log("[Pagination] onPageChange:", { old: currentPage, new: newPage });
              setCurrentPage(newPage);
            }}
          />
        </div>
      </div>

      {/* Student Detail Drawer */}
      <StudentDetailDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerClose}
        student={studentDetails}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}
