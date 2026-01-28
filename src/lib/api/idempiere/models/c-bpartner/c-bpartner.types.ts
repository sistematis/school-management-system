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
  Phone?: string;
  Phone2?: string;
  Fax?: string;
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
  ad_user?: ADUser[];
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

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Briefcase, Cake, CheckCircle, Globe, Mail, Phone, Store, User, Users } from "lucide-react";

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

  // Reference fields (with value rules)
  C_BP_Group_ID: {
    label: "BP Group",
    type: "reference" as const,
    operators: ["eq"] as const,
    modelName: "C_BP_Group",
    icon: Users,
  },
} as const;

// Type inference from metadata
export type CBPartnerFilterableField = keyof typeof CBPartnerFilterableFields;
