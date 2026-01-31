/**
 * AD_Role Types
 * System Role types for iDempiere REST API
 *
 * Reference: /api/v1/models/ad_role
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

export interface UserLevelRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

export interface PreferenceTypeRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

export interface RoleTypeRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// AD_Role Types
// =============================================================================

/**
 * Single AD_Role record from the API
 */
export interface ADRole {
  id: number;
  uid: string;
  Name: string;
  Description?: string;
  UserLevel: UserLevelRef;
  AD_Client_ID: AdClientIdRef;
  AD_Org_ID: AdOrgIdRef;
  IsActive: boolean;
  Created: string;
  CreatedBy: CreatedByRef;
  Updated: string;
  UpdatedBy: UpdatedByRef;
  AmtApproval: number;
  IsManual: boolean;
  IsPersonalAccess: boolean;
  IsShowAcct: boolean;
  IsPersonalLock: boolean;
  IsCanReport: boolean;
  IsCanExport: boolean;
  IsCanApproveOwnDoc: boolean;
  IsAccessAllOrgs: boolean;
  IsChangeLog: boolean;
  PreferenceType: PreferenceTypeRef;
  OverwritePriceLimit: boolean;
  IsUseUserOrgAccess: boolean;
  ConfirmQueryRecords: number;
  MaxQueryRecords: number;
  Allow_Info_Account: boolean;
  Allow_Info_Asset: boolean;
  Allow_Info_BPartner: boolean;
  Allow_Info_InOut: boolean;
  Allow_Info_Invoice: boolean;
  Allow_Info_Order: boolean;
  Allow_Info_Payment: boolean;
  Allow_Info_Product: boolean;
  Allow_Info_Resource: boolean;
  Allow_Info_Schedule: boolean;
  IsDiscountUptoLimitPrice: boolean;
  IsDiscountAllowedOnTotal: boolean;
  IsMenuAutoExpand: boolean;
  IsMasterRole: boolean;
  IsAccessAdvanced: boolean;
  RoleType?: RoleTypeRef;
  IsClientAdministrator: boolean;
  "model-name": string;
}

/**
 * API Response for AD_Role query
 * Returns paginated list of roles
 */
export interface ADRoleResponse {
  "page-count": number;
  "records-size": number;
  "skip-records": number;
  "row-count": number;
  "array-count": number;
  records: ADRole[];
}

/**
 * Simplified role option for dropdown/select components
 */
export interface RoleOption {
  id: number;
  name: string;
  description?: string;
}
