# School Management System - Database Schema Summary

**Project:** School Management System (K-12 + Vocational + Training Center)
**Date:** 2025-01-24
**Backend:** iDempiere 12 ERP with Custom Extensions

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Table Naming Convention](#table-naming-convention)
3. [Mandatory Columns](#mandatory-columns)
4. [Complete Table List](#complete-table-list)
5. [Module Mapping](#module-mapping)
6. [Integration Strategy](#integration-strategy)
7. [Entity Relationship Summary](#entity-relationship-summary)
8. [Next Steps](#next-steps)

---

## Architecture Overview

### Hybrid Integration Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    School Management System                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐    ┌──────────────────────┐       │
│  │   Frontend Layer    │    │   Integration Layer  │       │
│  │   (Next.js)         │    │   (API Gateway)      │       │
│  └─────────┬───────────┘    └──────────┬───────────┘       │
│            │                           │                      │
│            └───────────────┬───────────┘                      │
│                            │                                  │
│  ┌─────────────────────────▼─────────────────────┐         │
│  │              Backend Layer                     │         │
│  ├───────────────────────────────────────────────┤         │
│  │  ┌─────────────────┐    ┌─────────────────┐  │         │
│  │  │ iDempiere Core  │    │ Custom Tables   │  │         │
│  │  │ (Native Modules)│    │ (SCH_, HR_, LIB)│  │         │
│  │  └─────────────────┘    └─────────────────┘  │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Integration Distribution

| Module Type | Percentage | Count | Notes |
|-------------|------------|-------|-------|
| **Native iDempiere** | ~40% | 8 modules | Finance, Asset, Communication |
| **Extended iDempiere** | ~30% | 6 modules | Student, Staff, Curriculum based on BP/Project |
| **Full Custom** | ~30% | 10 modules | Timetable, Attendance, Grades, HR, Library |

---

## Table Naming Convention

### Prefix System

| Prefix | Module | Purpose |
|--------|--------|---------|
| `SCH_` | Academic Core | Student, enrollment, curriculum, class, subjects |
| `LM_` | Learning Management | Assignments, quiz, materials (Phase 2 - Deferred) |
| `HR_` | Human Resources | Employee, leave, payroll |
| `LIB_` | Library | Books, loans, fines, reservations |
| `PA_` | Performance Analysis | Native iDempiere for KPIs |
| `AD_` | Application Dictionary | Native iDempiere |
| `C_` | Core Business | Native iDempiere (BP, Invoice, Payment, etc) |
| `A_` | Assets | Native iDempiere |
| `S_` | Resources | Native iDempiere |

### Suffix Pattern

| Suffix | Purpose |
|--------|---------|
| `_ID` | Primary Key |
| `_UU` | UUID for replication |
| `_LINE` | Detail/child records |
| `_ACCESS` | Access control or portal access |
| `_CONFIG` | Configuration settings |

---

## Mandatory Columns

All custom tables include these standard iDempiere columns:

```sql
-- Primary Key
<TABLE>_ID          NUMBER(10) NOT NULL PRIMARY KEY
<TABLE>_UU          VARCHAR2(36) UNIQUE          -- UUID for replication

-- Mandatory iDempiere Columns
AD_CLIENT_ID        NUMBER(10) NOT NULL           -- Multi-tenancy
AD_ORG_ID           NUMBER(10) NOT NULL           -- Organization access
ISACTIVE            CHAR(1) DEFAULT 'Y'           -- Soft delete (Y/N)
CREATED             DATE DEFAULT SYSDATE NOT NULL
CREATEDBY           NUMBER(10) NOT NULL
UPDATED             DATE DEFAULT SYSDATE NOT NULL
UPDATEDBY           NUMBER(10) NOT NULL
```

### Benefits

- ✅ **Multi-tenancy** via `AD_CLIENT_ID`
- ✅ **Organization isolation** via `AD_ORG_ID`
- ✅ **Soft delete** via `ISACTIVE`
- ✅ **Audit trail** via `CREATED, CREATEDBY, UPDATED, UPDATEDBY`
- ✅ **Replication support** via UUID columns
- ✅ **iDempiere compliance** for migration compatibility

---

## Complete Table List

### 6.1 Core Academic Tables (`SCH_`)

| Table | Purpose | Key Relations | Status |
|-------|---------|---------------|--------|
| `SCH_STUDENT` | Student profile extension | `C_BPARTNER` | ✅ Defined |
| `SCH_ENROLLMENT` | Enrollment history | `SCH_STUDENT` | ✅ Defined |
| `SCH_STUDENT_PARENT` | Parent-student link | `SCH_STUDENT`, `C_BPARTNER` | ✅ Defined |
| `SCH_CURRICULUM` | Curriculum header | `C_PROJECT` (optional) | ✅ Defined |
| `SCH_SUBJECT` | Subject master data | Standalone | ✅ Defined |
| `SCH_CURRICULUM_SUBJECT` | Curriculum-subject mapping | `SCH_CURRICULUM`, `SCH_SUBJECT` | ✅ Defined |
| `SCH_CLASS` | Class/groups | `AD_USER` (homeroom) | ✅ Defined |
| `SCH_CLASS_STUDENT` | Student-class assignment | `SCH_CLASS`, `SCH_STUDENT` | ✅ Defined |
| `SCH_TEACHER_SUBJECT` | Teacher-subject assignment | `AD_USER`, `SCH_SUBJECT`, `SCH_CLASS` | ✅ Defined |
| `SCH_TIME_SLOT` | Time periods | Standalone | ✅ Defined |
| `SCH_TIMETABLE` | Timetable header | Standalone | ✅ Defined |
| `SCH_SCHEDULE` | Schedule detail | `SCH_TIMETABLE`, `SCH_CLASS`, `SCH_SUBJECT`, `AD_USER`, `SCH_TIME_SLOT`, `S_RESOURCE` | ✅ Defined |
| `SCH_TEACHER_AVAILABILITY` | Teacher availability | `AD_USER`, `SCH_TIME_SLOT` | ✅ Defined |
| `SCH_RESOURCE_AVAILABILITY` | Room/resource availability | `S_RESOURCE`, `SCH_TIME_SLOT` | ✅ Defined |
| `SCH_SCHEDULE_EXCEPTION` | Holidays, special events | Standalone | ✅ Defined |
| `SCH_ATTENDANCE_CONFIG` | Attendance settings | Standalone | ✅ Defined |
| `SCH_ATTENDANCE` | Attendance header | `SCH_CLASS`, `SCH_SUBJECT` | ✅ Defined |
| `SCH_ATTENDANCE_LINE` | Student attendance | `SCH_ATTENDANCE`, `SCH_STUDENT` | ✅ Defined |
| `SCH_EXAM_TYPE` | Exam type master | Standalone | ✅ Defined |
| `SCH_EXAM` | Exam header | `SCH_EXAM_TYPE`, `SCH_SUBJECT`, `SCH_CLASS` | ✅ Defined |
| `SCH_GRADE` | Student grades | `SCH_EXAM`, `SCH_STUDENT` | ✅ Defined |
| `SCH_REPORT_CARD` | Report card header | `SCH_STUDENT`, `SCH_ENROLLMENT`, `SCH_CLASS` | ✅ Defined |
| `SCH_REPORT_CARD_LINE` | Subject-wise grades | `SCH_REPORT_CARD`, `SCH_SUBJECT` | ✅ Defined |
| `SCH_PARENT_ACCESS` | Parent portal login | `SCH_STUDENT_PARENT` | ✅ Defined |
| `SCH_STUDENT_PORTAL` | Student portal login | `SCH_STUDENT` | ✅ Defined |
| `SCH_ANNOUNCEMENT` | School announcements | `AD_NOTE` (optional) | ✅ Defined |
| `SCH_ANNOUNCEMENT_READ` | Announcement read receipts | `SCH_ANNOUNCEMENT`, `C_BPARTNER` | ✅ Defined |
| `SCH_MESSAGE` | Communication messages | `R_REQUEST`, `AD_NOTE` (optional) | ✅ Defined |
| `SCH_MESSAGE_RECIPIENT` | Message recipients | `SCH_MESSAGE`, `C_BPARTNER` | ✅ Defined |

**Total Academic Tables: 28 tables**

---

### 6.2 HR Custom Tables (`HR_`)

| Table | Purpose | Key Relations | Status |
|-------|---------|---------------|--------|
| `HR_EMPLOYEE` | Employee extension | `C_BPARTNER`, `AD_USER` | ✅ Defined |
| `HR_LEAVE_REQUEST` | Leave requests | `HR_EMPLOYEE` | ✅ Defined |
| `HR_LEAVE_BALANCE` | Leave balance tracking | `HR_EMPLOYEE` | ✅ Defined |
| `HR_PAYROLL` | Payroll header | Standalone | ✅ Defined |
| `HR_PAYROLL_LINE` | Payroll per employee | `HR_PAYROLL`, `HR_EMPLOYEE` | ✅ Defined |

**Total HR Tables: 5 tables**

---

### 6.3 Library Tables (`LIB_`)

| Table | Purpose | Key Relations | Status |
|-------|---------|---------------|--------|
| `LIB_BOOK_CATEGORY` | Book categories | Self-referential | ✅ Defined |
| `LIB_BOOK` | Bibliography master | `LIB_BOOK_CATEGORY`, `A_ASSET` | ✅ Defined |
| `LIB_BOOK_COPY` | Physical book copies | `LIB_BOOK` | ✅ Defined |
| `LIB_LOAN` | Loan transactions | `LIB_BOOK_COPY`, `SCH_STUDENT`, `HR_EMPLOYEE`, `C_BPARTNER` | ✅ Defined |
| `LIB_FINE` | Fine records | `LIB_LOAN` | ✅ Defined |
| `LIB_RESERVATION` | Book reservations | `LIB_BOOK`, `SCH_STUDENT`, `HR_EMPLOYEE`, `C_BPARTNER` | ✅ Defined |

**Total Library Tables: 6 tables**

---

### Native iDempiere Tables Used

| Module | Tables Used | Purpose |
|--------|-------------|---------|
| **Business Partner** | `C_BPARTNER`, `C_BPARTNER_LOCATION`, `C_BP_GROUP` | Students, Parents, Teachers, Staff, Vendors |
| **User Management** | `AD_USER`, `AD_USER_ROLES`, `AD_ROLE`, `AD_ROLE_ORGACCESS` | System users, authentication |
| **Organization** | `AD_CLIENT`, `AD_ORG`, `AD_ORGINFO` | Multi-tenancy, divisions |
| **Invoice Management** | `C_INVOICE`, `C_INVOICELINE`, `C_INVOICESCHEDULE` | Tuition, fees, charges |
| **Payment** | `C_PAYMENT`, `C_ALLOCATIONLINE`, `C_BANKACCOUNT` | Payment processing |
| **Accounting** | `C_ACCTSCHEMA`, `C_VALIDCOMBINATION`, `FACT_ACCT` | Financial accounting |
| **Financial Reporting** | `PA_REPORT`, `PA_REPORTLINE`, `PA_REPORTCOLUMN` | Financial reports |
| **Assets** | `A_ASSET`, `A_ASSET_GROUP`, `A_ASSET_ACCT` | Asset management |
| **Resources** | `S_RESOURCE`, `S_RESOURCEUNAVAILABLE`, `S_RESOURCETYPE` | Room/facility booking |
| **Projects** | `C_PROJECT`, `C_PROJECTLINE` | Curriculum base |
| **Performance Analysis** | `PA_GOAL`, `PA_MEASURE`, `PA_DASHBOARDCONTENT` | KPIs, dashboards |
| **Notes/Requests** | `AD_NOTE`, `R_REQUEST`, `R_REQUESTTYPE` | Notifications, communication |
| **Attachments** | `AD_ATTACHMENT`, `AD_ATTACHMENTNOTE` | Document storage |
| **Workflow** | `AD_WORKFLOW`, `AD_WF_PROCESS` | Approval workflows |

**Total Native iDempiere Tables: 50+ tables referenced**

---

## Module Mapping

### Dashboard
| Menu Item | Table | Integration Type |
|-----------|-------|------------------|
| Dashboard | `PA_DASHBOARDCONTENT` | 🟢 Native iDempiere |

### Academic Module
| Menu Item | Tables | Integration Type |
|-----------|--------|------------------|
| Students | `SCH_STUDENT`, `SCH_ENROLLMENT`, `SCH_STUDENT_PARENT` | 🟡 Extended `C_BPARTNER` |
| Curriculum | `SCH_CURRICULUM`, `SCH_SUBJECT`, `SCH_CURRICULUM_SUBJECT` | 🟡 Extended `C_PROJECT` |
| Timetable | `SCH_TIMETABLE`, `SCH_SCHEDULE`, `SCH_TIME_SLOT`, `SCH_TEACHER_AVAILABILITY`, `SCH_RESOURCE_AVAILABILITY`, `SCH_SCHEDULE_EXCEPTION` | 🔴 Full Custom |
| Attendance | `SCH_ATTENDANCE`, `SCH_ATTENDANCE_LINE`, `SCH_ATTENDANCE_CONFIG` | 🔴 Full Custom |
| Grades & Exams | `SCH_EXAM`, `SCH_EXAM_TYPE`, `SCH_GRADE`, `SCH_REPORT_CARD`, `SCH_REPORT_CARD_LINE` | 🔴 Full Custom |

### Finance Module
| Menu Item | Tables | Integration Type |
|-----------|--------|------------------|
| Invoices | `C_INVOICE`, `C_INVOICELINE` | 🟢 Native iDempiere |
| Payments | `C_PAYMENT`, `C_ALLOCATIONLINE` | 🟢 Native iDempiere |
| Payroll | `HR_PAYROLL`, `HR_PAYROLL_LINE` | 🔴 Custom (rebuild deprecated HR module) |
| Reports | `PA_REPORT`, `PA_REPORTLINE`, `FACT_ACCT` | 🟢 Native iDempiere |

### Human Resources Module
| Menu Item | Tables | Integration Type |
|-----------|--------|------------------|
| Staff Directory | `HR_EMPLOYEE`, `C_BPARTNER`, `AD_USER` | 🟡 Extended `C_BPARTNER` |
| Leave Management | `HR_LEAVE_REQUEST`, `HR_LEAVE_BALANCE` | 🔴 Full Custom |
| Performance | `PA_GOAL`, `PA_MEASURE`, `PA_ACHIEVEMENT` | 🟡 Extended native PA modules |

### Communication Module
| Menu Item | Tables | Integration Type |
|-----------|--------|------------------|
| Parent Portal | `SCH_PARENT_ACCESS` | 🔴 Custom Portal |
| Student Portal | `SCH_STUDENT_PORTAL` | 🔴 Custom Portal |
| Notifications | `AD_NOTE`, `R_REQUEST`, `SCH_ANNOUNCEMENT`, `SCH_MESSAGE` | 🟡 Extended native |

### Resources Module
| Menu Item | Tables | Integration Type |
|-----------|--------|------------------|
| Asset Management | `A_ASSET`, `A_ASSET_GROUP` | 🟢 Native iDempiere |
| Library | `LIB_BOOK`, `LIB_BOOK_COPY`, `LIB_LOAN`, `LIB_FINE`, `LIB_RESERVATION`, `LIB_BOOK_CATEGORY` | 🔴 Full Custom |
| Facilities | `S_RESOURCE`, `S_RESOURCEUNAVAILABLE` | 🟢 Native iDempiere |

### Legend
- 🟢 **Native** - Use iDempiere tables directly
- 🟡 **Extended** - Based on iDempiere with custom extensions
- 🔴 **Custom** - Full custom tables

---

## Integration Strategy

### Phase 1: Core Implementation (Current Scope)

**Priority 1 - High:**
1. ✅ Student Management (`SCH_STUDENT`, `SCH_ENROLLMENT`)
2. ✅ Curriculum (`SCH_CURRICULUM`, `SCH_SUBJECT`, `SCH_CLASS`)
3. ✅ Timetable (`SCH_TIMETABLE`, `SCH_SCHEDULE`)
4. ✅ Attendance (`SCH_ATTENDANCE`, `SCH_ATTENDANCE_LINE`)
5. ✅ Grades & Report Cards (`SCH_EXAM`, `SCH_GRADE`, `SCH_REPORT_CARD`)
6. ✅ Finance Integration (Invoices, Payments)
7. ✅ HR Basic (Employee, Leave)
8. ✅ Portal Access (Parent, Student)

**Priority 2 - Medium:**
1. ✅ Library Management
2. ✅ Communication/Notifications
3. ✅ Facility/Resource Booking
4. ✅ Payroll

**Priority 3 - Low:**
1. Performance Management (KPIs)
2. Advanced Analytics
3. Document Generation

### Phase 2: Future Enhancements (Deferred)

**LMS & Online Learning:**
- Assignments (`LM_ASSIGNMENT`, `LM_ASSIGNMENT_SUBMISSION`)
- Online Quiz (`LM_QUIZ`, `LM_QUIZ_QUESTION`, `LM_QUIZ_ATTEMPT`)
- Learning Materials (`LM_MATERIAL`)
- Question Bank (`LM_QUESTION_BANK`)

**Advanced Features:**
- Transport Management
- Dormitory/Hostel Management
- Alumni Management
- Alumni Portal
- Advanced Analytics & BI

---

## Entity Relationship Summary

### Core Entities

```
┌─────────────────┐
│  C_BPARTNER     │ (iDempiere Native)
│  - Students     │
│  - Parents      │
│  - Teachers     │
│  - Staff        │
└────────┬────────┘
         │
         ├─────────────────────┬─────────────────────┐
         │                     │                     │
    ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
    │SCH_STU- │          │HR_EMPLO-│          │SCH_CLASS│
    │DENT     │          │YEE      │          │_STUDENT │
    └────┬────┘          └─────────┘          └─────────┘
         │
         ├─────────────────────┬─────────────────────┐
         │                     │                     │
    ┌────▼──────┐       ┌─────▼──────┐       ┌─────▼──────┐
    │SCH_ENROLL-│       │SCH_TIMETABLE│      │SCH_ATTEND- │
    │MENT       │       │SCH_SCHEDULE │      │ANCE        │
    └───────────┘       └──────┬───────┘      └─────┬──────┘
                               │                    │
                        ┌──────▼────────┐    ┌─────▼──────────┐
                        │ SCH_SUBJECT   │    │ SCH_EXAM       │
                        │ SCH_CLASS     │    │ SCH_GRADE      │
                        │ AD_USER(Tchr) │    │ SCH_REPORT_CARD│
                        └───────────────┘    └────────────────┘
```

### Key Relationships

**1. Student Relationships:**
- `SCH_STUDENT` → `C_BPARTNER` (1:1)
- `SCH_STUDENT` ← `SCH_ENROLLMENT` (1:N)
- `SCH_STUDENT` ← `SCH_STUDENT_PARENT` (1:N)
- `SCH_STUDENT` ← `SCH_CLASS_STUDENT` (1:N)
- `SCH_STUDENT` → `SCH_ATTENDANCE_LINE` (1:N)
- `SCH_STUDENT` → `SCH_GRADE` (1:N)

**2. Academic Relationships:**
- `SCH_CURRICULUM` ← `SCH_CURRICULUM_SUBJECT` (1:N)
- `SCH_SUBJECT` ← `SCH_CURRICULUM_SUBJECT` (1:N)
- `SCH_CLASS` ← `SCH_CLASS_STUDENT` (1:N)
- `SCH_CLASS` ← `SCH_TEACHER_SUBJECT` (1:N)
- `SCH_CLASS` → `SCH_SCHEDULE` (1:N)

**3. Assessment Relationships:**
- `SCH_EXAM` ← `SCH_GRADE` (1:N)
- `SCH_EXAM` → `SCH_SUBJECT` (N:1)
- `SCH_REPORT_CARD` ← `SCH_REPORT_CARD_LINE` (1:N)

**4. HR Relationships:**
- `C_BPARTNER` → `HR_EMPLOYEE` (1:1)
- `HR_EMPLOYEE` ← `HR_LEAVE_REQUEST` (1:N)
- `HR_EMPLOYEE` ← `HR_LEAVE_BALANCE` (1:N)
- `HR_PAYROLL` ← `HR_PAYROLL_LINE` (1:N)

**5. Library Relationships:**
- `LIB_BOOK` ← `LIB_BOOK_COPY` (1:N)
- `LIB_BOOK_COPY` → `LIB_LOAN` (1:N)
- `LIB_LOAN` → `LIB_FINE` (1:N)

---

## Database Statistics

### Table Count Summary

| Category | Table Count |
|----------|-------------|
| Academic Core (`SCH_`) | 28 |
| HR Custom (`HR_`) | 5 |
| Library (`LIB_`) | 6 |
| **Custom Total** | **39** |
| Native iDempiere (referenced) | 50+ |
| **Grand Total** | **~90 tables** |

### Column Count (Estimated)

| Table Group | Avg Columns/Table | Total Columns |
|-------------|-------------------|---------------|
| Academic Core | ~25 | ~700 |
| HR Custom | ~20 | ~100 |
| Library | ~18 | ~108 |
| **Custom Total** | **~23** | **~908** |

### Index Count (Estimated)

| Table Group | Avg Indexes/Table | Total Indexes |
|-------------|-------------------|---------------|
| Academic Core | ~7 | ~196 |
| HR Custom | ~6 | ~30 |
| Library | ~5 | ~30 |
| **Custom Total** | **~6.5** | **~256** |

---

## Next Steps

### 1. Database Creation
```sql
-- Execute DDL scripts in order:
-- 1. Core Academic Tables (6.1)
-- 2. HR Custom Tables (6.2)
-- 3. Library Tables (6.3)
-- 4. Portal Tables (6.4)
```

### 2. Data Dictionary
Create comprehensive data dictionary with:
- Field descriptions
- Validation rules
- Default values
- Reference data (enums, lookups)

### 3. Seed Data
Prepare initial seed data:
- Academic year configurations
- Curriculum templates
- Subject master data
- Exam types
- Leave types
- Book categories

### 4. API Development
Design REST APIs for each module:
- Authentication (iDempiere native)
- CRUD operations per table
- Business logic endpoints
- Reporting endpoints

### 5. Frontend Integration
Connect Next.js frontend:
- API client setup
- Authentication flow
- Dashboard components
- Module-specific pages

---

## Appendix

### A. iDempiere Table References

**Key Native Tables:**
- `AD_CLIENT` - Client/Tenant
- `AD_ORG` - Organization
- `AD_USER` - System users
- `AD_ROLE` - Security roles
- `C_BPARTNER` - Business partners (students, parents, staff)
- `C_INVOICE` - Invoices
- `C_PAYMENT` - Payments
- `A_ASSET` - Fixed assets
- `S_RESOURCE` - Resources (rooms, facilities)
- `C_PROJECT` - Projects (curriculum base)
- `PA_REPORT` - Financial reports
- `R_REQUEST` - Requests/Support

### B. Deferred Features

**Phase 2 - LMS (Learning Management System):**
- Online assignments
- Quiz/exam system
- Learning materials
- Student submissions
- Question bank

**Not in Scope:**
- University-specific features (credits, KRS, thesis)
- Transport management
- Dormitory/hostel management
- Alumni management

### C. Documentation References

- [iDempiere Tables by Module](https://wiki.idempiere.org/en/Tables_by_Module)
- [iDempiere Database Structure](https://wiki.idempiere.org/en/Database_structure)
- [iDempiere 12 API Documentation](https://jenkins-artifacts.idempiere.org/javadoc12/)

---

**Document Version:** 1.0
**Last Updated:** 2025-01-24
**Author:** School Management System Development Team
