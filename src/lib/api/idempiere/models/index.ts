/**
 * All Models Entry Point
 * Central export untuk semua models
 * NOTE: Referenced types (seperti CBPartnerId, dll) tidak di-export di sini
 * untuk menghindari naming conflicts. Import langsung dari file masing-masing jika diperlukan.
 */

// Export A_Asset
export type {
  AAsset,
  AAssetCreate,
  AAssetResponse,
  Asset,
} from "./a-asset";
// Export AD_User
export type {
  ADUser,
  ADUserCreate,
  ADUserExpanded,
  ADUserResponse,
} from "./ad-user";
// Export C_BPartner
export type {
  BusinessPartner,
  CBPartner,
  CBPartnerCreate,
  CBPartnerResponse,
} from "./c-bpartner";
// Export C_Invoice
export type {
  CInvoice,
  CInvoiceCreate,
  CInvoiceResponse,
  Invoice,
} from "./c-invoice";
// Export C_Payment
export type {
  CPayment,
  CPaymentCreate,
  CPaymentResponse,
  Payment,
} from "./c-payment";
// Export M_Product
export type {
  MProduct,
  MProductCreate,
  MProductResponse,
  Product,
} from "./m-product";
// Export Students (Student Creation)
export type {
  StudentBPCreateRequest,
  StudentBPCreateResponse,
  StudentBPLocationCreateRequest,
  StudentBPLocationCreateResponse,
  StudentCreateFormData,
  StudentCreateFormErrors,
  StudentCreationContext,
  StudentCreationStep,
  StudentLocationRequest,
  StudentUserCreateRequest,
  StudentUserCreateResponse,
  StudentUserRoleCreateRequest,
  StudentUserRoleCreateResponse,
} from "./students";
export { STUDENT_CREATION_STEPS, TOTAL_STUDENT_CREATION_STEPS } from "./students";
