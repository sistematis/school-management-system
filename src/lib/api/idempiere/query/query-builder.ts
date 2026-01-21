/**
 * iDempiere REST API Query Builder
 *
 * Type-safe query builder for constructing OData-style queries
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * Features:
 * - $filter: Logical and method operators
 * - $orderby: Ascending/descending sort
 * - $top and $skip: Pagination
 * - $select: Property selection
 * - $expand: Related entity expansion
 * - iDempiere-specific: $valrule, $context, showsql, label, showlabel
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Logical operators for $filter
 */
export type LogicalOperator =
  | "eq" // equals (=)
  | "neq" // not equals (!=)
  | "in" // in list (IN)
  | "gt" // greater than (>)
  | "ge" // greater or equal (>=)
  | "lt" // less than (<)
  | "le" // less or equal (<=)
  | "and" // logical AND
  | "or" // logical OR
  | "not"; // logical NOT

/**
 * Method operators for $filter (strings must use single quotes)
 */
export type MethodOperator = "contains" | "startswith" | "endswith" | "tolower" | "toupper";

/**
 * Sort order for $orderby
 */
export type SortOrder = "asc" | "desc";

/**
 * Filter condition types
 */
export type FilterCondition = LogicalFilter | MethodFilter | CompoundFilter | NotFilter | InFilter;

/**
 * Logical filter: field operator value
 * Example: Name eq 'John'
 */
export interface LogicalFilter {
  type: "logical";
  field: string;
  operator: Extract<LogicalOperator, "eq" | "neq" | "gt" | "ge" | "lt" | "le">;
  value: string | number | boolean;
}

/**
 * Method filter: method(field, 'value')
 * Example: contains(Name, 'John')
 */
export interface MethodFilter {
  type: "method";
  operator: Extract<MethodOperator, "contains" | "startswith" | "endswith">;
  field: string;
  value: string;
}

/**
 * Text transformation filter: tolower(field) or toupper(field)
 * Used in combination with other filters
 */
export interface TextTransformFilter {
  type: "transform";
  operator: Extract<MethodOperator, "tolower" | "toupper">;
  field: string;
}

/**
 * Compound filter: filter1 AND/OR filter2
 * Example: Name eq 'John' AND IsActive eq true
 */
export interface CompoundFilter {
  type: "compound";
  operator: Extract<LogicalOperator, "and" | "or">;
  left: FilterCondition;
  right: FilterCondition;
}

/**
 * NOT filter: NOT(filter)
 * Example: NOT(IsActive eq false)
 */
export interface NotFilter {
  type: "not";
  filter: FilterCondition;
}

/**
 * IN filter: field in (value1, value2, ...)
 * Example: ID in (1, 2, 3)
 */
export interface InFilter {
  type: "in";
  field: string;
  values: Array<string | number>;
}

/**
 * Order by clause
 */
export interface OrderByClause {
  field: string;
  order?: SortOrder;
}

/**
 * Expand clause with optional nested query options
 * Example: C_OrderLine($select=Line;$filter=LineNetAmt gt 1000)
 */
export interface ExpandClause {
  field: string;
  select?: string[];
  filter?: FilterCondition;
  orderBy?: OrderByClause;
  top?: number;
  skip?: number;
  customJoinKey?: string; // For custom join like C_order.salesrep_id
}

/**
 * iDempiere-specific query options
 */
export interface IdempiereOptions {
  /** Validation rule by ID or UUID */
  valrule?: string | number;
  /** Context variables: VariableName:Value */
  context?: Record<string, string | number>;
  /** Show SQL query in response */
  showsql?: boolean;
  /** Show SQL without data */
  showsqlNoData?: boolean;
  /** Filter by label */
  label?: string;
  /** Include assigned labels in response */
  showlabel?: boolean | string[];
}

/**
 * Complete query configuration
 */
export interface QueryConfig {
  /** Filter conditions */
  filter?: FilterCondition;
  /** Order by clauses */
  orderBy?: OrderByClause | OrderByClause[];
  /** Number of records to return ($top) */
  top?: number;
  /** Number of records to skip ($skip) */
  skip?: number;
  /** Properties to select ($select) */
  select?: string[];
  /** Related entities to expand ($expand) */
  expand?: ExpandClause | ExpandClause[];
  /** iDempiere-specific options */
  idempiere?: IdempiereOptions;
}

/**
 * Built query result
 */
export interface BuiltQuery {
  url: string;
  params: Record<string, string>;
}

// =============================================================================
// Query Builder Class
// =============================================================================

/**
 * Fluent query builder for iDempiere REST API
 *
 * @example
 * const query = new QueryBuilder()
 *   .filter("Name", "eq", "John")
 *   .and("IsActive", "eq", true)
 *   .orderBy("Created", "desc")
 *   .top(10)
 *   .build();
 */
export class QueryBuilder {
  private config: QueryConfig = {};
  private currentFilter?: FilterCondition;

  /**
   * Set the base filter (starts a new filter chain)
   * @param field - Field name
   * @param operator - Logical operator
   * @param value - Filter value
   */
  filter(
    field: string,
    operator: Extract<LogicalOperator, "eq" | "neq" | "gt" | "ge" | "lt" | "le">,
    value: string | number | boolean,
  ): this {
    this.currentFilter = {
      type: "logical",
      field,
      operator,
      value,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * Add a method filter (contains, startswith, endswith)
   * @param operator - Method operator
   * @param field - Field name
   * @param value - Search value
   */
  methodFilter(
    operator: Extract<MethodOperator, "contains" | "startswith" | "endswith">,
    field: string,
    value: string,
  ): this {
    this.currentFilter = {
      type: "method",
      operator,
      field,
      value,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * Add an IN filter
   * @param field - Field name
   * @param values - Array of values
   */
  inFilter(field: string, values: Array<string | number>): this {
    this.currentFilter = {
      type: "in",
      field,
      values,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * AND condition with previous filter
   * @param field - Field name
   * @param operator - Logical operator
   * @param value - Filter value
   */
  and(
    field: string,
    operator: Extract<LogicalOperator, "eq" | "neq" | "gt" | "ge" | "lt" | "le">,
    value: string | number | boolean,
  ): this {
    if (!this.currentFilter) {
      return this.filter(field, operator, value);
    }
    const newFilter: LogicalFilter = {
      type: "logical",
      field,
      operator,
      value,
    };
    this.currentFilter = {
      type: "compound",
      operator: "and",
      left: this.currentFilter,
      right: newFilter,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * OR condition with previous filter
   * @param field - Field name
   * @param operator - Logical operator
   * @param value - Filter value
   */
  or(
    field: string,
    operator: Extract<LogicalOperator, "eq" | "neq" | "gt" | "ge" | "lt" | "le">,
    value: string | number | boolean,
  ): this {
    if (!this.currentFilter) {
      return this.filter(field, operator, value);
    }
    const newFilter: LogicalFilter = {
      type: "logical",
      field,
      operator,
      value,
    };
    this.currentFilter = {
      type: "compound",
      operator: "or",
      left: this.currentFilter,
      right: newFilter,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * NOT condition for the current filter
   */
  not(): this {
    if (!this.currentFilter) {
      return this;
    }
    this.currentFilter = {
      type: "not",
      filter: this.currentFilter,
    };
    this.config.filter = this.currentFilter;
    return this;
  }

  /**
   * Order by field (ascending by default)
   * @param field - Field name
   * @param order - Sort order
   */
  orderBy(field: string, order?: SortOrder): this {
    this.config.orderBy = { field, order };
    return this;
  }

  /**
   * Add multiple order by clauses
   * @param clauses - Array of order by clauses
   */
  orderByMultiple(...clauses: OrderByClause[]): this {
    this.config.orderBy = clauses;
    return this;
  }

  /**
   * Set top (limit) number of records
   * @param count - Number of records to return
   */
  top(count: number): this {
    this.config.top = count;
    return this;
  }

  /**
   * Set skip (offset) number of records
   * @param count - Number of records to skip
   */
  skip(count: number): this {
    this.config.skip = count;
    return this;
  }

  /**
   * Set pagination (top and skip)
   * @param page - Page number (1-based)
   * @param pageSize - Number of records per page
   */
  paginate(page: number, pageSize: number): this {
    this.config.skip = (page - 1) * pageSize;
    this.config.top = pageSize;
    return this;
  }

  /**
   * Select specific properties
   * @param properties - Property names to select
   */
  select(...properties: string[]): this {
    this.config.select = properties;
    return this;
  }

  /**
   * Expand related entities
   * @param expands - Expand clauses
   */
  expand(...expands: ExpandClause[]): this {
    this.config.expand = expands.length === 1 ? expands[0] : expands;
    return this;
  }

  /**
   * Add iDempiere-specific options
   * @param options - Idempiere options
   */
  withIdempiereOptions(options: IdempiereOptions): this {
    this.config.idempiere = { ...this.config.idempiere, ...options };
    return this;
  }

  /**
   * Set validation rule
   * @param valrule - Validation rule ID or UUID
   */
  withValRule(valrule: string | number): this {
    this.config.idempiere = { ...this.config.idempiere, valrule };
    return this;
  }

  /**
   * Add context variable
   * @param name - Variable name
   * @param value - Variable value
   */
  withContext(name: string, value: string | number): this {
    const context = { ...this.config.idempiere?.context, [name]: value };
    this.config.idempiere = { ...this.config.idempiere, context };
    return this;
  }

  /**
   * Enable SQL query tracing
   * @param noData - Return only query info without records
   */
  withShowSql(noData = false): this {
    if (noData) {
      this.config.idempiere = { ...this.config.idempiere, showsqlNoData: true };
    } else {
      this.config.idempiere = { ...this.config.idempiere, showsql: true };
    }
    return this;
  }

  /**
   * Filter by label
   * @param label - Label filter expression
   */
  withLabel(label: string): this {
    this.config.idempiere = { ...this.config.idempiere, label };
    return this;
  }

  /**
   * Include assigned labels in response
   * @param columns - Columns to include (true for all, or array of specific columns)
   */
  withShowLabel(columns?: true | string[]): this {
    this.config.idempiere = {
      ...this.config.idempiere,
      showlabel: columns === true ? true : columns,
    };
    return this;
  }

  /**
   * Build the query string and parameters
   */
  build(): BuiltQuery {
    const params: Record<string, string> = {};

    // Build $filter
    if (this.config.filter) {
      params["$filter"] = this.buildFilter(this.config.filter);
    }

    // Build $orderby
    if (this.config.orderBy) {
      params["$orderby"] = this.buildOrderBy(this.config.orderBy);
    }

    // Build $top
    if (this.config.top !== undefined) {
      params["$top"] = String(this.config.top);
    }

    // Build $skip
    if (this.config.skip !== undefined) {
      params["$skip"] = String(this.config.skip);
    }

    // Build $select
    if (this.config.select && this.config.select.length > 0) {
      params["$select"] = this.config.select.join(",");
    }

    // Build $expand
    if (this.config.expand) {
      params["$expand"] = this.buildExpand(this.config.expand);
    }

    // Build iDempiere-specific options
    if (this.config.idempiere) {
      if (this.config.idempiere.valrule !== undefined) {
        params["$valrule"] = String(this.config.idempiere.valrule);
      }
      if (this.config.idempiere.context) {
        const contextEntries = Object.entries(this.config.idempiere.context)
          .map(([k, v]) => `${k}:${v}`)
          .join(",");
        params["$context"] = contextEntries;
      }
      if (this.config.idempiere.showsql) {
        params.showsql = "true";
      }
      if (this.config.idempiere.showsqlNoData) {
        params.showsql = "nodata";
      }
      if (this.config.idempiere.label) {
        params.label = this.config.idempiere.label;
      }
      if (this.config.idempiere.showlabel === true) {
        params.showlabel = "true";
      } else if (Array.isArray(this.config.idempiere.showlabel)) {
        params.showlabel = this.config.idempiere.showlabel.join(",");
      }
    }

    return {
      url: "",
      params,
    };
  }

  /**
   * Get the query string (for use in URLs)
   */
  toQueryString(): string {
    const { params } = this.build();
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    return searchParams.toString();
  }

  /**
   * Build filter expression
   */
  private buildFilter(filter: FilterCondition, nested = false): string {
    switch (filter.type) {
      case "logical": {
        const value = this.formatValue(filter.value);
        return `${filter.field} ${filter.operator} ${value}`;
      }
      case "method": {
        return `${filter.operator}(${filter.field},'${filter.value}')`;
      }
      case "in": {
        const values = filter.values.map((v) => this.formatValue(v)).join(",");
        return `${filter.field} in (${values})`;
      }
      case "compound": {
        const left = this.buildFilter(filter.left, true);
        const right = this.buildFilter(filter.right, true);
        const expression = `${left} ${filter.operator.toUpperCase()} ${right}`;
        return nested ? `(${expression})` : expression;
      }
      case "not": {
        const inner = this.buildFilter(filter.filter, true);
        return `NOT ${inner}`;
      }
      default: {
        const _exhaustive: never = filter;
        return "";
      }
    }
  }

  /**
   * Build order by expression
   */
  private buildOrderBy(orderBy: OrderByClause | OrderByClause[]): string {
    if (Array.isArray(orderBy)) {
      return orderBy.map((o) => `${o.field}${o.order ? " " + o.order : ""}`).join(",");
    }
    return `${orderBy.field}${orderBy.order ? " " + orderBy.order : ""}`;
  }

  /**
   * Build expand expression
   */
  private buildExpand(expand: ExpandClause | ExpandClause[]): string {
    if (Array.isArray(expand)) {
      return expand.map((e) => this.buildSingleExpand(e)).join(",");
    }
    return this.buildSingleExpand(expand);
  }

  /**
   * Build a single expand expression
   */
  private buildSingleExpand(expand: ExpandClause): string {
    let expression = expand.field;

    // Custom join key
    if (expand.customJoinKey) {
      expression = `${expand.field}.${expand.customJoinKey}`;
    }

    // Nested options
    const nestedOptions: string[] = [];

    if (expand.select && expand.select.length > 0) {
      nestedOptions.push(`$select=${expand.select.join(",")}`);
    }

    if (expand.filter) {
      nestedOptions.push(`$filter=${this.buildFilter(expand.filter)}`);
    }

    if (expand.orderBy) {
      nestedOptions.push(`$orderby=${this.buildOrderBy(expand.orderBy)}`);
    }

    if (expand.top !== undefined) {
      nestedOptions.push(`$top=${expand.top}`);
    }

    if (expand.skip !== undefined) {
      nestedOptions.push(`$skip=${expand.skip}`);
    }

    if (nestedOptions.length > 0) {
      expression += `(${nestedOptions.join("; ")})`;
    }

    return expression;
  }

  /**
   * Format a value for use in filter expressions
   */
  private formatValue(value: string | number | boolean): string {
    if (typeof value === "string") {
      return `'${value}'`;
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return String(value);
  }

  /**
   * Reset the builder to initial state
   */
  reset(): this {
    this.config = {};
    this.currentFilter = undefined;
    return this;
  }

  /**
   * Clone the builder
   */
  clone(): QueryBuilder {
    const cloned = new QueryBuilder();
    cloned.config = JSON.parse(JSON.stringify(this.config));
    cloned.currentFilter = this.config.filter ? JSON.parse(JSON.stringify(this.config.filter)) : undefined;
    return cloned;
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a filter condition (logical operator)
 * @param field - Field name
 * @param operator - Logical operator
 * @param value - Filter value
 */
export function filter(
  field: string,
  operator: Extract<LogicalOperator, "eq" | "neq" | "gt" | "ge" | "lt" | "le">,
  value: string | number | boolean,
): LogicalFilter {
  return { type: "logical", field, operator, value };
}

/**
 * Create a method filter condition
 * @param operator - Method operator
 * @param field - Field name
 * @param value - Search value
 */
export function methodFilter(
  operator: Extract<MethodOperator, "contains" | "startswith" | "endswith">,
  field: string,
  value: string,
): MethodFilter {
  return { type: "method", operator, field, value };
}

/**
 * Create an IN filter condition
 * @param field - Field name
 * @param values - Array of values
 */
export function inFilter(field: string, values: Array<string | number>): InFilter {
  return { type: "in", field, values };
}

/**
 * Combine filters with AND
 * @param filters - Filter conditions to combine
 */
export function and(...filters: FilterCondition[]): FilterCondition {
  if (filters.length === 0) {
    throw new Error("AND requires at least one filter");
  }
  if (filters.length === 1) {
    return filters[0];
  }
  return filters
    .slice(1)
    .reduce(
      (acc, filter) => ({ type: "compound" as const, operator: "and" as const, left: acc, right: filter }),
      filters[0],
    );
}

/**
 * Combine filters with OR
 * @param filters - Filter conditions to combine
 */
export function or(...filters: FilterCondition[]): FilterCondition {
  if (filters.length === 0) {
    throw new Error("OR requires at least one filter");
  }
  if (filters.length === 1) {
    return filters[0];
  }
  return filters
    .slice(1)
    .reduce(
      (acc, filter) => ({ type: "compound" as const, operator: "or" as const, left: acc, right: filter }),
      filters[0],
    );
}

/**
 * Negate a filter
 * @param filter - Filter condition to negate
 */
export function not(filter: FilterCondition): NotFilter {
  return { type: "not", filter };
}

/**
 * Create an order by clause
 * @param field - Field name
 * @param order - Sort order
 */
export function orderBy(field: string, order?: SortOrder): OrderByClause {
  return { field, order };
}

/**
 * Create an expand clause
 * @param field - Field name to expand
 * @param options - Optional nested query options
 */
export function expand(field: string, options?: Omit<ExpandClause, "field">): ExpandClause {
  return { field, ...options };
}

/**
 * Build a query from configuration object
 * @param config - Query configuration
 */
export function buildQuery(config: QueryConfig): BuiltQuery {
  const builder = new QueryBuilder();

  // Use the builder's public methods to set config
  if (config.filter) {
    // For complex filters, set both internal state and config
    (builder as unknown as { currentFilter?: FilterCondition; config: QueryConfig }).currentFilter = config.filter;
    (builder as unknown as { config: QueryConfig }).config.filter = config.filter;
  }

  if (config.orderBy) {
    if (Array.isArray(config.orderBy)) {
      builder.orderByMultiple(...config.orderBy);
    } else {
      builder.orderBy(config.orderBy.field, config.orderBy.order);
    }
  }

  if (config.top !== undefined) {
    builder.top(config.top);
  }

  if (config.skip !== undefined) {
    builder.skip(config.skip);
  }

  if (config.select && config.select.length > 0) {
    builder.select(...config.select);
  }

  if (config.expand) {
    if (Array.isArray(config.expand)) {
      builder.expand(...config.expand);
    } else {
      builder.expand(config.expand);
    }
  }

  if (config.idempiere) {
    builder.withIdempiereOptions(config.idempiere);
  }

  return builder.build();
}

/**
 * Convert query configuration to URL query string
 * @param config - Query configuration
 */
export function toQueryString(config: QueryConfig): string {
  const { params } = buildQuery(config);
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  return searchParams.toString();
}
