/**
 * iDempiere Business Partner Service
 *
 * Handles operations for C_BPartner entity (Students, Staff, Parents)
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * This service extends IdempiereBaseService to provide reusable querying functionality
 * with full OData-style query support using QueryBuilder.
 */

import type { ExpandClause, FilterCondition, OrderByClause, QueryBuilder, QueryConfig, SortOrder } from "../query";
import { and, filter, inFilter, methodFilter } from "../query";
import { transformBPartnersToStudents, transformBPartnerToStudent, transformStudentToBPartner } from "../transformers";
import type { BusinessPartner, PaginatedResponse, PaginationParams, Student } from "../types";
import { IdempiereBaseService } from "./base.service";

/**
 * Business Partner Service with reusable query support
 */
export class BusinessPartnerService extends IdempiereBaseService<BusinessPartner, Student> {
  readonly endpoint = "/models/C_BPartner";

  // ==========================================================================
  // Query Methods - Using QueryBuilder for reusable querying
  // ==========================================================================

  /**
   * Query business partners with full QueryBuilder configuration
   * @param config - Query configuration from QueryBuilder
   * @returns Paginated response with students
   *
   * @example
   * import { QueryBuilder, filter, and, expand } from '@/lib/api/idempiere/query';
   *
   * const query = new QueryBuilder()
   *   .filter('Name', 'eq', 'John')
   *   .and('IsActive', 'eq', true)
   *   .orderBy('Created', 'desc')
   *   .top(10)
   *   .expand(expand('C_BP_Group', { select: ['Name'] }));
   *
   * // Pass the QueryBuilder instance directly (do not call .build())
   * const result = await service.queryWithConfig(query);
   */
  async queryWithConfig(builder: QueryBuilder): Promise<PaginatedResponse<Student>> {
    const { buildQuery } = await import("../query");
    const config = (builder as unknown as { config: QueryConfig }).config;
    return super.query(config);
  }

  /**
   * Query with filter condition
   * @param filter - Filter condition
   * @param pagination - Page and page size
   * @returns Paginated response with students
   *
   * @example
   * import { filter, and } from '@/lib/api/idempiere/query';
   *
   * const result = await service.queryWithFilter(
   *   and(
   *     filter('IsCustomer', 'eq', true),
   *     filter('IsActive', 'eq', true)
   *   ),
   *   { page: 1, pageSize: 20 }
   * );
   */
  async queryWithFilter(
    filterCondition: FilterCondition,
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    return this.query({ filter: filterCondition, ...this.buildPaginationConfig(pagination) });
  }

  /**
   * Query with order by
   * @param orderBy - Order by clause(s)
   * @param pagination - Page and page size
   * @returns Paginated response with students
   *
   * @example
   * import { orderBy } from '@/lib/api/idempiere/query';
   *
   * const result = await service.queryWithOrderBy(
   *   orderBy('Name', 'asc'),
   *   { page: 1, pageSize: 20 }
   * );
   */
  async queryWithOrderBy(
    orderBy: OrderByClause | OrderByClause[],
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    return this.query({ orderBy, ...this.buildPaginationConfig(pagination) });
  }

  /**
   * Query with expand (related entities)
   * @param expand - Expand clause(s)
   * @param pagination - Page and page size
   * @returns Paginated response with students
   *
   * @example
   * import { expand } from '@/lib/api/idempiere/query';
   *
   * const result = await service.queryWithExpand(
   *   expand('C_BP_Group', { select: ['Name', 'Description'] }),
   *   { page: 1, pageSize: 20 }
   * );
   */
  async queryWithExpand(
    expand: ExpandClause | ExpandClause[],
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    return this.query({ expand, ...this.buildPaginationConfig(pagination) });
  }

  // ==========================================================================
  // Specialized Query Methods
  // ==========================================================================

  /**
   * Get active customers only (students)
   * @param pagination - Page and page size
   * @returns Paginated response with active customers
   */
  async getActiveCustomers(pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("IsCustomer", "eq", true), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get active employees only
   * @param pagination - Page and page size
   * @returns Paginated response with active employees
   */
  async getActiveEmployees(pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("IsEmployee", "eq", true), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get active vendors only
   * @param pagination - Page and page size
   * @returns Paginated response with active vendors
   */
  async getActiveVendors(pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("IsVendor", "eq", true), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Search by name using contains method
   * @param searchTerm - Search term
   * @param pagination - Page and page size
   * @returns Paginated response with matching students
   */
  async searchByName(searchTerm: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: methodFilter("contains", "Name", searchTerm),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Search by email using contains method
   * @param searchTerm - Email search term
   * @param pagination - Page and page size
   * @returns Paginated response with matching students
   */
  async searchByEmail(searchTerm: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(methodFilter("contains", "EMail", searchTerm), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get students by BP Group ID
   * @param groupId - BP Group ID
   * @param pagination - Page and page size
   * @returns Paginated response with students in the group
   */
  async getByBpGroupId(groupId: number, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("C_BP_Group_ID", "eq", groupId), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get students by Value (search key) using IN filter
   * @param values - Array of Value field values
   * @param pagination - Page and page size
   * @returns Paginated response with matching students
   *
   * @example
   * const result = await service.getByValues(['10A-001', '10A-002', '10A-003']);
   */
  async getByValues(values: string[], pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(inFilter("Value", values), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get students created after a specific date
   * @param date - ISO date string
   * @param pagination - Page and page size
   * @returns Paginated response with students created after the date
   */
  async getCreatedAfter(date: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("Created", "ge", date), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get students created before a specific date
   * @param date - ISO date string
   * @param pagination - Page and page size
   * @returns Paginated response with students created before the date
   */
  async getCreatedBefore(date: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(filter("Created", "le", date), filter("IsActive", "eq", true)),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get students with name starting with prefix
   * @param prefix - Name prefix
   * @param pagination - Page and page size
   * @returns Paginated response with matching students
   */
  async getNameStartingWith(prefix: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: methodFilter("startswith", "Name", prefix),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Complex query example: Active customers with specific criteria
   * @param namePrefix - Optional name prefix filter
   * @param pagination - Page and page size
   * @returns Paginated response with filtered students
   */
  async getActiveCustomersWithNamePrefix(
    namePrefix: string,
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    return this.query({
      filter: and(
        filter("IsCustomer", "eq", true),
        filter("IsActive", "eq", true),
        methodFilter("startswith", "Name", namePrefix),
      ),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Query with iDempiere-specific options
   * @param options - iDempiere query options
   * @param pagination - Page and page size
   * @returns Paginated response
   *
   * @example
   * // With validation rule
   * const result = await service.queryWithOptions(
   *   { valrule: 210, context: { M_Product_ID: 124 } }
   * );
   *
   * @example
   * // With SQL tracing
   * const result = await service.queryWithOptions(
   *   { showsql: true }
   * );
   */
  async queryWithOptions(
    options: {
      valrule?: string | number;
      context?: Record<string, string | number>;
      showsql?: boolean;
      showsqlNoData?: boolean;
      label?: string;
      showlabel?: boolean | string[];
    },
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    return this.query({
      idempiere: options,
      ...this.buildPaginationConfig(pagination),
    });
  }

  // ==========================================================================
  // CRUD Methods using base service
  // ==========================================================================

  /**
   * Get paginated list of students (using getStudents for backward compatibility)
   * @param pagination - Page and page size
   * @returns Paginated list of students
   */
  async getStudents(pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.getActiveCustomers(pagination);
  }

  /**
   * Get a single student by Business Partner ID
   * @param bpartnerId - C_BPartner_ID
   * @returns Student or null if not found
   */
  async getStudentById(bpartnerId: number): Promise<Student | null> {
    return this.getById(bpartnerId);
  }

  /**
   * Get a single student by Value (search key)
   * @param value - Value field (e.g., "10A-001")
   * @returns Student or null if not found
   */
  async getStudentByValue(value: string): Promise<Student | null> {
    const result = await this.query({
      filter: filter("Value", "eq", value),
      top: 1,
    });

    return result.records[0] ?? null;
  }

  /**
   * Search students by name or email
   * @param searchTerm - Search term
   * @param pagination - Page and page size
   * @returns Paginated list of matching students
   */
  async searchStudents(searchTerm: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    return this.searchByName(searchTerm, pagination);
  }

  /**
   * Filter students by grade (BP Group)
   * @param grade - Grade name or BP Group ID
   * @param pagination - Page and page size
   * @returns Paginated list of students in the grade
   */
  async getStudentsByGrade(
    grade: string | number,
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<Student>> {
    if (typeof grade === "number") {
      return this.getByBpGroupId(grade, pagination);
    }
    // For grade name, we'd need to query by group name
    // This would require joining with C_BP_Group
    return this.searchByName(grade, pagination);
  }

  /**
   * Create a new student
   * @param student - Student data to create
   * @returns Created student or null if failed
   */
  async createStudent(student: Partial<Student>): Promise<Student | null> {
    return this.create(student);
  }

  /**
   * Update an existing student
   * @param bpartnerId - C_BPartner_ID of student to update
   * @param student - Updated student data
   * @returns Updated student or null if failed
   */
  async updateStudent(bpartnerId: number, student: Partial<Student>): Promise<Student | null> {
    return this.update(bpartnerId, student);
  }

  /**
   * Delete (deactivate) a student
   * @param bpartnerId - C_BPartner_ID of student to delete
   * @returns true if successful, false otherwise
   */
  async deleteStudent(bpartnerId: number): Promise<boolean> {
    return this.delete(bpartnerId);
  }

  /**
   * Get student statistics
   * @returns Object with count statistics
   */
  async getStudentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byGrade: Record<string, number>;
  }> {
    try {
      // Get first page with maximum page size to get count
      const response = await this.getStudents({ page: 1, pageSize: 1 });

      const stats = {
        total: response.totalRecords,
        active: 0, // Would need separate query or process all records
        inactive: 0,
        byGrade: {} as Record<string, number>,
      };

      return stats;
    } catch (error) {
      console.error("Failed to fetch student stats:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byGrade: {},
      };
    }
  }

  // ==========================================================================
  // Transformation methods override
  // ==========================================================================

  protected transformToAppEntity(entities: BusinessPartner[]): Student[] {
    return transformBPartnersToStudents(entities);
  }

  protected transformSingleToAppEntity(entity: BusinessPartner): Student {
    return transformBPartnerToStudent(entity);
  }

  protected transformFromAppEntity(appEntity: Partial<Student>): Partial<BusinessPartner> {
    return transformStudentToBPartner(appEntity);
  }
}

/**
 * Singleton instance
 */
let businessPartnerServiceInstance: BusinessPartnerService | null = null;

/**
 * Get or create the BusinessPartnerService singleton
 */
export function getBusinessPartnerService(): BusinessPartnerService {
  if (!businessPartnerServiceInstance) {
    businessPartnerServiceInstance = new BusinessPartnerService();
  }
  return businessPartnerServiceInstance;
}
