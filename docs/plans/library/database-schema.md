# Library Module - Database Schema

**Module:** Library Management
**Prefix:** `LIB_`
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
| Catalog | 2 | ~50 |
| Circulation | 4 | ~70 |
| **Total** | **6** | **~120** |

### Integration with iDempiere

| iDempiere Table | Purpose |
|-----------------|---------|
| `A_ASSET` | Books linked as Assets for tracking |
| `C_BPARTNER` | Members (students, employees, others) |

---

## Core Tables

### Mandatory Columns (All Tables)

All `LIB_*` tables include these iDempiere standard columns:

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

## LIB_BOOK_CATEGORY - Book Category

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Category name |
| `CODE` | VARCHAR2(20) | YES | Category code |
| `PARENT_CATEGORY_ID` | NUMBER(10) | NO | Parent category (self-reference) |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |

**Unique:**
- `CODE` + `AD_CLIENT_ID`

**Category Hierarchy:**
```
Root Categories
├── Science
│   ├── Mathematics
│   ├── Physics
│   └── Chemistry
├── Literature
│   ├── Fiction
│   └── Non-Fiction
├── Reference
│   ├── Encyclopedia
│   └── Dictionary
└── Textbooks
    ├── Primary
    ├── Secondary
    └── High School
```

---

## LIB_BOOK - Book/Bibliography

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `ISBN` | VARCHAR2(20) | NO | ISBN |
| `TITLE` | VARCHAR2(255) | YES | Title |
| `SUBTITLE` | VARCHAR2(255) | NO | Subtitle |
| `EDITION` | VARCHAR2(50) | NO | Edition |
| `AUTHOR` | VARCHAR2(255) | YES | Author |
| `CO_AUTHORS` | VARCHAR2(500) | NO | Co-authors |
| `PUBLISHER` | VARCHAR2(150) | NO | Publisher |
| `PUBLICATION_YEAR` | NUMBER(4) | NO | Publication year |
| `PUBLICATION_PLACE` | VARCHAR2(100) | NO | Publication place |
| `PAGES` | NUMBER(5) | NO | Pages |
| `LANGUAGE` | VARCHAR2(50) | NO | Language (default: Indonesian) |
| `LIB_CATEGORY_ID` | NUMBER(10) | NO | Category ID |
| `CALL_NUMBER` | VARCHAR2(50) | NO | Call number |
| `SUBJECT_KEYWORDS` | VARCHAR2(500) | NO | Subject keywords |
| `TOTAL_COPIES` | NUMBER(3) | NO | Total copies (default: 1) |
| `AVAILABLE_COPIES` | NUMBER(3) | NO | Available copies (default: 1) |
| `ACQUISITION_DATE` | DATE | NO | Acquisition date |
| `ACQUISITION_SOURCE` | VARCHAR2(100) | NO | Acquisition source |
| `SUPPLIER` | VARCHAR2(150) | NO | Supplier |
| `PRICE` | NUMBER(10,2) | NO | Price |
| `A_ASSET_ID` | NUMBER(10) | NO | Asset ID (optional) |
| `BOOK_STATUS` | VARCHAR2(20) | NO | Status (default: Available) |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `NOTES` | VARCHAR2(500) | NO | Notes |

**Book Status Values:**
- `Available` - Available for borrowing
- `Lost` - Lost and need replacement
- `Damaged` - Damaged and under repair
- `Withdrawn` - No longer in collection

---

## LIB_BOOK_COPY - Book Copy

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `LIB_BOOK_ID` | NUMBER(10) | YES | Book ID |
| `COPY_NUMBER` | NUMBER(3) | YES | Copy number (1, 2, 3...) |
| `BARCODE` | VARCHAR2(50) | YES | Barcode (unique) |
| `ACCESSION_NO` | VARCHAR2(50) | NO | Accession number |
| `COPY_STATUS` | VARCHAR2(20) | NO | Status (default: Available) |
| `CONDITION` | VARCHAR2(20) | NO | Condition (default: Good) |
| `CONDITION_NOTES` | VARCHAR2(255) | NO | Condition notes |
| `LOCATION` | VARCHAR2(50) | NO | Location (shelf, row) |
| `SHELF` | VARCHAR2(20) | NO | Shelf |
| `ROW` | VARCHAR2(20) | NO | Row |

**Copy Status Values:**
- `Available` - Available for borrowing
- `On Loan` - Currently borrowed
- `Reserved` - Reserved for someone
- `Lost` - Lost
- `Damaged` - Damaged
- `Under Repair` - Under repair
- `Withdrawn` - Withdrawn from circulation

**Condition Values:**
- `New` - New condition
- `Good` - Good condition
- `Fair` - Fair condition
- `Poor` - Poor condition
- `Damaged` - Damaged

**Unique:**
- `BARCODE`
- `LIB_BOOK_ID`, `COPY_NUMBER`, `AD_CLIENT_ID`

---

## LIB_LOAN - Loan Transaction

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `LIB_BOOK_COPY_ID` | NUMBER(10) | YES | Book copy ID |
| `SCH_STUDENT_ID` | NUMBER(10) | NO | Student ID |
| `HR_EMPLOYEE_ID` | NUMBER(10) | NO | Employee ID |
| `C_BPARTNER_ID` | NUMBER(10) | NO | BP ID (for other members) |
| `LOAN_NO` | VARCHAR2(20) | YES | Loan number (unique) |
| `LOAN_DATE` | DATE | YES | Loan date |
| `DUE_DATE` | DATE | YES | Due date |
| `RETURN_DATE` | DATE | NO | Return date |
| `RETURNED_BY` | NUMBER(10) | NO | Returned by |
| `RECEIVED_CONDITION` | VARCHAR2(20) | NO | Received condition |
| `LOAN_STATUS` | VARCHAR2(20) | NO | Status (default: Active) |
| `RENEWAL_COUNT` | NUMBER(2) | NO | Renewal count (default: 0) |
| `MAX_RENEWALS` | NUMBER(2) | NO | Max renewals (default: 2) |
| `HAS_FINE` | CHAR(1) | NO | Has fine (Y/N) |
| `FINE_AMOUNT` | NUMBER(10,2) | NO | Fine amount |
| `FINE_PAID` | CHAR(1) | NO | Fine paid (Y/N) |
| `FINE_WAIVED` | CHAR(1) | NO | Fine waived (Y/N) |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Loan Status Values:**
- `Active` - Currently borrowed
- `Returned` - Returned (no issues)
- `Returned Damaged` - Returned with damage
- `Overdue` - Past due date
- `Lost` - Book lost

**Unique:**
- `LOAN_NO`, `AD_CLIENT_ID`

---

## LIB_FINE - Fine Record

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `LIB_LOAN_ID` | NUMBER(10) | YES | Loan ID |
| `FINE_DATE` | DATE | YES | Fine date |
| `DAYS_OVERDUE` | NUMBER(5) | YES | Days overdue |
| `FINE_RATE_PER_DAY` | NUMBER(10,2) | YES | Fine rate per day |
| `TOTAL_FINE` | NUMBER(10,2) | YES | Total fine |
| `FINE_STATUS` | VARCHAR2(20) | NO | Status (Unpaid, Paid, Waived) |
| `PAID_AMOUNT` | NUMBER(10,2) | NO | Paid amount |
| `PAID_DATE` | DATE | NO | Paid date |
| `PAYMENT_METHOD` | VARCHAR2(20) | NO | Payment method |
| `PAYMENT_REFERENCE` | VARCHAR2(50) | NO | Payment reference |
| `IS_WAIVED` | CHAR(1) | NO | Waived (Y/N) |
| `WAIVED_BY` | NUMBER(10) | NO | Waived by (AD_USER) |
| `WAIVED_DATE` | DATE | NO | Waived date |
| `WAIVER_REASON` | VARCHAR2(255) | NO | Waiver reason |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Fine Status Values:**
- `Unpaid` - Not yet paid
- `Partial` - Partially paid
- `Paid` - Fully paid
- `Waived` - Waived by librarian

**Fine Calculation:**
```
DAYS_OVERDUE = TRUNC(RETURN_DATE) - TRUNC(DUE_DATE)
TOTAL_FINE = DAYS_OVERDUE × FINE_RATE_PER_DAY
```

---

## LIB_RESERVATION - Book Reservation

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `LIB_BOOK_ID` | NUMBER(10) | YES | Book ID |
| `SCH_STUDENT_ID` | NUMBER(10) | NO | Student ID |
| `HR_EMPLOYEE_ID` | NUMBER(10) | NO | Employee ID |
| `C_BPARTNER_ID` | NUMBER(10) | NO | BP ID |
| `RESERVATION_DATE` | DATE | YES | Reservation date |
| `EXPIRY_DATE` | DATE | YES | Expiry date |
| `STATUS` | VARCHAR2(20) | NO | Status (Pending, Notified, Cancelled) |
| `NOTIFIED_DATE` | DATE | NO | Notified date |
| `NOTIFIED` | CHAR(1) | NO | Notified (Y/N) |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Reservation Status Values:**
- `Pending` - Waiting for book
- `Notified` - Member notified (book available)
- `Fulfilled` - Book issued
- `Cancelled` - Reservation cancelled
- `Expired` - Reservation expired

---

## Relationships Summary

### Book Flow

```
LIB_BOOK (Bibliography)
    ↓ 1:N
LIB_BOOK_COPY (Physical Copies)
    ↓ 1:N
LIB_LOAN (Transactions)
    ↓ 1:N
LIB_FINE (Fines)
```

### Circulation Flow

```
LIB_BOOK_COPY
    ↓ 1:N
LIB_LOAN
    ├─ SCH_STUDENT_ID (Student borrowers)
    ├─ HR_EMPLOYEE_ID (Staff borrowers)
    └─ C_BPARTNER_ID (Other borrowers)
```

### Reservation Flow

```
LIB_BOOK
    ↓ 1:N
LIB_RESERVATION
    ├─ SCH_STUDENT_ID
    ├─ HR_EMPLOYEE_ID
    └─ C_BPARTNER_ID
```

---

## Sample Data Structure

### Book Example

```
LIB_BOOK:
- ID: 1001
- ISBN: 978-0-123456-78-9
- Title: "Mathematics for High School"
- Author: "Dr. John Smith"
- Category: Science > Mathematics
- Total Copies: 5
- Available Copies: 3

LIB_BOOK_COPY:
- Book ID: 1001, Copy 1, Barcode: BC001, Status: Available
- Book ID: 1001, Copy 2, Barcode: BC002, Status: On Loan
- Book ID: 1001, Copy 3, Barcode: BC003, Status: Available
- Book ID: 1001, Copy 4, Barcode: BC004, Status: On Loan
- Book ID: 1001, Copy 5, Barcode: BC005, Status: Reserved

LIB_LOAN:
- Loan 1: Copy 2, Student: STU-001, Due: 2024-08-15, Status: Active
- Loan 2: Copy 4, Employee: EMP-003, Due: 2024-08-20, Status: Active
```

---

**Document Version:** 1.0
**Related:**
- [API Specification](../api/library/library-module.md)
- [Implementation Guide](./implementation-guide.md)
