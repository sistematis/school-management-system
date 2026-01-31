/**
 * C_BP_Group Types
 * Business Partner Group types for iDempiere REST API
 *
 * Reference: /api/v1/models/c_bp_group
 */

// =============================================================================
// Reference Types
// =============================================================================

export interface AdClientIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface AdOrgIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface CreatedByRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface UpdatedByRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface PriorityBaseRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// C_BP_Group Types
// =============================================================================

/**
 * Single C_BP_Group record from the API
 */
export interface CBPGroup {
  id: number;
  uid: string;
  AD_Client_ID: AdClientIdRef;
  AD_Org_ID: AdOrgIdRef;
  IsActive: boolean;
  Created: string;
  CreatedBy: CreatedByRef;
  Updated: string;
  UpdatedBy: UpdatedByRef;
  Value: string;
  Name: string;
  IsDefault: boolean;
  IsConfidentialInfo: boolean;
  PriorityBase: PriorityBaseRef;
  "model-name": string;
}

/**
 * API Response for C_BP_Group query
 * Returns paginated list of business partner groups
 */
export interface CBPGroupResponse {
  "page-count": number;
  "records-size": number;
  "skip-records": number;
  "row-count": number;
  "array-count": number;
  records: CBPGroup[];
}

/**
 * Simplified BP group option for dropdown/select components
 */
export interface BPGroupOption {
  id: number;
  name: string;
  value: string;
  isDefault: boolean;
}
