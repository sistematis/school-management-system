/**
 * iDempiere Query Builder Module
 *
 * Reusable querying data utilities for iDempiere REST API
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 *
 * @example
 * import { QueryBuilder, filter, and, expand } from '@/lib/api/idempiere/query';
 *
 * const query = new QueryBuilder()
 *   .filter('Name', 'eq', 'John')
 *   .and('IsActive', 'eq', true)
 *   .orderBy('Created', 'desc')
 *   .top(10)
 *   .expand(expand('C_BP_Group', { select: ['Name'] }))
 *   .build();
 */

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
} from "./query-builder";
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
} from "./query-builder";
