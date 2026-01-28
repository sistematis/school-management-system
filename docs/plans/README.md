# School Management System - Implementation Plans

**Last Updated:** 2025-01-28

---

## Overview

This directory contains focused implementation plans for the School Management System modules. Each module has its own subdirectory with database schema, API mapping, and implementation guide.

---

## Module Structure

```
docs/plans/
├── academic/              # Academic Module
│   ├── database-schema.md   # Table definitions, relationships
│   ├── api-mapping.md       # API to database mapping
│   └── implementation-guide.md  # Phase-based implementation guide
│
├── finance/               # Finance Module
│   ├── database-schema.md   # Native iDempiere tables + custom payroll
│   ├── api-mapping.md       # API to database mapping
│   └── implementation-guide.md  # Implementation phases
│
├── hr/                    # Human Resources Module
│   ├── database-schema.md   # Employee, Leave, Payroll tables
│   ├── api-mapping.md       # API to database mapping
│   └── implementation-guide.md  # Implementation phases
│
├── library/               # Library Module
│   ├── database-schema.md   # Catalog, Circulation, Fines tables
│   ├── api-mapping.md       # API to database mapping
│   └── implementation-guide.md  # Implementation phases
│
└── README.md              # This file
```

---

## Module Summaries

### Academic Module (28 tables)

**Focus Areas:**

- Student Management (enrollment, profiles)
- Curriculum & Subjects
- Class Management
- Timetable & Scheduling
- Attendance Tracking
- Grades & Exams
- Parent & Student Portals

**Database Prefix:** `SCH_`

**Tables:**

- `SCH_STUDENT` - Student profiles
- `SCH_ENROLLMENT` - Enrollment history
- `SCH_CURRICULUM` - Curriculum definitions
- `SCH_SUBJECT` - Subject master data
- `SCH_CLASS` - Class/groups
- `SCH_TIMETABLE` - Timetable headers
- `SCH_SCHEDULE` - Schedule details
- `SCH_ATTENDANCE` - Attendance tracking
- `SCH_EXAM`, `SCH_GRADE` - Exams and grades
- `SCH_REPORT_CARD` - Report cards
- `SCH_PARENT_ACCESS`, `SCH_STUDENT_PORTAL` - Portals

---

### Finance Module (11 tables)

**Focus Areas:**

- Invoicing (tuition, fees, charges)
- Payments (receipts, allocation)
- Financial Reports
- Payroll Processing

**Database Tables:**

- **Native iDempiere:** `C_INVOICE`, `C_INVOICELINE`, `C_PAYMENT`, `C_ALLOCATIONLINE`, `C_BANKACCOUNT`, `C_ACCTSCHEMA`, `FACT_ACCT`
- **Custom:** `HR_PAYROLL`, `HR_PAYROLL_LINE`

---

### HR Module (5 tables)

**Focus Areas:**

- Staff Directory
- Leave Management
- Payroll Processing

**Database Prefix:** `HR_`

**Tables:**

- `HR_EMPLOYEE` - Staff profiles
- `HR_LEAVE_REQUEST` - Leave requests
- `HR_LEAVE_BALANCE` - Leave balance tracking
- `HR_PAYROLL` - Payroll header
- `HR_PAYROLL_LINE` - Payroll per employee

---

### Library Module (6 tables)

**Focus Areas:**

- Book Catalog
- Circulation (loans, returns)
- Fines Management
- Reservations

**Database Prefix:** `LIB_`

**Tables:**

- `LIB_BOOK_CATEGORY` - Book categories
- `LIB_BOOK` - Bibliography
- `LIB_BOOK_COPY` - Physical copies
- `LIB_LOAN` - Loan transactions
- `LIB_FINE` - Fine records
- `LIB_RESERVATION` - Book reservations

---

## Implementation Order

### Phase 1: Core Foundation

1. Set up iDempiere connection
2. Configure common structures (`common-structures.md`)
3. Set up authentication & authorization

### Phase 2: Module Implementation (can be parallel)

1. **Academic Module** (~21 days)
   - Students, Curriculum, Classes
   - Timetable, Attendance, Grades

2. **Finance Module** (~7 days)
   - Invoicing, Payments
   - Reports

3. **HR Module** (~6 days)
   - Staff Directory
   - Leave Management

4. **Library Module** (~5 days)
   - Catalog, Circulation

### Phase 3: Integration & Testing

1. Cross-module workflows
2. Portal integration
3. Performance testing
4. User acceptance testing

---

## Key Design Decisions

### 1. Native vs Custom Tables

- **Finance:** Mostly native iDempiere (invoice, payment) + custom payroll
- **HR:** Custom tables for employee, leave
- **Academic:** All custom tables (SCH\_ prefix)
- **Library:** All custom tables (LIB\_ prefix)

### 2. iDempiere Integration

- Use `C_BPARTNER` for all persons (students, parents, staff)
- Use `AD_USER` for system users
- Use native accounting for financial postings
- Use `C_INVOICE`/`C_PAYMENT` for billing

### 3. Multi-tenancy

- All tables include `AD_CLIENT_ID` and `AD_ORG_ID`
- Row-level security via organization access
- Soft delete via `ISACTIVE` flag

### 4. Audit Trail

- All tables include `CREATED`, `CREATEDBY`, `UPDATED`, `UPDATEDBY`
- UUID columns for replication (`_UU`)

---

## Related Documentation

### API Specifications

- [Academic API](../api/academic/academic-module.md)
- [Finance API](../api/finance/finance-module.md)
- [HR API](../api/hr/hr-module.md)
- [Library API](../api/library/library-module.md)
- [Common Structures](../api/common-structures.md)

### Seed Data

- [Academic Seed Data](./academic/seed/)
- [Finance Seed Data](./finance/seed/)
- [HR Seed Data](./hr/seed/)
- [Library Seed Data](./library/seed/)

---

## Documentation Structure

### Role of Each Document Type

| Document Type             | Location             | Purpose                                                |
| ------------------------- | -------------------- | ------------------------------------------------------ |
| `*module.md`              | `docs/api/*/`        | API endpoint specifications, request/response examples |
| `database-schema.md`      | `docs/plans/*/`      | Database table definitions, relationships              |
| `api-mapping.md`          | `docs/plans/*/`      | API to database SQL mapping                            |
| `implementation-guide.md` | `docs/plans/*/`      | Phase-based implementation guide                       |
| `seed/*.json`             | `docs/plans/*/seed/` | Sample data for testing                                |

**Key Points:**

- `*module.md` files are **API specifications** - they define endpoints, request formats, response formats
- `api-mapping.md` files are **SQL mapping guides** - they show how APIs map to database queries
- Both serve different purposes and should be kept

---

**Document Version:** 1.0
**Last Updated:** 2025-01-28
