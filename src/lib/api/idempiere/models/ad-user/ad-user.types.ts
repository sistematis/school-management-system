/**
 * AD_User Model Types
 * User/Contact entity untuk user login dan kontak
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * AD_User entity dari iDempiere REST API
 * Response lengkap dari endpoint /api/v1/models/AD_User
 */
export interface ADUser extends IdempiereBaseEntity {
  id: number;
  uid: string;
  Value: string;
  Name: string;
  Description?: string;
  EMail?: string;
  Phone?: string;
  Birthday?: string;
  C_BPartner_ID?: number;
  "model-name": string;
}

/**
 * OData response untuk AD_User query
 */
export type ADUserResponse = ODataResponse<ADUser>;

/**
 * ADUser dalam expand (field terbatas)
 * Untuk response ketika di-expand dari entity lain
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
 * Partial type untuk create/update operations
 */
export type ADUserCreate = Partial<
  Omit<ADUser, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;
