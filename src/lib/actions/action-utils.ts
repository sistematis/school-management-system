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
    AP: "Approve",
    CL: "Close",
    CO: "Complete",
    IN: "Invalidate",
    PO: "Post",
    PR: "Prepare",
    RA: "Reverse - Accrual",
    RC: "Reverse - Correct",
    RE: "Re-activate",
    RJ: "Reject",
    VO: "Void",
    WC: "Wait Complete",
    XL: "Unlock",
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
export async function executeDocumentAction(entityId: string, action: DocumentAction): Promise<void> {
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
