# Finance Module - Implementation Guide

**Module:** Finance Management
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Implementation Phases](#implementation-phases)
2. [Phase 1: Invoicing](#phase-1-invoicing)
3. [Phase 2: Payments](#phase-2-payments)
4. [Phase 3: Financial Reports](#phase-3-financial-reports)
5. [Phase 4: Payroll](#phase-4-payroll)
6. [Testing Checklist](#testing-checklist)

---

## Implementation Phases

### Phase Overview

| Phase | Feature | Priority | Estimated Effort | Dependencies |
|-------|---------|----------|------------------|--------------|
| 1 | Invoicing | High | 2 days | iDempiere C_INVOICE tables |
| 2 | Payments | High | 2 days | iDempiere C_PAYMENT tables |
| 3 | Financial Reports | Medium | 1 day | Phase 1, 2 |
| 4 | Payroll | Medium | 2 days | HR_EMPLOYEE table |

**Total Estimated Effort:** ~7 days

---

## Phase 1: Invoicing

### 1.1 Prerequisites

**iDempiere Setup:**
1. Configure Document Types (`C_DOCTYPE`)
   - Student Invoice (ARI - AR Invoice)
   - Credit Memo (ARC)
   - Debit Memo (ARD)

2. Configure Payment Terms (`C_PAYMENTTERM`)
   - Immediate
   - Net 30
   - Due on Receipt

3. Configure Products/Services (`M_PRODUCT`) for Fee Types
   - Tuition Fee
   - Admission Fee
   - Examination Fee
   - Book Fee
   - Uniform Fee
   - Transport Fee
   - Other Charges

### 1.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/finance/invoices` - List invoices
- [x] `GET /api/v1/finance/invoices/{id}` - Get invoice detail
- [x] `POST /api/v1/finance/invoices` - Create invoice
- [x] `PUT /api/v1/finance/invoices/{id}` - Update invoice (draft only)
- [x] `DELETE /api/v1/finance/invoices/{id}` - Void invoice
- [x] `POST /api/v1/finance/invoices/{id}/allocate` - Allocate payments

### 1.3 Invoice Creation Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Invoice Creation Flow                    │
└─────────────────────────────────────────────────────────┘

    REQUEST                VALIDATION              CREATION
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Invoice  │───────────▶│ Student │───────────▶│ C_      │
    │ Request │           │ Exists  │           │ INVOICE │
    │ Data    │           │ Active  │           │ Header  │
    └─────────┘           └─────────┘           └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Create Lines│
                    │ C_          │
                    │ INVOICELINE │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Calculate Totals │
                    │ (Lines + Tax)    │
                    └──────────────────┘
                           │
                    ┌────────▼─────────┐
                    │ Update Header    │
                    │ (GrandTotal)     │
                    └──────────────────┘
                           │
                    ┌────────▼─────────┐
                    │ Generate Doc No │
                    │ (Auto Sequence) │
                    └──────────────────┘
```

### 1.4 Business Rules

**Invoice Number Generation:**
- Format: `INV-{YYYY}-{MM}-{XXXX}`
- Auto-increment per client/org
- Managed by iDempiere sequence

**Due Date Calculation:**
- Default: Invoice date + Payment Term days
- Immediate: Due date = Invoice date
- Net 30: Due date = Invoice date + 30 days

**Invoice Status Flow:**
```
Draft (DR) → In Progress (IP) → Completed (CO)
              ↓
          Voided (VO)
```

**Validation Rules:**
- Student must be active (`C_BPARTNER.ISACTIVE = 'Y'`)
- At least one invoice line required
- Line amounts must be positive
- Cannot update completed invoice (must void and recreate)

### 1.5 Frontend Components

**Required Pages:**
- `/finance/invoices` - Invoice list
- `/finance/invoices/new` - Create invoice
- `/finance/invoices/[id]` - Invoice detail
- `/finance/invoices/[id]/print` - Print invoice

---

## Phase 2: Payments

### 2.1 Prerequisites

**iDempiere Setup:**
1. Configure Bank Accounts (`C_BANKACCOUNT`)
   - Cash
   - Bank Transfer
   - Check

2. Configure Payment Methods
   - Cash
   - Bank Transfer
   - Check
   - Credit Card
   - Online Payment

### 2.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/finance/payments` - List payments
- [x] `GET /api/v1/finance/payments/{id}` - Get payment detail
- [x] `POST /api/v1/finance/payments` - Create payment
- [x] `PUT /api/v1/finance/payments/{id}` - Update payment (draft only)
- [x] `DELETE /api/v1/finance/payments/{id}` - Void payment

### 2.3 Payment Creation Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Payment Creation Flow                    │
└─────────────────────────────────────────────────────────┘

    REQUEST                VALIDATION              CREATION
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Payment  │───────────▶│ Invoice  │───────────▶│ C_      │
    │ Request │           │ Open    │           │ PAYMENT │
    │ Data    │           │ Amount   │           │ Header  │
    └─────────┘           └─────────┘           └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Allocate to │
                    │ Invoices    │
                    │ C_          │
                    │ ALLOCATION- │
                    │ LINE        │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Update Invoice   │
                    │ Paid Amounts     │
                    └──────────────────┘
                           │
                    ┌────────▼─────────┐
                    │ Mark Allocated   │
                    │ Payment IsAlloc  │
                    └──────────────────┘
```

### 2.4 Business Rules

**Payment Number Generation:**
- Format: `PAY-{YYYY}-{MM}-{XXXX}`
- Auto-increment per client/org
- Managed by iDempiere sequence

**Payment Allocation:**
- Single payment can allocate to multiple invoices
- Partial allocation allowed
- Overpayment allowed (credit balance)

**Payment Status Flow:**
```
Draft (DR) → In Progress (IP) → Completed (CO)
              ↓
          Voided (VO)
```

**Validation Rules:**
- At least one invoice must be selected
- Payment amount must match total allocation amount
- Cannot fully allocate paid invoices
- Bank account required for non-cash payments

### 2.5 Frontend Components

**Required Pages:**
- `/finance/payments` - Payment list
- `/finance/payments/new` - Create payment
- `/finance/payments/[id]` - Payment detail
- `/finance/payments/[id]/receipt` - Print receipt

---

## Phase 3: Financial Reports

### 3.1 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/finance/reports/fee-collection` - Fee collection report
- [x] `GET /api/v1/finance/reports/outstanding` - Outstanding fees report
- [x] `GET /api/v1/finance/reports/payment-summary` - Payment summary report
- [x] `GET /api/v1/finance/reports/aged-receivables` - Aged receivables report

### 3.2 Report Queries

**Fee Collection Report:**
```sql
-- By Invoice Type
SELECT
    p.NAME as InvoiceType,
    COUNT(i.C_INVOICE_ID) as InvoiceCount,
    SUM(i.GRANDTOTAL) as TotalInvoiced,
    COALESCE(SUM(i.PAIDAMT), 0) as TotalCollected,
    (SUM(i.GRANDTOTAL) - COALESCE(SUM(i.PAIDAMT), 0)) as Outstanding
FROM C_INVOICE i
LEFT JOIN C_INVOICELINE il ON i.C_INVOICE_ID = il.C_INVOICELINE_ID
LEFT JOIN M_PRODUCT p ON il.M_PRODUCT_ID = p.M_PRODUCT_ID
WHERE i.DATEINVOICED BETWEEN ? AND ?
  AND i.AD_CLIENT_ID = ?
GROUP BY p.NAME
```

**Outstanding Fees Report:**
```sql
SELECT
    bp.C_BPARTNER_ID as studentId,
    bp.NAME as studentName,
    s.GRADE_LEVEL as gradeLevel,
    s.CLASS_NAME as className,
    COUNT(i.C_INVOICE_ID) as outstandingInvoices,
    SUM(i.GRANDTOTAL - i.PAIDAMT) as totalOutstanding
FROM C_INVOICE i
LEFT JOIN C_BPARTNER bp ON i.C_BPARTNER_ID = bp.C_BPARTNER_ID
LEFT JOIN SCH_STUDENT s ON i.C_BPARTNER_ID = s.C_BPARTNER_ID
WHERE i.PAIDAMT < i.GRANDTOTAL
  AND i.AD_CLIENT_ID = ?
  AND i.DOCSTATUS = 'CO'
GROUP BY bp.C_BPARTNER_ID, bp.NAME, s.GRADE_LEVEL, s.CLASS_NAME
HAVING SUM(i.GRANDTOTAL - i.PAIDAMT) > 0
ORDER BY totalOutstanding DESC
```

**Aged Receivables Report:**
```sql
SELECT
    bp.C_BPARTNER_ID as studentId,
    bp.NAME as studentName,
    SUM(CASE WHEN TRUNC(SYSDATE) - i.DUEDATE <= 30 THEN (i.GRANDTOTAL - i.PAIDAMT) ELSE 0 END) as current,
    SUM(CASE WHEN TRUNC(SYSDATE) - i.DUEDATE BETWEEN 31 AND 60 THEN (i.GRANDTOTAL - i.PAIDAMT) ELSE 0 END) as days31to60,
    SUM(CASE WHEN TRUNC(SYSDATE) - i.DUEDATE BETWEEN 61 AND 90 THEN (i.GRANDTOTAL - i.PAIDAMT) ELSE 0 END) as days61to90,
    SUM(CASE WHEN TRUNC(SYSDATE) - i.DUEDATE > 90 THEN (i.GRANDTOTAL - i.PAIDAMT) ELSE 0 END) as over90Days,
    SUM(i.GRANDTOTAL - i.PAIDAMT) as totalOutstanding
FROM C_INVOICE i
LEFT JOIN C_BPARTNER bp ON i.C_BPARTNER_ID = bp.C_BPARTNER_ID
WHERE i.PAIDAMT < i.GRANDTOTAL
  AND i.AD_CLIENT_ID = ?
  AND i.DOCSTATUS = 'CO'
GROUP BY bp.C_BPARTNER_ID, bp.NAME
HAVING SUM(i.GRANDTOTAL - i.PAIDAMT) > 0
ORDER BY totalOutstanding DESC
```

### 3.3 Frontend Components

**Required Pages:**
- `/finance/reports/fee-collection` - Fee collection report
- `/finance/reports/outstanding` - Outstanding fees
- `/finance/reports/aged-receivables` - Aged receivables
- `/finance/reports/dashboard` - Finance dashboard

---

## Phase 4: Payroll

### 4.1 Prerequisites

**Custom Tables:**
- `HR_PAYROLL` - Payroll header
- `HR_PAYROLL_LINE` - Payroll per employee
- `HR_EMPLOYEE` - Employee data (from HR module)

### 4.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/finance/payroll` - List payroll
- [x] `POST /api/v1/finance/payroll/process` - Process payroll
- [x] `GET /api/v1/finance/payroll/{id}` - Get payroll detail
- [x] `POST /api/v1/finance/payroll/{id}/approve` - Approve payroll
- [x] `POST /api/v1/finance/payroll/{id}/post` - Post to accounting

### 4.3 Payroll Processing Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Payroll Processing Flow                  │
└─────────────────────────────────────────────────────────┘

    INITIATE                CALCULATE              FINALIZE
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Payroll  │───────────▶│ Get All │───────────▶│ Update  │
    │ Request │           │ Active │           │ Summary │
    │ (Month) │           │ Emps   │           │         │
    └─────────┘           └────┬────┘           └────┬────┘
                              │                     │
                         ┌────▼─────────────┐       │
                         │ For Each Emp:    │       │
                         │ - Basic Salary   │       │
                         │ - Allowances     │       │
                         │ - Deductions     │       │
                         │ - Calculate Net  │       │
                         └──────────────────┘       │
                              │                     │
                         ┌────▼─────────────┐       │
                         │ Create Lines     │───────┘
                         │ HR_PAYROLL_LINE  │
                         └──────────────────┘
```

### 4.4 Business Rules

**Payroll Calculation:**
```
GROSS_PAY = BASIC_SALARY + HOUSING_ALLOWANCE + TRANSPORT_ALLOWANCE + MEDICAL_ALLOWANCE + OTHER_ALLOWANCE
DEDUCTIONS = TAX_DEDUCTION + INSURANCE_DEDUCTION + OTHER_DEDUCTIONS
NET_PAY = GROSS_PAY - DEDUCTIONS
```

**Payroll Status Flow:**
```
Draft → Processing → Processed → Posted
           ↓
         Cancelled
```

**Validation Rules:**
- Payroll period must not overlap existing payroll
- All employees must have valid salary data
- Working days must be between 1 and 31
- Paid days cannot exceed working days

### 4.5 Frontend Components

**Required Pages:**
- `/finance/payroll` - Payroll list
- `/finance/payroll/process` - Process new payroll
- `/finance/payroll/[id]` - Payroll detail with lines
- `/finance/payroll/[id]/slips` - Generate pay slips

---

## Testing Checklist

### Database Testing

- [ ] Native iDempiere tables accessible
- [ ] Invoice sequences working correctly
- [ ] Payment sequences working correctly
- [ ] Foreign key relationships working
- [ ] Document status transitions working
- [ ] Accounting postings working correctly

### API Testing

- [ ] Invoice list returns correct data
- [ ] Invoice detail returns complete data with lines
- [ ] Invoice creation inserts C_INVOICE and C_INVOICELINE
- [ ] Payment list returns correct data
- [ ] Payment creation inserts C_PAYMENT and C_ALLOCATIONLINE
- [ ] Payment allocation updates invoice paid amounts
- [ ] Reports return accurate aggregated data
- [ ] Payroll processing creates HR_PAYROLL and HR_PAYROLL_LINE

### Frontend Testing

- [ ] All pages accessible
- [ ] Invoice form validates correctly
- [ ] Payment form validates correctly
- [ ] Invoice print preview working
- [ ] Receipt print preview working
- [ ] Reports display correctly
- [ ] Payroll processing completes successfully

### Integration Testing

- [ ] Student invoice linked to correct student BP
- [ ] Payment allocated to correct invoices
- [ ] Invoice paid amount updated after payment
- [ ] Invoice IsPaid flag updated correctly
- [ ] Accounting fact created correctly
- [ ] Payroll linked to correct employees
- [ ] Payroll calculations accurate
- [ ] Pay slip generation working

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Mapping](./api-mapping.md)
- [API Specification](../api/finance/finance-module.md)
