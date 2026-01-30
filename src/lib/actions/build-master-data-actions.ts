// src/lib/actions/build-master-data-actions.ts

import { Eye, Pencil, Trash2 } from "lucide-react";

import type { ActionItem } from "@/components/data-table";
import type { MasterDataActionConfig } from "@/types/entity-actions";

/**
 * Build action items untuk master data entity
 *
 * Flow: View → Edit → Custom Actions → Delete
 *
 * @example
 * ```ts
 * const items = buildMasterDataActions(productActionConfig, product);
 * // Returns: [{ label: "View details", ... }, { label: "Edit", ... }, ...]
 * ```
 */
export function buildMasterDataActions<T>(config: MasterDataActionConfig<T>, entity: T): ActionItem[] {
  const items: ActionItem[] = [];

  // 1. View Action
  if (config.enableView) {
    items.push({
      label: "View details",
      icon: Eye,
      onClick: () => config.onView?.(entity),
    });
  }

  // 2. Edit Action
  if (config.enableEdit) {
    items.push({
      label: "Edit",
      icon: Pencil,
      onClick: () => config.onEdit?.(entity),
    });
  }

  // 3. Separator before custom actions (if any)
  if (config.customActions && config.customActions.length > 0) {
    items.push({ variant: "separator" });

    // 4. Custom Actions
    for (const custom of config.customActions) {
      items.push({
        label: custom.label,
        icon: custom.icon,
        disabled: custom.disabled,
        onClick: () => custom.onClick(entity),
      });
    }

    // 5. Separator before delete (if enabled)
    if (config.enableDelete) {
      items.push({ variant: "separator" });
    }
  }

  // 6. Delete Action
  if (config.enableDelete) {
    items.push({
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: () => config.onDelete?.(entity),
    });
  }

  return items;
}
