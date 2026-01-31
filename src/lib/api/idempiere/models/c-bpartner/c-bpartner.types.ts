/**
 * C_BPartner Model Types
 * Business Partner entity untuk Students, Staff, Parents, Vendors
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";
import type { ADUser } from "@/lib/api/idempiere/models/ad-user/ad-user.types";

// =============================================================================
// Referenced Types (hanya yang spesifik untuk C_BPartner)
// =============================================================================

/**
 * Reference ke C_BP_Group_ID
 */
export interface CBPGroupId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Reference ke SOCreditStatus (Ref List)
 */
export interface Socreditstatus {
  propertyLabel: string;
  id: string;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Related Entity Types (for expanded queries)
// =============================================================================

/**
 * C_BPartner_Location entity
 * Location/Address untuk Business Partner
 */
export interface CBPartnerLocation {
  id: number;
  uid: string;
  C_Location_ID: CLocation;
  Name: string;
  IsBillTo: boolean;
  IsShipTo: boolean;
  IsPayFrom: boolean;
  IsRemitTo: boolean;
  IsActive: boolean;
}

/**
 * C_Location entity (nested dalam C_BPartner_Location)
 */
export interface CLocation {
  id: number;
  uid?: string;
  identifier: string; // Pre-formatted full address from iDempiere
  Address1: string;
  Address2?: string;
  Address3?: string;
  Address4?: string;
  City: string;
  C_Country_ID: CCountry;
  Postal?: string;
  Region?: string;
}

/**
 * C_Country reference (nested dalam C_Location)
 */
export interface CCountry {
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * C_BP_BankAccount entity
 * Rekening bank untuk Business Partner
 */
export interface CBPBankAccount {
  id: number;
  uid: string;
  AD_User_ID?: {
    id: number;
    identifier: string;
    "model-name": string;
  };
  A_Name: string;
  A_Address?: string;
  A_City?: string;
  A_Zip?: string;
  A_Country?: string;
  A_EMail?: string;
  A_Phone?: string;
  BankAccount?: string;
  CreditCardNumber?: string;
  CreditCardExpMM: number;
  CreditCardExpYY: number;
  CreditCardType?: {
    propertyLabel: string;
    id: string;
    identifier: string;
    "model-name": string;
  };
  BPBankAcctUse?: {
    propertyLabel: string;
    id: string;
    identifier: string;
    "model-name": string;
  };
  IsACH: boolean;
  IsActive: boolean;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * C_BPartner entity dari iDempiere REST API
 * Response lengkap dari endpoint /api/v1/models/C_BPartner
 */
export interface CBPartner extends IdempiereBaseEntity {
  id: number;
  uid: string;
  Value: string;
  Name: string;
  Name2?: string;
  Description?: string;
  EMail?: string;
  Birthday?: string; // ISO date string
  SalesRep_ID?: number;
  C_BP_Group_ID: CBPGroupId;
  SalesVolume: number;
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
  IsDiscountPrinted: boolean;
  SendEMail: boolean;
  SOCreditStatus: Socreditstatus;
  TotalOpenBalance: number;
  IsPOTaxExempt: boolean;
  IsManufacturer: boolean;
  Is1099Vendor: boolean;
  "model-name": string;
  // Expanded relations (for detail view with $expand)
  ad_user?: ADUser[];
  c_bp_bankaccount?: CBPBankAccount[];
  c_bpartner_location?: CBPartnerLocation[];
  // Custom fields for school management
  parentContact?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;
}

/**
 * OData response untuk C_BPartner query
 */
export type CBPartnerResponse = ODataResponse<CBPartner>;

/**
 * Partial type untuk create/update operations
 */
export type CBPartnerCreate = Partial<
  Omit<CBPartner, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;

/**
 * Backward compatibility alias
 */
export type BusinessPartner = CBPartner;

// =============================================================================
// Filterable Fields Metadata (for Dynamic Data Table)
// =============================================================================

import { AlertTriangle, Briefcase, Cake, Calendar, CheckCircle, Globe, Mail, Phone, Store, User } from "lucide-react";

/**
 * Filterable field metadata for C_BPartner
 * Maps model fields to their filter capabilities
 */
export const CBPartnerFilterableFields = {
  // Boolean filters (true/false toggles)
  IsActive: {
    label: "Active",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: CheckCircle,
  },
  IsCustomer: {
    label: "Customer",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: User,
  },
  IsEmployee: {
    label: "Employee",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: Briefcase,
  },
  IsVendor: {
    label: "Vendor",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: Store,
  },
  IsSalesRep: {
    label: "Sales Representative",
    type: "boolean" as const,
    operators: ["eq"] as const,
  },

  // String filters (search, exact match)
  Name: {
    label: "Name",
    type: "string" as const,
    operators: ["contains", "startswith", "eq"] as const,
    searchable: true, // Enables global search
  },
  Value: {
    label: "ID/Code",
    type: "string" as const,
    operators: ["contains", "eq"] as const,
  },
  EMail: {
    label: "Email",
    type: "string" as const,
    operators: ["contains", "eq"] as const,
    icon: Mail,
  },

  // Enum-like filters (predefined options)
  Ad_Language: {
    label: "Language",
    type: "enum" as const,
    operators: ["eq"] as const,
    options: [
      { label: "English", value: "en_US" },
      { label: "Indonesian", value: "id_ID" },
    ],
    icon: Globe,
  },

  // Date filters
  Birthday: {
    label: "Birthday",
    type: "date" as const,
    operators: ["eq", "gt", "lt"] as const,
    icon: Cake,
  },
  Created: {
    label: "Created Date",
    type: "date" as const,
    operators: ["eq", "gt", "lt", "ge", "le"] as const,
    icon: Calendar,
  },
  Updated: {
    label: "Updated Date",
    type: "date" as const,
    operators: ["eq", "gt", "lt", "ge", "le"] as const,
    icon: Calendar,
  },

  // Custom fields for school management
  parentContact: {
    label: "Parent Contact",
    type: "string" as const,
    operators: ["contains"] as const,
  },
  emergencyContact: {
    label: "Emergency Contact",
    type: "string" as const,
    operators: ["contains"] as const,
    icon: Phone,
  },
  allergies: {
    label: "Allergies",
    type: "string" as const,
    operators: ["contains"] as const,
    icon: AlertTriangle,
  },
} as const;

// Type inference from metadata
export type CBPartnerFilterableField = keyof typeof CBPartnerFilterableFields;
