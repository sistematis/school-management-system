# iDempiere Query Builder

Type-safe query builder for constructing OData-style queries for the iDempiere REST API.

Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data

## Features

- **`$filter`**: Logical operators (`eq`, `neq`, `gt`, `ge`, `lt`, `le`, `and`, `or`, `not`) and method operators (`contains`, `startswith`, `endswith`, `tolower`, `toupper`)
- **`$orderby`**: Ascending/descending sort on single or multiple fields
- **`$top` and `$skip`**: Pagination support
- **`$select`**: Property selection to limit returned fields
- **`$expand`**: Related entity expansion with nested query options
- **iDempiere-specific**: `$valrule`, `$context`, `showsql`, `label`, `showlabel`

## Installation

The query builder is included in the iDempiere API module:

```typescript
import {
  QueryBuilder,
  filter,
  and,
  or,
  inFilter,
  methodFilter,
  orderBy,
  expand,
  buildQuery,
} from '@/lib/api/idempiere/query';
```

## Usage

### Fluent API with QueryBuilder

```typescript
import { QueryBuilder } from '@/lib/api/idempiere/query';

const query = new QueryBuilder()
  .filter('Name', 'eq', 'John')
  .and('IsActive', 'eq', true)
  .orderBy('Created', 'desc')
  .top(10)
  .expand(expand('C_BP_Group', { select: ['Name'] }))
  .build();

// Use with client.query()
const response = await client.query('/models/C_BPartner', query.params);
```

### Helper Functions

```typescript
import { filter, and, methodFilter, orderBy, expand } from '@/lib/api/idempiere/query';

const query = buildQuery({
  filter: and(
    filter('IsCustomer', 'eq', true),
    filter('IsActive', 'eq', true),
    methodFilter('contains', 'Name', 'Smith')
  ),
  orderBy: orderBy('Created', 'desc'),
  top: 20,
  expand: expand('C_BP_Group', { select: ['Name', 'Description'] })
});
```

### With Base Service

```typescript
import { getBusinessPartnerServiceV2 } from '@/lib/api/idempiere/services';
import { filter, and } from '@/lib/api/idempiere/query';

const service = getBusinessPartnerServiceV2();

// Use the queryWithFilter method
const result = await service.queryWithFilter(
  and(
    filter('IsCustomer', 'eq', true),
    filter('IsActive', 'eq', true)
  ),
  { page: 1, pageSize: 20 }
);
```

## Examples

### Filtering

```typescript
// Simple equality
.filter('Name', 'eq', 'John')

// Greater than
.filter('Amount', 'gt', 1000)

// Multiple conditions with AND
.filter('IsActive', 'eq', true)
.and('IsCustomer', 'eq', true)

// Method filters
.methodFilter('contains', 'Name', 'John')
.methodFilter('startswith', 'Name', 'A')
.methodFilter('endswith', 'Email', 'example.com')

// IN filter
.inFilter('ID', [1, 2, 3])
.inFilter('Status', ['Active', 'Pending'])

// Complex filter with AND/OR
import { and, or, filter, not } from '@/lib/api/idempiere/query';

const complexQuery = buildQuery({
  filter: and(
    filter('IsActive', 'eq', true),
    or(
      filter('Status', 'eq', 'Active'),
      filter('Status', 'eq', 'Pending')
    ),
    not(filter('IsDeleted', 'eq', true))
  )
});
```

### Sorting

```typescript
// Single field, ascending
.orderBy('Name')

// Single field, descending
.orderBy('Created', 'desc')

// Multiple fields
.orderByMultiple(
  { field: 'Name', order: 'asc' },
  { field: 'Created', order: 'desc' }
)
```

### Pagination

```typescript
// Direct top/skip
.top(10)
.skip(20)

// Using page/pageSize
.paginate(3, 20)  // Page 3, 20 records per page
```

### Property Selection

```typescript
.select('Name', 'Value', 'EMail')
```

### Expanding Related Entities

```typescript
// Simple expand
.expand(expand('C_BP_Group'))

// Expand with select
.expand(expand('C_BP_Group', { select: ['Name', 'Description'] }))

// Expand with filter
.expand(expand('C_OrderLine', {
  filter: filter('LineNetAmt', 'gt', 1000)
}))

// Expand with multiple nested options
.expand(expand('C_OrderLine', {
  select: ['Line', 'LineNetAmt'],
  filter: filter('LineNetAmt', 'gt', 1000),
  orderBy: orderBy('Line', 'asc'),
  top: 5
}))

// Multiple expands
.expand(
  expand('C_BP_Group', { select: ['Name'] }),
  expand('AD_User', { select: ['Name', 'EMail'] })
)

// Custom join key
.expand(expand('C_Order', {
  customJoinKey: 'salesrep_id',
  select: ['DocumentNo']
}))
```

### iDempiere-Specific Options

```typescript
// Validation rule
.withValRule(210)

// Context variables
.withContext('M_Product_ID', 124)
.withContext('AD_Org_ID', 11)

// SQL tracing
.withShowSql()        // Show SQL with data
.withShowSqlNoData()  // Show SQL without data

// Label filtering
.withLabel("Name eq '#Customer'")

// Include assigned labels
.withShowLabel(true)           // All columns
.withShowLabel(['Name'])       // Specific columns
```

## API Reference

### QueryBuilder Class

| Method | Description |
|--------|-------------|
| `filter(field, operator, value)` | Set base filter condition |
| `methodFilter(operator, field, value)` | Set method filter (contains, startswith, endswith) |
| `inFilter(field, values)` | Set IN filter |
| `and(field, operator, value)` | Add AND condition |
| `or(field, operator, value)` | Add OR condition |
| `not()` | Negate current filter |
| `orderBy(field, order?)` | Set sort order |
| `orderByMultiple(...clauses)` | Set multiple sort orders |
| `top(count)` | Set max records |
| `skip(count)` | Set records to skip |
| `paginate(page, pageSize)` | Set pagination |
| `select(...properties)` | Select properties |
| `expand(...expands)` | Expand related entities |
| `withValRule(valrule)` | Set validation rule |
| `withContext(name, value)` | Add context variable |
| `withShowSql(noData?)` | Enable SQL tracing |
| `withLabel(label)` | Set label filter |
| `withShowLabel(columns?)` | Include labels in response |
| `build()` | Build query to get params |
| `toQueryString()` | Get URL query string |
| `reset()` | Reset builder |
| `clone()` | Clone builder |

### Helper Functions

| Function | Description |
|----------|-------------|
| `filter(field, operator, value)` | Create logical filter |
| `methodFilter(operator, field, value)` | Create method filter |
| `inFilter(field, values)` | Create IN filter |
| `and(...filters)` | Combine filters with AND |
| `or(...filters)` | Combine filters with OR |
| `not(filter)` | Negate filter |
| `orderBy(field, order?)` | Create order by clause |
| `expand(field, options?)` | Create expand clause |
| `buildQuery(config)` | Build query from config |
| `toQueryString(config)` | Convert config to query string |

## Complete Example

```typescript
import { QueryBuilder, filter, and, methodFilter, orderBy, expand, buildQuery } from '@/lib/api/idempiere/query';
import { getBusinessPartnerServiceV2 } from '@/lib/api/idempiere/services';

// Using QueryBuilder
const builder = new QueryBuilder()
  .filter('IsCustomer', 'eq', true)
  .and('IsActive', 'eq', true)
  .methodFilter('startswith', 'Name', 'Pa')
  .orderBy('Created', 'desc')
  .paginate(1, 10)
  .select('Name', 'Value', 'EMail')
  .expand(expand('C_BP_Group', { select: ['Name'] }))
  .withShowSql();

const { params } = builder.build();

// Using helper functions
const query = buildQuery({
  filter: and(
    filter('IsCustomer', 'eq', true),
    filter('IsActive', 'eq', true),
    methodFilter('startswith', 'Name', 'Pa')
  ),
  orderBy: orderBy('Created', 'desc'),
  top: 10,
  skip: 0,
  select: ['Name', 'Value', 'EMail'],
  expand: expand('C_BP_Group', { select: ['Name'] }),
  idempiere: { showsql: true }
});

// Using with service
const service = getBusinessPartnerServiceV2();
const result = await service.queryWithConfig(query);
```

## Testing

Tests are located in `src/lib/api/idempiere/query/query-builder.test.ts`:

```bash
npm test -- src/lib/api/idempiere/query/query-builder.test.ts
```

## License

MIT
