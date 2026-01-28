# Dynamic Data Table System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reusable, schema-driven data table system with dynamic filters from iDempiere model types, URL parameter sync, and OData integration.

**Architecture:** Layered architecture with Page Layer → Table Layer → Filter Engine → Model Schemas. Filters sync bi-directionally with URL params, convert to iDempiere OData `$filter` queries, and reflect in both table data and statistics.

**Tech Stack:** Next.js 15, React 19, TanStack Table, TanStack Query, Shadcn/UI, iDempiere REST API (OData), TypeScript

---

## Task 1: Create Filter Type Definitions

**Files:**
- Create: `src/lib/data-table/filter.types.ts`

**Step 1: Create the type definitions file**

```typescript
// src/lib/data-table/filter.types.ts

import { LucideIcon } from "lucide-react";

/**
 * OData operators supported by iDempiere REST API
 * Reference: docs/api/common-structures.md
 */
export type ODataOperator =
  | "eq"      // equals (=)
  | "neq"     // not equals (!=)
  | "in"      // in list (IN)
  | "gt"      // greater than (>)
  | "ge"      // greater or equal (>=)
  | "lt"      // less than (<)
  | "le"      // less or equal (<=)
  | "contains"   // contains(field,'value')
  | "startswith" // startswith(field,'value')
  | "endswith";  // endswith(field,'value')

/**
 * Filter value type for proper OData formatting
 */
export type FilterFieldType = "boolean" | "string" | "enum" | "number" | "date" | "reference";

/**
 * Metadata for a filterable field
 */
export interface FilterFieldMetadata<
  TFieldType extends FilterFieldType = FilterFieldType,
  TOperator extends ODataOperator = ODataOperator
> {
  label: string;
  type: TFieldType;
  operators: readonly TOperator[];
  icon?: LucideIcon;
  searchable?: boolean; // For global search input
  options?: readonly { label: string; value: string }[];
  modelName?: string; // For reference fields
}

/**
 * Dynamic filter metadata for any iDempiere model
 */
export type ModelFilterMetadata = Record<string, FilterFieldMetadata>;

/**
 * Active filter state (runtime)
 */
export interface ActiveFilter {
  field: string;      // Model field name
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
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors (new file, no dependencies yet)

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/filter.types.ts
git commit -m "feat(data-table): add filter type definitions

Add core types for the dynamic filter system:
- ODataOperator: All iDempiere-supported operators
- FilterFieldMetadata: Field filter configuration
- ActiveFilter: Runtime filter state
- FilterSchema: Complete schema with groups

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 2: Create OData Filter Builder

**Files:**
- Create: `src/lib/data-table/build-odata-filter.ts`

**Step 1: Create test file**

```typescript
// src/lib/data-table/build-odata-filter.test.ts

import { describe, it, expect } from "vitest";
import { buildODataFilter } from "./build-odata-filter";

describe("buildODataFilter", () => {
  it("should build single boolean filter", () => {
    const metadata = {
      IsActive: {
        label: "Active",
        type: "boolean" as const,
        operators: ["eq"] as const,
      },
    };
    const filters = [{ field: "IsActive", operator: "eq" as const, value: "true" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("IsActive eq true");
  });

  it("should build string contains filter", () => {
    const metadata = {
      Name: {
        label: "Name",
        type: "string" as const,
        operators: ["contains"] as const,
      },
    };
    const filters = [{ field: "Name", operator: "contains" as const, value: "John" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("contains(Name,'John')");
  });

  it("should build multiple filters with AND", () => {
    const metadata = {
      IsActive: {
        label: "Active",
        type: "boolean" as const,
        operators: ["eq"] as const,
      },
      Name: {
        label: "Name",
        type: "string" as const,
        operators: ["contains"] as const,
      },
    };
    const filters = [
      { field: "IsActive", operator: "eq" as const, value: "true" },
      { field: "Name", operator: "contains" as const, value: "John" },
    ];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("IsActive eq true and contains(Name,'John')");
  });

  it("should build enum filter with quotes", () => {
    const metadata = {
      Ad_Language: {
        label: "Language",
        type: "enum" as const,
        operators: ["eq"] as const,
      },
    };
    const filters = [{ field: "Ad_Language", operator: "eq" as const, value: "en_US" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("Ad_Language eq 'en_US'");
  });

  it("should return null for empty filters", () => {
    const result = buildODataFilter([], {});
    expect(result).toBeNull();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm test -- build-odata-filter.test.ts`
Expected: FAIL with "buildODataFilter is not defined"

**Step 3: Write implementation**

```typescript
// src/lib/data-table/build-odata-filter.ts

import { ActiveFilter, FilterFieldMetadata, ODataOperator, FilterFieldType } from "./filter.types";

type MetadataMap = Record<string, FilterFieldMetadata>;

/**
 * Build iDempiere OData $filter string from active filters
 * Follows iDempiere REST API standard
 *
 * @example
 * Input: [{ field: "IsActive", operator: "eq", value: "true" }]
 * Output: "IsActive eq true"
 *
 * @example
 * Input: Multiple filters
 * Output: "IsActive eq true and GradeLevel eq '9' and contains(Name,'John')"
 */
export function buildODataFilter(
  activeFilters: ActiveFilter[],
  metadataMap: MetadataMap | FilterFieldMetadata[]
): string | null {
  if (activeFilters.length === 0) return null;

  // Convert array to map if needed
  const metadata: MetadataMap = Array.isArray(metadataMap)
    ? {}
    : metadataMap;

  const clauses: string[] = [];

  for (const filter of activeFilters) {
    const fieldMetadata = metadata[filter.field];
    if (!fieldMetadata) continue;

    const clause = buildFilterClause(
      filter.field,
      filter.operator,
      filter.value,
      fieldMetadata.type
    );

    if (clause) {
      clauses.push(clause);
    }
  }

  return clauses.length > 0 ? clauses.join(" and ") : null;
}

/**
 * Build single OData filter clause
 * Handles all iDempiere operators: eq, neq, in, gt, ge, lt, le, contains, startswith, endswith
 */
function buildFilterClause(
  field: string,
  operator: ODataOperator,
  value: string | string[],
  valueType: FilterFieldType
): string | null {
  // Handle multi-select values
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    if (value.length === 1) {
      return buildSingleValueClause(field, operator, value[0], valueType);
    }
    // For multiple values, use OR logic: (field eq 'a' or field eq 'b')
    const clauses = value
      .map((v) => buildSingleValueClause(field, operator, v, valueType))
      .filter(Boolean);
    return clauses.length > 0 ? `(${clauses.join(" or ")})` : null;
  }

  return buildSingleValueClause(field, operator, value, valueType);
}

function buildSingleValueClause(
  field: string,
  operator: ODataOperator,
  value: string,
  valueType: FilterFieldType
): string | null {
  switch (operator) {
    case "contains":
      return `contains(${field},'${value}')`;
    case "startswith":
      return `startswith(${field},'${value}')`;
    case "endswith":
      return `endswith(${field},'${value}')`;
    case "in":
      // value should be comma-separated
      const values = value.split(",").map((v) => `'${v.trim()}'`).join(",");
      return `${field} in (${values})`;
    default:
      // eq, neq, gt, ge, lt, le
      const formattedValue = formatODataValue(value, valueType);
      return `${field} ${operator} ${formattedValue}`;
  }
}

/**
 * Format value for OData query
 * Strings get quotes, numbers/booleans don't
 */
function formatODataValue(
  value: string,
  type: FilterFieldType
): string {
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
```

**Step 4: Run tests to verify they pass**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm test -- build-odata-filter.test.ts`
Expected: PASS (5 tests passing)

**Step 5: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/build-odata-filter.ts src/lib/data-table/build-odata-filter.test.ts
git commit -m "feat(data-table): add OData filter builder

Add function to convert active filters to iDempiere OData $filter:
- Supports all iDempiere operators (eq, contains, startswith, etc.)
- Handles multi-select with OR logic
- Proper value formatting (quotes for strings, lowercase booleans)

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 3: Create URL Parameter Hook

**Files:**
- Create: `src/lib/data-table/use-table-filters.ts`
- Create: `src/lib/data-table/use-table-filters.test.ts`

**Step 1: Create test file**

```typescript
// src/lib/data-table/use-table-filters.test.ts

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTableFilters } from "./use-table-filters";
import { FilterSchema } from "./filter.types";

// Mock Next.js hooks
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

describe("useTableFilters", () => {
  const mockSchema: FilterSchema = {
    metadata: {
      IsActive: {
        label: "Active",
        type: "boolean",
        operators: ["eq"],
      },
    },
    groups: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should parse URL params to active filters", () => {
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === "f[IsActive]") return "true";
        return null;
      },
      forEach: (cb: any) => {
        cb("true", "f[IsActive]");
      },
      toString: () => "f[IsActive]=true",
    });

    const { useSearchParams: useRouter } = require("next/navigation");
    useRouter.mockReturnValue({
      push: vi.fn(),
    });

    const { result } = renderHook(() =>
      useTableFilters({ schema: mockSchema })
    );

    expect(result.current.activeFilters).toEqual([
      { field: "IsActive", operator: "eq", value: "true" },
    ]);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm test -- use-table-filters.test.ts`
Expected: FAIL with "useTableFilters is not defined"

**Step 3: Write implementation**

```typescript
// src/lib/data-table/use-table-filters.ts

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ActiveFilter, FilterSchema } from "./filter.types";

export interface UseTableFiltersOptions {
  schema: FilterSchema;
  searchableField?: string;
}

export interface UseTableFiltersReturn {
  /** Current active filters */
  activeFilters: ActiveFilter[];
  /** Current search query */
  searchQuery: string;
  /** Update filters (syncs to URL) */
  setActiveFilters: (filters: ActiveFilter[]) => void;
  /** Update search query (syncs to URL) */
  setSearchQuery: (query: string) => void;
  /** Clear all filters and search */
  resetAll: () => void;
  /** Check if a specific filter is active */
  isFilterActive: (field: string, value: string) => boolean;
}

const FILTER_PARAM_PREFIX = "f";
const SEARCH_PARAM = "q";

/**
 * Hook for managing table filters with URL search params
 *
 * URL Format:
 * ?f[IsActive]=true&f[GradeLevel]=9&f[GradeLevel]=10&q=John
 *
 * Features:
 * - Bi-directional sync: URL ←→ State
 * - Multi-select support: f[GradeLevel]=9&f[GradeLevel]=10
 * - Bookmarkable and shareable states
 * - Browser back/forward support
 */
export function useTableFilters({
  schema,
  searchableField,
}: UseTableFiltersOptions): UseTableFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL params to active filters
  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];

    searchParams.forEach((value, key) => {
      // Parse filter params: f[FieldName]=value
      if (key.startsWith(`${FILTER_PARAM_PREFIX}[`)) {
        const match = key.match(/\[([^\]]+)\]/);
        if (match) {
          const field = match[1];
          const metadata = schema.metadata[field];

          filters.push({
            field,
            operator: metadata?.operators?.[0] || "eq",
            value,
          });
        }
      }
    });

    return filters;
  }, [searchParams, schema]);

  // Parse search query
  const searchQuery = useMemo(() => {
    return searchParams.get(SEARCH_PARAM) || "";
  }, [searchParams]);

  // Update URL params with new filters
  const setActiveFilters = useCallback(
    (newFilters: ActiveFilter[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // Remove existing filter params
      params.forEach((_, key) => {
        if (key.startsWith(`${FILTER_PARAM_PREFIX}[`)) {
          params.delete(key);
        }
      });

      // Add new filter params
      newFilters.forEach((filter) => {
        const key = `${FILTER_PARAM_PREFIX}[${filter.field}]`;

        if (Array.isArray(filter.value)) {
          filter.value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, filter.value);
        }
      });

      // Update URL
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Update search query in URL
  const setSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set(SEARCH_PARAM, query);
      } else {
        params.delete(SEARCH_PARAM);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Clear all filters and search
  const resetAll = useCallback(() => {
    router.push(window.location.pathname, { scroll: false });
  }, [router]);

  // Check if a specific filter is active
  const isFilterActive = useCallback(
    (field: string, value: string) => {
      return activeFilters.some(
        (f) => f.field === field && f.value === value
      );
    },
    [activeFilters]
  );

  return {
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
    isFilterActive,
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm test -- use-table-filters.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/use-table-filters.ts src/lib/data-table/use-table-filters.test.ts
git commit -m "feat(data-table): add URL parameter sync hook

Add useTableFilters hook for managing filters with URL params:
- Parse f[field]=value format to active filters
- Update URL on filter changes
- Support multi-select with duplicate keys
- Search query support with q parameter

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 4: Create OData Query Hook

**Files:**
- Create: `src/lib/data-table/use-odata-query.ts`

**Step 1: Create implementation**

```typescript
// src/lib/data-table/use-odata-query.ts

"use client";

import { useMemo } from "react";
import { useTableFilters } from "./use-table-filters";
import { buildODataFilter } from "./build-odata-filter";
import { FilterSchema } from "./filter.types";

export interface UseODataQueryOptions {
  schema: FilterSchema;
  searchableField?: string;
  pageSize?: number;
  currentPage?: number;
}

export interface ODataQueryParams {
  $filter?: string;
  $orderby: string;
  $top: number;
  $skip: number;
}

/**
 * Build OData query parameters from current filter state
 * Returns params ready for iDempiere REST API
 */
export function useODataQuery({
  schema,
  searchableField,
  pageSize = 10,
  currentPage = 1,
}: UseODataQueryOptions) {
  const {
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
  } = useTableFilters({ schema, searchableField });

  // Build complete OData query params
  const queryParams = useMemo((): ODataQueryParams => {
    const params: ODataQueryParams = {
      $orderby: "Name asc", // Default sort
      $top: pageSize,
      $skip: (currentPage - 1) * pageSize,
    };

    // Build $filter from active filters
    const filterClauses: string[] = [];

    // Add search filter (if searchable field exists)
    if (searchQuery && searchableField) {
      const metadata = schema.metadata[searchableField];
      if (metadata?.searchable) {
        filterClauses.push(
          `contains(${searchableField},'${searchQuery}')`
        );
      }
    }

    // Add active filters
    const filterString = buildODataFilter(
      activeFilters,
      schema.metadata
    );
    if (filterString) {
      filterClauses.push(filterString);
    }

    // Combine with AND
    if (filterClauses.length > 0) {
      params.$filter = filterClauses.join(" and ");
    }

    return params;
  }, [activeFilters, searchQuery, searchableField, schema, pageSize, currentPage]);

  return {
    queryParams,
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
  };
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/use-odata-query.ts
git commit -m "feat(data-table): add OData query hook

Add useODataQuery hook to build iDempiere query params:
- Combines active filters with search query
- Generates $filter, $orderby, $top, $skip params
- Integrates with useTableFilters for URL sync

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 5: Add Filterable Fields to C_BPartner Model

**Files:**
- Modify: `src/lib/api/idempiere/models/c-bpartner/c-bpartner.types.ts`

**Step 1: Add filterable fields export**

Add to the end of `c-bpartner.types.ts`:

```typescript
// =============================================================================
// Filterable Fields Metadata (for Dynamic Data Table)
// =============================================================================

import { LucideIcon } from "lucide-react";
import {
  CheckCircle,
  User,
  Briefcase,
  Store,
  Mail,
  Globe,
  Cake,
  Phone,
  AlertTriangle,
  Users,
} from "lucide-react";

/**
 * Filterable field metadata for C_BPartner
 * Maps model fields to their filter capabilities
 */
export const CBPartnerFilterableFields = {
  // Boolean filters (true/false toggles)
  IsActive: {
    label: "Active",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: CheckCircle,
  },
  IsCustomer: {
    label: "Customer",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: User,
  },
  IsEmployee: {
    label: "Employee",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: Briefcase,
  },
  IsVendor: {
    label: "Vendor",
    type: "boolean" as const,
    operators: ["eq"] as const,
    icon: Store,
  },
  IsSalesRep: {
    label: "Sales Representative",
    type: "boolean" as const,
    operators: ["eq"] as const,
  },

  // String filters (search, exact match)
  Name: {
    label: "Name",
    type: "string" as const,
    operators: ["contains", "startswith", "eq"] as const,
    searchable: true, // Enables global search
  },
  Value: {
    label: "ID/Code",
    type: "string" as const,
    operators: ["contains", "eq"] as const,
  },
  EMail: {
    label: "Email",
    type: "string" as const,
    operators: ["contains", "eq"] as const,
    icon: Mail,
  },

  // Enum-like filters (predefined options)
  Ad_Language: {
    label: "Language",
    type: "enum" as const,
    operators: ["eq"] as const,
    options: [
      { label: "English", value: "en_US" },
      { label: "Indonesian", value: "id_ID" },
    ],
    icon: Globe,
  },

  // Date filters
  Birthday: {
    label: "Birthday",
    type: "date" as const,
    operators: ["eq", "gt", "lt"] as const,
    icon: Cake,
  },

  // Custom fields for school management
  parentContact: {
    label: "Parent Contact",
    type: "string" as const,
    operators: ["contains"] as const,
  },
  emergencyContact: {
    label: "Emergency Contact",
    type: "string" as const,
    operators: ["contains"] as const,
    icon: Phone,
  },
  allergies: {
    label: "Allergies",
    type: "string" as const,
    operators: ["contains"] as const,
    icon: AlertTriangle,
  },

  // Reference fields (with value rules)
  C_BP_Group_ID: {
    label: "BP Group",
    type: "reference" as const,
    operators: ["eq"] as const,
    modelName: "C_BP_Group",
    icon: Users,
  },
} as const;

// Type inference from metadata
export type CBPartnerFilterableField = keyof typeof CBPartnerFilterableFields;
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/api/idempiere/models/c-bpartner/c-bpartner.types.ts
git commit -m "feat(c-bpartner): add filterable fields metadata

Add CBPartnerFilterableFields for dynamic filter generation:
- Boolean fields: IsActive, IsCustomer, IsEmployee, IsVendor
- String fields: Name (searchable), Value, EMail
- Enum: Ad_Language with options
- Date: Birthday
- Custom: parentContact, emergencyContact, allergies
- Reference: C_BP_Group_ID

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 6: Create Filter Schema Generator

**Files:**
- Create: `src/lib/data-table/generate-filter-schema.ts`

**Step 1: Create implementation**

```typescript
// src/lib/data-table/generate-filter-schema.ts

import { ModelFilterMetadata, FilterSchema, FilterFieldType } from "./filter.types";

/**
 * Automatically generate filter schema from model metadata
 * Groups fields by type and usage patterns
 */
export function generateFilterSchema(
  modelName: string,
  metadata: ModelFilterMetadata,
  variant?: "student" | "vendor" | "employee" | "all"
): FilterSchema {
  const fieldNames = Object.keys(metadata);

  // Auto-generate groups based on field types
  const groups = autoGenerateGroups(fieldNames, metadata, variant);

  return {
    metadata,
    groups,
  };
}

function autoGenerateGroups(
  fields: string[],
  metadata: ModelFilterMetadata,
  variant?: string
): FilterSchema["groups"] {
  const groups: FilterSchema["groups"] = [];

  // Group 1: Status flags (boolean fields)
  const booleanFields = fields.filter((f) => metadata[f].type === "boolean");
  if (booleanFields.length > 0) {
    groups.push({
      id: "status",
      title: "Status",
      fields: booleanFields,
    });
  }

  // Group 2: Classification (enum, reference fields)
  const classificationFields = fields.filter(
    (f) => metadata[f].type === "enum" || metadata[f].type === "reference"
  );
  if (classificationFields.length > 0) {
    groups.push({
      id: "classification",
      title: "Classification",
      fields: classificationFields,
    });
  }

  // Group 3: Personal Info (string fields with icons)
  const personalFields = fields.filter(
    (f) => metadata[f].type === "string" && metadata[f].icon
  );
  if (personalFields.length > 0) {
    groups.push({
      id: "personal",
      title: "Personal Information",
      fields: personalFields,
    });
  }

  // Group 4: Dates
  const dateFields = fields.filter((f) => metadata[f].type === "date");
  if (dateFields.length > 0) {
    groups.push({
      id: "dates",
      title: "Dates",
      fields: dateFields,
    });
  }

  return groups;
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/generate-filter-schema.ts
git commit -m "feat(data-table): add filter schema generator

Add generateFilterSchema function to auto-create filter groups:
- Status: Boolean fields grouped together
- Classification: Enum and reference fields
- Personal Info: String fields with icons
- Dates: Date type fields

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 7: Create Student Filter Schema

**Files:**
- Create: `src/lib/api/idempiere/models/c-bpartner/c-bpartner.schema.ts`
- Create: `src/lib/api/idempiere/models/c-bpartner/index.ts`

**Step 1: Create schema file**

```typescript
// src/lib/api/idempiere/models/c-bpartner/c-bpartner.schema.ts

import { generateFilterSchema } from "@/lib/data-table/generate-filter-schema";
import { CBPartnerFilterableFields } from "./c-bpartner.types";

/**
 * Filter schema for Student entity (C_BPartner with IsCustomer=true)
 * Auto-generated from CBPartnerFilterableFields
 */
export const studentFilterSchema = generateFilterSchema(
  "C_BPartner",
  CBPartnerFilterableFields,
  "student"
);

/**
 * Filter schema for all Business Partners
 */
export const businessPartnerFilterSchema = generateFilterSchema(
  "C_BPartner",
  CBPartnerFilterableFields
);
```

**Step 2: Create index file**

```typescript
// src/lib/api/idempiere/models/c-bpartner/index.ts

export * from "./c-bpartner.types";
export * from "./c-bpartner.schema";
export * from "./business-partner.service";
```

**Step 3: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/api/idempiere/models/c-bpartner/c-bpartner.schema.ts src/lib/api/idempiere/models/c-bpartner/index.ts
git commit -m "feat(c-bpartner): add filter schema exports

Add studentFilterSchema and businessPartnerFilterSchema:
- Auto-generated from CBPartnerFilterableFields
- Export from index for easy importing
- Ready for use with DataTable components

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 8: Create Student Type Definition

**Files:**
- Create: `src/lib/types/students.ts` (or use existing `src/lib/types.ts`)

**Step 1: Add Student type**

If `src/lib/types.ts` exists, add to it. Otherwise create new file:

```typescript
// src/lib/types/students.ts

/**
 * Student entity for frontend use
 * Transformed from C_BPartner
 */
export interface Student {
  id: string;           // C_BPartner_ID
  uid: string;          // UUID
  value: string;        // Value field (student code)
  name: string;         // Name
  name2?: string;       // Name2
  email?: string;       // EMail
  phone?: string;       // Phone
  phone2?: string;      // Phone2
  isActive: boolean;    // IsActive
  isCustomer: boolean;  // IsCustomer
  gradeLevel?: string;  // Custom field (GradeLevel)
  adLanguage?: string;  // Ad_Language
  birthday?: string;    // Birthday (ISO date)

  // Custom school fields
  parentContact?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/types/students.ts
git commit -m "feat(types): add Student type definition

Add Student interface for frontend use:
- Maps from C_BPartner entity
- Includes custom school fields
- Type-safe for table columns

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 9: Create useStudents Hook

**Files:**
- Create: `src/lib/hooks/use-students.ts`
- Create: `src/lib/hooks/use-students.test.ts`

**Step 1: Create implementation**

```typescript
// src/lib/hooks/use-students.ts

import { useQuery } from "@tanstack/react-query";
import { useIdempiereAuth } from "./use-idempiere-data";
import { businessPartnerService } from "@/lib/api/idempiere/models/c-bpartner";
import type { ODataQueryParams } from "@/lib/data-table/use-odata-query";
import type { Student } from "@/lib/types/students";
import type { CBPartner } from "@/lib/api/idempiere/models/c-bpartner";

export interface UseStudentsOptions {
  /** OData query params from useODataQuery hook */
  queryParams?: ODataQueryParams;
  /** Enable/disable the query */
  enabled?: boolean;
}

/**
 * Transform C_BPartner to Student
 */
function toStudent(bpartner: CBPartner): Student {
  return {
    id: bpartner.id.toString(),
    uid: bpartner.uid,
    value: bpartner.Value,
    name: bpartner.Name,
    name2: bpartner.Name2,
    email: bpartner.EMail,
    phone: bpartner.Phone,
    phone2: bpartner.Phone2,
    isActive: bpartner.IsActive,
    isCustomer: bpartner.IsCustomer,
    adLanguage: bpartner.AD_Language_ID?.identifier || bpartner.Ad_Language,
    birthday: bpartner.Birthday,

    // Custom fields
    parentContact: (bpartner as any).parentContact,
    emergencyContact: (bpartner as any).emergencyContact,
    allergies: (bpartner as any).allergies,
    medicalConditions: (bpartner as any).medicalConditions,

    createdAt: bpartner.Created,
    updatedAt: bpartner.Updated,
  };
}

/**
 * Fetch students with OData filter support
 * Integrates with the dynamic filter system
 */
export function useStudents({ queryParams, enabled = true }: UseStudentsOptions = {}) {
  const { accessToken, isAuthenticated } = useIdempiereAuth();

  return useQuery({
    queryKey: ["students", queryParams],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      // Use the existing service with OData params
      const response = await businessPartnerService.query(accessToken, {
        $filter: queryParams?.$filter,
        $orderby: queryParams?.$orderby,
        $top: queryParams?.$top,
        $skip: queryParams?.$skip,
      });

      // Transform C_BPartner to Student
      return {
        ...response,
        records: response.records.map(toStudent),
      };
    },
    enabled: isAuthenticated && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
}

export interface StudentStats {
  total: number;
  active: number;
  grade9: number;
  grade10: number;
  grade11: number;
  grade12: number;
  grades11_12: number;
}

/**
 * Fetch student stats with filter support
 * Returns counts for: Total, Active, by Grade
 */
export function useStudentStats(filter?: string) {
  const { accessToken, isAuthenticated } = useIdempiereAuth();

  return useQuery<StudentStats>({
    queryKey: ["student-stats", filter],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      // For each stat, query with appropriate filter
      const [
        totalResult,
        activeResult,
        grade9Result,
        grade10Result,
        grade11Result,
        grade12Result,
      ] = await Promise.all([
        // Total students
        businessPartnerService.query(accessToken, {
          $filter: filter,
          $select: "C_BPartner_ID",
          $top: 0, // We only need row-count
        }),
        // Active students
        businessPartnerService.query(accessToken, {
          $filter: filter ? `${filter} and IsActive eq true` : "IsActive eq true",
          $select: "C_BPartner_ID",
          $top: 0,
        }),
        // Grade 9 (custom field - adjust field name as needed)
        businessPartnerService.query(accessToken, {
          $filter: filter ? `${filter} and GradeLevel eq '9'` : "GradeLevel eq '9'",
          $select: "C_BPartner_ID",
          $top: 0,
        }),
        // Grade 10
        businessPartnerService.query(accessToken, {
          $filter: filter ? `${filter} and GradeLevel eq '10'` : "GradeLevel eq '10'",
          $select: "C_BPartner_ID",
          $top: 0,
        }),
        // Grade 11
        businessPartnerService.query(accessToken, {
          $filter: filter ? `${filter} and GradeLevel eq '11'` : "GradeLevel eq '11'",
          $select: "C_BPartner_ID",
          $top: 0,
        }),
        // Grade 12
        businessPartnerService.query(accessToken, {
          $filter: filter ? `${filter} and GradeLevel eq '12'` : "GradeLevel eq '12'",
          $select: "C_BPartner_ID",
          $top: 0,
        }),
      ]);

      return {
        total: totalResult["row-count"],
        active: activeResult["row-count"],
        grade9: grade9Result["row-count"],
        grade10: grade10Result["row-count"],
        grade11: grade11Result["row-count"],
        grade12: grade12Result["row-count"],
        grades11_12: grade11Result["row-count"] + grade12Result["row-count"],
      };
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/hooks/use-students.ts
git commit -m "feat(hooks): add useStudents hook with OData support

Add useStudents and useStudentStats hooks:
- useStudents: Fetch students with OData params
- useStudentStats: Fetch counts (Total, Active, by Grade)
- Transform C_BPartner to Student
- Stats reflect filtered data

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 10: Create DataTableStats Component

**Files:**
- Create: `src/components/data-table/data-table-stats.tsx`

**Step 1: Create component**

```typescript
// src/components/data-table/data-table-stats.tsx

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface StatCard {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  change?: number; // Optional: +5, -3, etc.
  changeType?: "increase" | "decrease" | "neutral";
}

export interface DataTableStatsProps {
  stats: StatCard[];
  isLoading?: boolean;
}

export function DataTableStats({ stats, isLoading }: DataTableStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              {stat.icon && (
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <p
                  className={`text-xs ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : stat.changeType === "decrease"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/components/data-table/data-table-stats.tsx
git commit -m "feat(data-table): add DataTableStats component

Add statistics cards component:
- Grid layout (5 columns on large screens)
- Skeleton loading state
- Optional icons and change indicators
- Displays value, title, optional change percentage

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 11: Create DataTableFacetedFilter Component

**Files:**
- Create: `src/components/data-table/data-table-faceted-filter.tsx`

**Step 1: Create component**

```typescript
// src/components/data-table/data-table-faceted-filter.tsx

"use client";

import { useState } from "react";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FilterSchema, ActiveFilter } from "@/lib/data-table/filter.types";

export interface DataTableFacetedFilterProps {
  schema: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
}

export function DataTableFacetedFilter({
  schema,
  activeFilters,
  onFiltersChange,
}: DataTableFacetedFilterProps) {
  const [open, setOpen] = useState(false);
  const activeCount = activeFilters.length;

  // Group fields by their group ID
  const groupedFields = schema.groups.reduce((acc, group) => {
    acc[group.id] = {
      title: group.title,
      fields: group.fields.map((fieldName) => ({
        name: fieldName,
        metadata: schema.metadata[fieldName],
      })),
    };
    return acc;
  }, {} as Record<string, { title: string; fields: Array<{ name: string; metadata: any }> }>);

  const toggleFilter = (field: string, value: string, operator: string) => {
    const existingIndex = activeFilters.findIndex(
      (f) => f.field === field && f.value === value
    );

    let newFilters: ActiveFilter[];
    if (existingIndex >= 0) {
      newFilters = activeFilters.filter((_, i) => i !== existingIndex);
    } else {
      newFilters = [...activeFilters, { field, operator, value }];
    }

    onFiltersChange(newFilters);
  };

  const isFilterActive = (field: string, value: string) => {
    return activeFilters.some((f) => f.field === field && f.value === value);
  };

  const clearAll = () => {
    onFiltersChange([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {activeCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {activeCount > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {activeCount} selected
                  </Badge>
                ) : (
                  activeFilters.map((filter) => (
                    <Badge
                      key={`${filter.field}-${filter.value}`}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {schema.metadata[filter.field]?.label || filter.field}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-1">
          {Object.entries(groupedFields).map(([groupId, group]) => (
            <div key={groupId} className="pb-4 last:pb-0">
              <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.fields.map(({ name, metadata }) => {
                  // For boolean fields, show as toggle
                  if (metadata.type === "boolean") {
                    return (
                      <button
                        key={name}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                          isFilterActive(name, "true") && "bg-accent"
                        )}
                        onClick={() => toggleFilter(name, "true", "eq")}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isFilterActive(name, "true")
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50"
                          )}
                        >
                          {isFilterActive(name, "true") && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="flex-1 text-left">{metadata.label}</span>
                      </button>
                    );
                  }

                  // For enum/reference fields, show options
                  if (metadata.options) {
                    return metadata.options.map((option) => (
                      <button
                        key={`${name}-${option.value}`}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                          isFilterActive(name, option.value) && "bg-accent"
                        )}
                        onClick={() => toggleFilter(name, option.value, "eq")}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isFilterActive(name, option.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50"
                          )}
                        >
                          {isFilterActive(name, option.value) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="flex-1 text-left">{option.label}</span>
                      </button>
                    ));
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
        {activeCount > 0 && (
          <>
            <Separator />
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={clearAll}
              >
                Clear all filters
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/components/data-table/data-table-faceted-filter.tsx
git commit -m "feat(data-table): add DataTableFacetedFilter component

Add dynamic filter popover component:
- Single Filter button with active count badge
- Popover with filter groups (Status, Classification, etc.)
- Boolean fields as toggle switches
- Enum fields as option lists with checkboxes
- Clear all filters button

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 12: Create DataTableToolbar Component

**Files:**
- Create: `src/components/data-table/data-table-toolbar.tsx`

**Step 1: Create component**

```typescript
// src/components/data-table/data-table-toolbar.tsx

"use client";

import { X } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { ActiveFilter, FilterSchema } from "@/lib/data-table/filter.types";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterSchema?: FilterSchema;
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  searchableField?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterSchema,
  activeFilters,
  onFiltersChange,
  searchableField,
  searchValue,
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = activeFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={
            searchableField && filterSchema
              ? `Search by ${filterSchema.metadata[searchableField]?.label || "name"}...`
              : "Search..."
          }
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterSchema && (
          <DataTableFacetedFilter
            schema={filterSchema}
            activeFilters={activeFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => onFiltersChange([])}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/components/data-table/data-table-toolbar.tsx
git commit -m "feat(data-table): add DataTableToolbar component

Add toolbar component with search and filters:
- Search input with placeholder from schema
- Filter button (using DataTableFacetedFilter)
- Reset button when filters are active
- View options button (column visibility)

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 13: Create Loading and Empty State Components

**Files:**
- Create: `src/components/data-table/data-table-skeleton.tsx`
- Create: `src/components/data-table/data-table-empty.tsx`

**Step 1: Create skeleton component**

```typescript
// src/components/data-table/data-table-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DataTableSkeleton({
  rowCount = 10,
  columnCount = 6,
}: {
  rowCount?: number;
  columnCount?: number;
}) {
  return (
    <Card className="p-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
        <Skeleton className="h-9 w-[100px]" />
      </div>

      {/* Header skeleton */}
      <div className="flex gap-4 mb-2 px-4">
        <Skeleton className="h-10 w-10 shrink-0" />
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
          <Skeleton className="h-10 w-10 shrink-0" />
          {Array.from({ length: columnCount }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <Skeleton className="h-9 w-[150px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>
    </Card>
  );
}
```

**Step 2: Create empty component**

```typescript
// src/components/data-table/data-table-empty.tsx

"use client";

import { SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface DataTableEmptyProps {
  hasFilters: boolean;
  hasSearch: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state message when no results found
 * Shows different messages based on whether filters/search are active
 */
export function DataTableEmpty({
  hasFilters,
  hasSearch,
  onClearFilters,
}: DataTableEmptyProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      {hasFilters || hasSearch ? (
        <>
          <FilterX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            {hasFilters && hasSearch
              ? "Try adjusting your filters or search term"
              : hasFilters
              ? "Try adjusting your filters"
              : "Try a different search term"}
          </p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Clear all filters
            </Button>
          )}
        </>
      ) : (
        <>
          <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first student
          </p>
          <Button onClick={() => (window.location.href = "/academic/students/new")}>
            Add Student
          </Button>
        </>
      )}
    </Card>
  );
}
```

**Step 3: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/components/data-table/data-table-skeleton.tsx src/components/data-table/data-table-empty.tsx
git commit -m "feat(data-table): add loading and empty state components

Add DataTableSkeleton and DataTableEmpty:
- Skeleton: Loading state with animating placeholders
- Empty: Context-aware messages (no results vs no data)
- Clear filters button when filters are active
- Add student button when truly empty

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 14: Create Student Table Columns

**Files:**
- Create: `src/app/(main)/academic/students/columns.tsx`

**Step 1: Create columns definition**

```typescript
// src/app/(main)/academic/students/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Student } from "@/lib/types/students";
import { cn } from "@/lib/utils";

/**
 * Column definitions for Students table
 * Uses TanStack Table with Shadcn styling
 */
export const studentColumns: ColumnDef<Student>[] = [
  // Selection checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Student Profile (Name + Details)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{student.name}</span>
            {student.email && (
              <span className="text-xs text-muted-foreground">
                {student.email}
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  // Student ID (Value field)
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground font-mono">
          {row.original.value}
        </span>
      );
    },
  },

  // Status Badge
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "capitalize",
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Phone
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.phone || "—"}
        </span>
      );
    },
  },

  // Actions dropdown
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit student</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/app/\(main\)/academic/students/columns.tsx
git commit -m "feat(students): add table column definitions

Add studentColumns for TanStack Table:
- Checkbox for row selection
- Student profile with avatar and email
- ID/Code in monospace
- Status badge (Active/Inactive)
- Phone number
- Actions dropdown menu

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 15: Create TanStack Table Setup Hook

**Files:**
- Create: `src/lib/data-table/use-tanstack-table.ts`

**Step 1: Create hook**

```typescript
// src/lib/data-table/use-tanstack-table.ts

import { useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

export function useTanStackTable<TData>({
  data,
  columns,
  pageCount,
  state,
  onPaginationChange,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount: number;
  state?: { pagination?: PaginationState };
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
}) {
  return useReactTable({
    data,
    columns,
    pageCount,
    state,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // We handle pagination on the server
  });
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/lib/data-table/use-tanstack-table.ts
git commit -m "feat(data-table): add useTanStackTable hook

Add helper hook for TanStack Table setup:
- Wraps useReactTable with common config
- Manual pagination (server-side)
- Core row model enabled

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 16: Replace Students Page with Table Implementation

**Files:**
- Replace: `src/app/(main)/academic/students/page.tsx`

**Step 1: Backup existing page and create new implementation**

First, backup the existing page. Then create the new implementation:

```typescript
// src/app/(main)/academic/students/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableStats } from "@/components/data-table/data-table-stats";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import { studentColumns } from "./columns";
import { useStudents, useStudentStats } from "@/lib/hooks/use-students";
import { useODataQuery } from "@/lib/data-table/use-odata-query";
import { studentFilterSchema } from "@/lib/api/idempiere/models/c-bpartner";
import { useTanStackTable } from "@/lib/data-table/use-tanstack-table";
import type { Student } from "@/lib/types/students";

/**
 * Page size for table pagination
 */
const PAGE_SIZE = 10;

/**
 * Students Page - Table view with dynamic filtering
 *
 * Features:
 * - Dynamic filters from C_BPartner model schema
 * - URL-synced filters (bookmarkable, shareable)
 * - Stats that reflect filtered data
 * - Server-side pagination with iDempiere OData
 */
export default function StudentsPage() {
  const router = useRouter();

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Build OData query params from URL filters
  const {
    queryParams,
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    resetAll,
  } = useODataQuery({
    schema: studentFilterSchema,
    searchableField: "Name",
    pageSize: PAGE_SIZE,
    currentPage,
  });

  // Fetch students with filters
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useStudents({
    queryParams,
  });

  // Fetch stats (reflects filtered data)
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useStudentStats(queryParams.$filter);

  // Calculate total pages from response
  const totalPages = studentsData?.["page-count"] || 1;
  const totalRecords = studentsData?.["row-count"] || 0;

  // Transform response to table data
  const tableData: Student[] = studentsData?.records || [];

  // Build table
  const table = useTanStackTable({
    data: tableData,
    columns: studentColumns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: PAGE_SIZE,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({
              pageIndex: currentPage - 1,
              pageSize: PAGE_SIZE,
            })
          : updater;
      setCurrentPage(newState.pageIndex + 1);
    },
  });

  // Stats cards configuration
  const statCards = [
    {
      title: "Total Students",
      value: stats?.total || 0,
      icon: Users,
    },
    {
      title: "Active",
      value: stats?.active || 0,
    },
    {
      title: "Grade 9",
      value: stats?.grade9 || 0,
    },
    {
      title: "Grade 10",
      value: stats?.grade10 || 0,
    },
    {
      title: "Grades 11-12",
      value: stats?.grades11_12 || 0,
    },
  ];

  // Loading state
  if (isLoadingStudents && !tableData.length) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student records and information
            </p>
          </div>
          <Button onClick={() => router.push("/academic/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <DataTableStats stats={statCards} isLoading={true} />
        <DataTableSkeleton rowCount={PAGE_SIZE} />
      </div>
    );
  }

  // Error state
  if (studentsError) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">Error</p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Error loading students: {studentsError.message}
        </div>
      </div>
    );
  }

  // Empty state
  if (!tableData.length && !isLoadingStudents) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student records and information
            </p>
          </div>
          <Button onClick={() => router.push("/academic/students/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        <DataTableStats stats={statCards} isLoading={isLoadingStats} />
        <DataTableEmpty
          hasFilters={activeFilters.length > 0}
          hasSearch={!!searchQuery}
          onClearFilters={resetAll}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <Button onClick={() => router.push("/academic/students/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards - Reflect Filtered Data */}
      <DataTableStats stats={statCards} isLoading={isLoadingStats} />

      {/* Data Table */}
      <div className="rounded-md border bg-card">
        {/* Toolbar with Search and Filters */}
        <DataTableToolbar
          table={table}
          filterSchema={studentFilterSchema}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          searchableField="Name"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Table Content */}
        <DataTable table={table} columns={studentColumns} />

        {/* Pagination */}
        <DataTablePagination
          table={table}
          totalRecords={totalRecords}
          isLoading={isLoadingStudents}
        />
      </div>
    </div>
  );
}
```

**Step 2: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 3: Run build to verify**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm run build 2>&1 | tail -30`
Expected: Build succeeds

**Step 4: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/app/\(main\)/academic/students/page.tsx
git commit -m "feat(students): replace page with table implementation

Replace card-based students page with table view:
- Dynamic filters from C_BPartner schema
- URL-synced filter state (bookmarkable)
- Stats reflecting filtered data
- Server-side pagination
- Loading, error, and empty states
- Search with debouncing

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 17: Add Index Export for DataTable Components

**Files:**
- Create: `src/components/data-table/index.ts`
- Modify: `src/lib/data-table/index.ts`

**Step 1: Create components index**

```typescript
// src/components/data-table/index.ts

export { DataTable } from "./data-table";
export { DataTableColumnHeader } from "./data-table-column-header";
export { DataTablePagination } from "./data-table-pagination";
export { DataTableViewOptions } from "./data-table-view-options";
export { DataTableToolbar } from "./data-table-toolbar";
export { DataTableFacetedFilter } from "./data-table-faceted-filter";
export { DataTableStats } from "./data-table-stats";
export { DataTableSkeleton } from "./data-table-skeleton";
export { DataTableEmpty } from "./data-table-empty";
```

**Step 2: Create lib index**

```typescript
// src/lib/data-table/index.ts

export * from "./filter.types";
export * from "./build-odata-filter";
export * from "./use-table-filters";
export * from "./use-odata-query";
export * from "./use-tanstack-table";
export * from "./generate-filter-schema";
```

**Step 3: Run TypeScript check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git add src/components/data-table/index.ts src/lib/data-table/index.ts
git commit -m "feat(data-table): add index exports

Add index files for cleaner imports:
- components/data-table/index.ts
- lib/data-table/index.ts

Co-Authored-By: Claude (glm-4.7) <noreply@anthropic.com>"
```

---

## Task 18: Final Build and Test

**Step 1: Run full build**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npm run build`
Expected: Build succeeds without errors

**Step 2: Run type check**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && npx tsc --noEmit`
Expected: No type errors (ignore pre-existing test file errors)

**Step 3: Verify all new files are created**

Run: `cd ~/.config/superpowers/worktrees/school-management-system/data-table-system && git status`
Expected: All new files committed, working tree clean

**Step 4: Create summary commit if needed**

If there are any remaining uncommitted changes, commit them.

**Step 5: Push to remote**

```bash
cd ~/.config/superpowers/worktrees/school-management-system/data-table-system
git push -u origin feature/data-table-system
```

---

## Implementation Complete!

### Summary

Created a complete dynamic data table system with:

1. **Filter Type System** - Types for filters, schemas, and OData operators
2. **OData Filter Builder** - Converts active filters to iDempiere `$filter` strings
3. **URL Parameter Hook** - Bi-directional sync between filters and URL params
4. **OData Query Hook** - Builds complete query params for API calls
5. **Model Filterable Fields** - C_BPartner metadata for dynamic filter generation
6. **Filter Schema Generator** - Auto-generates filter groups from metadata
7. **Student Filter Schema** - Ready-to-use schema for students page
8. **Student Type** - Frontend Student interface
9. **useStudents Hook** - Fetch students with OData support and stats
10. **DataTableStats** - Statistics cards with loading state
11. **DataTableFacetedFilter** - Dynamic filter popover
12. **DataTableToolbar** - Search + filters + view options
13. **Loading/Empty States** - Skeleton and empty components
14. **Student Columns** - Table column definitions
15. **useTanStackTable Hook** - Helper for table setup
16. **Students Page** - Complete table-based implementation

### Next Steps for Other Entities

To add the same table system for Teachers, Products, etc.:

1. Add `FilterableFields` to the model's type file
2. Create `[model].schema.ts` with `generateFilterSchema()`
3. Create `use[ModelName]()` hook following `useStudents` pattern
4. Create `[model]Columns` definition
5. Create page using the same components

**All data table components are reused!**

---

**Plan Version:** 1.0
**Last Updated:** 2025-01-29
