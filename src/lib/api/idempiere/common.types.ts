/**
 * iDempiere REST API Common/Shared Types
 * Types yang digunakan oleh banyak model
 */

// =============================================================================
// Option Types for Dropdowns
// =============================================================================

/**
 * Simplified country option for dropdown/select components
 */
export interface CountryOption {
  id: number;
  name: string;
}

/**
 * Simplified greeting option for dropdown/select components
 */
export interface GreetingOption {
  id: number;
  name: string;
}

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
// Universal/Mandatory Field Types (ada di semua table iDempiere)
// =============================================================================

/**
 * Standard reference untuk AD_Client_ID
 * Mandatory di semua entity
 */
export interface AdClientId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Standard reference untuk AD_Org_ID
 * Mandatory di semua entity
 */
export interface ADOrgId {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Standard reference untuk CreatedBy
 * Mengacu ke AD_User yang membuat record
 * Mandatory di semua entity
 */
export interface CreatedBy {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Standard reference untuk UpdatedBy
 * Mengacu ke AD_User yang terakhir mengupdate record
 * Mandatory di semua entity
 */
export interface UpdatedBy {
  propertyLabel: string;
  id: number;
  identifier: string;
  "model-name": string;
}

/**
 * Base interface untuk semua iDempiere entities
 * Berisi field universal yang ada di setiap table
 */
export interface IdempiereBaseEntity {
  AD_Client_ID: AdClientId;
  AD_Org_ID: ADOrgId;
  IsActive: boolean;
  Created: string; // ISO datetime string
  CreatedBy: CreatedBy;
  Updated: string; // ISO datetime string
  UpdatedBy: UpdatedBy;
}

// =============================================================================
// OData Query Types
// =============================================================================

/**
 * OData-style query request parameters
 * Use with QueryBuilder or pass directly to API functions
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
 * iDempiere OData-style query response wrapper
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
// Pagination Types
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
