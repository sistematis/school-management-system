// src/app/(main)/academic/students/page.tsx

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Plus, Users } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableStats } from "@/components/data-table/data-table-stats";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { studentFilterSchema } from "@/lib/api/idempiere/models/c-bpartner";
import { useODataQuery } from "@/lib/data-table/use-odata-query";
import { useTanStackTable } from "@/lib/data-table/use-tanstack-table";
import { useStudentStats, useStudents } from "@/lib/hooks/use-students";
import type { Student } from "@/lib/types/students";

import { studentColumns } from "./columns";

/**
 * Page size for table pagination
 */
const PAGE_SIZE = 10;

/**
 * Students Page - Table view with dynamic filtering
 *
 * Features:
 * - Dynamic filters from C_BPartner model schema
 * - URL-synced filters (bookmarkable, shareable)
 * - Stats that reflect filtered data
 * - Server-side pagination with iDempiere OData
 */
export default function StudentsPage() {
  const router = useRouter();

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Build OData query params from URL filters
  const { queryParams, activeFilters, searchQuery, setActiveFilters, setSearchQuery, resetAll } = useODataQuery({
    schema: studentFilterSchema,
    searchableField: "Name",
    pageSize: PAGE_SIZE,
    currentPage,
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
  const totalRecords = studentsData?.totalRecords || 0;

  // Transform response to table data
  const tableData: Student[] = studentsData?.records || [];

  // Build table
  const table = useTanStackTable({
    data: tableData,
    columns: studentColumns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: PAGE_SIZE,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({
              pageIndex: currentPage - 1,
              pageSize: PAGE_SIZE,
            })
          : updater;
      setCurrentPage(newState.pageIndex + 1);
    },
  });

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
    {
      title: "Grade 9",
      value: stats?.grade9 || 0,
    },
    {
      title: "Grade 10",
      value: stats?.grade10 || 0,
    },
    {
      title: "Grades 11-12",
      value: stats?.grades11_12 || 0,
    },
  ];

  // Loading state
  if (isLoadingStudents && !tableData.length) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">Manage student records and information</p>
          </div>
          <Button onClick={() => router.push("/academic/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <DataTableStats stats={statCards} isLoading={true} />
        <DataTableSkeleton rowCount={PAGE_SIZE} />
      </div>
    );
  }

  // Error state
  if (studentsError) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">Error</p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Error loading students: {studentsError.message}
        </div>
      </div>
    );
  }

  // Empty state
  if (!tableData.length && !isLoadingStudents) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">Manage student records and information</p>
          </div>
          <Button onClick={() => router.push("/academic/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <DataTableStats stats={statCards} isLoading={isLoadingStats} />
        <DataTableEmpty hasFilters={activeFilters.length > 0} hasSearch={!!searchQuery} onClearFilters={resetAll} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
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
      <div className="rounded-md border bg-card">
        {/* Toolbar with Search and Filters */}
        <DataTableToolbar
          table={table}
          filterSchema={studentFilterSchema}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          searchableField="Name"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Table Content */}
        <DataTable table={table} columns={studentColumns} />

        {/* Pagination */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
