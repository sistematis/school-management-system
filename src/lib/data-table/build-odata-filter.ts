// src/lib/data-table/build-odata-filter.ts

import type { ActiveFilter, FilterFieldMetadata, FilterFieldType, ODataOperator } from "./filter.types";

type MetadataMap = Record<string, FilterFieldMetadata>;

/**
 * Build iDempiere OData $filter string from active filters
 * Follows iDempiere REST API standard
 * Note: Filters marked with clientSide=true are excluded from OData query
 */
export function buildODataFilter(
  activeFilters: ActiveFilter[],
  metadataMap: MetadataMap | FilterFieldMetadata[],
): string | null {
  if (activeFilters.length === 0) return null;

  // Convert array to map if needed
  const metadata: MetadataMap = Array.isArray(metadataMap) ? {} : metadataMap;

  const clauses: string[] = [];

  for (const filter of activeFilters) {
    const fieldMetadata = metadata[filter.field];
    if (!fieldMetadata) continue;

    // Skip client-side filters (navigation properties not supported by iDempiere OData)
    if ("clientSide" in fieldMetadata && fieldMetadata.clientSide) continue;

    const clause = buildFilterClause(filter.field, filter.operator, filter.value, fieldMetadata.type);

    if (clause) {
      clauses.push(clause);
    }
  }

  return clauses.length > 0 ? clauses.join(" and ") : null;
}

/**
 * Extract client-side filters from active filters
 * Returns filters that should be applied on the client side
 */
export function getClientSideFilters(
  activeFilters: ActiveFilter[],
  metadataMap: MetadataMap | FilterFieldMetadata[],
): ActiveFilter[] {
  if (activeFilters.length === 0) return [];

  // Convert array to map if needed
  const metadata: MetadataMap = Array.isArray(metadataMap) ? {} : metadataMap;

  return activeFilters.filter((filter) => {
    const fieldMetadata = metadata[filter.field];
    if (!fieldMetadata) return false;
    return "clientSide" in fieldMetadata && fieldMetadata.clientSide;
  });
}

/**
 * Build single OData filter clause
 */
function buildFilterClause(
  field: string,
  operator: ODataOperator,
  value: string | string[],
  valueType: FilterFieldType,
): string | null {
  // Handle multi-select values
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (value.length === 1) {
      return buildSingleValueClause(field, operator, value[0], valueType);
    }
    // For multiple values, use OR logic: (field eq 'a' or field eq 'b')
    const clauses = value.map((v) => buildSingleValueClause(field, operator, v, valueType)).filter(Boolean);
    return clauses.length > 0 ? `(${clauses.join(" or ")})` : null;
  }

  return buildSingleValueClause(field, operator, value, valueType);
}

function buildSingleValueClause(
  field: string,
  operator: ODataOperator,
  value: string,
  valueType: FilterFieldType,
): string | null {
  switch (operator) {
    case "contains":
      return `contains(${field},'${value}')`;
    case "startswith":
      return `startswith(${field},'${value}')`;
    case "endswith":
      return `endswith(${field},'${value}')`;
    case "in": {
      const values = value
        .split(",")
        .map((v) => `'${v.trim()}'`)
        .join(",");
      return `${field} in (${values})`;
    }
    default: {
      const formattedValue = formatODataValue(value, valueType);
      return `${field} ${operator} ${formattedValue}`;
    }
  }
}

/**
 * Format value for OData query
 */
function formatODataValue(value: string, type: FilterFieldType): string {
  switch (type) {
    case "string":
    case "enum":
    case "reference":
    case "date":
      return `'${value}'`;
    case "number":
      return value;
    case "boolean":
      return value.toLowerCase();
    default:
      return `'${value}'`;
  }
}
