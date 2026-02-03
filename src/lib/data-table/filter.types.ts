// src/lib/data-table/filter.types.ts

import type { LucideIcon } from "lucide-react";

/**
 * OData operators supported by iDempiere REST API
 * Reference: docs/api/common-structures.md
 */
export type ODataOperator =
  | "eq" // equals (=)
  | "neq" // not equals (!=)
  | "in" // in list (IN)
  | "gt" // greater than (>)
  | "ge" // greater or equal (>=)
  | "lt" // less than (<)
  | "le" // less or equal (<=)
  | "contains" // contains(field,'value')
  | "startswith" // startswith(field,'value')
  | "endswith"; // endswith(field,'value')

/**
 * Filter value type for proper OData formatting
 */
export type FilterFieldType = "boolean" | "string" | "enum" | "number" | "date" | "reference";

/**
 * Reference field configuration for dynamic option fetching
 */
export interface ReferenceFieldConfig {
  endpoint: string; // API endpoint to fetch options from
  labelField: string; // Field name to use as label
  valueField: string; // Field name to use as value
  filter?: string; // Optional OData filter for fetching options
  sort?: string; // Optional OData sort for fetching options
}

/**
 * Metadata for a filterable field
 */
export interface FilterFieldMetadata<
  TFieldType extends FilterFieldType = FilterFieldType,
  TOperator extends ODataOperator = ODataOperator,
> {
  label: string;
  type: TFieldType;
  operators: readonly TOperator[];
  icon?: LucideIcon;
  searchable?: boolean; // For global search input
  options?: readonly { label: string; value: string }[];
  modelName?: string; // For reference fields
  reference?: ReferenceFieldConfig; // For dynamic reference option fetching
  clientSide?: boolean; // Filter should be applied client-side (for navigation properties)
}

/**
 * Dynamic filter metadata for any iDempiere model
 */
export type ModelFilterMetadata = Record<string, FilterFieldMetadata>;

/**
 * Active filter state (runtime)
 */
export interface ActiveFilter {
  field: string; // Model field name
  operator: ODataOperator;
  value: string | string[]; // Multi-select support
}

/**
 * Filter group for UI organization
 */
export interface FilterGroup {
  id: string;
  title: string;
  fields: string[]; // Field names (keys from ModelFilterMetadata)
}

/**
 * Complete filter schema for a model
 */
export interface FilterSchema {
  metadata: ModelFilterMetadata;
  groups: FilterGroup[];
}
