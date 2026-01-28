/**
 * iDempiere REST API Module
 *
 * Complete API integration for iDempiere REST API
 * Based on: https://bxservice.github.io/idempiere-rest-docs/
 *
 * @module
 */

// =============================================================================
// Exports
// =============================================================================

// Client
// Error
export { getIdempiereClient, IdempiereApiError, IdempiereClient } from "./client";
// Common Types (NEW - universal/mandatory fields)
export type {
  ADOrgId,
  AdClientId,
  ApiResponse,
  AuthCompleteResponse,
  AuthFinalizeRequest,
  AuthLoginFullRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthOption,
  AuthRefreshRequest,
  AuthRefreshResponse,
  CreatedBy,
  FilterOperator,
  IdempiereBaseEntity,
  IdempiereError,
  MethodFilterOperator,
  ODataQueryParams,
  ODataResponse,
  ODataSingleResponse,
  PaginatedResponse,
  PaginationParams,
  SortDirection,
  UpdatedBy,
} from "./common.types";
// Config
export { BP_GROUP_STUDENTS, IDEMPIERE_CONFIG, IDEMPIERE_TABLES } from "./config";
// Models (NEW - organized by entity)
export type {
  AAsset,
  AAssetCreate,
  AAssetResponse,
  ADUser,
  ADUserCreate,
  ADUserExpanded,
  ADUserResponse,
  CBPartner,
  CBPartnerCreate,
  CBPartnerResponse,
  CInvoice,
  CInvoiceCreate,
  CInvoiceResponse,
  CPayment,
  CPaymentCreate,
  CPaymentResponse,
  MProduct,
  MProductCreate,
  MProductResponse,
} from "./models";
export type {
  BuiltQuery,
  CompoundFilter,
  ExpandClause,
  FilterCondition,
  IdempiereOptions,
  InFilter,
  LogicalFilter,
  LogicalOperator,
  MethodFilter,
  MethodOperator,
  NotFilter,
  OrderByClause,
  QueryConfig,
  SortOrder,
} from "./query";
// Query Builder
export {
  and,
  buildQuery,
  expand,
  filter,
  inFilter,
  methodFilter,
  not,
  or,
  orderBy,
  QueryBuilder,
  toQueryString,
} from "./query";
// Services
export { IdempiereBaseService } from "./services/base.service";
export {
  BusinessPartnerService,
  getBusinessPartnerService,
} from "./services/business-partner.service";
// Transformers
export {
  transformAssetToSchoolAsset,
  transformBPartnersToStudents,
  transformBPartnerToStudent,
  transformInvoiceToSchoolInvoice,
  transformPaymentToSchoolPayment,
  transformProductToLibraryBook,
  transformStudentToBPartner,
} from "./transformers";
// School Management Specific Types (backward compatibility - deprecated)
// Import from types.ts for domain-specific transformed types
// Backward compatibility aliases (deprecated - use new types instead)
export type {
  Asset as AssetDeprecated,
  AssetCondition,
  BookStatus,
  BusinessPartner as BPartnerDeprecated,
  Invoice as InvoiceDeprecated,
  InvoiceItem,
  InvoiceStatus,
  LibraryBook,
  Payment as PaymentDeprecated,
  PaymentMethod,
  Product as ProductDeprecated,
  SchoolAsset,
  SchoolInvoice,
  SchoolPayment,
  Student,
} from "./types";
