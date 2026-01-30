// src/app/(main)/academic/students/columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  type ActionItem,
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
 * Column definitions for Students table
 * Now uses reusable action builder
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

  // Actions column configuration - NOW USING BUILDER
  const actionsColumn: ActionsColumnConfig<Student> = {
    items: (student) => {
      // Merge config dengan page-specific handlers
      const config = {
        ...studentActionConfig,
        onView: onViewDetails ? (s) => onViewDetails(s.id) : studentActionConfig.onView,
        onEdit: onEditStudent ? (s) => onEditStudent(s.id) : studentActionConfig.onEdit,
        onDelete: onDeleteStudent ? (s) => onDeleteStudent(s.id) : studentActionConfig.onDelete,
      };

      return buildMasterDataActions(config, student);
    },
    copyId: studentActionConfig.copyId,
  };

  // Custom column for Student ID
  const studentIdColumn = createTextColumn<Student>({
    accessorKey: "value",
    header: "ID",
    cellClassName: "font-mono text-muted-foreground text-sm",
    onSortChange,
    onHideClick,
  });

  return createEntityColumns<Student>({
    enableSelection: true,
    profileColumn,
    statusColumn,
    actionsColumn,
    customColumns: [studentIdColumn],
    onSortChange,
    onHideClick,
  });
}

// Keep the old export for backward compatibility (without sort handler)
export const studentColumns: ColumnDef<Student>[] = getStudentColumns();
