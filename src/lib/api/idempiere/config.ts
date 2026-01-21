/**
 * iDempiere REST API Configuration
 *
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 */

export const IDEMPIERE_CONFIG = {
  /**
   * Base URL for iDempiere REST API
   * Configure via environment variable: NEXT_PUBLIC_IDEMPIERE_API_URL
   */
  baseURL: process.env.NEXT_PUBLIC_IDEMPIERE_API_URL ?? "https://your-idempiere-server.com/api/v1",

  /**
   * Default client ID for login
   * Configure via environment variable: NEXT_PUBLIC_IDEMPIERE_CLIENT_ID
   */
  clientId: Number(process.env.NEXT_PUBLIC_IDEMPIERE_CLIENT_ID ?? "11"),

  /**
   * Default role ID for login
   * Configure via environment variable: NEXT_PUBLIC_IDEMPIERE_ROLE_ID
   */
  roleId: Number(process.env.NEXT_PUBLIC_IDEMPIERE_ROLE_ID ?? "2000001"),

  /**
   * Default organization ID for login
   * Configure via environment variable: NEXT_PUBLIC_IDEMPIERE_ORG_ID
   */
  organizationId: Number(process.env.NEXT_PUBLIC_IDEMPIERE_ORG_ID ?? "11"),

  /**
   * Default warehouse ID (optional)
   * Configure via environment variable: NEXT_PUBLIC_IDEMPIERE_WAREHOUSE_ID
   */
  warehouseId: process.env.NEXT_PUBLIC_IDEMPIERE_WAREHOUSE_ID
    ? Number(process.env.NEXT_PUBLIC_IDEMPIERE_WAREHOUSE_ID)
    : undefined,

  /**
   * Default language
   */
  language: process.env.NEXT_PUBLIC_IDEMPIERE_LANGUAGE ?? "en_US",

  /**
   * Request timeout in milliseconds
   */
  timeout: 30000,

  /**
   * Pagination page size
   */
  defaultPageSize: 100,

  /**
   * Token cache time in milliseconds (1 hour - should match server)
   */
  tokenCacheTime: 60 * 60 * 1000,

  /**
   * Refresh token cache time in milliseconds (24 hours - should match server)
   */
  refreshTokenCacheTime: 24 * 60 * 60 * 1000,

  /**
   * API endpoints
   */
  endpoints: {
    // Authentication
    authTokens: "/auth/tokens",
    authRefresh: "/auth/refresh",
    authLogout: "/auth/logout",
    authRoles: "/auth/roles",
    authOrganizations: "/auth/organizations",
    authWarehouses: "/auth/warehouses",
    authLanguage: "/auth/language",

    // Models
    models: "/models",
    businessPartner: "/models/C_BPartner",
    invoice: "/models/C_Invoice",
    payment: "/models/C_Payment",
    asset: "/models/A_Asset",
    product: "/models/M_Product",
    order: "/models/C_Order",
  } as const,
};

/**
 * iDempiere table names for reference
 */
export const IDEMPIERE_TABLES = {
  BUSINESS_PARTNER: "C_BPartner",
  INVOICE: "C_Invoice",
  PAYMENT: "C_Payment",
  ASSET: "A_Asset",
  PRODUCT: "M_Product",
  ORDER: "C_Order",
  BP_GROUP: "C_BP_Group",
  LOCATION: "C_Location",
  USER: "AD_User",
} as const;

/**
 * Business Partner Group IDs for student classification
 * These should be configured in iDempiere
 */
export const BP_GROUP_STUDENTS = {
  GRADE_9_A: "Grade 9 - Section A",
  GRADE_9_B: "Grade 9 - Section B",
  GRADE_10_A: "Grade 10 - Section A",
  GRADE_10_B: "Grade 10 - Section B",
  GRADE_11_A: "Grade 11 - Section A",
  GRADE_11_B: "Grade 11 - Section B",
  GRADE_12_A: "Grade 12 - Section A",
  GRADE_12_B: "Grade 12 - Section B",
} as const;
