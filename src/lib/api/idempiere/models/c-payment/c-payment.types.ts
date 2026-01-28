/**
 * C_Payment Model Types
 * Payment entity untuk pembayaran
 */

import type { IdempiereBaseEntity, ODataResponse } from "@/lib/api/idempiere/common.types";

// =============================================================================
// Referenced Types (spesifik untuk C_Payment)
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
 * Reference ke C_Invoice
 */
export interface CInvoiceId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

// =============================================================================
// Main Entity Types
// =============================================================================

/**
 * C_Payment entity dari iDempiere REST API
 */
export interface CPayment extends IdempiereBaseEntity {
  id: number;
  uid: string;
  C_Payment_ID?: number;
  DocumentNo?: string;
  DateTrx?: string;
  TenderType?: string;
  PayAmt?: number;
  C_BPartner_ID: CBPartnerId;
  C_BPartner?: {
    C_BPartner_ID?: number;
    id?: number;
    Name: string;
    Value?: string;
    identifier?: string;
  };
  C_Invoice_ID?: CInvoiceId;
  C_Invoice?: {
    C_Invoice_ID?: number;
    id?: number;
    DocumentNo?: string;
  };
  DocStatus?: string;
  IsApproved?: boolean;
  IsReconciled?: boolean;
  Description?: string;
  "model-name": string;
}

/**
 * OData response untuk C_Payment query
 */
export type CPaymentResponse = ODataResponse<CPayment>;

/**
 * Partial type untuk create/update operations
 */
export type CPaymentCreate = Partial<
  Omit<CPayment, "id" | "uid" | "AD_Client_ID" | "AD_Org_ID" | "Created" | "Updated" | "CreatedBy" | "UpdatedBy">
>;

/**
 * Backward compatibility alias
 */
export type Payment = CPayment;
