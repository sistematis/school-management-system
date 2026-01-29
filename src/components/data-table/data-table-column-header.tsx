"use no memo";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  onSortChange?: (columnId: string, desc: boolean) => void;
  onHideClick?: (columnId: string) => void;
}

function getSortIcon(sort: "asc" | "desc" | false | undefined) {
  switch (sort) {
    case "desc":
      return <ArrowDown />;
    case "asc":
      return <ArrowUp />;
    default:
      return <ChevronsUpDown />;
  }
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  onSortChange,
  onHideClick,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  // Direct click handlers - call parent callback if provided, otherwise use TanStack Table's method
  const handleSortAsc = () => {
    console.log("[ColumnHeader] Asc clicked for column:", column.id);
    if (onSortChange) {
      onSortChange(column.id, false);
    } else {
      column.toggleSorting(false);
    }
  };

  const handleSortDesc = () => {
    console.log("[ColumnHeader] Desc clicked for column:", column.id);
    if (onSortChange) {
      onSortChange(column.id, true);
    } else {
      column.toggleSorting(true);
    }
  };

  const handleHide = () => {
    console.log("[ColumnHeader] Hide clicked for column:", column.id);
    if (onHideClick) {
      onHideClick(column.id);
    } else {
      column.toggleVisibility(false);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{title}</span>
            {getSortIcon(isSorted)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleSortAsc}>
            <ArrowUp className="size-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSortDesc}>
            <ArrowDown className="size-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          {column.columnDef.enableHiding !== false && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleHide}>
                <EyeOff className="size-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
