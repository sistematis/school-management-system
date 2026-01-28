# Dynamic Data Table System Design

**Project:** School Management System
**Date:** 2025-01-29
**Status:** Design Approved
**Author:** Development Team

---

## Overview

A reusable, schema-driven data table system for the School Management System that:

- Generates dynamic filters from iDempiere model type definitions
- Syncs all filter state to URL parameters (bookmarkable, shareable)
- Integrates with iDempiere OData query parameters (`$filter`, `$orderby`, `$top`, `$skip`)
- Works for ANY entity (Students, Teachers, Products, etc.) with minimal code
- Displays statistics that reflect currently filtered data

---

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│  Page Layer (students/page.tsx)                        │
│  - Routes and URL param management                     │
│  - Page-specific configurations                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Table Layer (components/data-table/)                  │
│  - DataTableTable (main table wrapper)                 │
│  - DataTableToolbar (search + filter button)           │
│  - DataTableFacetedFilter (popover with filter groups) │
│  - DataTableStats (stats cards header)                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Filter Engine (lib/data-table/)                       │
│  - buildFilterFromSchema() - generates OData $filter   │
│  - parseUrlParams() - converts URL → filter state      │
│  - serializeUrlParams() - converts filter state → URL  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Model Schemas (lib/api/idempiere/models/)             │
│  - c-bpartner.schema.ts - filter config for students   │
│  - [other-model].schema.ts - reusable for any entity   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **URL → Filters**: On mount, `useSearchParams()` reads URL params and passes them to the filter engine
2. **Filters → OData**: Filter engine converts params to iDempiere `$filter` query string
3. **OData → API**: Query builder sends `$filter` to iDempiere REST API
4. **API → Table**: Response populates TanStack Table, which renders the UI
5. **User Action → URL**: Any filter change updates URL params (triggering re-fetch)

---

## Filter Schema System

### Dynamic Filter Generation from Model Types

Each iDempiere model exports `FilterableFields` metadata that describes which fields can be filtered. The system **introspects the model type** and generates filter options automatically.

### Model Filter Metadata

```typescript
// lib/api/idempiere/models/c-bpartner/c-bpartner.types.ts

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
} as const;
```

### Type System

```typescript
// lib/data-table/filter.types.ts

import { LucideIcon } from "lucide-react";

export type FilterFieldType = "boolean" | "string" | "enum" | "number" | "date" | "reference";

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

export interface FilterFieldMetadata<
  TFieldType extends FilterFieldType = FilterFieldType,
  TOperator extends ODataOperator = ODataOperator
> {
  label: string;
  type: TFieldType;
  operators: readonly TOperator[];
  icon?: LucideIcon;
  searchable?: boolean;
  options?: readonly { label: string; value: string }[];
  modelName?: string;
}

export type ModelFilterMetadata = Record<string, FilterFieldMetadata>;

export interface ActiveFilter {
  field: string;
  operator: ODataOperator;
  value: string | string[];
}

export interface FilterGroup {
  id: string;
  title: string;
  fields: string[];
}

export interface FilterSchema {
  metadata: ModelFilterMetadata;
  groups: FilterGroup[];
}
```

### Auto-Generate Schema

```typescript
// lib/data-table/generate-filter-schema.ts

export function generateFilterSchema(
  modelName: string,
  metadata: ModelFilterMetadata,
  variant?: "student" | "vendor" | "employee" | "all"
): FilterSchema {
  const fieldNames = Object.keys(metadata);
  const groups = autoGenerateGroups(fieldNames, metadata, variant);

  return { metadata, groups };
}
```

---

## URL Parameter System

### URL Format

```
# Filter params use bracket syntax for grouping
?f[IsActive]=true&f[GradeLevel]=9&f[GradeLevel]=10&q=John

# f[fieldName]=value format for single/multi-select
# q=searchterm for global search
```

### Hook: useTableFilters

```typescript
// src/lib/data-table/use-table-filters.ts

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
      if (key.startsWith("f[")) {
        const match = key.match(/\[([^\]]+)\]/);
        if (match) {
          const field = match[1];
          filters.push({ field, operator: "eq", value });
        }
      }
    });
    return filters;
  }, [searchParams, schema]);

  // Update URL with new filters
  const setActiveFilters = useCallback((newFilters: ActiveFilter[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.forEach((_, key) => {
      if (key.startsWith("f[")) params.delete(key);
    });
    newFilters.forEach((filter) => {
      params.append(`f[${filter.field}]`, filter.value);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  return { activeFilters, setActiveFilters, /* ... */ };
}
```

---

## OData Filter Builder

### Building iDempiere-Compatible Filters

```typescript
// src/lib/data-table/build-odata-filter.ts

export function buildODataFilter(
  activeFilters: ActiveFilter[],
  metadataMap: ModelFilterMetadata
): string | null {
  const clauses: string[] = [];

  for (const filter of activeFilters) {
    const fieldMetadata = metadataMap[filter.field];
    const clause = buildFilterClause(
      filter.field,
      filter.operator,
      filter.value,
      fieldMetadata.type
    );
    if (clause) clauses.push(clause);
  }

  return clauses.length > 0 ? clauses.join(" and ") : null;
}

function buildFilterClause(
  field: string,
  operator: ODataOperator,
  value: string | string[],
  valueType: FilterFieldMetadata["type"]
): string | null {
  const formattedValue = formatODataValue(value, valueType);

  switch (operator) {
    case "contains":
      return `contains(${field},'${value}')`;
    case "startswith":
      return `startswith(${field},'${value}')`;
    case "endswith":
      return `endswith(${field},'${value}')`;
    case "in":
      const values = String(value).split(",").map(v => `'${v.trim()}'`).join(",");
      return `${field} in (${values})`;
    default:
      return `${field} ${operator} ${formattedValue}`;
  }
}

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
```

---

## UI Components

### Component Structure

```
src/components/data-table/
├── data-table.tsx                 (existing - TanStack Table wrapper)
├── data-table-toolbar.tsx         (NEW - Search + Filter button)
├── data-table-faceted-filter.tsx  (NEW - Dynamic filter popover)
├── data-table-stats.tsx           (NEW - Statistics cards)
├── data-table-skeleton.tsx        (NEW - Loading state)
├── data-table-empty.tsx           (NEW - Empty state)
├── data-table-column-header.tsx   (existing)
├── data-table-pagination.tsx      (existing)
└── data-table-view-options.tsx    (existing)
```

### DataTableFacetedFilter

- Single "Filter" button that opens a popover
- Popover contains all filter groups (Status, Grade, Language, etc.)
- Multi-select with checkboxes
- Shows active filter count on button
- "Clear all" option when filters are active

### DataTableStats

- Grid of stat cards (5 columns on large screens)
- Each card shows: title, value, optional icon
- Supports loading state with skeleton
- Values reflect currently filtered data

### DataTableToolbar

- Search input (debounced)
- Filter button (with active count badge)
- Reset button (when filters are active)
- View options button (column visibility)

---

## Data Fetching

### Enhanced Hooks

```typescript
// src/lib/hooks/use-students.ts

export function useStudents({ queryParams, enabled = true }: UseStudentsOptions = {}) {
  const { accessToken, isAuthenticated } = useIdempiereAuth();

  return useQuery({
    queryKey: ["students", queryParams],
    queryFn: async () => {
      const response = await businessPartnerService.query(accessToken, {
        $filter: queryParams?.$filter,
        $orderby: queryParams?.$orderby,
        $top: queryParams?.$top,
        $skip: queryParams?.$skip,
      });
      return response.records.map(bp => businessPartnerService.transformToStudent(bp));
    },
    enabled: isAuthenticated && enabled,
  });
}

export function useStudentStats(filter?: string) {
  // Fetches counts for: Total, Active, Grade 9, 10, 11, 12
  // All queries respect the filter parameter
}
```

### Query Flow

```
User filters: Grade 9 + Active
        │
        ▼
OData: "IsActive eq true and GradeLevel eq '9'"
        │
        ▼
API: GET /api/v1/models/C_BPartner?$filter=IsActive eq true and GradeLevel eq '9'
        │
        ▼
Response: Filtered students + row-count
        │
        ▼
Table + Stats both reflect filtered results
```

---

## Table Column Definitions

### Student Columns

```typescript
// src/app/(main)/academic/students/columns.ts

export const studentColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox {...} />,
    cell: ({ row }) => <Checkbox {...} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Student" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>{row.original.name[0]}</Avatar>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <code className="text-sm">{row.original.value}</code>,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "gradeLevel",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Grade" />,
    cell: ({ row }) => row.original.gradeLevel || "—",
  },
  {
    id: "actions",
    cell: ({ row }) => <DropdownMenu>...</DropdownMenu>,
  },
];
```

---

## Students Page Implementation

```typescript
// src/app/(main)/academic/students/page.tsx

export default function StudentsPage() {
  const [currentPage, setCurrentPage] = useState(1);

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
    pageSize: 10,
    currentPage,
  });

  const { data: students, isLoading, error } = useStudents({ queryParams });
  const { data: stats } = useStudentStats(queryParams.$filter);

  const table = useTanStackTable({
    data: students?.records || [],
    columns: studentColumns,
    pageCount: students?.["page-count"] || 1,
    manualPagination: true,
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        <Button onClick={() => router.push("/academic/students/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <DataTableStats stats={statCards} isLoading={isLoading} />

      <div className="rounded-md border">
        <DataTableToolbar
          table={table}
          filterSchema={studentFilterSchema}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          searchableField="Name"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <DataTable table={table} columns={studentColumns} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
```

---

## Error Handling & Loading States

### Loading State

- `DataTableSkeleton` component shows placeholder rows
- `DataTableStats` shows skeleton cards during load

### Error State

- `DataTableError` component displays:
  - Authentication errors (401)
  - Network errors
  - Server errors (500, 502, 503)
  - Retry button

### Empty State

- `DataTableEmpty` shows different messages:
  - No results with filters: "Try adjusting your filters"
  - No results at all: "Add your first student"

---

## Reusability

### For Any New Entity (Teachers, Products, etc.)

1. **Add `FilterableFields` to model type file:**

```typescript
// lib/api/idempiere/models/ad-user/ad-user.types.ts
export const ADUserFilterableFields = {
  IsActive: { label: "Active", type: "boolean", operators: ["eq"] },
  Name: { label: "Name", type: "string", operators: ["contains"], searchable: true },
  // ...
};
```

2. **Create schema export:**

```typescript
// lib/api/idempiere/models/ad-user/ad-user.schema.ts
export const teacherFilterSchema = generateFilterSchema("AD_User", ADUserFilterableFields);
```

3. **Create hook following same pattern:**

```typescript
// lib/hooks/use-teachers.ts
export function useTeachers({ queryParams }) {
  // Same structure as useStudents
}
```

4. **Create page - SAME COMPONENTS:**

```typescript
// app/(main)/academic/teachers/page.tsx
// Identical structure to students page, just different imports
```

**All data table components are reused!**

---

## File Structure

### New Files

```
src/components/data-table/
├── data-table-toolbar.tsx
├── data-table-faceted-filter.tsx
├── data-table-stats.tsx
├── data-table-skeleton.tsx
└── data-table-empty.tsx

src/lib/data-table/
├── filter.types.ts
├── use-table-filters.ts
├── use-odata-query.ts
├── use-tanstack-table.ts
├── build-odata-filter.ts
├── generate-filter-schema.ts
└── error-boundary.tsx

src/lib/api/idempiere/models/c-bpartner/
├── c-bpartner.schema.ts
└── index.ts

src/app/(main)/academic/students/
├── columns.ts
└── page.tsx (replace)
```

### Files to Modify

| File | Changes |
|------|---------|
| `c-bpartner.types.ts` | Add `CBPartnerFilterableFields` export |
| `use-students.ts` | Add `queryParams` parameter, `useStudentStats` |
| `types.ts` | Ensure `Student` type is defined |

---

## Implementation Checklist

- [ ] Create `src/lib/data-table/` folder structure
- [ ] Create filter type definitions (`filter.types.ts`)
- [ ] Implement `useTableFilters` hook
- [ ] Implement `buildODataFilter` function
- [ ] Implement `generateFilterSchema` function
- [ ] Add `CBPartnerFilterableFields` to `c-bpartner.types.ts`
- [ ] Create `c-bpartner.schema.ts` with `studentFilterSchema`
- [ ] Create UI components: `DataTableFacetedFilter`, `DataTableStats`, `DataTableToolbar`
- [ ] Create loading/error components: `DataTableSkeleton`, `DataTableError`, `DataTableEmpty`
- [ ] Enhance `useStudents` hook with OData support
- [ ] Create `useStudentStats` hook
- [ ] Create `studentColumns` definition
- [ ] Replace students page with new table-based implementation
- [ ] Test URL parameter sync
- [ ] Test OData filter generation
- [ ] Test stats reflect filtered data
- [ ] Add error handling
- [ ] Document for other entities (Teachers, Products)

---

**Document Version:** 1.0
**Last Updated:** 2025-01-29
