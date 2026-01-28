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
// Config
export { BP_GROUP_STUDENTS, IDEMPIERE_CONFIG, IDEMPIERE_TABLES } from "./config";
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
// Types
export type {
  ADUser,
  ApiResponse,
  Asset,
  AssetCondition,
  AuthCompleteResponse,
  AuthFinalizeRequest,
  AuthLoginFullRequest,
  // Authentication
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthOption,
  AuthRefreshRequest,
  AuthRefreshResponse,
  BookStatus,
  // Entities
  BusinessPartner,
  // Errors
  IdempiereError,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  LibraryBook,
  // OData-style
  ODataResponse,
  ODataSingleResponse,
  ODataQueryParams,
  // Common
  ExpandOptions,
  FilterOperator,
  MethodFilterOperator,
  PaginationParams,
  Payment,
  PaymentMethod,
  Product,
  SortDirection,
  SchoolAsset,
  SchoolInvoice,
  SchoolPayment,
  // School Management
  Student,
  TypedFilter,
} from "./types";
