// src/lib/actions/document-action-registry.ts

import { Ban, CheckCircle, FileCheck, LockOpen, PauseCircle, RotateCcw, Send, XCircle } from "lucide-react";

import type { DocumentAction, DocumentActionDefinition, DocumentStatus } from "@/types/entity-actions";

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
export function isDocumentActionAllowed(action: DocumentAction, status: DocumentStatus, processing?: boolean): boolean {
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
export function getAllowedDocumentActions(status: DocumentStatus, processing?: boolean): DocumentAction[] {
  return (Object.keys(documentActionRegistry) as DocumentAction[]).filter((action) =>
    isDocumentActionAllowed(action, status, processing),
  );
}
