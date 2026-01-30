// src/lib/actions/index.ts

/**
 * Entity Actions System
 *
 * Reusable action system for master data and document entities.
 */

// Types
export type {
  ActionItemConfig,
  DocumentAction,
  DocumentActionConfig,
  DocumentActionDefinition,
  DocumentEntity,
  DocumentStatus,
  MasterDataActionConfig,
} from "@/types/entity-actions";

// Utilities
export { copyIdToClipboard, executeDocumentAction, getDocumentActionLabel, withActionHandler } from "./action-utils";
export { buildDocumentActions } from "./build-document-actions";
// Builders
export { buildMasterDataActions } from "./build-master-data-actions";
// Registry
export { documentActionRegistry, getAllowedDocumentActions, isDocumentActionAllowed } from "./document-action-registry";
