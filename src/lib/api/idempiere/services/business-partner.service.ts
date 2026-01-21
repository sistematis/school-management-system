/**
 * iDempiere Business Partner Service
 *
 * Handles operations for C_BPartner entity (Students, Staff, Parents)
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/query-model
 */

import { getIdempiereClient } from "../client";
import { IDEMPIERE_CONFIG } from "../config";
import { transformBPartnersToStudents, transformBPartnerToStudent, transformStudentToBPartner } from "../transformers";
import type { BusinessPartner, PaginatedResponse, PaginationParams, QueryFilter, Student } from "../types";

/**
 * Business Partner Service
 */
export class BusinessPartnerService {
  private client = getIdempiereClient();

  /**
   * Get paginated list of students (Business Partners with specific BP Group)
   * @param pagination - Page and page size
   * @param filters - Optional query filters
   * @returns Paginated list of students
   */
  async getStudents(pagination: PaginationParams = {}, filters?: QueryFilter[]): Promise<PaginatedResponse<Student>> {
    const params: Record<string, string | number> = {
      page: pagination.page ?? 1,
      pagesize: pagination.pageSize ?? IDEMPIERE_CONFIG.defaultPageSize,
    };

    // Add filters if provided
    if (filters && filters.length > 0) {
      // iDempiere uses query string format for filters
      // Example: ?filter=Name_Eq_John&filter=IsActive_Eq_true
      filters.forEach((filter, index) => {
        params[`filter[${index}]`] = `${filter.column}_${filter.operator}_${filter.value}`;
      });
    }

    // Default filter for active students only
    if (!filters?.some((f) => f.column === "IsActive")) {
      const filterCount = filters?.length ?? 0;
      params[`filter[${filterCount}]`] = "IsActive_Eq_true";
    }

    try {
      const response = await this.client.get<{
        records?: BusinessPartner[];
        page?: number;
        pageSize?: number;
        totalPages?: number;
        totalRecords?: number;
        // sistematis backend specific fields
        "page-count"?: number;
        "records-size"?: number;
        "skip-records"?: number;
        "row-count"?: number;
      }>(IDEMPIERE_CONFIG.endpoints.businessPartner, params);

      const records = response.records ?? [];
      const students = transformBPartnersToStudents(records);

      // Handle both standard and sistematis pagination response
      const totalPages = response.totalPages ?? response["page-count"] ?? 1;
      const pageSize = response.pageSize ?? response["records-size"] ?? IDEMPIERE_CONFIG.defaultPageSize;
      const totalRecords = response.totalRecords ?? response["row-count"] ?? 0;

      return {
        records: students,
        page: response.page ?? 1,
        pageSize,
        totalPages,
        totalRecords,
      };
    } catch (error) {
      console.error("Failed to fetch students:", error);
      return {
        records: [],
        page: 1,
        pageSize: IDEMPIERE_CONFIG.defaultPageSize,
        totalPages: 0,
        totalRecords: 0,
      };
    }
  }

  /**
   * Get a single student by Business Partner ID
   * @param bpartnerId - C_BPartner_ID
   * @returns Student or null if not found
   */
  async getStudentById(bpartnerId: number): Promise<Student | null> {
    try {
      const response = await this.client.get<BusinessPartner>(
        `${IDEMPIERE_CONFIG.endpoints.businessPartner}/${bpartnerId}`,
      );

      return transformBPartnerToStudent(response);
    } catch (error) {
      console.error(`Failed to fetch student ${bpartnerId}:`, error);
      return null;
    }
  }

  /**
   * Get a single student by Value (search key)
   * @param value - Value field (e.g., "10A-001")
   * @returns Student or null if not found
   */
  async getStudentByValue(value: string): Promise<Student | null> {
    try {
      const params = {
        filter: `Value_Eq_${value}`,
      };

      const response = await this.client.get<{ records?: BusinessPartner[] }>(
        IDEMPIERE_CONFIG.endpoints.businessPartner,
        params,
      );

      const records = response.records ?? [];
      if (records.length === 0) return null;

      return transformBPartnerToStudent(records[0] ?? ({} as BusinessPartner));
    } catch (error) {
      console.error(`Failed to fetch student by value ${value}:`, error);
      return null;
    }
  }

  /**
   * Search students by name, email, or search key
   * @param searchTerm - Search term
   * @param pagination - Page and page size
   * @returns Paginated list of matching students
   */
  async searchStudents(searchTerm: string, pagination: PaginationParams = {}): Promise<PaginatedResponse<Student>> {
    // Use multiple filters for search (Name OR Value OR EMail)
    const filters: QueryFilter[] = [{ column: "Name", operator: "Like", value: `%${searchTerm}%` }];

    return this.getStudents(pagination, filters);
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
    let filterValue: string;

    if (typeof grade === "number") {
      filterValue = grade.toString();
    } else {
      // Use grade name, assuming BP Group has matching name
      filterValue = grade;
    }

    const filters: QueryFilter[] = [{ column: "C_BP_Group_ID", operator: "Eq", value: filterValue }];

    return this.getStudents(pagination, filters);
  }

  /**
   * Create a new student
   * @param student - Student data to create
   * @returns Created student or null if failed
   */
  async createStudent(student: Partial<Student>): Promise<Student | null> {
    try {
      const bPartnerData = transformStudentToBPartner(student);

      const response = await this.client.post<{ records?: BusinessPartner[] }>(
        IDEMPIERE_CONFIG.endpoints.businessPartner,
        {
          records: [bPartnerData],
        },
      );

      const records = response.records ?? [];
      if (records.length === 0) return null;

      return transformBPartnerToStudent(records[0] ?? ({} as BusinessPartner));
    } catch (error) {
      console.error("Failed to create student:", error);
      return null;
    }
  }

  /**
   * Update an existing student
   * @param bpartnerId - C_BPartner_ID of student to update
   * @param student - Updated student data
   * @returns Updated student or null if failed
   */
  async updateStudent(bpartnerId: number, student: Partial<Student>): Promise<Student | null> {
    try {
      const bPartnerData = transformStudentToBPartner(student);

      const response = await this.client.put<{ records?: BusinessPartner[] }>(
        `${IDEMPIERE_CONFIG.endpoints.businessPartner}/${bpartnerId}`,
        {
          records: [bPartnerData],
        },
      );

      const records = response.records ?? [];
      if (records.length === 0) return null;

      return transformBPartnerToStudent(records[0] ?? ({} as BusinessPartner));
    } catch (error) {
      console.error(`Failed to update student ${bpartnerId}:`, error);
      return null;
    }
  }

  /**
   * Delete (deactivate) a student
   * @param bpartnerId - C_BPartner_ID of student to delete
   * @returns true if successful, false otherwise
   */
  async deleteStudent(bpartnerId: number): Promise<boolean> {
    try {
      // Instead of hard delete, set IsActive = false
      await this.client.put(`${IDEMPIERE_CONFIG.endpoints.businessPartner}/${bpartnerId}`, {
        records: [{ IsActive: false }],
      });

      return true;
    } catch (error) {
      console.error(`Failed to delete student ${bpartnerId}:`, error);
      return false;
    }
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
