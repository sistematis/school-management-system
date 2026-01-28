# Finance Module - API Mapping

**Module:** Finance Management
**Base URL:** `/api/v1/finance`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Overview](#overview)
2. [Invoices API](#invoices-api)
3. [Payments API](#payments-api)
4. [Financial Reports API](#financial-reports-api)
5. [Payroll API](#payroll-api)
6. [Field Mapping Reference](#field-mapping-reference)

---

## Overview

### API to Database Table Mapping

| API Endpoint | Primary Table | Related Tables |
|-------------|---------------|----------------|
| `GET /invoices` | `C_INVOICE` | `C_BPARTNER`, `C_INVOICELINE` |
| `GET /invoices/{id}` | `C_INVOICE` | `C_INVOICELINE`, `C_DOCTYPE` |
| `POST /invoices` | `C_INVOICE` + `C_INVOICELINE` | `C_BPARTNER`, `M_PRODUCT` |
| `GET /payments` | `C_PAYMENT` | `C_BPARTNER`, `C_BANKACCOUNT` |
| `GET /payments/{id}` | `C_PAYMENT` | `C_ALLOCATIONLINE` |
| `POST /payments` | `C_PAYMENT` + `C_ALLOCATIONLINE` | `C_BANKACCOUNT`, `C_INVOICE` |
| `GET /reports/fee-collection` | Aggregation | `C_INVOICE`, `C_PAYMENT` |
| `POST /payroll/process` | `HR_PAYROLL` | `HR_PAYROLL_LINE`, `HR_EMPLOYEE` |

---

## Invoices API

### List Invoices → C_INVOICE

```http
GET /api/v1/finance/invoices
```

**Database Query:**
```sql
SELECT
    i.C_INVOICE_ID as id,
    i.C_INVOICE_UU as uid,
    i.DOCUMENTNO as DocumentNo,
    i.C_BPARTNER_ID,
    bp.NAME as Name,
    i.DATEINVOICED as DateInvoiced,
    i.DUEDATE as DueDate,
    i.GRANDTOTAL as GrandTotal,
    i.PAIDAMT as PaidAmt,
    (i.GRANDTOTAL - i.PAIDAMT) as OutstandingAmt,
    CASE WHEN i.PAIDAMT >= i.GRANDTOTAL THEN 'Y' ELSE 'N' END as IsPaid,
    i.DOCSTATUS as DocStatus,
    i.DESCRIPTION as Description,
    'c_invoice' as model-name
FROM C_INVOICE i
LEFT JOIN C_BPARTNER bp ON i.C_BPARTNER_ID = bp.C_BPARTNER_ID
WHERE i.AD_CLIENT_ID = ?
  AND i.ISACTIVE = 'Y'
ORDER BY i.DATEINVOICED DESC
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=C_BPartner_ID eq 1001` | `i.C_BPARTNER_ID = 1001` |
| `$filter=DocStatus eq 'CO'` | `i.DOCSTATUS = 'CO'` |
| `$filter=DateInvoiced ge '2024-01-01'` | `i.DATEINVOICCED >= TO_DATE('2024-01-01', 'YYYY-MM-DD')` |
| `$filter=DueDate lt '2024-12-31'` | `i.DUEDATE < TO_DATE('2024-12-31', 'YYYY-MM-DD')` |
| `$filter=GrandTotal gt PaidAmt` | `i.GRANDTOTAL > i.PAIDAMT` |
| `$orderby=DateInvoiced desc` | `ORDER BY i.DATEINVOICED DESC` |
| `$top=20&$skip=0` | `FETCH FIRST 20 ROWS ONLY` |
| `$expand=c_bpartner` | JOIN with `C_BPARTNER` table |

---

### Get Invoice Detail → C_INVOICE + C_INVOICELINE

```http
GET /api/v1/finance/invoices/{invoiceId}
```

**Database Query:**
```sql
-- Main invoice
SELECT
    i.C_INVOICE_ID,
    i.DOCUMENTNO,
    i.C_BPARTNER_ID,
    bp.NAME as BPartnerName,
    bp.EMAIL as BPartnerEmail,
    bp.PHONE as BPartnerPhone,
    i.DATEINVOICED,
    i.DUEDATE,
    i.GRANDTOTAL,
    i.PAIDAMT,
    (i.GRANDTOTAL - i.PAIDAMT) as OutstandingAmt,
    i.DOCSTATUS,
    i.ISPAID,
    i.DESCRIPTION,
    i.POREFERENCE
FROM C_INVOICE i
LEFT JOIN C_BPARTNER bp ON i.C_BPARTNER_ID = bp.C_BPARTNER_ID
WHERE i.C_INVOICE_ID = ?

-- Invoice lines
SELECT
    il.C_INVOICELINE_ID,
    il.LINE,
    il.DESCRIPTION,
    p.NAME as ProductName,
    il.QTYINVOICED as Qty,
    il.PRICEACTUAL as Price,
    il.LINENETAMT as LineNetAmt,
    il.TAXAMT,
    (il.LINENETAMT + il.TAXAMT) as LineTotalAmt
FROM C_INVOICELINE il
LEFT JOIN M_PRODUCT p ON il.M_PRODUCT_ID = p.M_PRODUCT_ID
WHERE il.C_INVOICE_ID = ?
ORDER BY il.LINE
```

---

### Create Invoice → C_INVOICE + C_INVOICELINE

```http
POST /api/v1/finance/invoices
```

**Transaction Flow:**
```sql
-- Step 1: Create C_INVOICE
INSERT INTO C_INVOICE (
    C_INVOICE_ID, C_INVOICE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    DOCUMENTNO, C_DOCTYPE_ID, C_BPARTNER_ID,
    DATEINVOICED, DUEDATE, GRANDTOTAL, PAIDAMT, ISPAID,
    DOCSTATUS, DOCACTION, PROCESSING, PROCESSED,
    C_CURRENCY_ID, DESCRIPTION
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?,
    SYSDATE, ?, 0, 0, 'N',
    'DR', '--', 'N', 'N',
    ?, ?
);

-- Step 2: Create C_INVOICELINE for each line
INSERT INTO C_INVOICELINE (
    C_INVOICELINE_ID, C_INVOICELINE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    C_INVOICE_ID, LINE, DESCRIPTION, M_PRODUCT_ID,
    QTYINVOICED, PRICEACTUAL, LINENETAMT, C_TAX_ID, TAXAMT
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?
);
-- Repeat for each invoice line

-- Step 3: Update invoice totals
UPDATE C_INVOICE
SET GRANDTOTAL = (
    SELECT SUM(LINENETAMT + TAXAMT)
    FROM C_INVOICELINE
    WHERE C_INVOICE_ID = ?
)
WHERE C_INVOICE_ID = ?
```

---

## Payments API

### List Payments → C_PAYMENT

```http
GET /api/v1/finance/payments
```

**Database Query:**
```sql
SELECT
    p.C_PAYMENT_ID as id,
    p.DOCUMENTNO as DocumentNo,
    p.C_BPARTNER_ID,
    bp.NAME as BPartnerName,
    p.DATETRX as DateTrx,
    p.PAYAMT as PayAmt,
    ba.BANKACCOUNTTYPE as PaymentMethod,
    ba.ACCOUNTNO as BankAccount,
    p.REFERENCENO as Reference,
    p.DOCSTATUS as DocStatus,
    p.ISRECEIPT,
    p.PROCESSED,
    'c_payment' as model-name
FROM C_PAYMENT p
LEFT JOIN C_BPARTNER bp ON p.C_BPARTNER_ID = bp.C_BPARTNER_ID
LEFT JOIN C_BANKACCOUNT ba ON p.C_BANKACCOUNT_ID = ba.C_BANKACCOUNT_ID
WHERE p.AD_CLIENT_ID = ?
  AND p.ISACTIVE = 'Y'
ORDER BY p.DATETRX DESC
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=C_BPartner_ID eq 1001` | `p.C_BPARTNER_ID = 1001` |
| `$filter=DocStatus eq 'CO'` | `p.DOCSTATUS = 'CO'` |
| `$filter=DateTrx ge '2024-01-01'` | `p.DATETRX >= TO_DATE('2024-01-01', 'YYYY-MM-DD')` |
| `$orderby=DateTrx desc` | `ORDER BY p.DATETRX DESC` |

---

### Create Payment → C_PAYMENT + C_ALLOCATIONLINE

```http
POST /api/v1/finance/payments
```

**Transaction Flow:**
```sql
-- Step 1: Create C_PAYMENT
INSERT INTO C_PAYMENT (
    C_PAYMENT_ID, C_PAYMENT_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    DOCUMENTNO, C_DOCTYPE_ID, C_BPARTNER_ID,
    DATETRX, DATEACCT, PAYAMT,
    C_CURRENCY_ID, C_BANKACCOUNT_ID,
    DOCSTATUS, ISRECEIPT, ISALLOCATED,
    PROCESSING, PROCESSED, DESCRIPTION, REFERENCENO
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?,
    SYSDATE, SYSDATE, ?,
    ?, ?,
    'DR', 'Y', 'N',
    'N', 'N', ?, ?
);

-- Step 2: Create C_ALLOCATIONLINE for each invoice
INSERT INTO C_ALLOCATIONLINE (
    C_ALLOCATIONLINE_ID, C_ALLOCATIONLINE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    C_ALLOCATION_HDR_ID, C_INVOICE_ID, C_PAYMENT_ID,
    AMOUNT, DISCOUNTAMT, WRITEOFFAMT,
    C_CURRENCY_ID, DATEACCT, DESCRIPTION,
    PROCESSING, PROCESSED
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?,
    ?, 0, 0,
    ?, SYSDATE, ?,
    'N', 'N'
);
-- Repeat for each invoice

-- Step 3: Update invoice paid amount
UPDATE C_INVOICE
SET PAIDAMT = PAIDAMT + ?,
    ISPAID = CASE WHEN PAIDAMT + ? >= GRANDTOTAL THEN 'Y' ELSE 'N' END
WHERE C_INVOICE_ID = ?

-- Step 4: Mark payment as allocated
UPDATE C_PAYMENT
SET ISALLOCATED = 'Y'
WHERE C_PAYMENT_ID = ?
```

---

## Financial Reports API

### Fee Collection Report → Aggregation

```http
GET /api/v1/finance/reports/fee-collection?startDate=2024-01-01&endDate=2024-12-31
```

**Database Query:**
```sql
-- Summary by invoice type
SELECT
    COALESCE(p.NAME, 'Other') as InvoiceType,
    COUNT(i.C_INVOICE_ID) as InvoiceCount,
    SUM(i.GRANDTOTAL) as TotalInvoiced,
    COALESCE(SUM(i.PAIDAMT), 0) as TotalCollected,
    (SUM(i.GRANDTOTAL) - COALESCE(SUM(i.PAIDAMT), 0)) as Outstanding
FROM C_INVOICE i
LEFT JOIN M_PRODUCT p ON EXISTS (
    SELECT 1 FROM C_INVOICELINE il
    WHERE il.C_INVOICE_ID = i.C_INVOICE_ID
      AND il.M_PRODUCT_ID = p.M_PRODUCT_ID
)
WHERE i.DATEINVOICED BETWEEN ? AND ?
  AND i.AD_CLIENT_ID = ?
  AND i.ISACTIVE = 'Y'
GROUP BY p.NAME
ORDER BY TotalInvoiced DESC

-- Summary by grade level (from student info)
SELECT
    s.GRADE_LEVEL as GradeLevel,
    COUNT(DISTINCT i.C_BPARTNER_ID) as StudentCount,
    COUNT(i.C_INVOICE_ID) as InvoiceCount,
    SUM(i.GRANDTOTAL) as TotalInvoiced,
    COALESCE(SUM(i.PAIDAMT), 0) as TotalCollected
FROM C_INVOICE i
LEFT JOIN SCH_STUDENT s ON i.C_BPARTNER_ID = s.C_BPARTNER_ID
WHERE i.DATEINVOICED BETWEEN ? AND ?
  AND i.AD_CLIENT_ID = ?
  AND i.ISACTIVE = 'Y'
GROUP BY s.GRADE_LEVEL
ORDER BY s.GRADE_LEVEL
```

---

## Payroll API

### Process Payroll → HR_PAYROLL + HR_PAYROLL_LINE

```http
POST /api/v1/finance/payroll/process
```

**Transaction Flow:**
```sql
-- Step 1: Create HR_PAYROLL header
INSERT INTO HR_PAYROLL (
    HR_PAYROLL_ID, HR_PAYROLL_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    NAME, PAYROLL_TYPE, PAYROLL_YEAR, PAYROLL_MONTH,
    FROM_DATE, TO_DATE, PAY_DATE, STATUS
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, 'Monthly', ?, ?,
    ?, ?, ?, 'Processing'
);

-- Step 2: Get active employees for the period
DECLARE
    CURSOR employee_cursor IS
    SELECT e.HR_EMPLOYEE_ID
    FROM HR_EMPLOYEE e
    WHERE e.AD_CLIENT_ID = ?
      AND e.ISACTIVE = 'Y'
      AND e.EMPLOYMENT_STATUS = 'Active';

-- Step 3: Create HR_PAYROLL_LINE for each employee
FOR emp_rec IN employee_cursor LOOP
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
        ?, emp_rec.HR_EMPLOYEE_ID,
        BASIC_SALARY, 22, 22,
        HOUSING_ALLOWANCE, TRANSPORT_ALLOWANCE, MEDICAL_ALLOWANCE,
        TAX_DEDUCTION, INSURANCE_DEDUCTION,
        (BASIC_SALARY + HOUSING_ALLOWANCE + TRANSPORT_ALLOWANCE + MEDICAL_ALLOWANCE),
        (BASIC_SALARY + HOUSING_ALLOWANCE + TRANSPORT_ALLOWANCE + MEDICAL_ALLOWANCE - TAX_DEDUCTION - INSURANCE_DEDUCTION)
    FROM HR_EMPLOYEE
    WHERE HR_EMPLOYEE_ID = emp_rec.HR_EMPLOYEE_ID;
END LOOP;

-- Step 4: Update payroll summary
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

### Invoice Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `invoiceId` | `C_INVOICE` | `C_INVOICE_ID` |
| `invoiceNo` | `C_INVOICE` | `DOCUMENTNO` |
| `studentId` | `C_INVOICE` | `C_BPARTNER_ID` |
| `studentName` | `C_BPARTNER` | `NAME` |
| `invoiceDate` | `C_INVOICE` | `DATEINVOICED` |
| `dueDate` | `C_INVOICE` | `DUEDATE` |
| `totalAmount` | `C_INVOICE` | `GRANDTOTAL` |
| `paidAmount` | `C_INVOICE` | `PAIDAMT` |
| `outstandingAmount` | Calculated | `GRANDTOTAL - PAIDAMT` |
| `isPaid` | `C_INVOICE` | `ISPAID` |
| `status` | `C_INVOICE` | `DOCSTATUS` |
| `description` | `C_INVOICE` | `DESCRIPTION` |

### Invoice Line Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `lineId` | `C_INVOICELINE` | `C_INVOICELINE_ID` |
| `lineType` | `M_PRODUCT` | `NAME` (via JOIN) |
| `description` | `C_INVOICELINE` | `DESCRIPTION` |
| `quantity` | `C_INVOICELINE` | `QTYINVOICED` |
| `unitPrice` | `C_INVOICELINE` | `PRICEACTUAL` |
| `taxRate` | `C_TAX` | `RATE` (via JOIN) |
| `amount` | `C_INVOICELINE` | `LINENETAMT` |
| `taxAmount` | `C_INVOICELINE` | `TAXAMT` |

### Payment Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `paymentId` | `C_PAYMENT` | `C_PAYMENT_ID` |
| `paymentNo` | `C_PAYMENT` | `DOCUMENTNO` |
| `studentId` | `C_PAYMENT` | `C_BPARTNER_ID` |
| `studentName` | `C_BPARTNER` | `NAME` (via JOIN) |
| `paymentDate` | `C_PAYMENT` | `DATETRX` |
| `amount` | `C_PAYMENT` | `PAYAMT` |
| `paymentMethod` | `C_BANKACCOUNT` | `BANKACCOUNTTYPE` (via JOIN) |
| `bankAccount` | `C_BANKACCOUNT` | `ACCOUNTNO` (via JOIN) |
| `reference` | `C_PAYMENT` | `REFERENCENO` |
| `status` | `C_PAYMENT` | `DOCSTATUS` |

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
- [API Specification](../api/finance/finance-module.md)
- [Implementation Guide](./implementation-guide.md)
