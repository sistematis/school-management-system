// src/components/data-table/generic-columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

/**
 * Profile column configuration
 * Displays avatar + name + optional subtitle
 */
export interface ProfileColumnConfig<T> {
  nameField: keyof T & string;
  subtitleField?: (keyof T & string) | ((row: T) => string | undefined);
  showAvatar?: boolean;
  avatarLetter?: (row: T) => string;
  avatarClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
}

/**
 * Status badge column configuration
 */
export interface StatusColumnConfig<T> {
  field: keyof T & string;
  getStatus: (value: unknown) => {
    label: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
    className?: string;
  };
}

/**
 * Action item configuration
 */
export type ActionItem =
  | {
      label: string;
      icon?: React.ComponentType<{ className?: string }>;
      onClick: () => void;
      variant?: "default" | "destructive";
      disabled?: boolean;
    }
  | {
      variant: "separator";
    };

/**
 * Type guard to check if an ActionItem has a label (i.e., is not a separator)
 */
function isActionItemWithLabel(item: ActionItem): item is ActionItem & { label: string } {
  return "label" in item;
}

/**
 * Actions column configuration
 */
export interface ActionsColumnConfig<T> {
  items: (entity: T) => ActionItem[];
  copyId?: {
    label?: string;
    getId: (entity: T) => string;
  };
}

/**
 * Generic column builder configuration
 */
export interface GenericColumnsConfig<T> {
  // Base columns
  enableSelection?: boolean;
  profileColumn?: ProfileColumnConfig<T>;
  statusColumn?: StatusColumnConfig<T>;
  actionsColumn?: ActionsColumnConfig<T>;

  // Custom columns (for entity-specific fields)
  customColumns?: ColumnDef<T>[];

  // Handlers
  onSortChange?: (columnId: string, desc: boolean) => void;
  onHideClick?: (columnId: string) => void;
}

// =============================================================================
// Column Builders
// =============================================================================

/**
 * Creates a selection checkbox column
 */
function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Creates a profile column with avatar + name + subtitle
 */
function createProfileColumn<T>(
  config: ProfileColumnConfig<T>,
  onSortChange?: (columnId: string, desc: boolean) => void,
  onHideClick?: (columnId: string) => void,
): ColumnDef<T> {
  const {
    nameField,
    subtitleField,
    showAvatar = true,
    avatarLetter,
    avatarClassName,
    nameClassName,
    subtitleClassName,
  } = config;

  return {
    accessorKey: nameField,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" onSortChange={onSortChange} onHideClick={onHideClick} />
    ),
    cell: ({ row }) => {
      const entity = row.original;
      const name = String(entity[nameField] || "");
      const letter = avatarLetter ? avatarLetter(entity) : name.charAt(0).toUpperCase();

      let subtitle: string | undefined;
      if (subtitleField) {
        if (typeof subtitleField === "function") {
          subtitle = subtitleField(entity);
        } else {
          subtitle = entity[subtitleField] as string | undefined;
        }
      }

      return (
        <div className="flex items-center gap-3">
          {showAvatar && (
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm",
                avatarClassName,
              )}
            >
              {letter}
            </div>
          )}
          <div className="flex flex-col">
            <span className={cn("font-medium", nameClassName)}>{name}</span>
            {subtitle && <span className={cn("text-muted-foreground text-xs", subtitleClassName)}>{subtitle}</span>}
          </div>
        </div>
      );
    },
  };
}

/**
 * Creates a status badge column
 */
function createStatusColumn<T>(
  config: StatusColumnConfig<T>,
  onSortChange?: (columnId: string, desc: boolean) => void,
  onHideClick?: (columnId: string) => void,
): ColumnDef<T> {
  const { field, getStatus } = config;

  return {
    accessorKey: field,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" onSortChange={onSortChange} onHideClick={onHideClick} />
    ),
    cell: ({ row }) => {
      const value = row.getValue(field);
      const status = getStatus(value);
      return (
        <Badge variant={status.variant} className={cn("capitalize", status.className)}>
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  };
}

/**
 * Creates an actions dropdown column
 */
function createActionsColumn<T>(config: ActionsColumnConfig<T>): ColumnDef<T> {
  const { items, copyId } = config;

  return {
    id: "actions",
    cell: ({ row }) => {
      const entity = row.original;
      const actionItems = items(entity);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {copyId && (
              <>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(copyId.getId(entity))}>
                  {copyId.label || "Copy ID"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {actionItems.map((item, index, arr) => {
              if ("variant" in item && item.variant === "separator") {
                const prevItem = index > 0 ? arr[index - 1] : null;
                const nextItem = index < arr.length - 1 ? arr[index + 1] : null;
                const prevLabel = prevItem && isActionItemWithLabel(prevItem) ? prevItem.label : "";
                const nextLabel = nextItem && isActionItemWithLabel(nextItem) ? nextItem.label : "";
                return <DropdownMenuSeparator key={`sep-${prevLabel}-${nextLabel}`} />;
              }

              return (
                <DropdownMenuItem
                  key={"label" in item ? item.label : `item-${index}`}
                  className={"variant" in item && item.variant === "destructive" ? "text-red-600" : ""}
                  onClick={"onClick" in item ? item.onClick : undefined}
                  disabled={"disabled" in item ? item.disabled : false}
                >
                  {"icon" in item && item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {"label" in item && item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

// =============================================================================
// Main Builder Function
// =============================================================================

/**
 * Creates generic columns for any entity type
 *
 * @example
 * ```ts
 * const columns = createEntityColumns<Student>({
 *   enableSelection: true,
 *   profileColumn: {
 *     nameField: "name",
 *     subtitleField: "email",
 *   },
 *   statusColumn: {
 *     field: "isActive",
 *     getStatus: (value) => ({
 *       label: value ? "Active" : "Inactive",
 *       variant: value ? "default" : "secondary",
 *       className: value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
 *     }),
 *   },
 *   actionsColumn: {
 *     items: (student) => [
 *       { label: "View details", onClick: () => onViewDetails(student.id) },
 *       { label: "Edit", onClick: () => onEdit(student.id) },
 *       { variant: "separator" },
 *       { label: "Delete", variant: "destructive", onClick: () => onDelete(student.id) },
 *     ],
 *     copyId: { getId: (student) => student.id },
 *   },
 *   onSortChange,
 *   onHideClick,
 * });
 * ```
 */
export function createEntityColumns<T>(config: GenericColumnsConfig<T>): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [];

  // Add selection column
  if (config.enableSelection) {
    columns.push(createSelectionColumn());
  }

  // Add profile column
  if (config.profileColumn) {
    columns.push(createProfileColumn(config.profileColumn, config.onSortChange, config.onHideClick));
  }

  // Add custom columns (entity-specific fields)
  if (config.customColumns) {
    columns.push(...config.customColumns);
  }

  // Add status column
  if (config.statusColumn) {
    columns.push(createStatusColumn(config.statusColumn, config.onSortChange, config.onHideClick));
  }

  // Add actions column
  if (config.actionsColumn) {
    columns.push(createActionsColumn(config.actionsColumn));
  }

  return columns;
}

/**
 * Creates a simple text column for basic fields
 */
export function createTextColumn<T>({
  accessorKey,
  header,
  cellClassName,
  onSortChange,
  onHideClick,
}: {
  accessorKey: keyof T & string;
  header: string;
  cellClassName?: string;
  onSortChange?: (columnId: string, desc: boolean) => void;
  onHideClick?: (columnId: string) => void;
}): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} onSortChange={onSortChange} onHideClick={onHideClick} />
    ),
    cell: ({ row }) => <span className={cn("text-sm", cellClassName)}>{String(row.getValue(accessorKey) || "-")}</span>,
  };
}

/**
 * Creates a badge column for enum/reference fields
 */
export function createBadgeColumn<T>({
  accessorKey,
  header,
  getBadge,
  onSortChange,
  onHideClick,
}: {
  accessorKey: keyof T & string;
  header: string;
  getBadge: (value: unknown) => { label: string; variant?: "default" | "secondary" | "outline"; className?: string };
  onSortChange?: (columnId: string, desc: boolean) => void;
  onHideClick?: (columnId: string) => void;
}): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} onSortChange={onSortChange} onHideClick={onHideClick} />
    ),
    cell: ({ row }) => {
      const value = row.getValue(accessorKey);
      const badge = getBadge(value);
      return (
        <Badge variant={badge.variant} className={cn("text-xs", badge.className)}>
          {badge.label}
        </Badge>
      );
    },
  };
}
