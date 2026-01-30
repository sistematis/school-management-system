/**
 * Student Creation Types
 * Multi-step form types for creating students in school management system
 *
 * Flow:
 * 1. Create C_BPartner (Business Partner)
 * 2. Create C_BPartner_Location with C_Location
 * 3. Create AD_User (User Account)
 * 4. Assign AD_User_Roles (Role Assignment)
 */

// =============================================================================
// STEP 1: Business Partner Creation Types
// =============================================================================

/**
 * Request body for creating C_BPartner (Step 1)
 */
export interface StudentBPCreateRequest {
  /** Student ID/Code */
  Value: string;
  /** Full Name */
  Name: string;
  /** Middle/Last Name (optional) */
  Name2?: string;
  /** Business Partner Group ID (reference) */
  C_BP_Group_ID: number;
  /** Is Customer = true for Student */
  IsCustomer: boolean;
  /** Description/Notes */
  Description?: string;
  /** Tax ID / National ID */
  TaxID?: string;
}

/**
 * Reference types from API response
 */
export interface BPGroupIdRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

export interface SocreditstatusRef {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

/**
 * Response from creating C_BPartner
 */
export interface StudentBPCreateResponse {
  id: number;
  uid: string;
  AD_Client_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_Org_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  IsActive: boolean;
  Created: string;
  CreatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Updated: string;
  UpdatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Value: string;
  Name: string;
  Description?: string;
  SalesVolume: number;
  TaxID?: string;
  IsSummary: boolean;
  IsVendor: boolean;
  IsCustomer: boolean;
  IsProspect: boolean;
  SO_CreditLimit: number;
  SO_CreditUsed: number;
  AcqusitionCost: number;
  PotentialLifeTimeValue: number;
  ActualLifeTimeValue: number;
  ShareOfCustomer: number;
  IsEmployee: boolean;
  IsSalesRep: boolean;
  IsOneTime: boolean;
  IsTaxExempt: boolean;
  Name2?: string;
  IsDiscountPrinted: boolean;
  C_BP_Group_ID: BPGroupIdRef;
  SendEMail: boolean;
  SOCreditStatus: SocreditstatusRef;
  TotalOpenBalance: number;
  IsPOTaxExempt: boolean;
  IsManufacturer: boolean;
  Is1099Vendor: boolean;
  "model-name": string;
}

// =============================================================================
// STEP 2: Location Creation Types
// =============================================================================

/**
 * C_Location nested object for address
 */
export interface StudentLocationRequest {
  /** Address Line 1 */
  Address1: string;
  /** Address Line 2 (optional) */
  Address2?: string;
  /** Address Line 3 (optional) */
  Address3?: string;
  /** Address Line 4 (optional) */
  Address4?: string;
  /** City */
  City: string;
  /** Postal Code */
  Postal?: string;
  /** Country ID (reference) */
  C_Country_ID: number;
}

/**
 * Request body for creating C_BPartner_Location (Step 2)
 */
export interface StudentBPLocationCreateRequest {
  /** Reference to Business Partner created in Step 1 */
  C_BPartner_ID: {
    id: number;
  };
  /** Location name */
  Name: string;
  /** Nested location object */
  C_Location_ID: StudentLocationRequest;
}

/**
 * C_Location object in response
 */
export interface CLocationResponse {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
  AD_Client_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Address1: string;
  Address2?: string;
  Address3?: string;
  Address4?: string;
  AD_Org_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  C_Country_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  City: string;
  C_Location_UU: string;
  Created: string;
  CreatedBy: string;
  IsActive: string;
  IsValid: string;
  Postal?: string;
  Updated: string;
  UpdatedBy: string;
}

/**
 * Reference to C_BPartner in response
 */
export interface CBPartnerRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Response from creating C_BPartner_Location
 */
export interface StudentBPLocationCreateResponse {
  id: number;
  uid: string;
  AD_Client_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_Org_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  IsActive: boolean;
  Created: string;
  CreatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Updated: string;
  UpdatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  C_BPartner_ID: CBPartnerRef;
  C_Location_ID: CLocationResponse;
  Name: string;
  IsBillTo: boolean;
  IsShipTo: boolean;
  IsPayFrom: boolean;
  IsRemitTo: boolean;
  IsPreserveCustomName: boolean;
  "model-name": string;
}

// =============================================================================
// STEP 3: User Account Creation Types
// =============================================================================

/**
 * Reference types for AD_User creation
 */
export interface CGreetingIdRef {
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

/**
 * Request body for creating AD_User (Step 3)
 */
export interface StudentUserCreateRequest {
  /** Full Name (same as BP Name) */
  Name: string;
  /** Email address */
  EMail?: string;
  /** Greeting (Mr/Ms/Mrs) */
  C_Greeting_ID?: number;
  /** Title */
  Title?: string;
  /** Primary Phone */
  Phone?: string;
  /** Secondary Phone */
  Phone2?: string;
  /** Birthday (ISO date string: YYYY-MM-DD) */
  Birthday?: string;
  /** Comments/Notes */
  Comments?: string;
  /** Reference to Business Partner created in Step 1 */
  C_BPartner_ID: {
    id: number;
  };
  /** Reference to BP Location created in Step 2 */
  C_BPartner_Location_ID: {
    id: number;
  };
  /** Username */
  Value: string;
  /** Password */
  Password?: string;
  /** User PIN */
  UserPIN?: string;
}

/**
 * Response from creating AD_User
 */
export interface StudentUserCreateResponse {
  id: number;
  uid: string;
  Name: string;
  AD_Client_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_Org_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  IsActive: boolean;
  Created: string;
  CreatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Updated: string;
  UpdatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  EMail?: string;
  C_BPartner_ID: CBPartnerRef;
  C_Greeting_ID?: CGreetingIdRef;
  Phone2?: string;
  Birthday?: string;
  C_BPartner_Location_ID: CBPartnerRef;
  Phone?: string;
  Title?: string;
  Comments?: string;
  NotificationType: NotificationTypeRef;
  IsFullBPAccess: boolean;
  Value: string;
  IsInPayroll: boolean;
  IsSalesLead: boolean;
  IsLocked: boolean;
  FailedLoginCount: number;
  DatePasswordChanged?: string;
  IsNoPasswordReset: boolean;
  IsExpired: boolean;
  IsAddMailTextAutomatically: boolean;
  IsNoExpire: boolean;
  IsSupportUser: boolean;
  IsShipTo: boolean;
  IsBillTo: boolean;
  IsVendorLead: boolean;
  "model-name": string;
}

// =============================================================================
// STEP 4: Role Assignment Types
// =============================================================================

/**
 * Request body for creating AD_User_Roles (Step 4)
 */
export interface StudentUserRoleCreateRequest {
  /** Reference to User created in Step 3 */
  AD_User_ID: {
    id: number;
  };
  /** Role ID to assign */
  AD_Role_ID: number;
}

/**
 * Reference types in role response
 */
export interface ADRoleRef {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Response from creating AD_User_Roles
 */
export interface StudentUserRoleCreateResponse {
  uid: string;
  AD_Role_ID: ADRoleRef;
  IsActive: boolean;
  Created: string;
  CreatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  Updated: string;
  UpdatedBy: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_User_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_Client_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  AD_Org_ID: {
    propertyLabel: string;
    id: number;
    identifier: string;
    "model-name": string;
  };
  "model-name": string;
}

// =============================================================================
// Multi-Step Form State Types
// =============================================================================

/**
 * Complete student creation form data across all steps
 */
export interface StudentCreateFormData {
  // Step 1: Business Partner
  step1: {
    value: string;
    name: string;
    name2?: string;
    bpGroupId: number;
    description?: string;
    taxId?: string;
  };
  // Step 2: Location
  step2: {
    locationName: string;
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    city: string;
    postal?: string;
    countryId: number;
  };
  // Step 3: User Account
  step3: {
    email?: string;
    greetingId?: number;
    title?: string;
    phone?: string;
    phone2?: string;
    birthday?: string;
    comments?: string;
    username?: string;
    password?: string;
    userPin?: string;
  };
  // Step 4: Role
  step4: {
    roleId: number;
  };
}

/**
 * IDs returned from each step (used for subsequent steps)
 */
export interface StudentCreationContext {
  /** C_BPartner ID from Step 1 */
  bpId?: number;
  /** C_BPartner_Location ID from Step 2 */
  bpLocationId?: number;
  /** AD_User ID from Step 3 */
  userId?: number;
}

/**
 * Validation errors for each step
 */
export interface StudentCreateFormErrors {
  step1?: {
    value?: string;
    name?: string;
    bpGroupId?: string;
  };
  step2?: {
    locationName?: string;
    address1?: string;
    city?: string;
    countryId?: string;
  };
  step3?: {
    username?: string;
    email?: string;
  };
  step4?: {
    roleId?: string;
  };
}

/**
 * Student creation step metadata
 */
export interface StudentCreationStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

/**
 * Available steps for student creation
 */
export const STUDENT_CREATION_STEPS: StudentCreationStep[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Student's basic personal information",
    icon: "user",
  },
  {
    id: 2,
    title: "Address & Location",
    description: "Student's address and location details",
    icon: "map-pin",
  },
  {
    id: 3,
    title: "Account Setup",
    description: "Create user account and credentials",
    icon: "lock",
  },
  {
    id: 4,
    title: "Role Assignment",
    description: "Assign system role to the student",
    icon: "shield",
  },
] as const;

/**
 * Total number of steps in student creation flow
 */
export const TOTAL_STUDENT_CREATION_STEPS = 4;
