# HR Module - API Mapping

**Module:** Human Resources
**Base URL:** `/api/v1/hr`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Overview](#overview)
2. [Staff Directory API](#staff-directory-api)
3. [Leave Management API](#leave-management-api)
4. [Payroll API](#payroll-api)
5. [Field Mapping Reference](#field-mapping-reference)

---

## Overview

### API to Database Table Mapping

| API Endpoint | Primary Table | Related Tables |
|-------------|---------------|----------------|
| `GET /staff` | `HR_EMPLOYEE` | `C_BPARTNER`, `AD_USER` |
| `GET /staff/{id}` | `HR_EMPLOYEE` | `C_BPARTNER`, `AD_USER` |
| `POST /staff` | `HR_EMPLOYEE` + `C_BPARTNER` | `AD_USER` |
| `POST /leave-requests` | `HR_LEAVE_REQUEST` | `HR_EMPLOYEE` |
| `PUT /leave-requests/{id}/approve` | `HR_LEAVE_REQUEST` | `AD_USER` |
| `GET /leave-balance` | `HR_LEAVE_BALANCE` | `HR_EMPLOYEE` |
| `POST /payroll/process` | `HR_PAYROLL` | `HR_PAYROLL_LINE`, `HR_EMPLOYEE` |

---

## Staff Directory API

### List Staff → HR_EMPLOYEE

```http
GET /api/v1/hr/staff
```

**Database Query:**
```sql
SELECT
    e.HR_EMPLOYEE_ID as id,
    e.HR_EMPLOYEE_UU as uid,
    e.EMPLOYEE_NO as EmployeeNo,
    bp.NAME as Name,
    e.EMPLOYEE_TYPE as EmployeeType,
    e.IS_TEACHER as IsTeacher,
    e.TEACHER_QUALIFICATION as TeacherQualification,
    e.SUBJECTS_EXPERTISE as SubjectsExpertise,
    e.DESIGNATION as Designation,
    e.DEPARTMENT as Department,
    e.EMPLOYMENT_STATUS as EmploymentStatus,
    e.STARTDATE as StartDate,
    bp.PHONE as Phone,
    u.EMAIL as Email,
    e.ISACTIVE as IsActive,
    'sms_employee' as model-name
FROM HR_EMPLOYEE e
LEFT JOIN C_BPARTNER bp ON e.C_BPARTNER_ID = bp.C_BPARTNER_ID
LEFT JOIN AD_USER u ON e.AD_USER_ID = u.AD_USER_ID
WHERE e.AD_CLIENT_ID = ?
  AND e.ISACTIVE = 'Y'
ORDER BY bp.NAME
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=IsActive eq true` | `e.ISACTIVE = 'Y'` |
| `$filter=IsTeacher eq true` | `e.IS_TEACHER = 'Y'` |
| `$filter=Department eq 'Academic'` | `e.DEPARTMENT = 'Academic'` |
| `$filter=EmployeeType eq 'Teaching'` | `e.EMPLOYEE_TYPE = 'Teaching'` |
| `$filter=contains(Name,'Sarah')` | `bp.NAME LIKE '%Sarah%'` |
| `$orderby=Name asc` | `ORDER BY bp.NAME ASC` |

---

### Get Staff Detail → HR_EMPLOYEE

```http
GET /api/v1/hr/staff/{staffId}
```

**Database Query:**
```sql
SELECT
    e.HR_EMPLOYEE_ID,
    e.EMPLOYEE_NO,
    e.C_BPARTNER_ID,
    e.AD_USER_ID,
    bp.NAME,
    bp.VALUE as BpValue,
    u.EMAIL,
    u.USERNAME,
    bp.PHONE as Phone,
    bp.NAME2 as Name2,
    e.EMPLOYEE_TYPE,
    e.IS_TEACHER,
    e.TEACHER_QUALIFICATION,
    e.SUBJECTS_EXPERTISE,
    e.JOINING_DATE,
    e.DEPARTMENT,
    e.DESIGNATION,
    e.EMPLOYMENT_STATUS,
    e.HIGHEST_QUALIFICATION,
    e.QUALIFICATION_DETAILS,
    e.BANK_NAME,
    e.BANK_ACCOUNT_NO,
    e.BANK_ACCOUNT_NAME,
    e.TAX_ID,
    e.EMERGENCY_CONTACT_NAME,
    e.EMERGENCY_CONTACT_PHONE,
    e.EMERGENCY_CONTACT_RELATION
FROM HR_EMPLOYEE e
LEFT JOIN C_BPARTNER bp ON e.C_BPARTNER_ID = bp.C_BPARTNER_ID
LEFT JOIN AD_USER u ON e.AD_USER_ID = u.AD_USER_ID
WHERE e.HR_EMPLOYEE_ID = ?
```

---

### Create Staff → HR_EMPLOYEE + C_BPARTNER

```http
POST /api/v1/hr/staff
```

**Transaction Flow:**
```sql
-- Step 1: Create C_BPARTNER
INSERT INTO C_BPARTNER (
    C_BPARTNER_ID, C_BPARTNER_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    NAME, NAME2, ISVENDOR, BP_GROUP_ID
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, NULL, 'Y', ?);

-- Step 2: Create HR_EMPLOYEE
INSERT INTO HR_EMPLOYEE (
    HR_EMPLOYEE_ID, HR_EMPLOYEE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    C_BPARTNER_ID, AD_USER_ID, EMPLOYEE_NO,
    EMPLOYEE_TYPE, IS_TEACHER, TEACHER_QUALIFICATION,
    SUBJECTS_EXPERTISE, DEPARTMENT, DESIGNATION,
    EMPLOYMENT_STATUS, BANK_NAME, BANK_ACCOUNT_NO,
    BANK_ACCOUNT_NAME, TAX_ID, EMERGENCY_CONTACT_NAME,
    EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATION
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

---

## Leave Management API

### Request Leave → HR_LEAVE_REQUEST

```http
POST /api/v1/hr/leave-requests
```

**Database Query:**
```sql
INSERT INTO HR_LEAVE_REQUEST (
    HR_LEAVE_REQUEST_ID, HR_LEAVE_REQUEST_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    HR_EMPLOYEE_ID, LEAVE_TYPE, FROM_DATE, TO_DATE,
    TOTAL_DAYS, REASON, CONTACT_ADDRESS, CONTACT_PHONE,
    SUBSTITUTE_EMPLOYEE_ID, HANDOVER_NOTES, STATUS
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?, 'Pending'
);
```

---

### Approve Leave → HR_LEAVE_REQUEST + HR_LEAVE_BALANCE

```http
PUT /api/v1/hr/leave-requests/{leaveRequestId}/approve
```

**Transaction Flow:**
```sql
-- Step 1: Update leave request status
UPDATE HR_LEAVE_REQUEST
SET STATUS = 'Approved',
    APPROVED_BY = ?,
    APPROVED_DATE = SYSDATE,
    APPROVAL_REMARKS = ?
WHERE HR_LEAVE_REQUEST_ID = ?

-- Step 2: Update leave balance
UPDATE HR_LEAVE_BALANCE
SET USED_DAYS = USED_DAYS + (
    SELECT TOTAL_DAYS FROM HR_LEAVE_REQUEST WHERE HR_LEAVE_REQUEST_ID = ?
)
WHERE HR_EMPLOYEE_ID = (
    SELECT HR_EMPLOYEE_ID FROM HR_LEAVE_REQUEST WHERE HR_LEAVE_REQUEST_ID = ?
)
AND LEAVE_TYPE = (
    SELECT LEAVE_TYPE FROM HR_LEAVE_REQUEST WHERE HR_LEAVE_REQUEST_ID = ?
)
AND ACADEMIC_YEAR = (
    SELECT TO_CHAR(FROM_DATE, 'YYYY') FROM HR_LEAVE_REQUEST WHERE HR_LEAVE_REQUEST_ID = ?
)
```

---

### Get Leave Balance → HR_LEAVE_BALANCE

```http
GET /api/v1/hr/leave-balance?employeeId=EMP-001&academicYear=2024
```

**Database Query:**
```sql
SELECT
    lb.LEAVE_TYPE,
    lb.ACADEMIC_YEAR,
    lb.ALLOTTED_DAYS,
    lb.USED_DAYS,
    lb.PENDING_DAYS,
    lb.CARRIED_FORWARD_DAYS,
    (lb.ALLOTTED_DAYS - lb.USED_DAYS - lb.PENDING_DAYS) as REMAINING_DAYS
FROM HR_LEAVE_BALANCE lb
WHERE lb.HR_EMPLOYEE_ID = ?
  AND lb.ACADEMIC_YEAR = ?
ORDER BY lb.LEAVE_TYPE
```

---

## Payroll API

### Process Payroll → HR_PAYROLL + HR_PAYROLL_LINE

```http
POST /api/v1/hr/payroll/process
```

**Transaction Flow:**
```sql
-- Step 1: Create HR_PAYROLL header
INSERT INTO HR_PAYROLL (
    HR_PAYROLL_ID, HR_PAYROLL_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    NAME, PAYROLL_TYPE, PAYROLL_YEAR, PAYROLL_MONTH,
    FROM_DATE, TO_DATE, STATUS
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, 'Monthly', ?, ?,
    ?, ?, 'Processing'
);

-- Step 2: Create HR_PAYROLL_LINE for each employee
INSERT INTO HR_PAYROLL_LINE (
    HR_PAYROLL_LINE_ID, HR_PAYROLL_LINE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    HR_PAYROLL_ID, HR_EMPLOYEE_ID,
    BASIC_SALARY, WORKING_DAYS, PAID_DAYS,
    HOUSING_ALLOWANCE, TRANSPORT_ALLOWANCE, MEDICAL_ALLOWANCE,
    TAX_DEDUCTION, INSURANCE_DEDUCTION,
    GROSS_PAY, NET_PAY
)
SELECT
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, e.HR_EMPLOYEE_ID,
    BASIC_SALARY, 22, 22,
    HOUSING_ALLOWANCE, TRANSPORT_ALLOWANCE, MEDICAL_ALLOWANCE,
    TAX_DEDUCTION, INSURANCE_DEDUCTION,
    (BASIC_SALARY + HOUSING_ALLOWANCE + TRANSPORT_ALLOWANCE + MEDICAL_ALLOWANCE),
    (BASIC_SALARY + HOUSING_ALLOWANCE + TRANSPORT_ALLOWANCE + MEDICAL_ALLOWANCE - TAX_DEDUCTION - INSURANCE_DEDUCTION)
FROM HR_EMPLOYEE e
WHERE e.HR_EMPLOYEE_ID IN (?)
  AND e.EMPLOYMENT_STATUS = 'Active';

-- Step 3: Update payroll summary
UPDATE HR_PAYROLL
SET TOTAL_EMPLOYEES = (SELECT COUNT(*) FROM HR_PAYROLL_LINE WHERE HR_PAYROLL_ID = ?),
    TOTAL_GROSS_PAY = (SELECT SUM(GROSS_PAY) FROM HR_PAYROLL_LINE WHERE HR_PAYROLL_ID = ?),
    TOTAL_NET_PAY = (SELECT SUM(NET_PAY) FROM HR_PAYROLL_LINE WHERE HR_PAYROLL_ID = ?),
    STATUS = 'Draft',
    PROCESSED_DATE = SYSDATE
WHERE HR_PAYROLL_ID = ?
```

---

## Field Mapping Reference

### Staff Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `staffId` | `HR_EMPLOYEE` | `HR_EMPLOYEE_ID` |
| `employeeNo` | `HR_EMPLOYEE` | `EMPLOYEE_NO` |
| `name` | `C_BPARTNER` | `NAME` |
| `email` | `AD_USER` | `EMAIL` |
| `phone` | `C_BPARTNER` | `PHONE` |
| `employeeType` | `HR_EMPLOYEE` | `EMPLOYEE_TYPE` |
| `isTeacher` | `HR_EMPLOYEE` | `IS_TEACHER` |
| `teacherQualification` | `HR_EMPLOYEE` | `TEACHER_QUALIFICATION` |
| `subjectsExpertise` | `HR_EMPLOYEE` | `SUBJECTS_EXPERTISE` |
| `department` | `HR_EMPLOYEE` | `DEPARTMENT` |
| `designation` | `HR_EMPLOYEE` | `DESIGNATION` |
| `employmentStatus` | `HR_EMPLOYEE` | `EMPLOYMENT_STATUS` |
| `isActive` | `HR_EMPLOYEE` | `ISACTIVE` |

### Leave Request Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `leaveRequestId` | `HR_LEAVE_REQUEST` | `HR_LEAVE_REQUEST_ID` |
| `employeeId` | `HR_LEAVE_REQUEST` | `HR_EMPLOYEE_ID` |
| `leaveType` | `HR_LEAVE_REQUEST` | `LEAVE_TYPE` |
| `fromDate` | `HR_LEAVE_REQUEST` | `FROM_DATE` |
| `toDate` | `HR_LEAVE_REQUEST` | `TO_DATE` |
| `totalDays` | `HR_LEAVE_REQUEST` | `TOTAL_DAYS` |
| `reason` | `HR_LEAVE_REQUEST` | `REASON` |
| `substituteEmployeeId` | `HR_LEAVE_REQUEST` | `SUBSTITUTE_EMPLOYEE_ID` |
| `status` | `HR_LEAVE_REQUEST` | `STATUS` |
| `approvedBy` | `HR_LEAVE_REQUEST` | `APPROVED_BY` |
| `approvedDate` | `HR_LEAVE_REQUEST` | `APPROVED_DATE` |

### Leave Balance Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `employeeId` | `HR_LEAVE_BALANCE` | `HR_EMPLOYEE_ID` |
| `leaveType` | `HR_LEAVE_BALANCE` | `LEAVE_TYPE` |
| `academicYear` | `HR_LEAVE_BALANCE` | `ACADEMIC_YEAR` |
| `allottedDays` | `HR_LEAVE_BALANCE` | `ALLOTTED_DAYS` |
| `usedDays` | `HR_LEAVE_BALANCE` | `USED_DAYS` |
| `pendingDays` | `HR_LEAVE_BALANCE` | `PENDING_DAYS` |
| `remainingDays` | Computed | `ALLOTTED_DAYS - USED_DAYS - PENDING_DAYS` |

### Payroll Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `payrollId` | `HR_PAYROLL` | `HR_PAYROLL_ID` |
| `name` | `HR_PAYROLL` | `NAME` |
| `payrollType` | `HR_PAYROLL` | `PAYROLL_TYPE` |
| `payrollYear` | `HR_PAYROLL` | `PAYROLL_YEAR` |
| `payrollMonth` | `HR_PAYROLL` | `PAYROLL_MONTH` |
| `fromDate` | `HR_PAYROLL` | `FROM_DATE` |
| `toDate` | `HR_PAYROLL` | `TO_DATE` |
| `payDate` | `HR_PAYROLL` | `PAY_DATE` |
| `totalEmployees` | `HR_PAYROLL` | `TOTAL_EMPLOYEES` |
| `totalGrossPay` | `HR_PAYROLL` | `TOTAL_GROSS_PAY` |
| `totalNetPay` | `HR_PAYROLL` | `TOTAL_NET_PAY` |
| `status` | `HR_PAYROLL` | `STATUS` |

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Specification](../api/hr/hr-module.md)
- [Implementation Guide](./implementation-guide.md)
