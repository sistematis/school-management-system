/**
 * iDempiere REST API TypeScript Types
 *
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 * And: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * @example
 * // OData-style query response
 * interface StudentResponse extends ODataResponse<StudentRecord> {
 *   records: StudentRecord[];
 *   "page-count": number;
 *   "records-size": number;
 *   "row-count": number;
 * }
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
 *
 * Operators match iDempiere REST API standard:
 * https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * @example
 * const filter: QueryFilter = {
 *   column: "IsActive",
 *   operator: "eq",
 *   value: true
 * };
 */
export interface QueryFilter {
  /** Field/column name */
  column: string;
  /** Logical operator */
  operator:
    | "eq"
    | "neq"
    | "in"
    | "gt"
    | "ge"
    | "lt"
    | "le"
    | "and"
    | "or"
    | "not"
    | "contains"
    | "startswith"
    | "endswith"
    | "tolower"
    | "toupper";
  /** Filter value */
  value: string | number | boolean | Array<string | number>;
}

/**
 * Generic query request (use ODataQueryParams instead for new code)
 */
export interface QueryRequest extends PaginationParams {
  filters?: QueryFilter[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// =============================================================================
// OData-style Query Request Types (new - matches documentation)
// =============================================================================

/**
 * OData-style query request parameters
 * Use with QueryBuilder or pass directly to API functions
 *
 * @example
 * const params: ODataQueryParams = {
 *   $filter: "IsActive eq true AND GradeLevel eq '10'",
 *   $orderby: "Name asc",
 *   $top: 20,
 *   $skip: 0,
 *   $select: "Name,Email,Phone"
 * };
 */
export interface ODataQueryParams {
  /** Filter expression */
  $filter?: string;
  /** Order by expression */
  $orderby?: string;
  /** Number of records to return */
  $top?: number;
  /** Number of records to skip */
  $skip?: number;
  /** Properties to select */
  $select?: string;
  /** Related entities to expand */
  $expand?: string;
  /** Validation rule */
  $valrule?: string | number;
  /** Context variables (format: "Name:Value,Name2:Value2") */
  $context?: string;
  /** Show SQL query in response */
  showsql?: "true" | "nodata";
  /** Filter by label */
  label?: string;
  /** Include assigned labels in response */
  showlabel?: "true" | string;
}

/**
 * Common filter operators for type-safe filter creation
 */
export type FilterOperator =
  | "eq" // equals (=)
  | "neq" // not equals (!=)
  | "gt" // greater than (>)
  | "ge" // greater or equal (>=)
  | "lt" // less than (<)
  | "le" // less or equal (<=)
  | "and" // logical AND
  | "or" // logical OR
  | "not"; // logical NOT

/**
 * Method filter operators for string operations
 */
export type MethodFilterOperator =
  | "contains" // contains substring
  | "startswith" // starts with prefix
  | "endswith" // ends with suffix
  | "tolower" // convert to lowercase
  | "toupper"; // convert to uppercase

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Type-safe filter builder interface
 * Used to construct filter expressions with type safety
 *
 * @example
 * const filters = {
 *   IsActive: { eq: true },
 *   GradeLevel: { eq: "10" },
 *   Name: { contains: "John" }
 * };
 */
export type TypedFilter<T> = {
  [K in keyof T]?: {
    eq?: T[K];
    neq?: T[K];
    gt?: T[K];
    ge?: T[K];
    lt?: T[K];
    le?: T[K];
    in?: Array<T[K]>;
    contains?: T[K] extends string ? string : never;
    startswith?: T[K] extends string ? string : never;
    endswith?: T[K] extends string ? string : never;
  };
};

/**
 * Expanded entity with nested query options
 *
 * @example
 * const expands = [{
 *   field: "c_bpartner",
 *   select: ["Name", "Email"],
 *   filter: "IsActive eq true"
 * }];
 */
export interface ExpandOptions {
  field: string;
  select?: string[];
  filter?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
  customJoinKey?: string;
}

// =============================================================================
// OData-style Query Types (new - use QueryBuilder)
// =============================================================================

/**
 * iDempiere OData-style query response wrapper
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * @example
 * // Response from GET /api/v1/models/c_bpartner
 * const response: ODataResponse<BusinessPartner> = {
 *   records: [...],
 *   "page-count": 1,
 *   "records-size": 3,
 *   "skip-records": 0,
 *   "row-count": 1,
 *   "array-count": 1
 * };
 *
 * @example
 * // Response with SQL tracing (showsql parameter)
 * const responseWithSql: ODataResponse<BusinessPartner> = {
 *   records: [...],
 *   "page-count": 1,
 *   "records-size": 1,
 *   "skip-records": 0,
 *   "row-count": 1,
 *   "array-count": 1,
 *   "sql-command": "SELECT ... FROM C_BPartner WHERE ..."
 * };
 *
 * @example
 * // Response with labels (showlabel parameter)
 * const responseWithLabels: ODataResponse<BusinessPartner> = {
 *   records: [...],
 *   "page-count": 1,
 *   "records-size": 1,
 *   "skip-records": 0,
 *   "row-count": 1,
 *   "array-count": 1,
 *   "assigned-labels": [
 *     { Name: "#Customer", Description: "Customers" }
 *   ]
 * };
 */
export interface ODataResponse<T> {
  /** Array of records */
  records: T[];
  /** Total number of pages */
  "page-count": number;
  /** Number of records in current page */
  "records-size": number;
  /** Number of skipped records */
  "skip-records"?: number;
  /** Total row count */
  "row-count": number;
  /** Array count (same as records-size) */
  "array-count"?: number;
  /** Optional: SQL command (when showsql is enabled) */
  "sql-command"?: string;
  /** Optional: Additional dynamic properties */
  [key: string]: T | T[] | number | string | undefined | Array<{ Name: string; Description?: string }>;
}

/**
 * Single record OData response
 */
export interface ODataSingleResponse<T> {
  /** The record */
  [key: string]: T | string | undefined | Array<{ Name: string; Description?: string }>;
  /** Optional: SQL command (when showsql is enabled) */
  "sql-command"?: string;
  /** Optional: Assigned labels (when showlabel is enabled) */
  "assigned-labels"?: Array<{ Name: string; Description?: string }>;
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
  ad_user?: ADUser[];
  // Expanded relations (for detail view with $expand)
  c_bpartner_location?: BPartnerLocation[];
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
 * C_BPartner_Location entity (expanded relation)
 * Location/Address for Business Partner
 */
export interface BPartnerLocation {
  id: number;
  C_Location_ID?: {
    id?: number;
    identifier?: string;
    "model-name"?: string;
    Address1?: string;
    Address2?: string;
    Address3?: string;
    Address4?: string;
    City?: string;
    Postal?: string;
    C_Country_ID?: {
      id: number;
      identifier?: string;
      "model-name"?: string;
    };
  };
  Name?: string;
  IsBillTo?: boolean;
  IsShipTo?: boolean;
  IsPayFrom?: boolean;
  IsRemitTo?: boolean;
  IsActive?: boolean;
}

/**
 * iDempiere User/Contact entity (ad_user)
 * Linked to Business Partner for parent/guardian info
 */
export interface ADUser {
  id: number;
  uid?: string;
  Name: string;
  Description?: string;
  EMail?: string;
  Phone?: string;
  Phone2?: string;
  Birthday?: string;
  Title?: string;
  Comments?: string;
  Value?: string;
  IsActive: boolean;
  C_BPartner_ID?: number;
  C_Greeting_ID?: {
    id: number;
    identifier?: string;
    "model-name"?: string;
    propertyLabel?: string;
  };
  Created?: string;
  Updated?: string;
  CreatedBy?: number;
  UpdatedBy?: number;
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
