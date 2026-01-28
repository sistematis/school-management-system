# Finance Module - Database Schema

**Module:** Finance Management
**Prefix:** Native `C_`, `HR_PAYROLL`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [iDempiere Native Tables](#idempiere-native-tables)
3. [Custom Payroll Tables](#custom-payroll-tables)
4. [Relationships Summary](#relationships-summary)

---

## Module Overview

### Table Statistics

| Category | Table Count | Type |
|----------|-------------|------|
| Invoicing | 3 | Native (`C_INVOICE`, `C_INVOICELINE`, `C_INVOICESCHEDULE`) |
| Payments | 3 | Native (`C_PAYMENT`, `C_ALLOCATIONLINE`, `C_BANKACCOUNT`) |
| Accounting | 3 | Native (`C_ACCTSCHEMA`, `C_VALIDCOMBINATION`, `FACT_ACCT`) |
| Custom Payroll | 2 | Custom (`HR_PAYROLL`, `HR_PAYROLL_LINE`) |
| **Total** | **11** | - |

### Integration Approach

The Finance module primarily uses iDempiere's native tables for:
- Invoicing (`C_INVOICE`, `C_INVOICELINE`)
- Payments (`C_PAYMENT`, `C_ALLOCATIONLINE`)
- Accounting (`C_ACCTSCHEMA`, `FACT_ACCT`)

Only Payroll functionality uses custom tables due to iDempiere's deprecated HR module.

---

## iDempiere Native Tables

### C_INVOICE - Invoice Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_INVOICE_ID` | NUMBER(10) | YES | Primary Key |
| `C_INVOICE_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `DOCUMENTNO` | VARCHAR2(30) | NO | Invoice number (auto-generated) |
| `C_DOCTYPE_ID` | NUMBER(10) | YES | Document type |
| `C_BPARTNER_ID` | NUMBER(10) | YES | Student BP ID |
| `C_BPARTNER_LOCATION_ID` | NUMBER(10) | NO | BP Location ID |
| `DATEINVOICED` | DATE | NO | Invoice date |
| `DUEDATE` | DATE | NO | Payment due date |
| `GRANDTOTAL` | NUMBER(10,2) | NO | Total amount |
| `PAIDAMT` | NUMBER(10,2) | NO | Amount paid |
| `ISPAID` | CHAR(1) | NO | Fully paid (Y/N) |
| `DOCSTATUS` | CHAR(2) | NO | Document status (DR, IP, CO, VO, CL, RE) |
| `DOCACTION` | CHAR(2) | NO | Document action |
| `PROCESSING` | CHAR(1) | NO | Processing |
| `PROCESSED` | CHAR(1) | NO | Processed (Y/N) |
| `POSTED` | CHAR(1) | NO | Posted (Y/N) |
| `C_PAYMENTTERM_ID` | NUMBER(10) | NO | Payment term |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `POREFERENCE` | VARCHAR2(20) | NO | Reference |
| `C_ORDER_ID` | NUMBER(10) | NO | Sales order |
| `AD_USER_ID` | NUMBER(10) | NO | Sales rep |
| `SALESREP_ID` | NUMBER(10) | NO | Sales representative |

**Indexes:**
- `C_INVOICE_CLIENT` on `AD_CLIENT_ID`
- `C_INVOICE_ORG` on `AD_ORG_ID`
- `C_INVOICE_BPARTNER` on `C_BPARTNER_ID`
- `C_INVOICE_DATE` on `DATEINVOICED`
- `C_INVOICE_DUE` on `DUEDATE`
- `C_INVOICE_PAID` on `ISPAID`

**Document Status:**
- `DR` - Draft
- `IP` - In Progress
- `CO` - Completed
- `VO` - Voided
- `CL` - Closed
- `RE` - Reversed

---

### C_INVOICELINE - Invoice Line

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_INVOICELINE_ID` | NUMBER(10) | YES | Primary Key |
| `C_INVOICELINE_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `C_INVOICE_ID` | NUMBER(10) | YES | Invoice ID |
| `LINE` | NUMBER(10) | YES | Line number |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `M_PRODUCT_ID` | NUMBER(10) | NO | Product (fee type) |
| `QTYINVOICED` | NUMBER(10,2) | NO | Quantity |
| `PRICELIST` | NUMBER(10,2) | NO | List price |
| `PRICEACTUAL` | NUMBER(10,2) | NO | Actual price |
| `PRICELIMIT` | NUMBER(10,2) | NO | Limit price |
| `LINENETAMT` | NUMBER(10,2) | NO | Net amount |
| `C_CHARGE_ID` | NUMBER(10) | NO | Charge |
| `C_TAX_ID` | NUMBER(10) | NO | Tax |
| `TAXAMT` | NUMBER(10,2) | NO | Tax amount |
| `LINE_TOTALAMT` | NUMBER(10,2) | NO | Line total |
| `C_ORDERLINE_ID` | NUMBER(10) | NO | Order line |
| `S_RESOURCEASSIGNMENT_ID` | NUMBER(10) | NO | Resource assignment |

---

### C_PAYMENT - Payment Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_PAYMENT_ID` | NUMBER(10) | YES | Primary Key |
| `C_PAYMENT_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `DOCUMENTNO` | VARCHAR2(30) | NO | Payment number (auto-generated) |
| `C_DOCTYPE_ID` | NUMBER(10) | YES | Document type |
| `C_BPARTNER_ID` | NUMBER(10) | YES | Student BP ID |
| `DATETRX` | DATE | NO | Transaction date |
| `DATEACCT` | DATE | NO | Accounting date |
| `AMT` | NUMBER(10,2) | NO | Amount |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `PAYAMT` | NUMBER(10,2) | NO | Payment amount |
| `DISCOUNTAMT` | NUMBER(10,2) | NO | Discount amount |
| `WRITEOFFAMT` | NUMBER(10,2) | NO | Write-off amount |
| `TENDERAMT` | NUMBER(10,2) | NO | Tender amount |
| `C_BANKACCOUNT_ID` | NUMBER(10) | NO | Bank account |
| `C_PAYMENT_BATCH_ID` | NUMBER(10) | NO | Payment batch |
| `DOCSTATUS` | CHAR(2) | NO | Document status |
| `DOCACTION` | CHAR(2) | NO | Document action |
| `ISRECEIPT` | CHAR(1) | NO | Receipt (Y/N) |
| `ISAPPROVED` | CHAR(1) | NO | Approved (Y/N) |
| `ISALLOCATED` | CHAR(1) | YES | Allocated (Y/N) |
| `ISRECONCILED` | CHAR(1) | NO | Reconciled (Y/N) |
| `ISONLINE` | CHAR(1) | NO | Online payment |
| `PROCESSING` | CHAR(1) | NO | Processing |
| `PROCESSED` | CHAR(1) | NO | Processed (Y/N) |
| `POSTED` | CHAR(1) | NO | Posted (Y/N) |
| `C_CAMPAIGN_ID` | NUMBER(10) | NO | Campaign |
| `C_PROJECT_ID` | NUMBER(10) | NO | Project |
| `C_ACTIVITY_ID` | NUMBER(10) | NO | Activity |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `REFERENCENO` | VARCHAR2(20) | NO | Reference number |
| `MICR` | VARCHAR2(40) | NO | MICR |
| `OXXO_TYPE` | VARCHAR2(20) | NO | OXXO type |
| `VOICEAUTHCODE` | VARCHAR2(20) | NO | Voice authorization |
| `ORIGINAL_BPID` | VARCHAR2(20) | NO | Original BP |
| `ACCOUNTNO` | VARCHAR2(20) | NO | Account number |
| `CHECKNO` | VARCHAR2(20) | NO | Check number |
| `ROUTINGNO` | VARCHAR2(20) | NO | Routing number |
| `C_BPARTNER_B_ID` | NUMBER(10) | NO | Business Partner (Bank) |
| `C_PAYMENT_ID_ORIGINAL` | NUMBER(10) | NO | Original payment |
| `R_AVSADDR` | VARCHAR2(20) | NO | AVS address |
| `R_AVSZIP` | VARCHAR2(20) | NO | AVS ZIP |
| `ACCOUNT_CITY` | VARCHAR2(20) | NO | Account city |
| `ACCOUNT_STATE` | VARCHAR2(20) | NO | Account state |
| `ACCOUNT_COUNTRY` | VARCHAR2(20) | NO | Account country |
| `ACCOUNT_NAME` | VARCHAR2(20) | NO | Account name |
| `AD_USER_ID` | NUMBER(10) | NO | User |

---

### C_ALLOCATIONLINE - Payment Allocation

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_ALLOCATIONLINE_ID` | NUMBER(10) | YES | Primary Key |
| `C_ALLOCATIONLINE_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `C_ALLOCATION_HDR_ID` | NUMBER(10) | YES | Allocation header |
| `C_INVOICE_ID` | NUMBER(10) | NO | Invoice ID |
| `C_ORDER_ID` | NUMBER(10) | NO | Order ID |
| `C_PAYMENT_ID` | NUMBER(10) | NO | Payment ID |
| `AMOUNT` | NUMBER(10,2) | YES | Allocated amount |
| `DISCOUNTAMT` | NUMBER(10,2) | NO | Discount amount |
| `WRITEOFFAMT` | NUMBER(10,2) | NO | Write-off amount |
| `OVERUNDERAMT` | NUMBER(10,2) | NO | Over/Under amount |
| `C_BPARTNER_ID` | NUMBER(10) | NO | Business Partner |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `DATEACCT` | DATE | NO | Accounting date |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `PROCESSING` | CHAR(1) | NO | Processing |
| `PROCESSED` | CHAR(1) | NO | Processed (Y/N) |
| `POSTED` | CHAR(1) | NO | Posted (Y/N) |

---

### C_BANKACCOUNT - Bank Account

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_BANKACCOUNT_ID` | NUMBER(10) | YES | Primary Key |
| `C_BANKACCOUNT_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `C_BANK_ID` | NUMBER(10) | NO | Bank |
| `BANKACCOUNTTYPE` | VARCHAR2(20) | NO | Account type |
| `ACCOUNTNO` | VARCHAR2(20) | NO | Account number |
| `CURRENTBALANCE` | NUMBER(10,2) | NO | Current balance |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `CREDITCARDNUMBER` | VARCHAR2(20) | NO | Credit card number |
| `CREDITCARDTYPE` | VARCHAR2(20) | NO | Credit card type |
| `CREDITCAREXPMM` | NUMBER(10) | NO | Exp month |
| `CREDITCAREXPYY` | NUMBER(10) | NO | Exp year |
| `CREDITCARDVV` | VARCHAR2(4) | NO | Credit card CVV |
| `CHECKACCOUNTNO` | VARCHAR2(20) | NO | Check account |
| `IBAN` | VARCHAR2(40) | NO | IBAN |
| `ROUTINGNO` | VARCHAR2(20) | NO | Routing number |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `BANK_NAME` | VARCHAR2(40) | NO | Bank name |

---

### C_ACCTSCHEMA - Accounting Schema

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `C_ACCTSCHEMA_ID` | NUMBER(10) | YES | Primary Key |
| `C_ACCTSCHEMA_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `NAME` | VARCHAR2(60) | YES | Schema name |
| `GAAP` | VARCHAR2(20) | NO | GAAP |
| `ISHASALIAS` | CHAR(1) | NO | Has alias (Y/N) |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `AUTOPERIODCONTROL` | CHAR(1) | NO | Auto period control |
| `C_PERIOD_ID` | NUMBER(10) | NO | Current period |
| `PERIOD_OPENFuture` | NUMBER(10) | NO | Future open periods |
| `AD_TREE_ID` | VARCHAR2(20) | NO | Tree for report |
| `COMPARISON_AD_ORG_ID` | NUMBER(10) | NO | Comparison org |
| `COSTINGMETHOD` | VARCHAR2(20) | NO | Costing method |
| `COSTINGLEVEL` | VARCHAR2(20) | NO | Costing level |
| `ISTRADEDISCOUNTPOSTED` | CHAR(1) | NO | Trade discount posted |
| `ISACCRUAL` | CHAR(1) | NO | Accrual (Y/N) |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `M_PRODUCT_COSTING_ID` | NUMBER(10) | NO | Product costing |

---

### FACT_ACCT - Accounting Fact

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `FACT_ACCT_ID` | NUMBER(10) | YES | Primary Key |
| `FACT_ACCT_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `C_ACCTSCHEMA_ID` | NUMBER(10) | YES | Accounting schema |
| `ACCOUNT_ID` | NUMBER(10) | YES | Account |
| `DATETRX` | DATE | NO | Transaction date |
| `DATEACCT` | DATE | NO | Accounting date |
| `C_PERIOD_ID` | NUMBER(10) | NO | Period |
| `AD_TABLE_ID` | NUMBER(10) | YES | Table |
| `RECORD_ID` | NUMBER(10) | YES | Record ID |
| `LINE_ID` | NUMBER(10) | NO | Line ID |
| `GL_CATEGORY_ID` | NUMBER(10) | NO | GL Category |
| `C_TAX_ID` | NUMBER(10) | NO | Tax |
| `M_LOCATOR_ID` | NUMBER(10) | NO | Locator |
| `POSTINGTYPE` | CHAR(1) | YES | Posting type (A, B, S) |
| `C_CURRENCY_ID` | NUMBER(10) | YES | Currency |
| `AMTSOURCEDR` | NUMBER(10,2) | NO | Source amount |
| `AMTSOURCECR` | NUMBER(10,2) | NO | Source CR |
| `AMTACCTDR` | NUMBER(10,2) | NO | Acct DR |
| `AMTACCTCR` | NUMBER(10,2) | NO | Acct CR |
| `C_UOM_ID` | NUMBER(10) | NO | UOM |
| `QTY` | NUMBER(10,2) | NO | Quantity |
| `PRODUCT_ID` | NUMBER(10) | NO | Product |
| `C_BPARTNER_ID` | NUMBER(10) | NO | BP |
| `AD_ORGTRX_ID` | NUMBER(10) | NO | Trx org |
| `C_LOC_FROM_ID` | NUMBER(10) | NO | Loc from |
| `C_LOC_TO_ID` | NUMBER(10) | NO | Loc to |
| `C_SALESREGION_ID` | NUMBER(10) | NO | Sales region |
| `C_PROJECT_ID` | NUMBER(10) | NO | Project |
| `C_CAMPAIGN_ID` | NUMBER(10) | NO | Campaign |
| `C_ACTIVITY_ID` | NUMBER(10) | NO | Activity |
| `USER1_ID` | NUMBER(10) | NO | User1 |
| `USER2_ID` | NUMBER(10) | NO | User2 |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |
| `ASSET_ID` | NUMBER(10) | NO | Asset |

---

## Custom Payroll Tables

### HR_PAYROLL - Payroll Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `HR_PAYROLL_ID` | NUMBER(10) | YES | Primary Key |
| `HR_PAYROLL_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
| `NAME` | VARCHAR2(100) | YES | Payroll name |
| `PAYROLL_TYPE` | VARCHAR2(20) | NO | Payroll type (Monthly) |
| `PAYROLL_YEAR` | NUMBER(4) | YES | Payroll year |
| `PAYROLL_MONTH` | NUMBER(2) | YES | Payroll month |
| `FROM_DATE` | DATE | YES | From date |
| `TO_DATE` | DATE | YES | To date |
| `PAY_DATE` | DATE | NO | Pay date |
| `STATUS` | VARCHAR2(20) | NO | Status (Draft, Processing, Processed) |
| `PROCESSED_DATE` | DATE | NO | Processed date |
| `POSTED_DATE` | DATE | NO | Posted date |
| `TOTAL_EMPLOYEES` | NUMBER(3) | NO | Total employees |
| `TOTAL_GROSS_PAY` | NUMBER(15,2) | NO | Total gross |
| `TOTAL_DEDUCTIONS` | NUMBER(15,2) | NO | Total deductions |
| `TOTAL_NET_PAY` | NUMBER(15,2) | NO | Total net |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `PROCESSING_LOG` | CLOB | NO | Processing log |

---

### HR_PAYROLL_LINE - Payroll Per Employee

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `HR_PAYROLL_LINE_ID` | NUMBER(10) | YES | Primary Key |
| `HR_PAYROLL_LINE_UU` | VARCHAR2(36) | NO | UUID |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client ID |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization ID |
| `ISACTIVE` | CHAR(1) | YES | Active (Y/N) |
| `CREATED` | DATE | YES | Created date |
| `CREATEDBY` | NUMBER(10) | YES | Created by |
| `UPDATED` | DATE | YES | Updated date |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by |
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

### Invoice Flow

```
C_BPARTNER (Student)
    ↓ 1:N
C_INVOICE
    ↓ 1:N
├── C_INVOICELINE
└── C_ALLOCATIONLINE ← C_PAYMENT
    ↓ 1:N
└── FACT_ACCT (Accounting)
```

### Payment Flow

```
C_PAYMENT
    ↓ 1:N
C_ALLOCATIONLINE
    ↓ N:1
C_INVOICE (Allocation)
    ↓ 1:N
FACT_ACCT (Accounting)
```

### Payroll Flow

```
HR_PAYROLL
    ↓ 1:N
HR_PAYROLL_LINE
    ↓ N:1
├── HR_EMPLOYEE → C_BPARTNER (Employee)
└── C_PAYMENT (Final payment)
```

---

**Document Version:** 1.0
**Related:**
- [API Specification](../api/finance/finance-module.md)
- [Implementation Guide](./implementation-guide.md)
