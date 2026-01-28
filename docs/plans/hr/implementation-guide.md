# HR Module - Implementation Guide

**Module:** Human Resources
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Implementation Phases](#implementation-phases)
2. [Phase 1: Staff Directory](#phase-1-staff-directory)
3. [Phase 2: Leave Management](#phase-2-leave-management)
4. [Phase 3: Payroll](#phase-3-payroll)
5. [Testing Checklist](#testing-checklist)

---

## Implementation Phases

### Phase Overview

| Phase | Feature | Priority | Estimated Effort | Dependencies |
|-------|---------|----------|------------------|--------------|
| 1 | Staff Directory | High | 2 days | iDempiere C_BPARTNER, AD_USER |
| 2 | Leave Management | High | 2 days | HR_EMPLOYEE |
| 3 | Payroll | Medium | 2 days | HR_EMPLOYEE |

**Total Estimated Effort:** ~6 days

---

## Phase 1: Staff Directory

### 1.1 Database Setup

**Create Table:**
```sql
CREATE TABLE HR_EMPLOYEE (
    HR_EMPLOYEE_ID          NUMBER(10) NOT NULL PRIMARY KEY,
    HR_EMPLOYEE_UU          VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    C_BPARTNER_ID           NUMBER(10) NOT NULL,
    AD_USER_ID             NUMBER(10),
    EMPLOYEE_NO            VARCHAR2(20) NOT NULL,
    EMPLOYEE_TYPE          VARCHAR2(20),
    IS_TEACHER             CHAR(1) DEFAULT 'N',
    TEACHER_QUALIFICATION  VARCHAR2(100),
    SUBJECTS_EXPERTISE     VARCHAR2(255),
    JOINING_DATE           DATE,
    DEPARTMENT             VARCHAR2(50),
    DESIGNATION            VARCHAR2(100),
    EMPLOYMENT_STATUS      VARCHAR2(20),
    LEAVING_DATE           DATE,
    LEAVING_REASON         VARCHAR2(255),
    HIGHEST_QUALIFICATION  VARCHAR2(100),
    QUALIFICATION_DETAILS   CLOB,
    BANK_NAME              VARCHAR2(50),
    BANK_ACCOUNT_NO        VARCHAR2(30),
    BANK_ACCOUNT_NAME      VARCHAR2(100),
    TAX_ID                 VARCHAR2(30),
    EMERGENCY_CONTACT_NAME VARCHAR2(100),
    EMERGENCY_CONTACT_PHONE VARCHAR2(20),
    EMERGENCY_CONTACT_RELATION VARCHAR2(50),
    CONSTRAINT HR_EMPLOYEE_NO UNIQUE (EMPLOYEE_NO, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX HR_EMPLOYEE_UU_IDX ON HR_EMPLOYEE(HR_EMPLOYEE_UU);
CREATE INDEX HR_EMPLOYEE_NO_IDX ON HR_EMPLOYEE(EMPLOYEE_NO);
CREATE INDEX HR_EMPLOYEE_BP_IDX ON HR_EMPLOYEE(C_BPARTNER_ID);
CREATE INDEX HR_EMPLOYEE_USER_IDX ON HR_EMPLOYEE(AD_USER_ID);
CREATE INDEX HR_EMPLOYEE_TYPE_IDX ON HR_EMPLOYEE(EMPLOYEE_TYPE);
CREATE INDEX HR_EMPLOYEE_STATUS_IDX ON HR_EMPLOYEE(EMPLOYMENT_STATUS);
```

### 1.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/hr/staff` - List all staff
- [x] `GET /api/v1/hr/staff/{id}` - Get staff detail
- [x] `POST /api/v1/hr/staff` - Create staff
- [x] `PUT /api/v1/hr/staff/{id}` - Update staff
- [x] `DELETE /api/v1/hr/staff/{id}` - Delete staff (soft delete)

### 1.3 Staff Creation Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Staff Creation Flow                      │
└─────────────────────────────────────────────────────────┘

    REQUEST                VALIDATION              CREATION
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Staff   │───────────▶│ Email   │───────────▶│ C_      │
    │ Request │           │ Unique  │           │ BPARTNER│
    │ Data    │           │ Check   │           │         │
    └─────────┘           └─────────┘           └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Create AD_  │
                    │ USER        │
                    │ (optional)  │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Create HR_    │
                    │ EMPLOYEE      │
                    └──────────────────┘
                           │
                    ┌────────▼─────────┐
                    │ Link BP & User│
                    │ to Employee    │
                    └──────────────────┘
```

### 1.4 Business Rules

**Employee Number Generation:**
- Format: `STF-{YYYY}-{XXXX}`
- Auto-increment per client
- Must be unique

**Staff Types:**
- `Teaching` - Teachers, lecturers
- `Non-Teaching` - Admin, support staff
- `Contract` - Contract staff

**Employment Status:**
- `Active` - Currently employed
- `On Leave` - On leave (sabbatical, etc.)
- `Resigned` - Resigned
- `Retired` - Retired
- `Terminated` - Terminated

**Validation Rules:**
- Email must be unique (if AD_USER_ID provided)
- Employee number must be unique
- At least name is required
- Teacher qualification required if IS_TEACHER = 'Y'

### 1.5 Frontend Components

**Required Pages:**
- `/hr/staff` - Staff list
- `/hr/staff/new` - Create staff
- `/hr/staff/[id]` - Staff detail
- `/hr/staff/[id]/edit` - Edit staff

### 1.6 Seed Data

**File:** `docs/api/hr/seed/staff.json`

```json
[
  {
    "employeeNo": "STF-001",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@school.ac.id",
    "phone": "081234567001",
    "employeeType": "Teaching",
    "isTeacher": true,
    "teacherQualification": "S2 Pendidikan Matematika",
    "subjectsExpertise": "Matematika, Fisika",
    "department": "Academic",
    "designation": "Senior Teacher",
    "employmentStatus": "Active"
  },
  {
    "employeeNo": "STF-002",
    "name": "Michael Chen",
    "email": "michael.chen@school.ac.id",
    "phone": "081234567002",
    "employeeType": "Non-Teaching",
    "isTeacher": false,
    "department": "Administration",
    "designation": "Administrator",
    "employmentStatus": "Active"
  }
]
```

---

## Phase 2: Leave Management

### 2.1 Database Setup

**Create Tables:**
```sql
CREATE TABLE HR_LEAVE_REQUEST (
    HR_LEAVE_REQUEST_ID    NUMBER(10) NOT NULL PRIMARY KEY,
    HR_LEAVE_REQUEST_UU    VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    HR_EMPLOYEE_ID         NUMBER(10) NOT NULL,
    LEAVE_TYPE             VARCHAR2(20) NOT NULL,
    FROM_DATE              DATE NOT NULL,
    TO_DATE                DATE NOT NULL,
    TOTAL_DAYS             NUMBER(5) NOT NULL,
    REASON                 VARCHAR2(500),
    CONTACT_ADDRESS        VARCHAR2(255),
    CONTACT_PHONE          VARCHAR2(20),
    SUBSTITUTE_EMPLOYEE_ID NUMBER(10),
    HANDOVER_NOTES         CLOB,
    STATUS                 VARCHAR2(20),
    APPROVED_BY            NUMBER(10),
    APPROVED_DATE          DATE,
    APPROVAL_REMARKS       VARCHAR2(255),
    RETURN_DATE            DATE,
    RETURN_REMARKS         VARCHAR2(255),
    ATTACHMENT_ID          NUMBER(10)
);

CREATE TABLE HR_LEAVE_BALANCE (
    HR_LEAVE_BALANCE_ID    NUMBER(10) NOT NULL PRIMARY KEY,
    HR_LEAVE_BALANCE_UU    VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE              CHAR(1) DEFAULT 'Y',
    CREATED               DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY             NUMBER(10) NOT NULL,
    UPDATED               DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY             NUMBER(10) NOT NULL,
    HR_EMPLOYEE_ID        NUMBER(10) NOT NULL,
    LEAVE_TYPE            VARCHAR2(20) NOT NULL,
    ACADEMIC_YEAR         VARCHAR2(10) NOT NULL,
    ALLOTTED_DAYS        NUMBER(5) DEFAULT 12,
    USED_DAYS            NUMBER(5) DEFAULT 0,
    PENDING_DAYS         NUMBER(5) DEFAULT 0,
    CARRIED_FORWARD_DAYS NUMBER(5) DEFAULT 0,
    CONSTRAINT HR_LEAVE_BALANCE_UQ UNIQUE (HR_EMPLOYEE_ID, LEAVE_TYPE, ACADEMIC_YEAR, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX HR_LEAVE_REQUEST_EMP_IDX ON HR_LEAVE_REQUEST(HR_EMPLOYEE_ID);
CREATE INDEX HR_LEAVE_REQUEST_DATE_IDX ON HR_LEAVE_REQUEST(FROM_DATE, TO_DATE);
CREATE INDEX HR_LEAVE_REQUEST_STATUS_IDX ON HR_LEAVE_REQUEST(STATUS);

CREATE INDEX HR_LEAVE_BALANCE_EMP_IDX ON HR_LEAVE_BALANCE(HR_EMPLOYEE_ID);
CREATE INDEX HR_LEAVE_BALANCE_YEAR_IDX ON HR_LEAVE_BALANCE(ACADEMIC_YEAR);
```

### 2.2 API Implementation

**Required Endpoints:**
- [x] `POST /api/v1/hr/leave-requests` - Request leave
- [x] `GET /api/v1/hr/leave-requests` - List leave requests
- [x] `GET /api/v1/hr/leave-requests/{id}` - Get leave request detail
- [x] `PUT /api/v1/hr/leave-requests/{id}/approve` - Approve leave
- [x] `PUT /api/v1/hr/leave-requests/{id}/reject` - Reject leave
- [x] `GET /api/v1/hr/leave-balance` - Get leave balance
- [x] `POST /api/v1/hr/leave-balance` - Initialize leave balance

### 2.3 Leave Request Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Leave Request Flow                       │
└─────────────────────────────────────────────────────────┘

    REQUEST              CHECK BALANCE          SUBMIT
    ┌─────────┐          ┌─────────┐          ┌─────────┐
    │ Leave   │──────────▶│ Has     │──────────▶│ Status= │
    │ Request │          │ Balance?│          │ Pending │
    └─────────┘          └─────────┘          └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Notify      │
                    │ Approver    │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Approval:    │
                    │ - Approve    │
                    │ - Reject     │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Update Status │
                    │ Update Balance│
                    └──────────────────┘
```

### 2.4 Business Rules

**Leave Types:**
- `Annual` - 12 days per year (standard)
- `Sick` - As needed (with medical certificate)
- `Maternity` - 90 days (as per law)
- `Paternity` - 14 days (as per law)
- `Study` - With approval
- `Unpaid` - Without salary
- `Other` - Special cases

**Leave Balance Calculation:**
```
ANNUAL_LEAVE_BALANCE = 12 - USED_DAYS - PENDING_DAYS
```

**Approval Workflow:**
- HR Manager can approve all leave types
- Principal must approve teacher leave
- Substitute teacher required for teaching staff

**Validation Rules:**
- Cannot overlap existing approved leave
- Cannot exceed available balance (except sick leave)
- Total days must be positive
- To date must be after or equal to from date

### 2.5 Frontend Components

**Required Pages:**
- `/hr/leave` - Leave request list
- `/hr/leave/new` - Create leave request
- `/hr/leave/approve` - Approval page
- `/hr/leave/balance` - Leave balance view

### 2.6 Seed Data

**File:** `docs/api/hr/seed/leave-requests.json`

```json
[
  {
    "employeeId": "EMP-001",
    "leaveType": "Annual",
    "fromDate": "2024-09-01",
    "toDate": "2024-09-05",
    "totalDays": 5,
    "reason": "Family vacation",
    "status": "Pending"
  },
  {
    "employeeId": "EMP-002",
    "leaveType": "Sick",
    "fromDate": "2024-09-10",
    "toDate": "2024-09-12",
    "totalDays": 3,
    "reason": "Medical treatment",
    "status": "Approved"
  }
]
```

---

## Phase 3: Payroll

### 3.1 Database Setup

**Tables:** See Finance module documentation (HR_PAYROLL, HR_PAYROLL_LINE)

### 3.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/hr/payroll` - List payroll
- [x] `POST /api/v1/hr/payroll/process` - Process payroll
- [x] `GET /api/v1/hr/payroll/{id}` - Get payroll detail
- [x] `GET /api/v1/hr/payroll/{id}/slips` - Generate pay slips

### 3.3 Payroll Processing

**See Finance module documentation for detailed implementation.**

### 3.4 Frontend Components

**Required Pages:**
- `/hr/payroll` - Payroll list
- `/hr/payroll/process` - Process payroll
- `/hr/payroll/[id]` - Payroll detail
- `/hr/payroll/[id]/slips` - View pay slips

---

## Testing Checklist

### Database Testing

- [ ] HR_EMPLOYEE table created successfully
- [ ] HR_LEAVE_REQUEST table created successfully
- [ ] HR_LEAVE_BALANCE table created successfully
- [ ] All indexes created successfully
- [ ] Unique constraints working

### API Testing

- [ ] Staff list returns correct data
- [ ] Staff detail returns complete data
- [ ] Staff creation creates C_BPARTNER, AD_USER, HR_EMPLOYEE
- [ ] Leave request creates record correctly
- [ ] Leave approval updates status and balance
- [ ] Leave balance returns correct remaining days

### Frontend Testing

- [ ] All pages accessible
- [ ] Staff form validates correctly
- [ ] Leave form calculates days correctly
- [ ] Leave approval interface working
- [ ] Leave balance display correct

### Integration Testing

- [ ] Staff linked to correct C_BPARTNER
- [ ] Staff with AD_USER can log in
- [ ] Leave request checks balance correctly
- [ ] Leave approval updates balance correctly
- [ ] Payroll includes correct employees
- [ ] Payroll calculations accurate

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Mapping](./api-mapping.md)
- [API Specification](../api/hr/hr-module.md)
