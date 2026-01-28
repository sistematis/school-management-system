# School Management System - Common API Structures

**Project:** School Management System
**Version:** 1.0
**Date:** 2025-01-24
**Base URL:** `/api/v1`

---

## Standard Response Format

### iDempiere REST API Standard Response

The API follows the iDempiere REST API response format:

```typescript
// Standard Query Response (iDempiere format)
{
  "page-count": 1,
  "records-size": 3,
  "skip-records": 0,
  "row-count": 1,
  "array-count": 1,
  "records": [
    {
      "id": 121,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "Name": "Patio Fun, Inc.",
      "IsActive": true,
      "IsCustomer": true
    }
  ]
}

// With SQL tracing (showsql parameter)
{
  "page-count": 1,
  "records-size": 1,
  "skip-records": 0,
  "row-count": 1,
  "array-count": 1,
  "records": [...],
  "sql-command": "SELECT ... FROM C_BPartner WHERE ..."
}

// With labels (showlabel parameter)
{
  "page-count": 1,
  "records-size": 1,
  "skip-records": 0,
  "row-count": 1,
  "array-count": 1,
  "records": [...],
  "assigned-labels": [
    {
      "Name": "#Customer",
      "Description": "Customers"
    }
  ]
}
```

## Common Query Parameters (iDempiere REST API Standard)

This API follows the iDempiere REST API standard for querying data. Reference: [iDempiere REST Docs - Querying Data](https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data)

### Query Option `$filter`

The `$filter` query option allows you to filter a collection of resources by specifying expressions that evaluate to `true`.

**Logical Operators:**

| Operator | Description             |
| -------- | ----------------------- |
| `eq`     | equals (`=`)            |
| `neq`    | not equals (`!=`)       |
| `in`     | in list (`IN`)          |
| `gt`     | greater than (`>`)      |
| `ge`     | greater or equal (`>=`) |
| `lt`     | less than (`<`)         |
| `le`     | less or equal (`<=`)    |
| `and`    | logical AND             |
| `or`     | logical OR              |
| `not`    | logical NOT             |

**Method Operators** (strings must use single quotes):

| Operator                    | Description             |
| --------------------------- | ----------------------- |
| `contains(field,'value')`   | Field contains value    |
| `startswith(field,'value')` | Field starts with value |
| `endswith(field,'value')`   | Field ends with value   |
| `tolower(field)`            | Convert to lowercase    |
| `toupper(field)`            | Convert to uppercase    |

**Example:**

```
GET /api/v1/models/c_bpartner?$filter=isCustomer eq true AND isActive eq true AND startswith(name,'Pa') AND C_BPartner_ID in (120,121)
```

### Query Option `$orderby`

The `$orderby` query option allows you to request resources in either ascending order using `asc` or descending order using `desc`. If not specified, defaults to ascending order.

**Example:**

```
GET /api/v1/models/m_product?$orderby=Value desc
```

### Query Options `$top` and `$skip`

- `$top`: Number of items to include in the result
- `$skip`: Number of items to skip before returning results

**Example:**

```
GET /api/v1/models/c_order?$top=2&$skip=5
```

### Query Option `$select`

The `$select` query option allows clients to request a limited set of properties for each entity.

**Example:**

```
GET /api/v1/models/m_product?$select=Name,Value
```

### Query Option `$expand`

The `$expand` query option allows you to include related detail records within a single request.

**Basic Example:**

```
GET /api/v1/models/c_order?$expand=c_orderLine,c_ordertax
```

**With Query Options on Expanded Records:**

```
GET /api/v1/models/c_order?$select=DocumentNo,Description&$expand=C_OrderLine($select=Line,Linenetamt;$filter=LineNetAmt gt 1000;$orderby=Line)&$top=5
```

### iDempiere Specific Query Options

| Option      | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| `$valrule`  | Apply validation rule by AD_ValRule_ID or AD_ValRule_UU                       |
| `$context`  | Inject context variables (e.g., `$context=Variable1:Value1,Variable2:Value2`) |
| `showsql`   | Enable SQL query tracing in response (`showsql=nodata` for query only)        |
| `label`     | Filter records based on assigned AD_Label                                     |
| `showlabel` | Include assigned label data in response                                       |

## Common Headers

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
X-Client-ID: {client_id}
X-Org-ID: {org_id}
```

---

## Error Codes

| Code       | Description              |
| ---------- | ------------------------ |
| `AUTH_001` | Invalid access token     |
| `AUTH_002` | Access token expired     |
| `AUTH_003` | Insufficient permissions |
| `AUTH_004` | User not found           |
| `AUTH_005` | Invalid credentials      |
| `VAL_001`  | Validation error         |
| `VAL_002`  | Required field missing   |
| `VAL_003`  | Invalid data format      |
| `VAL_004`  | Duplicate record         |
| `RES_001`  | Resource not found       |
| `RES_002`  | Resource already exists  |
| `RES_003`  | Resource locked          |
| `SYS_001`  | Internal server error    |
| `SYS_002`  | Database error           |
| `SYS_003`  | External service error   |

---

## Common Request/Response Schemas

### OData Query Request Schema (iDempiere Standard)

```typescript
interface ODataQueryRequest {
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $select?: string;
  $expand?: string;
  $valrule?: string | number;
  $context?: string;
  showsql?: "true" | "nodata";
  label?: string;
  showlabel?: "true" | string;
}
```

### OData Response Schema (iDempiere Standard)

```typescript
interface ODataResponse<T> {
  records: T[];
  "page-count": number;
  "records-size": number;
  "skip-records"?: number;
  "row-count": number;
  "array-count"?: number;
  "sql-command"?: string;
  "assigned-labels"?: Array<{ Name: string; Description?: string }>;
}
```

### Postman Collection Structure

```
School Management System API
├── Academic
│   ├── Students
│   │   ├── List Students [GET]
│   │   ├── Get Student [GET]
│   │   ├── Create Student [POST]
│   │   ├── Update Student [PUT]
│   │   └── Delete Student [DELETE]
│   ├── Enrollment
│   ├── Curriculum
│   ├── Subjects
│   ├── Classes
│   ├── Timetable
│   ├── Attendance
│   └── Grades & Exams
├── Finance
│   ├── Invoices
│   ├── Payments
│   └── Reports
├── HR
│   ├── Staff
│   ├── Leave
│   └── Payroll
├── Library
│   ├── Books
│   ├── Loans
│   └── Fines
├── Communication
│   ├── Announcements
│   └── Messages
├── Portal
│   ├── Parent
│   └── Student
└── System
    ├── Users
    └── Configuration
```

---

**Document Version:** 1.0
**Last Updated:** 2025-01-27
**Author:** School Management System Development Team
