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
import type { Student } from "@/lib/types/students";

/**
 * Column definitions for Students table
 * Uses generic column builder for reusability
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
      const items: ActionItem[] = [
        { label: "View details", onClick: () => onViewDetails?.(student.id) },
        { label: "Edit student", onClick: () => onEditStudent?.(student.id) },
        { variant: "separator" },
        {
          label: "Delete",
          variant: "destructive",
          onClick: () => onDeleteStudent?.(student.id),
        },
      ];
      return items;
    },
    copyId: {
      label: "Copy ID",
      getId: (student) => student.id,
    },
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
