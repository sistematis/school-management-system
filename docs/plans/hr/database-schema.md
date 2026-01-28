# HR Module - Database Schema

**Module:** Human Resources
**Prefix:** `HR_`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Core Tables](#core-tables)
3. [Relationships Summary](#relationships-summary)

---

## Module Overview

### Table Statistics

| Category | Table Count | Est. Columns |
|----------|-------------|--------------|
| Employee Management | 1 | ~30 |
| Leave Management | 2 | ~40 |
| Payroll | 2 | ~30 |
| **Total** | **5** | **~100** |

### Integration with iDempiere

| iDempiere Table | Purpose |
|-----------------|---------|
| `C_BPARTNER` | Employees linked as Business Partners |
| `AD_USER` | System users for staff login |

---

## Core Tables

### Mandatory Columns (All Tables)

All `HR_*` tables include these iDempiere standard columns:

```sql
<TABLE>_ID          NUMBER(10) NOT NULL PRIMARY KEY
<TABLE>_UU          VARCHAR2(36) UNIQUE
AD_CLIENT_ID        NUMBER(10) NOT NULL
AD_ORG_ID           NUMBER(10) NOT NULL
ISACTIVE            CHAR(1) DEFAULT 'Y'
CREATED             DATE DEFAULT SYSDATE NOT NULL
CREATEDBY           NUMBER(10) NOT NULL
UPDATED             DATE DEFAULT SYSDATE NOT NULL
UPDATEDBY           NUMBER(10) NOT NULL
```

---

## HR_EMPLOYEE - Employee Extension

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_BPARTNER_ID` | NUMBER(10) | YES | Link to C_BPARTNER |
| `AD_USER_ID` | NUMBER(10) | NO | Link to AD_USER |
| `EMPLOYEE_NO` | VARCHAR2(20) | YES | Employee number (unique per client) |
| `EMPLOYEE_TYPE` | VARCHAR2(20) | NO | Type (Teaching, Non-Teaching, Contract) |
| `IS_TEACHER` | CHAR(1) | NO | Is teacher (Y/N) |
| `TEACHER_QUALIFICATION` | VARCHAR2(100) | NO | Teacher qualification |
| `SUBJECTS_EXPERTISE` | VARCHAR2(255) | NO | Subjects expertise |
| `JOINING_DATE` | DATE | NO | Joining date |
| `DEPARTMENT` | VARCHAR2(50) | NO | Department |
| `DESIGNATION` | VARCHAR2(100) | NO | Designation |
| `EMPLOYMENT_STATUS` | VARCHAR2(20) | NO | Employment status (Active) |
| `LEAVING_DATE` | DATE | NO | Leaving date |
| `LEAVING_REASON` | VARCHAR2(255) | NO | Leaving reason |
| `HIGHEST_QUALIFICATION` | VARCHAR2(100) | NO | Highest qualification |
| `QUALIFICATION_DETAILS` | CLOB | NO | Qualification details |
| `BANK_NAME` | VARCHAR2(50) | NO | Bank name |
| `BANK_ACCOUNT_NO` | VARCHAR2(30) | NO | Bank account |
| `BANK_ACCOUNT_NAME` | VARCHAR2(100) | NO | Account name |
| `TAX_ID` | VARCHAR2(30) | NO | Tax ID |
| `EMERGENCY_CONTACT_NAME` | VARCHAR2(100) | NO | Emergency contact name |
| `EMERGENCY_CONTACT_PHONE` | VARCHAR2(20) | NO | Emergency contact phone |
| `EMERGENCY_CONTACT_RELATION` | VARCHAR2(50) | NO | Emergency contact relation |

**Indexes:**
- `HR_EMPLOYEE_UU_IDX` on `HR_EMPLOYEE_UU`
- `HR_EMPLOYEE_NO_IDX` on `EMPLOYEE_NO`
- `HR_EMPLOYEE_BP_IDX` on `C_BPARTNER_ID`
- `HR_EMPLOYEE_USER_IDX` on `AD_USER_ID`

**Unique Constraints:**
- `EMPLOYEE_NO` + `AD_CLIENT_ID`

---

## HR_LEAVE_REQUEST - Leave Request

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `HR_EMPLOYEE_ID` | NUMBER(10) | YES | Employee ID |
| `LEAVE_TYPE` | VARCHAR2(20) | YES | Leave type |
| `FROM_DATE` | DATE | YES | From date |
| `TO_DATE` | DATE | YES | To date |
| `TOTAL_DAYS` | NUMBER(5) | YES | Total days |
| `REASON` | VARCHAR2(500) | NO | Reason |
| `CONTACT_ADDRESS` | VARCHAR2(255) | NO | Contact address |
| `CONTACT_PHONE` | VARCHAR2(20) | NO | Contact phone |
| `SUBSTITUTE_EMPLOYEE_ID` | NUMBER(10) | NO | Substitute employee |
| `HANDOVER_NOTES` | CLOB | NO | Handover notes |
| `STATUS` | VARCHAR2(20) | NO | Status (Pending, Approved, Rejected, Cancelled) |
| `APPROVED_BY` | NUMBER(10) | NO | Approved by (AD_USER) |
| `APPROVED_DATE` | DATE | NO | Approved date |
| `APPROVAL_REMARKS` | VARCHAR2(255) | NO | Approval remarks |
| `RETURN_DATE` | DATE | NO | Return date |
| `RETURN_REMARKS` | VARCHAR2(255) | NO | Return remarks |
| `ATTACHMENT_ID` | NUMBER(10) | NO | Attachment ID |

**Leave Type Values:**
- `Annual` - Annual leave
- `Sick` - Sick leave
- `Maternity` - Maternity leave
- `Paternity` - Paternity leave
- `Study` - Study leave
- `Unpaid` - Unpaid leave
- `Other` - Other

---

## HR_LEAVE_BALANCE - Leave Balance

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `HR_EMPLOYEE_ID` | NUMBER(10) | YES | Employee ID |
| `LEAVE_TYPE` | VARCHAR2(20) | YES | Leave type |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `ALLOTTED_DAYS` | NUMBER(5) | NO | Allotted days (default: 12) |
| `USED_DAYS` | NUMBER(5) | NO | Used days (default: 0) |
| `PENDING_DAYS` | NUMBER(5) | NO | Pending days (default: 0) |
| `CARRIED_FORWARD_DAYS` | NUMBER(5) | NO | Carried forward (default: 0) |

**Unique:**
- `HR_EMPLOYEE_ID`, `LEAVE_TYPE`, `ACADEMIC_YEAR`, `AD_CLIENT_ID`

**Computed:**
- `REMAINING_DAYS = ALLOTTED_DAYS - USED_DAYS - PENDING_DAYS`

---

## HR_PAYROLL - Payroll Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Payroll name |
| `PAYROLL_TYPE` | VARCHAR2(20) | NO | Payroll type (Monthly) |
| `PAYROLL_YEAR` | NUMBER(4) | YES | Payroll year |
| `PAYROLL_MONTH` | NUMBER(2) | YES | Payroll month |
| `FROM_DATE` | DATE | YES | From date |
| `TO_DATE` | DATE | YES | To date |
| `PAY_DATE` | DATE | NO | Pay date |
| `STATUS` | VARCHAR2(20) | NO | Status (Draft, Processing, Processed, Posted) |
| `PROCESSED_DATE` | DATE | NO | Processed date |
| `POSTED_DATE` | DATE | NO | Posted date |
| `TOTAL_EMPLOYEES` | NUMBER(3) | NO | Total employees |
| `TOTAL_GROSS_PAY` | NUMBER(15,2) | NO | Total gross pay |
| `TOTAL_DEDUCTIONS` | NUMBER(15,2) | NO | Total deductions |
| `TOTAL_NET_PAY` | NUMBER(15,2) | NO | Total net pay |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `PROCESSING_LOG` | CLOB | NO | Processing log |

---

## HR_PAYROLL_LINE - Payroll Per Employee

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `HR_PAYROLL_ID` | NUMBER(10) | YES | Payroll ID |
| `HR_EMPLOYEE_ID` | NUMBER(10) | YES | Employee ID |
| `BASIC_SALARY` | NUMBER(15,2) | YES | Basic salary |
| `WORKING_DAYS` | NUMBER(3) | NO | Working days (default: 22) |
| `PAID_DAYS` | NUMBER(3) | NO | Paid days (default: 22) |
| `HOUSING_ALLOWANCE` | NUMBER(15,2) | NO | Housing allowance |
| `TRANSPORT_ALLOWANCE` | NUMBER(15,2) | NO | Transport allowance |
| `MEDICAL_ALLOWANCE` | NUMBER(15,2) | NO | Medical allowance |
| `OTHER_ALLOWANCE` | NUMBER(15,2) | NO | Other allowance |
| `TOTAL_ALLOWANCES` | NUMBER(15,2) | NO | Total allowances |
| `TAX_DEDUCTION` | NUMBER(15,2) | NO | Tax deduction |
| `INSURANCE_DEDUCTION` | NUMBER(15,2) | NO | Insurance deduction |
| `OTHER_DEDUCTIONS` | NUMBER(15,2) | NO | Other deductions |
| `TOTAL_DEDUCTIONS` | NUMBER(15,2) | NO | Total deductions |
| `GROSS_PAY` | NUMBER(15,2) | NO | Gross pay |
| `NET_PAY` | NUMBER(15,2) | NO | Net pay |
| `PAYMENT_METHOD` | VARCHAR2(20) | NO | Payment method |
| `BANK_ACCOUNT_NO` | VARCHAR2(30) | NO | Bank account |
| `PAYMENT_REFERENCE` | VARCHAR2(50) | NO | Payment reference |
| `IS_PAID` | CHAR(1) | NO | Paid (Y/N) |
| `PAID_DATE` | DATE | NO | Paid date |

**Unique:**
- `HR_PAYROLL_ID`, `HR_EMPLOYEE_ID`, `AD_CLIENT_ID`

---

## Relationships Summary

### Employee Relationships

```
C_BPARTNER (iDempiere)
    ↓ 1:1
HR_EMPLOYEE
    ↓ 1:N
    ├── HR_LEAVE_REQUEST
    ├── HR_LEAVE_BALANCE
    └── HR_PAYROLL_LINE
        ↓ N:1
        └── HR_PAYROLL
```

### Leave Flow

```
HR_EMPLOYEE
    ↓ 1:N
HR_LEAVE_REQUEST
    ↓ (approval workflow)
AD_USER (Approver)
```

### Payroll Flow

```
HR_PAYROLL
    ↓ 1:N
HR_PAYROLL_LINE
    ↓ N:1
HR_EMPLOYEE → C_BPARTNER
```

---

**Document Version:** 1.0
**Related:**
- [API Specification](../api/hr/hr-module.md)
- [Implementation Guide](./implementation-guide.md)
