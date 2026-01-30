// src/lib/actions/build-document-actions.ts

import { Eye, Pencil, Trash2 } from "lucide-react";

import type { ActionItem } from "@/components/data-table";
import type { DocumentActionConfig, DocumentEntity } from "@/types/entity-actions";

import { documentActionRegistry, isDocumentActionAllowed } from "./document-action-registry";

/**
 * Build action items untuk document entity
 *
 * Flow: View → Edit (jika DR/IP) → Separator → Workflow Actions (filtered by status) → Delete (jika DR/IP)
 *
 * @example
 * ```ts
 * const items = buildDocumentActions(purchaseOrderActionConfig, purchaseOrder);
 * // Returns actions filtered by docStatus
 * ```
 */
export function buildDocumentActions<T extends DocumentEntity>(
  config: DocumentActionConfig<T>,
  entity: T,
): ActionItem[] {
  const items: ActionItem[] = [];
  const status = entity.docStatus;

  // Helper: Cek jika edit/delete diperbolehkan (hanya Draft/In Progress)
  const canModify = status === "DR" || status === "IP";

  // 1. View Action - selalu tersedia
  if (config.enableView) {
    items.push({
      label: "View details",
      icon: Eye,
      onClick: () => config.onView?.(entity),
    });
  }

  // 2. Edit Action - hanya jika Draft/In Progress
  if (config.enableEdit && canModify) {
    items.push({
      label: "Edit",
      icon: Pencil,
      onClick: () => config.onEdit?.(entity),
    });
  }

  // 3. Separator sebelum workflow actions (jika ada)
  if (config.workflowActions.length > 0) {
    items.push({ variant: "separator" });

    // 4. Build workflow actions berdasarkan config + filter by status
    for (const actionOrSep of config.workflowActions) {
      if (actionOrSep === "separator") {
        items.push({ variant: "separator" });
        continue;
      }

      // Get action definition dari registry
      const actionDef = documentActionRegistry[actionOrSep];

      if (!actionDef) {
        console.warn(`Unknown document action: ${actionOrSep}`);
        continue;
      }

      // Filter: Hanya tampilkan jika status mengizinkan atau processing=true untuk Unlock
      const isAllowed = isDocumentActionAllowed(actionOrSep, status, entity.processing);

      if (isAllowed) {
        items.push({
          label: actionDef.label,
          icon: actionDef.icon,
          variant: actionDef.variant,
          onClick: () => {
            // Gunakan custom handler jika ada, fallback ke registry handler
            if (config.onWorkflowAction) {
              config.onWorkflowAction(entity, actionOrSep);
            } else {
              actionDef.handler(entity);
            }
          },
        });
      }
    }
  }

  // 5. Custom Actions (if any)
  if (config.customActions && config.customActions.length > 0) {
    items.push({ variant: "separator" });

    for (const custom of config.customActions) {
      items.push({
        label: custom.label,
        icon: custom.icon,
        disabled: custom.disabled,
        onClick: () => custom.onClick(entity),
      });
    }
  }

  // 6. Delete Action - hanya jika Draft/In Progress
  if (config.enableDelete && canModify) {
    // Add separator if previous item is not separator
    const lastItem = items[items.length - 1];
    if (!lastItem || (lastItem as ActionItem).variant !== "separator") {
      items.push({ variant: "separator" });
    }

    items.push({
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: () => config.onDelete?.(entity),
    });
  }

  // Remove trailing separator if any
  const lastItem = items[items.length - 1];
  if (lastItem && (lastItem as ActionItem).variant === "separator") {
    items.pop();
  }

  return items;
}
