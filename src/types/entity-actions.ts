// src/types/entity-actions.ts

import type { ComponentType } from "react";

/**
 * Document Status iDempiere (sesuai backend)
 */
export type DocumentStatus =
  | "??" // Unknown
  | "AP" // Approved
  | "CL" // Closed
  | "CO" // Completed
  | "DR" // Drafted
  | "IN" // Invalid
  | "IP" // In Progress
  | "NA" // Not Approved
  | "RE" // Reversed
  | "VO" // Voided
  | "WC" // Waiting Confirmation
  | "WP"; // Waiting Payment

/**
 * Document Action iDempiere (sesuai backend)
 * "--" berarti no action
 */
export type DocumentAction =
  | "--" // None
  | "AP" // Approve
  | "CL" // Close
  | "CO" // Complete
  | "IN" // Invalidate
  | "PO" // Post
  | "PR" // Prepare
  | "RA" // Reverse - Accrual
  | "RC" // Reverse - Correct
  | "RE" // Re-activate
  | "RJ" // Reject
  | "VO" // Void
  | "WC" // Wait Complete
  | "XL"; // Unlock

/**
 * Base interface untuk document entity
 */
export interface DocumentEntity {
  id: string;
  docStatus: DocumentStatus;
  processing?: boolean; // Untuk kondisi Unlock
}

/**
 * Custom action item config
 */
export interface ActionItemConfig<T = any> {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
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
  icon?: ComponentType<{ className?: string }>;
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
