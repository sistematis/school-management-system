/**
 * iDempiere REST API TypeScript Types
 *
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 */

// =============================================================================
// Authentication Types
// =============================================================================

/**
 * Initial login request with username/password only
 */
export interface AuthLoginRequest {
  userName: string;
  password: string;
}

/**
 * One-step login request with all parameters
 */
export interface AuthLoginFullRequest extends AuthLoginRequest {
  parameters: {
    clientId: number;
    roleId: number;
    organizationId: number;
    warehouseId?: number;
    language?: string;
  };
}

/**
 * Initial login response with available options
 */
export interface AuthLoginResponse {
  token: string;
  clients?: AuthOption[];
  roles?: AuthOption[];
  organizations?: AuthOption[];
  warehouses?: AuthOption[];
}

/**
 * Finalize login request
 */
export interface AuthFinalizeRequest {
  clientId: number;
  roleId: number;
  organizationId: number;
  warehouseId?: number;
  language?: string;
}

/**
 * Complete login response with tokens
 */
export interface AuthCompleteResponse {
  userId: number;
  language: string;
  token: string;
  refresh_token: string;
  menuTreeId?: number; // Additional field from sistematis backend
  // Optional fields that may be returned
  clientId?: number;
  roleId?: number;
  organizationId?: number;
  warehouseId?: number;
}

/**
 * Refresh token request
 */
export interface AuthRefreshRequest {
  refresh_token: string;
  clientId?: number;
  userId?: number;
}

/**
 * Refresh token response
 */
export interface AuthRefreshResponse {
  token: string;
  refresh_token: string;
}

/**
 * Logout request
 */
export interface AuthLogoutRequest {
  token: string;
}

/**
 * Logout response
 */
export interface AuthLogoutResponse {
  summary: string;
}

/**
 * Simple option type for dropdowns
 */
export interface AuthOption {
  id: number;
  name: string;
  description?: string;
}

// =============================================================================
// Common Types
// =============================================================================

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Pagination response wrapper
 */
export interface PaginatedResponse<T> {
  records: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  // Additional fields from sistematis backend
  "page-count"?: number;
  "records-size"?: number;
  "skip-records"?: number;
  "row-count"?: number;
  "array-count"?: number;
}

/**
 * Query filter for iDempiere models
 */
export interface QueryFilter {
  column: string;
  operator: "Eq" | "Like" | "NotEq" | "GreaterThan" | "LessThan" | "Between";
  value: string | number | boolean;
}

/**
 * Generic query request
 */
export interface QueryRequest extends PaginationParams {
  filters?: QueryFilter[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// =============================================================================
// Business Partner Types (C_BPartner)
// =============================================================================

/**
 * iDempiere Business Partner entity
 * Used for: Students, Staff, Parents, Vendors
 * Supports both standard iDempiere format and sistematis backend format
 */
export interface BusinessPartner {
  // Standard iDempiere fields
  C_BPartner_ID?: number;
  id?: number; // sistematis backend uses 'id'
  Value: string;
  Name: string;
  Name2?: string;
  Description?: string;
  EMail?: string;
  Phone?: string;
  Phone2?: string;
  Fax?: string;
  Birthday?: string; // ISO date string
  IsActive: boolean;
  Created?: string;
  Updated?: string;
  CreatedBy?: number;
  UpdatedBy?: number;
  AD_Org_ID?: number;
  AD_Client_ID?: number;
  SalesRep_ID?: number;
  C_BP_Group_ID?: number;
  C_BP_Group?: {
    C_BP_Group_ID?: number;
    id?: number;
    Name: string;
    Description?: string;
    identifier?: string;
    "model-name"?: string;
    propertyLabel?: string;
  };
  AD_User?: ADUser[];
  // Custom fields for school management
  parentContact?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;
  // sistematis backend specific fields
  uid?: string;
  IsVendor?: boolean;
  IsCustomer?: boolean;
  IsEmployee?: boolean;
  IsSalesRep?: boolean;
}

/**
 * iDempiere User/Contact entity (AD_User)
 * Linked to Business Partner for parent/guardian info
 */
export interface ADUser {
  AD_User_ID: number;
  Name: string;
  EMail?: string;
  Phone?: string;
  Birthday?: string;
  IsActive: boolean;
  C_BPartner_ID?: number;
}

// =============================================================================
// Invoice Types (C_Invoice)
// =============================================================================

export interface Invoice {
  C_Invoice_ID?: number;
  id?: number; // sistematis backend uses 'id'
  DocumentNo?: string;
  DateInvoiced?: string;
  GrandTotal?: number;
  C_BPartner_ID?: number;
  C_BPartner?: {
    C_BPartner_ID?: number;
    id?: number;
    Name: string;
    Value: string;
    identifier?: string;
  };
  PaymentRule?: string;
  C_PaymentTerm_ID?: number;
  Description?: string;
  IsPaid?: boolean;
  IsSOTrx?: boolean;
  DocStatus?: string;
  Created?: string;
  Updated?: string;
  IsActive?: boolean;
  // sistematis backend specific
  uid?: string;
}

// =============================================================================
// Payment Types (C_Payment)
// =============================================================================

export interface Payment {
  C_Payment_ID?: number;
  id?: number; // sistematis backend uses 'id'
  DocumentNo?: string;
  DateTrx?: string;
  TenderType?: string;
  PayAmt?: number;
  C_BPartner_ID?: number;
  C_BPartner?: {
    C_BPartner_ID?: number;
    id?: number;
    Name: string;
    Value?: string;
    identifier?: string;
  };
  C_Invoice_ID?: number;
  C_Invoice?: {
    C_Invoice_ID?: number;
    id?: number;
    DocumentNo?: string;
  };
  DocStatus?: string;
  IsApproved?: boolean;
  IsReconciled?: boolean;
  Created?: string;
  Description?: string;
  IsActive?: boolean;
  // sistematis backend specific
  uid?: string;
}

// =============================================================================
// Asset Types (A_Asset)
// =============================================================================

export interface Asset {
  A_Asset_ID?: number;
  id?: number; // sistematis backend uses 'id'
  Value: string;
  Name: string;
  Description?: string;
  AssetServiceDate?: string;
  M_Product_ID?: number;
  C_BPartner_ID?: number;
  A_Asset_Group_ID?: number;
  A_Asset_Status?: string;
  IsOwned?: boolean;
  IsDepreciated?: boolean;
  AssetDepreciationDate?: string;
  UseLifeMonths?: number;
  UseLifeYears?: number;
  LocationComment?: string;
  IsActive?: boolean;
  // sistematis backend specific
  uid?: string;
  IsUsed?: boolean;
  IsInPosession?: boolean;
}

// =============================================================================
// Product Types (M_Product) - For Library
// =============================================================================

export interface Product {
  M_Product_ID?: number;
  id?: number; // sistematis backend uses 'id'
  Value: string;
  Name: string;
  Description?: string;
  Help?: string;
  UPC?: string;
  SKU?: string;
  C_UOM_ID?: number;
  M_Product_Category_ID?: number;
  ProductType?: string;
  ImageURL?: string;
  Volume?: number;
  Weight?: number;
  PageCount?: number; // For books
  Language?: string; // For books
  IsActive?: boolean;
  // sistematis backend specific
  uid?: string;
  IsSummary?: boolean;
  IsStocked?: boolean;
  IsPurchased?: boolean;
  IsSold?: boolean;
  Discontinued?: boolean;
  UnitsPerPack?: number;
  LowLevel?: number;
}

// =============================================================================
// Error Types
// =============================================================================

/**
 * iDempiere API error response
 */
export interface IdempiereError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * API response wrapper (for typed responses)
 */
export interface ApiResponse<T> {
  data?: T;
  error?: IdempiereError;
  status: number;
}

// =============================================================================
// School Management Specific Types (mapped from iDempiere)
// =============================================================================

/**
 * Student type mapped from Business Partner
 */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  email?: string;
  phone?: string;
  grade: string;
  parentName?: string;
  dateOfBirth?: string;
  status: "active" | "inactive";
  C_BPartner_ID?: number;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;
}

/**
 * Invoice status for school billing
 */
export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Cancelled";

/**
 * School invoice with status
 */
export interface SchoolInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  C_Invoice_ID?: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

/**
 * Payment method types
 */
export type PaymentMethod = "Virtual Account" | "Credit Card" | "E-Wallet" | "Cash";

/**
 * Payment transaction
 */
export interface SchoolPayment {
  id: string;
  transactionId: string;
  invoiceId?: string;
  amount: number;
  method: PaymentMethod;
  status: "Completed" | "Pending" | "Failed";
  timestamp: string;
  studentId?: string;
  studentName?: string;
}

/**
 * Asset condition for school assets
 */
export type AssetCondition = "Excellent" | "Good" | "Fair" | "Poor" | "Needs Repair" | "Retired";

/**
 * School asset
 */
export interface SchoolAsset {
  id: string;
  name: string;
  category: string;
  condition: AssetCondition;
  location: string;
  purchaseDate: string;
  currentValue: number;
  warrantyExpiry?: string;
  A_Asset_ID?: number;
}

/**
 * Book availability status
 */
export type BookStatus = "Available" | "Borrowed" | "Overdue" | "Reserved" | "Lost" | "Damaged";

/**
 * Library book
 */
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  status: BookStatus;
  location: string;
  pages?: number;
  language?: string;
  publisher?: string;
  M_Product_ID?: number;
}
