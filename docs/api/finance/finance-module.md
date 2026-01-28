# Finance Module APIs

**Base URL:** `/api/v1/finance`

---

## 1. Invoices

### 1.1 List Invoices

```http
GET /api/v1/finance/invoices
```

**Query Parameters (iDempiere REST API Standard):**

```
# Filter by student and status
$filter=C_BPartner_ID eq 1001 AND DocStatus eq 'CO'

# Filter by date range
$filter=DateInvoiced ge '2024-01-01' AND DateInvoiced le '2024-12-31'

# Filter open invoices
$filter=DocStatus eq 'CO' AND PaidAmt eq 0

# Get overdue invoices
$filter=DueDate lt '2024-12-31' AND PaidAmt lt GrandTotal

# Pagination and sorting
$top=20&$skip=0&$orderby=DateInvoiced desc

# Select specific fields
$select=DocumentNo,DateInvoiced,GrandTotal,PaidAmt,DocStatus

# With expanded student info
$expand=c_bpartner($select=Name,Name2)&$filter=DocStatus eq 'CO'
```

**Examples:**

```http
# Example 1: Get open invoices for a student
GET /api/v1/finance/invoices?$filter=C_BPartner_ID eq 1001 AND DocStatus eq 'CO'&$orderby=DateInvoiced desc

# Example 2: Get overdue invoices
GET /api/v1/finance/invoices?$filter=DueDate lt '2024-12-31' AND IsPaid eq false

# Example 3: Get invoices with outstanding balance
GET /api/v1/finance/invoices?$filter=GrandTotal gt PaidAmt&$orderby=DueDate asc

# Example 4: Get invoices by date range
GET /api/v1/finance/invoices?$filter=DateInvoiced ge '2024-01-01' AND DateInvoiced le '2024-12-31'&$top=50

# Example 5: Get invoices with student details
GET /api/v1/finance/invoices?$filter=C_BPartner_ID eq 1001&$expand=c_bpartner($select=Name,Email,Phone)
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
      "DocumentNo": "INV-2024-001",
      "C_BPartner_ID": 1001,
      "DateInvoiced": "2024-07-15",
      "DueDate": "2024-08-15",
      "GrandTotal": 2500000,
      "PaidAmt": 0,
      "IsPaid": false,
      "DocStatus": "CO",
      "Description": "Tuition fee for Semester 1 2024/2025",
      "model-name": "c_invoice"
    }
  ]
}
```

---

### 1.2 Create Invoice

```http
POST /api/v1/finance/invoices
```

**Request Body:**
```json
{
  "studentId": "STU-001",
  "invoiceType": "Tuition Fee",
  "invoiceDate": "2024-07-15",
  "dueDate": "2024-08-15",
  "description": "Tuition fee for Semester 1 2024/2025",
  "invoiceLines": [
    {
      "lineType": "Tuition Fee",
      "description": "Tuition Fee",
      "quantity": 1,
      "unitPrice": 2500000,
      "taxRate": 0,
      "amount": 2500000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-001",
    "invoiceNo": "INV-2024-001",
    "totalAmount": 2500000
  },
  "message": "Invoice created successfully"
}
```

---

## 2. Payments

### 2.1 List Payments

```http
GET /api/v1/finance/payments
```

**Query Parameters:**
```
?studentId=STU-001&status=Completed&paymentMethod=Bank Transfer&dateFrom=2024-01-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "paymentId": "PAY-001",
        "paymentNo": "PAY-2024-001",
        "studentId": "STU-001",
        "studentName": "John Doe",
        "paymentDate": "2024-08-01",
        "amount": 2500000,
        "paymentMethod": "Bank Transfer",
        "bankAccount": "BCA 1234567890",
        "reference": "TRX-12345",
        "status": "Completed",
        "invoices": [
          {
            "invoiceId": "INV-001",
            "invoiceNo": "INV-2024-001",
            "allocatedAmount": 2500000
          }
        ]
      }
    ]
  }
}
```

---

### 2.2 Create Payment

```http
POST /api/v1/finance/payments
```

**Request Body:**
```json
{
  "studentId": "STU-001",
  "paymentDate": "2024-08-01",
  "amount": 2500000,
  "paymentMethod": "Bank Transfer",
  "bankAccount": "BCA 1234567890",
  "reference": "TRX-12345",
  "invoices": [
    {
      "invoiceId": "INV-001",
      "allocatedAmount": 2500000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY-001",
    "paymentNo": "PAY-2024-001",
    "status": "Completed"
  },
  "message": "Payment processed successfully"
}
```

---

## 3. Financial Reports

### 3.1 Fee Collection Report

```http
GET /api/v1/finance/reports/fee-collection
```

**Query Parameters:**
```
?startDate=2024-01-01&endDate=2024-12-31&schoolType=SMA
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportPeriod": {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    },
    "summary": {
      "totalInvoiced": 500000000,
      "totalCollected": 450000000,
      "totalOutstanding": 50000000,
      "collectionPercentage": 90
    },
    "byInvoiceType": [
      {
        "invoiceType": "Tuition Fee",
        "totalInvoiced": 300000000,
        "totalCollected": 280000000,
        "outstanding": 20000000
      },
      {
        "invoiceType": "Admission Fee",
        "totalInvoiced": 50000000,
        "totalCollected": 50000000,
        "outstanding": 0
      }
    ],
    "byGrade": [
      {
        "gradeLevel": "10",
        "totalInvoiced": 100000000,
        "totalCollected": 95000000,
        "outstanding": 5000000
      }
    ]
  }
}
```

---

## Seed Data

Seed data untuk module ini tersedia di folder [`../../plans/finance/seed/`](../../plans/finance/seed/):

- [`invoices.json`](../../plans/finance/seed/invoices.json) - Data invoice/tagihan (5 records)
- [`payments.json`](../../plans/finance/seed/payments.json) - Data pembayaran (5 records)

---

**Last Updated:** 2025-01-27
