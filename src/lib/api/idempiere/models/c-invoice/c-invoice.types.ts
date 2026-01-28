/**
 * C_Invoice Model Types
 * Invoice entity untuk billing/keuangan sekolah
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";

// =============================================================================
// Referenced Types (spesifik untuk C_Invoice)
// =============================================================================

/**
 * Reference ke C_BPartner (Customer/Vendor)
 */
export interface CBPartnerId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Reference ke C_PaymentTerm
 */
export interface CPaymentTermId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * C_Invoice entity dari iDempiere REST API
 */
export interface CInvoice extends IdempiereBaseEntity {
  id: number;
  uid: string;
  C_Invoice_ID?: number;
  DocumentNo?: string;
  DateInvoiced?: string;
  GrandTotal?: number;
  C_BPartner_ID: CBPartnerId;
  C_BPartner?: {
    C_BPartner_ID?: number;
    id?: number;
    Name: string;
    Value: string;
    identifier?: string;
    "model-name"?: string;
  };
  PaymentRule?: string;
  C_PaymentTerm_ID?: CPaymentTermId;
  Description?: string;
  IsPaid?: boolean;
  IsSOTrx?: boolean;
  DocStatus?: string;
  "model-name": string;
}

/**
 * OData response untuk C_Invoice query
 */
export type CInvoiceResponse = ODataResponse<CInvoice>;

/**
 * Partial type untuk create/update operations
 */
export type CInvoiceCreate = Partial<
  Omit<CInvoice, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;

/**
 * Backward compatibility alias
 */
export type Invoice = CInvoice;
