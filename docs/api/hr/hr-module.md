# HR Module APIs

**Base URL:** `/api/v1/hr`

---

## 1. Staff Directory

### 1.1 List All Staff

```http
GET /api/v1/hr/staff
```

**Query Parameters (iDempiere REST API Standard):**

```
# Filter active teaching staff
$filter=IsActive eq true AND IsTeacher eq true

# Filter by department
$filter=Department eq 'Academic' AND IsActive eq true

# Filter by employment type
$filter=EmployeeType eq 'Teaching'

# Pagination and sorting
$top=20&$skip=0&$orderby=Name asc

# Select specific fields
$select=Name,EmployeeNo,Department,Email,Phone

# With expanded user info
$expand=ad_user($select=Email,Phone)&$filter=IsActive eq true

# Complex filter - Active teachers with email
$filter=IsActive eq true AND IsTeacher eq true AND Email ne null
```

**Examples:**

```http
# Example 1: Get all active teaching staff
GET /api/v1/hr/staff?$filter=IsActive eq true AND IsTeacher eq true&$orderby=Name asc

# Example 2: Get staff by department
GET /api/v1/hr/staff?$filter=Department eq 'Academic' AND IsActive eq true

# Example 3: Search staff by name
GET /api/v1/hr/staff?$filter=contains(Name,'Sarah') OR contains(Name,'Johnson')

# Example 4: Get teachers with qualifications
GET /api/v1/hr/staff?$filter=IsTeacher eq true AND TeacherQualification ne null&$orderby=Name asc

# Example 5: Get staff with expanded user details
GET /api/v1/hr/staff?$filter=IsActive eq true&$expand=ad_user($select=Email,Phone,Username)
```

**Response (iDempiere REST API Format):**
```json
{
  "page-count": 1,
  "records-size": 1,
  "skip-records": 0,
  "row-count": 1,
  "array-count": 1,
  "records": [
    {
      "id": 1001,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "EmployeeNo": "STF-001",
      "Name": "Sarah Johnson",
      "EmployeeType": "Teaching",
      "IsTeacher": true,
      "TeacherQualification": "S2 Pendidikan Matematika",
      "SubjectsExpertise": "Matematika, Fisika",
      "Designation": "Senior Teacher",
      "Department": "Academic",
      "EmploymentStatus": "Active",
      "IsActive": true,
      "StartDate": "2015-07-01",
      "Phone": "08123456789",
      "Email": "sarah.johnson@school.ac.id",
      "model-name": "sms_employee"
    }
  ]
}
```

---

## 2. Leave Management

### 2.1 Request Leave

```http
POST /api/v1/hr/leave-requests
```

**Request Body:**
```json
{
  "employeeId": "EMP-001",
  "leaveType": "Annual",
  "fromDate": "2024-09-01",
  "toDate": "2024-09-05",
  "totalDays": 5,
  "reason": "Family vacation",
  "substituteEmployeeId": "EMP-002",
  "contactAddress": "Home address",
  "contactPhone": "08123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaveRequestId": "LR-001",
    "status": "Pending",
    "message": "Leave request submitted successfully"
  }
}
```

---

### 2.2 Approve Leave

```http
PUT /api/v1/hr/leave-requests/{leaveRequestId}/approve
```

**Request Body:**
```json
{
  "status": "Approved",
  "approvalRemarks": "Leave approved. Enjoy your vacation!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaveRequestId": "LR-001",
    "status": "Approved",
    "approvedBy": "USR-001",
    "approvedDate": "2024-08-20T10:00:00Z"
  },
  "message": "Leave approved successfully"
}
```

---

## 3. Payroll

### 3.1 Process Payroll

```http
POST /api/v1/hr/payroll/process
```

**Request Body:**
```json
{
  "name": "Payroll September 2024",
  "payrollType": "Monthly",
  "payrollYear": 2024,
  "payrollMonth": 9,
  "fromDate": "2024-09-01",
  "toDate": "2024-09-30",
  "payDate": "2024-09-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payrollId": "PR-001",
    "name": "Payroll September 2024",
    "totalEmployees": 50,
    "totalGrossPay": 250000000,
    "totalDeductions": 25000000,
    "totalNetPay": 225000000,
    "status": "Draft"
  },
  "message": "Payroll processed successfully"
}
```

---

## Seed Data

Seed data untuk module ini tersedia di folder [`../../plans/hr/seed/`](../../plans/hr/seed/):

- [`staff.json`](../../plans/hr/seed/staff.json) - Data pegawai/staf (8 records)
- [`leave-requests.json`](../../plans/hr/seed/leave-requests.json) - Data cuti (3 records)
- [`payroll.json`](../../plans/hr/seed/payroll.json) - Data penggajian (2 records)

---

**Last Updated:** 2025-01-27
