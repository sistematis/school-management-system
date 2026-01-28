/**
 * M_Product Model Types
 * Product entity untuk library books
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";

// =============================================================================
// Referenced Types (spesifik untuk M_Product)
// =============================================================================

/**
 * Reference ke C_UOM (Unit of Measure)
 */
export interface CUOMId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Reference ke M_Product_Category
 */
export interface MProductCategoryId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * M_Product entity dari iDempiere REST API
 */
export interface MProduct extends IdempiereBaseEntity {
  id: number;
  uid: string;
  M_Product_ID?: number;
  Value: string;
  Name: string;
  Description?: string;
  Help?: string;
  UPC?: string;
  SKU?: string;
  C_UOM_ID?: CUOMId;
  M_Product_Category_ID?: MProductCategoryId;
  ProductType?: string;
  ImageURL?: string;
  Volume?: number;
  Weight?: number;
  PageCount?: number; // For books
  Language?: string; // For books
  "model-name": string;
  // sistematis backend specific
  IsSummary?: boolean;
  IsStocked?: boolean;
  IsPurchased?: boolean;
  IsSold?: boolean;
  Discontinued?: boolean;
  UnitsPerPack?: number;
  LowLevel?: number;
}

/**
 * OData response untuk M_Product query
 */
export type MProductResponse = ODataResponse<MProduct>;

/**
 * Partial type untuk create/update operations
 */
export type MProductCreate = Partial<
  Omit<MProduct, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;

/**
 * Backward compatibility alias
 */
export type Product = MProduct;
