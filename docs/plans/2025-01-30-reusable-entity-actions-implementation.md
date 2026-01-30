# Reusable Entity Actions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable and dynamic UI/UX system for entity actions (CRUD + document workflow) that can be used across multiple pages.

**Architecture:** Action Registry + Entity Config Pattern. Central registry defines all actions, entity-specific configs select which actions to show and in what order. Builder functions filter actions by document status and produce ActionItem[] for the dropdown.

**Tech Stack:** TypeScript, React, TanStack Table, Sonner (toast), Lucide icons

---

## Task 1: Create Type Definitions

**Files:**
- Create: `src/types/entity-actions.ts`

**Step 1: Create the type definitions file**

```typescript
// src/types/entity-actions.ts

/**
 * Document Status iDempiere (sesuai backend)
 */
export type DocumentStatus =
  | "??"   // Unknown
  | "AP"   // Approved
  | "CL"   // Closed
  | "CO"   // Completed
  | "DR"   // Drafted
  | "IN"   // Invalid
  | "IP"   // In Progress
  | "NA"   // Not Approved
  | "RE"   // Reversed
  | "VO"   // Voided
  | "WC"   // Waiting Confirmation
  | "WP";  // Waiting Payment

/**
 * Document Action iDempiere (sesuai backend)
 * "--" berarti no action
 */
export type DocumentAction =
  | "--"   // None
  | "AP"   // Approve
  | "CL"   // Close
  | "CO"   // Complete
  | "IN"   // Invalidate
  | "PO"   // Post
  | "PR"   // Prepare
  | "RA"   // Reverse - Accrual
  | "RC"   // Reverse - Correct
  | "RE"   // Re-activate
  | "RJ"   // Reject
  | "VO"   // Void
  | "WC"   // Wait Complete
  | "XL";  // Unlock

/**
 * Base interface untuk document entity
 */
export interface DocumentEntity {
  id: string;
  docStatus: DocumentStatus;
  processing?: boolean;  // Untuk kondisi Unlock
}

/**
 * Custom action item config
 */
export interface ActionItemConfig<T = any> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onClick: (entity: T) => void | Promise<void>;
}

/**
 * Document action definition
 */
export interface DocumentActionDefinition {
  id: DocumentAction;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  allowedFromStatuses: DocumentStatus[];
  handler: (entity: DocumentEntity) => void | Promise<void>;
}

/**
 * Config untuk master data entity (Product, User, Business Partner)
 */
export interface MasterDataActionConfig<T = any> {
  entityName: string;
  enableView?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onView?: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  copyId?: {
    getId: (entity: T) => string;
    label?: string;
  };
  customActions?: ActionItemConfig<T>[];
}

/**
 * Config untuk document entity (PO, Invoice, Material Receipt)
 */
export interface DocumentActionConfig<T extends DocumentEntity = any> {
  entityName: string;
  enableView?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  workflowActions: (DocumentAction | "separator")[];
  onView?: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  onWorkflowAction?: (entity: T, action: DocumentAction) => void;
  copyId?: {
    getId: (entity: T) => string;
    label?: string;
  };
  customActions?: ActionItemConfig<T>[];
}
```

**Step 2: Run TypeScript check**

Run: `npm run type-check` or `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/entity-actions.ts
git commit -m "feat(types): add entity action type definitions

Add DocumentStatus, DocumentAction, and config types for master data
and document entity action system.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 2: Create Action Utilities

**Files:**
- Create: `src/lib/actions/action-utils.ts`

**Step 1: Create action utility functions**

```typescript
// src/lib/actions/action-utils.ts

import { toast } from "sonner";
import type { DocumentAction, DocumentEntity } from "@/types/entity-actions";

/**
 * Wrapper untuk action handler dengan error handling dan toast notification
 */
export function withActionHandler<T>(
  handler: (entity: T) => void | Promise<void>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    confirmMessage?: string;
  },
) {
  return async (entity: T) => {
    // Confirm jika ada
    if (options?.confirmMessage) {
      const confirmed = confirm(options.confirmMessage);
      if (!confirmed) return;
    }

    try {
      await handler(entity);

      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
    } catch (error) {
      console.error("Action failed:", error);
      const message = options?.errorMessage || "Action failed. Please try again.";
      toast.error(message);
    }
  };
}

/**
 * Get document action definition info (label, etc.) for display
 * This is a placeholder - actual registry will be imported when needed
 */
export function getDocumentActionLabel(action: DocumentAction): string {
  const labels: Record<DocumentAction, string> = {
    "--": "No Action",
    "AP": "Approve",
    "CL": "Close",
    "CO": "Complete",
    "IN": "Invalidate",
    "PO": "Post",
    "PR": "Prepare",
    "RA": "Reverse - Accrual",
    "RC": "Reverse - Correct",
    "RE": "Re-activate",
    "RJ": "Reject",
    "VO": "Void",
    "WC": "Wait Complete",
    "XL": "Unlock",
  };
  return labels[action] || action;
}

/**
 * Copy ID to clipboard helper
 */
export function copyIdToClipboard(id: string, label?: string): void {
  navigator.clipboard.writeText(id);
  toast.success(label ? `${label} copied` : "ID copied");
}

/**
 * Execute document action with automatic toast
 * NOTE: This is a placeholder - actual API integration will be done separately
 */
export async function executeDocumentAction(
  entityId: string,
  action: DocumentAction,
): Promise<void> {
  // TODO: Implement actual API call to iDempiere
  // This will be implemented when we have document entity endpoints

  const response = await fetch(`/api/idempiere/documents/${entityId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docAction: action }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `Failed to execute action ${action}`);
  }

  toast.success(`${getDocumentActionLabel(action)} successful`);
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/actions/action-utils.ts
git commit -m "feat(actions): add action utility functions

Add withActionHandler wrapper, copyIdToClipboard, and
executeDocumentAction placeholder with toast notifications.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 3: Create Document Action Registry

**Files:**
- Create: `src/lib/actions/document-action-registry.ts`

**Step 1: Create document action registry**

```typescript
// src/lib/actions/document-action-registry.ts

import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  LockOpen,
  FileCheck,
  Send,
  PauseCircle,
} from "lucide-react";
import type { DocumentActionDefinition, DocumentAction, DocumentStatus } from "@/types/entity-actions";
import { executeDocumentAction } from "./action-utils";

/**
 * Complete registry untuk document actions iDempiere
 *
 * Reference: iDempiere Document Action Reference
 * AP=Approve, CL=Close, CO=Complete, IN=Invalidate, PO=Post,
 * PR=Prepare, RA=Reverse Accrual, RC=Reverse Correct, RE=Re-activate,
 * RJ=Reject, VO=Void, WC=Wait Complete, XL=Unlock
 */
export const documentActionRegistry: Record<DocumentAction, DocumentActionDefinition> = {
  "--": {
    id: "--",
    label: "No Action",
    description: "No action available",
    allowedFromStatuses: [],
    handler: () => {
      // No-op
    },
  },

  AP: {
    id: "AP",
    label: "Approve",
    description: "Approve this transaction",
    icon: Send,
    allowedFromStatuses: ["DR", "IP", "NA", "WC", "WP"],
    handler: async (doc) => await executeDocumentAction(doc.id, "AP"),
  },

  CL: {
    id: "CL",
    label: "Close",
    description: "Finally close this transaction. It cannot be re-activated.",
    icon: XCircle,
    variant: "destructive",
    allowedFromStatuses: ["CO"],
    handler: async (doc) => {
      if (confirm("Are you sure you want to close this document? It cannot be re-activated.")) {
        await executeDocumentAction(doc.id, "CL");
      }
    },
  },

  CO: {
    id: "CO",
    label: "Complete",
    description: "Generate documents and complete transaction",
    icon: FileCheck,
    allowedFromStatuses: ["DR", "IP", "WC", "WP"],
    handler: async (doc) => await executeDocumentAction(doc.id, "CO"),
  },

  IN: {
    id: "IN",
    label: "Invalidate",
    description: "Invalidate Document",
    icon: Ban,
    variant: "destructive",
    allowedFromStatuses: ["DR", "IP", "WC", "WP"],
    handler: async (doc) => {
      if (confirm("Are you sure you want to invalidate this document?")) {
        await executeDocumentAction(doc.id, "IN");
      }
    },
  },

  PO: {
    id: "PO",
    label: "Post",
    description: "Post transaction",
    allowedFromStatuses: ["DR", "IP"],
    handler: async (doc) => await executeDocumentAction(doc.id, "PO"),
  },

  PR: {
    id: "PR",
    label: "Prepare",
    description: "Check Document consistency and check Inventory",
    icon: CheckCircle,
    allowedFromStatuses: ["DR", "WC", "WP"],
    handler: async (doc) => await executeDocumentAction(doc.id, "PR"),
  },

  RA: {
    id: "RA",
    label: "Reverse - Accrual",
    description: "Reverse by switching Dr/Cr with current date",
    icon: RotateCcw,
    allowedFromStatuses: ["CO", "CL"],
    handler: async (doc) => {
      if (confirm("Reverse this document with current date?")) {
        await executeDocumentAction(doc.id, "RA");
      }
    },
  },

  RC: {
    id: "RC",
    label: "Reverse - Correct",
    description: "Reverse Transaction (correction) by reversing sign with same date",
    icon: RotateCcw,
    allowedFromStatuses: ["CO"],
    handler: async (doc) => {
      if (confirm("Reverse this document keeping the same date?")) {
        await executeDocumentAction(doc.id, "RC");
      }
    },
  },

  RE: {
    id: "RE",
    label: "Re-activate",
    description: "Reopen Document and Reverse automatically generated documents",
    icon: RotateCcw,
    allowedFromStatuses: ["CO", "CL", "RE", "VO", "IN"],
    handler: async (doc) => {
      if (confirm("Re-activate this document? This will reverse generated documents.")) {
        await executeDocumentAction(doc.id, "RE");
      }
    },
  },

  RJ: {
    id: "RJ",
    label: "Reject",
    description: "Reject the approval of the document",
    icon: XCircle,
    variant: "destructive",
    allowedFromStatuses: ["AP", "WC", "WP"],
    handler: async (doc) => {
      if (confirm("Reject this document?")) {
        await executeDocumentAction(doc.id, "RJ");
      }
    },
  },

  VO: {
    id: "VO",
    label: "Void",
    description: "Set all quantities to zero and complete transaction",
    icon: Ban,
    variant: "destructive",
    allowedFromStatuses: ["DR", "IP", "WC", "WP", "CO"],
    handler: async (doc) => {
      if (confirm("Are you sure you want to void this document?")) {
        await executeDocumentAction(doc.id, "VO");
      }
    },
  },

  WC: {
    id: "WC",
    label: "Wait Complete",
    description: "Wait Condition ok Complete Document",
    icon: PauseCircle,
    allowedFromStatuses: ["DR", "IP", "WC", "WP"],
    handler: async (doc) => await executeDocumentAction(doc.id, "WC"),
  },

  XL: {
    id: "XL",
    label: "Unlock",
    description: "Unlock Transaction (process error)",
    icon: LockOpen,
    allowedFromStatuses: ["??", "DR", "IP", "WC", "WP"], // Can unlock if processing=true
    handler: async (doc) => {
      if (confirm("Unlock this document? Use this only when there's a process error.")) {
        await executeDocumentAction(doc.id, "XL");
      }
    },
  },
};

/**
 * Helper to check if a document action is allowed for a given status
 */
export function isDocumentActionAllowed(
  action: DocumentAction,
  status: DocumentStatus,
  processing?: boolean,
): boolean {
  const actionDef = documentActionRegistry[action];

  if (!actionDef) {
    console.warn(`Unknown document action: ${action}`);
    return false;
  }

  // XL (Unlock) is special - can be used if processing=true
  if (action === "XL" && processing === true) {
    return true;
  }

  return actionDef.allowedFromStatuses.includes(status);
}

/**
 * Get all allowed actions for a document's current status
 */
export function getAllowedDocumentActions(
  status: DocumentStatus,
  processing?: boolean,
): DocumentAction[] {
  return (Object.keys(documentActionRegistry) as DocumentAction[])
    .filter((action) => isDocumentActionAllowed(action, status, processing));
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/actions/document-action-registry.ts
git commit -m "feat(actions): add document action registry

Add complete iDempiere document action definitions with
allowedFromStatuses filtering, icons, and helper functions.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 4: Create Master Data Action Builder

**Files:**
- Create: `src/lib/actions/build-master-data-actions.ts`

**Step 1: Create master data action builder**

```typescript
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
export function buildMasterDataActions<T>(
  config: MasterDataActionConfig<T>,
  entity: T,
): ActionItem[] {
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
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/actions/build-master-data-actions.ts
git commit -m "feat(actions): add master data action builder

Add buildMasterDataActions function that generates ActionItem[]
for master data entities with View, Edit, custom, and Delete actions.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 5: Create Document Action Builder

**Files:**
- Create: `src/lib/actions/build-document-actions.ts`

**Step 1: Create document action builder**

```typescript
// src/lib/actions/build-document-actions.ts

import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ActionItem } from "@/components/data-table";
import type { DocumentActionConfig, DocumentEntity, DocumentAction } from "@/types/entity-actions";
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
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/actions/build-document-actions.ts
git commit -m "feat(actions): add document action builder

Add buildDocumentActions function that generates ActionItem[]
for document entities with status-filtered workflow actions.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 6: Create Actions Index File

**Files:**
- Create: `src/lib/actions/index.ts`

**Step 1: Create index file for actions**

```typescript
// src/lib/actions/index.ts

/**
 * Entity Actions System
 *
 * Reusable action system for master data and document entities.
 */

// Types
export type {
  DocumentStatus,
  DocumentAction,
  DocumentEntity,
  ActionItemConfig,
  DocumentActionDefinition,
  MasterDataActionConfig,
  DocumentActionConfig,
} from "@/types/entity-actions";

// Utilities
export { withActionHandler, copyIdToClipboard, executeDocumentAction, getDocumentActionLabel } from "./action-utils";

// Registry
export { documentActionRegistry, isDocumentActionAllowed, getAllowedDocumentActions } from "./document-action-registry";

// Builders
export { buildMasterDataActions } from "./build-master-data-actions";
export { buildDocumentActions } from "./build-document-actions";
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/actions/index.ts
git commit -m "feat(actions): add actions index file

Create central export point for entity actions system.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 7: Update Data Table Index Exports

**Files:**
- Modify: `src/components/data-table/index.ts`

**Step 1: Update data-table index to export action types**

Read the existing file and add exports for action-related types.

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/data-table/index.ts
git commit -m "feat(data-table): export entity action types

Export MasterDataActionConfig and DocumentActionConfig from
data-table index for easier imports.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 8: Create Student Action Config

**Files:**
- Create: `src/config/actions/student-actions.ts`

**Step 1: Create student action config**

```typescript
// src/config/actions/student-actions.ts

import type { MasterDataActionConfig } from "@/types/entity-actions";
import type { Student } from "@/lib/types/students";
import { copyIdToClipboard } from "@/lib/actions";

/**
 * Student action configuration
 * Uses master data config since students don't have document workflow
 */
export const studentActionConfig: MasterDataActionConfig<Student> = {
  entityName: "student",

  enableView: true,
  enableEdit: true,
  enableDelete: true,

  // Default handlers - akan di-override di page level
  onView: (student) => {
    console.log("View student:", student.id);
    // Implementation: open drawer or navigate
  },

  onEdit: (student) => {
    console.log("Edit student:", student.id);
    // Implementation: navigate to edit page
    window.location.href = `/academic/students/${student.id}/edit`;
  },

  onDelete: async (student) => {
    console.log("Delete student:", student.id);
    // Implementation: call delete API
    // This will be overridden by the page's actual handler
  },

  copyId: {
    getId: (s) => s.id,
    label: "Copy Student ID",
  },
};
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/config/actions/student-actions.ts
git commit -m "feat(config): add student action config

Create master data action configuration for Student entity.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 9: Update Students Page to Use New Action System

**Files:**
- Modify: `src/app/(main)/academic/students/columns.tsx`

**Step 1: Update student columns to use action builder**

```typescript
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
import { buildMasterDataActions } from "@/lib/actions";
import { studentActionConfig } from "@/config/actions/student-actions";

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
        onView: onViewDetails
          ? (s) => onViewDetails(s.id)
          : studentActionConfig.onView,
        onEdit: onEditStudent
          ? (s) => onEditStudent(s.id)
          : studentActionConfig.onEdit,
        onDelete: onDeleteStudent
          ? (s) => onDeleteStudent(s.id)
          : studentActionConfig.onDelete,
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
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Test locally**

Run: `npm run dev`
Expected: Students page loads, actions dropdown works with View, Edit, Delete

**Step 4: Commit**

```bash
git add src/app/(main)/academic/students/columns.tsx
git commit -m "feat(students): use reusable action builder

Update student columns to use buildMasterDataActions and
studentActionConfig for consistent, reusable action handling.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 10: Verify Implementation

**Files:**
- No file changes - testing only

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Check build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Manual testing**

1. Open students page: `http://localhost:3000/academic/students`
2. Click the actions dropdown (three dots)
3. Verify actions appear: View details, Edit, Delete
4. Test each action works

**Step 4: Create documentation update**

Update the design document to mark implementation complete.

**Step 5: Final commit**

```bash
git add docs/plans/2025-01-30-reusable-entity-actions-design.md
git commit -m "docs: mark entity actions implementation complete

Update design document with implementation status.

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Summary

After completing all tasks, you will have:

1. **Type definitions** for document statuses and actions matching iDempiere
2. **Document action registry** with all 14 actions (AP, CL, CO, IN, PO, PR, RA, RC, RE, RJ, VO, WC, XL, --)
3. **Action builders** for master data and document entities
4. **Utility functions** for toast notifications, error handling, and clipboard operations
5. **Student action config** as first example implementation
6. **Updated students page** using the new system

The system is now ready to be used for other entities:
- For master data: Create config like `studentActionConfig`
- For documents: Create config with `workflowActions` array like `purchaseOrderActionConfig`

---

## Future Enhancements (Optional)

These are NOT part of this implementation plan but can be added later:

1. **Loading states** - Show loading spinner during async actions
2. **Keyboard shortcuts** - Ctrl+E for edit, Ctrl+D for delete
3. **Better confirm dialogs** - Replace `confirm()` with shadcn AlertDialog
4. **Bulk actions** - Support for multi-select actions
5. **Action permissions** - Role-based action visibility
