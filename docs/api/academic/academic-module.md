# Academic Module APIs

> [!IMPORTANT]
> **Architecture:** This is a **frontend-only Next.js application** that connects directly to the **iDempiere REST API**.
>
> ## Actual iDempiere REST API Endpoints:
>
> | Operation | iDempiere Endpoint | Notes |
> |-----------|-------------------|-------|
> | List Students | `GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true` | Students have `IsCustomer = true` |
> | Get Student Detail | `GET /api/v1/models/c_bpartner/{id}?$expand=C_BPartner_Location,AD_User` | Include location and user data |
> | Create Student | `POST /api/v1/models/c_bpartner` + `POST /api/v1/models/c_bpartner_location` + `POST /api/v1/models/ad_user` | Multi-step creation |
> | Update Student | `PUT /api/v1/models/c_bpartner/{id}` + `PUT /api/v1/models/c_bpartner_location/{id}` | Update main and location records |
> | Delete Student | `DELETE /api/v1/models/c_bpartner/{id}` | Soft delete via `IsActive` flag |
>
> ## Service Layer:
> - `BusinessPartnerService` (`src/lib/api/idempiere/services/business-partner.service.ts`)
> - Handles authentication, data transformation, and error handling
> - Transforms C_BPartner data to/from Student format

---

## 1. Students

### 1.1 List All Students

**iDempiere REST API Endpoint:**

```http
GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true&$top=20&$skip=0
```

**Query Parameters (iDempiere OData Standard):**

```
# Filter active students only
$filter=IsCustomer eq true AND IsActive eq true

# Filter by name starting with "John"
$filter=startswith(Name,'John')

# Sort by student number (Value field)
$orderby=Value desc

# Pagination
$top=20&$skip=0

# Select specific fields
$select=C_BPartner_ID,Value,Name,Description,IsActive

# Include related data
$expand=C_BPartner_Location,AD_User

# Combine multiple options
$top=20&$skip=0&$filter=IsCustomer eq true AND IsActive eq true&$orderby=Value asc
```

**Examples:**

```http
# Example 1: Get active students
GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true AND IsActive eq true&$top=20

# Example 2: Search students by name
GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true AND startswith(Name,'John')&$top=10

# Example 3: Get specific student by ID
GET /api/v1/models/c_bpartner?$filter=C_BPartner_ID eq 1001

# Example 4: With expanded location and user data
GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true&$expand=C_BPartner_Location,AD_User
```

**iDempiere REST API Response:**

```json
{
  "page-count": 8,
  "records-size": 20,
  "skip-records": 0,
  "row-count": 150,
  "array-count": 20,
  "records": [
    {
      "id": 1001,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "C_BPartner_ID": 1001,
      "Value": "2024001",
      "Name": "John Doe",
      "Name2": null,
      "Description": "Student - Grade 10",
      "IsCustomer": true,
      "IsActive": true,
      "model-name": "C_BPartner"
    },
    {
      "id": 1002,
      "uid": "4a9f96fc-05b3-5f52-bf56-f8e60e8cf188",
      "C_BPartner_ID": 1002,
      "Value": "2024002",
      "Name": "Jane Smith",
      "Name2": null,
      "Description": "Student - Grade 10",
      "IsCustomer": true,
      "IsActive": true,
      "model-name": "C_BPartner"
    }
  ]
}
```

**Frontend Student Format (after BusinessPartnerService transformation):**

```json
{
  "id": "1001",
  "studentNo": "2024001",
  "name": "John Doe",
  "gradeLevel": "10",
  "className": "X-A",
  "schoolType": "SMA",
  "isActive": true
}
```

---

### 1.2 Get Student Detail

**iDempiere REST API Endpoint:**

```http
GET /api/v1/models/c_bpartner/{bpartnerId}?$expand=C_BPartner_Location,AD_User
```

**iDempiere REST API Response:**

```json
{
  "id": 1001,
  "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
  "C_BPartner_ID": 1001,
  "Value": "2024001",
  "Name": "John Doe",
  "Name2": null,
  "Description": "Student - Grade 10 - X-A",
  "IsCustomer": true,
  "IsActive": true,
  "model-name": "C_BPartner",
  "C_BPartner_Location": [
    {
      "C_BPartner_Location_ID": 1001,
      "Address1": "Jl. Example No. 123",
      "City": "Jakarta",
      "Postal": "12345",
      "Region": "DKI Jakarta"
    }
  ],
  "AD_User": [
    {
      "AD_User_ID": 1001,
      "Name": "John Doe",
      "Email": "john@example.com",
      "Phone": "08123456789",
      "IsActive": true
    }
  ]
}
```

**Frontend Student Format (after transformation):**

```json
{
  "id": "1001",
  "studentNo": "2024001",
  "name": "John Doe",
  "bpartnerId": 1001,
  "gradeLevel": "10",
  "className": "X-A",
  "schoolType": "SMA",
  "major": "IPA",
  "dateOfBirth": "2008-05-15",
  "placeOfBirth": "Jakarta",
  "gender": "M",
  "bloodType": "O",
  "religion": "Islam",
  "nationality": "Indonesian",
  "address": "Jl. Example No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12345",
  "phoneHome": "021-1234567",
  "phoneMobile": "08123456789",
  "email": "john@example.com",
  "isActive": true
}
```

---

### 1.3 Create Student

**iDempiere REST API Endpoints (Multi-step):**

**Step 1: Create C_BPartner**

```http
POST /api/v1/models/c_bpartner
Content-Type: application/json

{
  "Value": "2024001",
  "Name": "John Doe",
  "Name2": null,
  "Description": "Student - Grade 10 - X-A",
  "IsCustomer": true,
  "C_BP_Group_ID": 1000000,
  "IsActive": true
}
```

**Step 2: Create C_BPartner_Location**

```http
POST /api/v1/models/c_bpartner_location
Content-Type: application/json

{
  "C_BPartner_ID": 1001,
  "Address1": "Jl. Example No. 123",
  "City": "Jakarta",
  "Postal": "12345",
  "Region": "DKI Jakarta",
  "IsActive": true
}
```

**Step 3: Create AD_User (for login/contact)**

```http
POST /api/v1/models/ad_user
Content-Type: application/json

{
  "Name": "John Doe",
  "C_BPartner_ID": 1001,
  "Email": "john@example.com",
  "Phone": "08123456789",
  "IsActive": true
}
```

**Response (from each step):**

```json
{
  "id": 1001,
  "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
  "C_BPartner_ID": 1001,
  "Value": "2024001",
  "Name": "John Doe",
  "model-name": "C_BPartner"
}
```

---

### 1.4 Update Student

**iDempiere REST API Endpoint:**

```http
PUT /api/v1/models/c_bpartner/{bpartnerId}
Content-Type: application/json

{
  "Name": "John Doe Updated",
  "Description": "Student - Grade 11 - XI-IPA-1",
  "IsActive": true
}
```

**Also update location if needed:**

```http
PUT /api/v1/models/c_bpartner_location/{locationId}
Content-Type: application/json

{
  "Address1": "Jl. New Address No. 456",
  "City": "Jakarta",
  "Postal": "12345"
}
```

---

### 1.5 Delete Student

**iDempiere REST API Endpoint:**

```http
DELETE /api/v1/models/c_bpartner/{bpartnerId}
```

Or use soft delete via update:

```http
PUT /api/v1/models/c_bpartner/{bpartnerId}
Content-Type: application/json

{
  "IsActive": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 2. Other Academic Modules

> [!NOTE]
> The following modules are documented for reference. They are conceptual and would need to be implemented in iDempiere or as custom endpoints.

### 2.1 Subjects, Classes, Timetable, Attendance, Grades

These modules follow similar patterns using iDempiere REST API:

| Module | iDempiere Table | REST Endpoint Pattern |
|--------|-----------------|----------------------|
| Subjects | M_Product | `/api/v1/models/m_product` |
| Classes | - | Custom table or use C_BPartner groups |
| Timetable | - | Custom implementation needed |
| Attendance | - | Custom implementation needed |
| Grades | - | Custom implementation needed |

**For these modules, the implementation would be:**

1. **Option A:** Extend iDempiere with custom tables (SCH_SUBJECT, SCH_CLASS, etc.)
2. **Option B:** Use existing iDempiere tables and adapt the data model
3. **Option C:** Create custom API endpoints that interface with iDempiere

---

## 3. iDempiere REST API Reference

### 3.1 Authentication

iDempiere uses token-based authentication:

```http
POST /api/v1/auth/tokens
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "token": "eyJraWQiOiJpZC...",
  "refresh_token": "eyJraWQiOiJpZC...",
  "userId": 1000000,
  "clientId": 1000000
}
```

Use the token in subsequent requests:

```http
GET /api/v1/models/c_bpartner?$filter=IsCustomer eq true
Authorization: Bearer eyJraWQiOiJpZC...
```

### 3.2 Common Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `$filter` | Filter records | `$filter=IsActive eq true` |
| `$select` | Select specific fields | `$select=C_BPartner_ID,Name` |
| `$orderby` | Sort results | `$orderby=Name asc` |
| `$top` | Limit results | `$top=20` |
| `$skip` | Skip records (pagination) | `$skip=20` |
| `$expand` | Include related records | `$expand=C_BPartner_Location` |

### 3.3 Common Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `IsActive eq true` |
| `ne` | Not equal | `IsActive ne false` |
| `gt` | Greater than | `C_BPartner_ID gt 1000` |
| `ge` | Greater or equal | `C_BPartner_ID ge 1000` |
| `lt` | Less than | `C_BPartner_ID lt 2000` |
| `le` | Less or equal | `C_BPartner_ID le 2000` |
| `and` | Logical AND | `IsActive eq true and IsCustomer eq true` |
| `or` | Logical OR | `IsActive eq false or IsCustomer eq false` |
| `not` | Logical NOT | `not(IsActive eq false)` |
| `startswith` | Starts with | `startswith(Name,'John')` |
| `endswith` | Ends with | `endswith(Name,'Doe')` |
| `contains` | Contains | `contains(Name,'John')` |
| `tolower` | Lower case | `tolower(Name) eq 'john doe'` |

---

## 4. Service Layer Reference

### 4.1 BusinessPartnerService

**Location:** `src/lib/api/idempiere/services/business-partner.service.ts`

**Methods:**

```typescript
// Get students
class BusinessPartnerService extends IdempiereBaseService {
  async getStudents(params: QueryParams): Promise<ODataResponse<C_BPartner>>

  async getStudentById(id: number): Promise<C_BPartner>

  async createStudent(data: StudentCreateFormData): Promise<StudentBPCreateResponse>

  async updateStudent(id: number, data: Partial<StudentCreateFormData>): Promise<C_BPartner>

  async deleteStudent(id: number): Promise<void>
}
```

### 4.2 Usage Example in React Components

```typescript
import { useStudents } from "@/lib/hooks/use-students";

function StudentsPage() {
  const { data, isLoading, error } = useStudents({
    filter: ["IsCustomer eq true", "IsActive eq true"],
    top: 20,
    orderby: "Value asc"
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.records.map((student) => (
        <li key={student.id}>{student.Name} ({student.Value})</li>
      ))}
    </ul>
  );
}
```

---

## 5. Environment Configuration

**File:** `.env.local`

```env
# iDempiere REST API Configuration
NEXT_PUBLIC_IDEMPIERE_API_URL=https://backend-school-management-system.sistematis.co.id/api/v1
NEXT_PUBLIC_IDEMPIERE_CLIENT_ID=1000000
NEXT_PUBLIC_IDEMPIERE_ROLE_ID=1000000
NEXT_PUBLIC_IDEMPIERE_ORG_ID=1000000
NEXT_PUBLIC_IDEMPIERE_WAREHOUSE_ID=1000000
```

---

**Last Updated:** 2025-01-31
**Related:**
- [API Mapping](../../plans/academic/api-mapping.md)
- [Implementation Guide](../../plans/academic/implementation-guide.md)
- [iDempiere REST API Documentation](https://bxservice.github.io/idempiere-rest-docs/)
