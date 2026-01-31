/**
 * AD_User Model Types
 * User/Contact entity for user login and contacts
 *
 * Reference: /api/v1/models/ad_user
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

export interface SupervisorIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface NotificationTypeRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

export interface CBpartnerIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface CGreetingIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface CBpartnerLocationIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface CLocationIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
  AD_Client_ID: AdClientId2;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  AD_Org_ID: AdOrgId2;
  C_Country_ID: CCountryId;
  City: string;
  C_Location_UU: string;
  Created: string;
  CreatedBy: string;
  IsActive: string;
  IsValid: string;
  Postal: string;
  Updated: string;
  UpdatedBy: string;
}

export interface AdClientId2 {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface AdOrgId2 {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface CCountryId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * AD_User entity from iDempiere REST API
 * Complete response from endpoint /api/v1/models/ad_user
 */
export interface ADUser {
  id: number;
  uid: string;
  Name: string;
  Description?: string;
  AD_Client_ID: AdClientIdRef;
  AD_Org_ID: AdOrgIdRef;
  IsActive: boolean;
  Created: string;
  CreatedBy: CreatedByRef;
  Updated: string;
  UpdatedBy: UpdatedByRef;
  EMail?: string;
  Supervisor_ID?: SupervisorIdRef;
  NotificationType: NotificationTypeRef;
  IsFullBPAccess: boolean;
  Value: string;
  IsInPayroll: boolean;
  IsSalesLead: boolean;
  IsLocked: boolean;
  FailedLoginCount: number;
  IsNoPasswordReset: boolean;
  IsExpired: boolean;
  IsAddMailTextAutomatically: boolean;
  IsNoExpire: boolean;
  IsSupportUser: boolean;
  IsShipTo: boolean;
  IsBillTo: boolean;
  IsVendorLead: boolean;
  "model-name": string;
  C_BPartner_ID?: CBpartnerIdRef;
  DatePasswordChanged?: string;
  Phone?: string;
  C_Greeting_ID?: CGreetingIdRef;
  Phone2?: string;
  Birthday?: string;
  C_BPartner_Location_ID?: CBpartnerLocationIdRef;
  Title?: string;
  Comments?: string;
  C_Location_ID?: CLocationIdRef;
  DateLastLogin?: string;
}

/**
 * API Response for AD_User query
 * Returns paginated list of users
 */
export interface ADUserResponse {
  "page-count": number;
  "records-size": number;
  "skip-records": number;
  "row-count": number;
  "array-count": number;
  records: ADUser[];
}

/**
 * ADUser in expand (limited fields)
 * For response when expanded from other entities
 */
export interface ADUserExpanded {
  id: number;
  uid: string;
  Name: string;
  EMail?: string;
  Birthday?: string;
  Value: string;
}

/**
 * Partial type for create/update operations
 */
export type ADUserCreate = Partial<
  Omit<
    ADUser,
    "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy" | "NotificationType"
  >
>;

/**
 * Simplified user option for dropdown/select components
 */
export interface UserOption {
  id: number;
  name: string;
  value: string;
  email?: string;
}
