/**
 * Base Service for iDempiere REST API
 *
 * Provides reusable querying functionality using the QueryBuilder
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 */

import { getIdempiereClient } from "../client";
import type { BuiltQuery, QueryBuilder, QueryConfig } from "../query";
import type { ODataResponse, PaginatedResponse, PaginationParams } from "../types";

/**
 * Base service class for iDempiere models
 * Provides common CRUD operations with OData-style query support
 */
export abstract class IdempiereBaseService<TEntity, TAppEntity = TEntity> {
  protected client = getIdempiereClient();
  abstract readonly endpoint: string;

  /**
   * Query records using QueryBuilder configuration
   * @param config - Query configuration from QueryBuilder
   * @returns Paginated response with records
   */
  async query(config: QueryConfig): Promise<PaginatedResponse<TAppEntity>> {
    const { buildQuery } = await import("../query");
    const { params } = buildQuery(config);

    try {
      const response = await this.client.query<ODataResponse<TEntity>>(this.endpoint, params as Record<string, string>);

      const records = response.records ?? [];
      const appRecords = this.transformToAppEntity(records);

      // Handle both standard and sistematis pagination response
      const totalPages = response["page-count"] ?? 1;
      const pageSize = response["records-size"] ?? records.length;
      const totalRecords = response["row-count"] ?? 0;

      return {
        records: appRecords,
        page: this.calculatePage(response["skip-records"] ?? 0, pageSize),
        pageSize,
        totalPages,
        totalRecords,
      };
    } catch (error) {
      console.error(`Failed to query ${this.endpoint}:`, error);
      return this.emptyResponse();
    }
  }

  /**
   * Get paginated list of records
   * @param pagination - Page and page size
   * @returns Paginated list of records
   */
  async getAll(pagination: PaginationParams = {}): Promise<PaginatedResponse<TAppEntity>> {
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 100;

    return this.query({
      skip: (page - 1) * pageSize,
      top: pageSize,
    });
  }

  /**
   * Get a single record by ID
   * @param id - Record ID
   * @returns Record or null if not found
   */
  async getById(id: number | string): Promise<TAppEntity | null> {
    try {
      const response = await this.client.get<TEntity>(`${this.endpoint}/${id}`);
      return this.transformSingleToAppEntity(response);
    } catch (error) {
      console.error(`Failed to fetch ${this.endpoint}/${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new record
   * @param data - Data to create
   * @returns Created record or null if failed
   */
  async create(data: Partial<TAppEntity>): Promise<TAppEntity | null> {
    try {
      const entityData = this.transformFromAppEntity(data);

      const response = await this.client.post<{ records?: TEntity[] }>(this.endpoint, {
        records: [entityData],
      });

      const records = response.records ?? [];
      if (records.length === 0) return null;

      return this.transformSingleToAppEntity(records[0] ?? ({} as TEntity));
    } catch (error) {
      console.error(`Failed to create ${this.endpoint}:`, error);
      return null;
    }
  }

  /**
   * Update an existing record
   * @param id - Record ID
   * @param data - Updated data
   * @returns Updated record or null if failed
   */
  async update(id: number | string, data: Partial<TAppEntity>): Promise<TAppEntity | null> {
    try {
      const entityData = this.transformFromAppEntity(data);

      const response = await this.client.put<{ records?: TEntity[] }>(`${this.endpoint}/${id}`, {
        records: [entityData],
      });

      const records = response.records ?? [];
      if (records.length === 0) return null;

      return this.transformSingleToAppEntity(records[0] ?? ({} as TEntity));
    } catch (error) {
      console.error(`Failed to update ${this.endpoint}/${id}:`, error);
      return null;
    }
  }

  /**
   * Delete (deactivate) a record
   * @param id - Record ID
   * @returns true if successful, false otherwise
   */
  async delete(id: number | string): Promise<boolean> {
    try {
      // Instead of hard delete, set IsActive = false
      await this.client.put(`${this.endpoint}/${id}`, {
        records: [{ IsActive: false }],
      });

      return true;
    } catch (error) {
      console.error(`Failed to delete ${this.endpoint}/${id}:`, error);
      return false;
    }
  }

  /**
   * Permanently delete a record (hard delete)
   * @param id - Record ID
   * @returns true if successful, false otherwise
   */
  async hardDelete(id: number | string): Promise<boolean> {
    try {
      await this.client.delete(`${this.endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to hard delete ${this.endpoint}/${id}:`, error);
      return false;
    }
  }

  /**
   * Search records by a query string
   * @param searchTerm - Search term to filter by
   * @param searchField - Field to search in (default: "Name")
   * @param pagination - Page and page size
   * @returns Paginated list of matching records
   */
  async search(
    searchTerm: string,
    searchField = "Name",
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<TAppEntity>> {
    const { methodFilter } = await import("../query");

    return this.query({
      filter: methodFilter("contains", searchField, searchTerm),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Filter records by field value
   * @param field - Field name
   * @param value - Field value
   * @param operator - Comparison operator (default: "eq")
   * @param pagination - Page and page size
   * @returns Paginated list of matching records
   */
  async filterBy(
    field: string,
    value: string | number | boolean,
    operator: "eq" | "neq" | "gt" | "ge" | "lt" | "le" = "eq",
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<TAppEntity>> {
    const { filter } = await import("../query");

    return this.query({
      filter: filter(field, operator, value),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Get records sorted by field
   * @param field - Field to sort by
   * @param order - Sort order (default: "asc")
   * @param pagination - Page and page size
   * @returns Paginated list of sorted records
   */
  async sortBy(
    field: string,
    order: "asc" | "desc" = "asc",
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<TAppEntity>> {
    const { orderBy } = await import("../query");

    return this.query({
      orderBy: orderBy(field, order),
      ...this.buildPaginationConfig(pagination),
    });
  }

  /**
   * Transform entity array to app entity array
   * Override this method to customize transformation
   */
  protected transformToAppEntity(entities: TEntity[]): TAppEntity[] {
    return entities as unknown as TAppEntity[];
  }

  /**
   * Transform single entity to app entity
   * Override this method to customize transformation
   */
  protected transformSingleToAppEntity(entity: TEntity): TAppEntity {
    return entity as unknown as TAppEntity;
  }

  /**
   * Transform app entity to iDempiere entity
   * Override this method to customize transformation
   */
  protected transformFromAppEntity(appEntity: Partial<TAppEntity>): Partial<TEntity> {
    return appEntity as unknown as Partial<TEntity>;
  }

  /**
   * Build pagination config from PaginationParams
   */
  protected buildPaginationConfig(pagination: PaginationParams): Partial<QueryConfig> {
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 100;

    return {
      skip: (page - 1) * pageSize,
      top: pageSize,
    };
  }

  /**
   * Calculate page number from skip and pageSize
   */
  protected calculatePage(skip: number, pageSize: number): number {
    return Math.floor(skip / pageSize) + 1;
  }

  /**
   * Return empty response
   */
  protected emptyResponse(): PaginatedResponse<TAppEntity> {
    return {
      records: [],
      page: 1,
      pageSize: 100,
      totalPages: 0,
      totalRecords: 0,
    };
  }
}
