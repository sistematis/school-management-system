// src/app/(main)/academic/students/columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Cake, Phone, Users } from "lucide-react";

import {
  type ActionsColumnConfig,
  createEntityColumns,
  createTextColumn,
  type ProfileColumnConfig,
  type StatusColumnConfig,
} from "@/components/data-table";
import { studentActionConfig } from "@/config/actions/student-actions";
import { buildMasterDataActions } from "@/lib/actions";
import type { Student } from "@/lib/types/students";

/**
 * Format date for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
}

/**
 * Column definitions for Students table
 * Aligned with form fields from create/edit student pages
 */
export function getStudentColumns(
  onSortChange?: (columnId: string, desc: boolean) => void,
  onHideClick?: (columnId: string) => void,
  onViewDetails?: (studentId: string) => void,
  onEditStudent?: (studentId: string) => void,
  onDeleteStudent?: (studentId: string) => void,
): ColumnDef<Student>[] {
  // Profile column configuration
  const profileColumn: ProfileColumnConfig<Student> = {
    nameField: "name",
    subtitleField: "email",
    showAvatar: true,
    avatarLetter: (student) => student.name.charAt(0).toUpperCase(),
  };

  // Status column configuration
  const statusColumn: StatusColumnConfig<Student> = {
    field: "isActive",
    getStatus: (value) => {
      const isActive = Boolean(value);
      return {
        label: isActive ? "Active" : "Inactive",
        variant: isActive ? "default" : "secondary",
        className: isActive
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200",
      };
    },
  };

  // Actions column configuration
  const actionsColumn: ActionsColumnConfig<Student> = {
    items: (student) => {
      // Merge config dengan page-specific handlers
      const config = {
        ...studentActionConfig,
        onView: onViewDetails ? (s: Student) => onViewDetails(s.id) : studentActionConfig.onView,
        onEdit: onEditStudent ? (s: Student) => onEditStudent(s.id) : studentActionConfig.onEdit,
        onDelete: onDeleteStudent ? (s: Student) => onDeleteStudent(s.id) : studentActionConfig.onDelete,
      };

      return buildMasterDataActions(config, student);
    },
    copyId: studentActionConfig.copyId,
  };

  // Custom column for Student ID (Step 1: Basic Info)
  const studentIdColumn = createTextColumn<Student>({
    accessorKey: "value",
    header: "Student ID",
    cellClassName: "font-mono text-muted-foreground text-sm",
    onSortChange,
    onHideClick,
  });

  // Custom column for Student Group (Step 1: Basic Info)
  const studentGroupColumn: ColumnDef<Student> = {
    accessorKey: "bpGroupName",
    header: "Student Group",
    cell: ({ row }) => {
      const groupName = row.original.bpGroupName;
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{groupName || "-"}</span>
        </div>
      );
    },
  };

  // Custom column for Phone (Step 3: Account)
  const phoneColumn: ColumnDef<Student> = {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {phone ? (
            <a href={`tel:${phone}`} className="text-primary text-sm hover:underline">
              {phone}
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      );
    },
  };

  // Custom column for Birthday (Step 3: Account)
  const birthdayColumn: ColumnDef<Student> = {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => {
      const birthday = row.original.birthday;
      return (
        <div className="flex items-center gap-2">
          <Cake className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(birthday)}</span>
        </div>
      );
    },
  };

  return createEntityColumns<Student>({
    enableSelection: true,
    profileColumn,
    statusColumn,
    actionsColumn,
    customColumns: [studentIdColumn, studentGroupColumn, phoneColumn, birthdayColumn],
    onSortChange,
    onHideClick,
  });
}

// Keep the old export for backward compatibility (without sort handler)
export const studentColumns: ColumnDef<Student>[] = getStudentColumns();
