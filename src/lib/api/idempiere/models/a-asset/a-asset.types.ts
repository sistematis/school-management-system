/**
 * A_Asset Model Types
 * Asset entity untuk aset sekolah
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";

// =============================================================================
// Referenced Types (spesifik untuk A_Asset)
// =============================================================================

/**
 * Reference ke C_BPartner (Owner)
 */
export interface CBPartnerId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Reference ke M_Product
 */
export interface MProductId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Reference ke A_Asset_Group
 */
export interface AAssetGroupId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * A_Asset entity dari iDempiere REST API
 */
export interface AAsset extends IdempiereBaseEntity {
  id: number;
  uid: string;
  A_Asset_ID?: number;
  Value: string;
  Name: string;
  Description?: string;
  AssetServiceDate?: string;
  M_Product_ID?: MProductId;
  C_BPartner_ID?: CBPartnerId;
  A_Asset_Group_ID: AAssetGroupId;
  A_Asset_Status?: string;
  IsOwned?: boolean;
  IsDepreciated?: boolean;
  AssetDepreciationDate?: string;
  UseLifeMonths?: number;
  UseLifeYears?: number;
  LocationComment?: string;
  "model-name": string;
  // sistematis backend specific
  IsUsed?: boolean;
  IsInPosession?: boolean;
}

/**
 * OData response untuk A_Asset query
 */
export type AAssetResponse = ODataResponse<AAsset>;

/**
 * Partial type untuk create/update operations
 */
export type AAssetCreate = Partial<
  Omit<AAsset, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;

/**
 * Backward compatibility alias
 */
export type Asset = AAsset;
