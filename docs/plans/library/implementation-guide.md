# Library Module - Implementation Guide

**Module:** Library Management
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Implementation Phases](#implementation-phases)
2. [Phase 1: Catalog Management](#phase-1-catalog-management)
3. [Phase 2: Circulation](#phase-2-circulation)
4. [Phase 3: Reports](#phase-3-reports)
5. [Testing Checklist](#testing-checklist)

---

## Implementation Phases

### Phase Overview

| Phase | Feature | Priority | Estimated Effort | Dependencies |
|-------|---------|----------|------------------|--------------|
| 1 | Catalog Management | High | 2 days | - |
| 2 | Circulation | High | 2 days | Phase 1 |
| 3 | Reports | Medium | 1 day | Phase 1, 2 |

**Total Estimated Effort:** ~5 days

---

## Phase 1: Catalog Management

### 1.1 Database Setup

**Create Tables:**
```sql
-- LIB_BOOK_CATEGORY
CREATE TABLE LIB_BOOK_CATEGORY (
    LIB_CATEGORY_ID         NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_CATEGORY_UU         VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(100) NOT NULL,
    CODE                   VARCHAR2(20) NOT NULL,
    PARENT_CATEGORY_ID     NUMBER(10),
    DESCRIPTION            VARCHAR2(500),
    CONSTRAINT LIB_CATEGORY_CODE UNIQUE (CODE, AD_CLIENT_ID)
);

-- LIB_BOOK
CREATE TABLE LIB_BOOK (
    LIB_BOOK_ID             NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_BOOK_UU             VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE              CHAR(1) DEFAULT 'Y',
    CREATED               DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY             NUMBER(10) NOT NULL,
    UPDATED               DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY             NUMBER(10) NOT NULL,
    ISBN                  VARCHAR2(20),
    TITLE                 VARCHAR2(255) NOT NULL,
    SUBTITLE              VARCHAR2(255),
    EDITION               VARCHAR2(50),
    AUTHOR                VARCHAR2(255) NOT NULL,
    CO_AUTHORS            VARCHAR2(500),
    PUBLISHER             VARCHAR2(150),
    PUBLICATION_YEAR      NUMBER(4),
    PUBLICATION_PLACE     VARCHAR2(100),
    PAGES                 NUMBER(5),
    LANGUAGE              VARCHAR2(50) DEFAULT 'Indonesian',
    LIB_CATEGORY_ID       NUMBER(10),
    CALL_NUMBER           VARCHAR2(50),
    SUBJECT_KEYWORDS      VARCHAR2(500),
    TOTAL_COPIES          NUMBER(3) DEFAULT 1,
    AVAILABLE_COPIES      NUMBER(3) DEFAULT 1,
    ACQUISITION_DATE      DATE,
    ACQUISITION_SOURCE     VARCHAR2(100),
    SUPPLIER              VARCHAR2(150),
    PRICE                 NUMBER(10,2),
    A_ASSET_ID            NUMBER(10),
    BOOK_STATUS           VARCHAR2(20) DEFAULT 'Available',
    DESCRIPTION           VARCHAR2(500),
    NOTES                 VARCHAR2(500)
);

-- LIB_BOOK_COPY
CREATE TABLE LIB_BOOK_COPY (
    LIB_BOOK_COPY_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_BOOK_COPY_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    LIB_BOOK_ID            NUMBER(10) NOT NULL,
    COPY_NUMBER            NUMBER(3) NOT NULL,
    BARCODE                VARCHAR2(50) NOT NULL,
    ACCESSION_NO           VARCHAR2(50),
    COPY_STATUS            VARCHAR2(20) DEFAULT 'Available',
    CONDITION             VARCHAR2(20) DEFAULT 'Good',
    CONDITION_NOTES        VARCHAR2(255),
    LOCATION               VARCHAR2(50),
    SHELF                  VARCHAR2(20),
    ROW                    VARCHAR2(20),
    CONSTRAINT LIB_BOOK_COPY_BARCODE UNIQUE (BARCODE),
    CONSTRAINT LIB_BOOK_COPY_UQ UNIQUE (LIB_BOOK_ID, COPY_NUMBER, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX LIB_BOOK_ISBN_IDX ON LIB_BOOK(ISBN);
CREATE INDEX LIB_BOOK_TITLE_IDX ON LIB_BOOK(TITLE);
CREATE LIB_BOOK_AUTHOR_IDX ON LIB_BOOK(AUTHOR);
CREATE INDEX LIB_BOOK_CATEGORY_IDX ON LIB_BOOK(LIB_CATEGORY_ID);

CREATE INDEX LIB_BOOK_COPY_BOOK_IDX ON LIB_BOOK_COPY(LIB_BOOK_ID);
CREATE INDEX LIB_BOOK_COPY_BARCODE_IDX ON LIB_BOOK_COPY(BARCODE);
CREATE INDEX LIB_BOOK_COPY_STATUS_IDX ON LIB_BOOK_COPY(COPY_STATUS);
```

### 1.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/library/books` - Search books
- [x] `GET /api/v1/library/books/{id}` - Get book detail
- [x] `POST /api/v1/library/books` - Add new book
- [x] `PUT /api/v1/library/books/{id}` - Update book
- [x] `DELETE /api/v1/library/books/{id}` - Delete book (soft delete)

### 1.3 Book Creation Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Book Creation Flow                        │
└─────────────────────────────────────────────────────────┘

    REQUEST                VALIDATION              CREATION
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Book     │───────────▶│ ISBN/    │───────────▶│ LIB_    │
    │ Request │           │ Title   │           │ BOOK    │
    │ Data    │           │ Valid   │           │ Header  │
    └─────────┘           └─────────┘           └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Create Book │
                    │ Copies     │
                    │ (For each  │
                    │  copy)     │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Generate    │
                    │ Barcodes    │
                    └──────────────────┘
```

### 1.4 Business Rules

**ISBN Validation:**
- Optional field (some books may not have ISBN)
- If provided, format must be valid ISBN-10 or ISBN-13
- Not unique (multiple copies can have same ISBN)

**Title/Author:**
- Required fields
- Support for multiple authors (CO_AUTHORS)

**Copy Management:**
- Total copies must be >= 1
- Available copies cannot exceed total copies
- When adding new copies, increment TOTAL_COPIES
- When book is on loan, AVAILABLE_COPIES decreases

**Book Status:**
- `Available` - Default status
- `Lost` - When marked lost, decrement total copies
- `Damaged` - Still in collection but not borrowable
- `Withdrawn` - No longer in collection

**Validation Rules:**
- Title and author required
- Total copies must be positive
- Category must exist

### 1.5 Frontend Components

**Required Pages:**
- `/library/books` - Book catalog with search
- `/library/books/new` - Add new book
- `/library/books/[id]` - Book detail
- `/library/books/[id]/edit` - Edit book
- `/library/categories` - Manage categories

### 1.6 Seed Data

**File:** `docs/api/library/seed/books.json`

```json
[
  {
    "isbn": "978-0-123456-78-9",
    "title": "Mathematics for High School",
    "subtitle": "Algebra and Geometry",
    "author": "Dr. John Smith",
    "publisher": "Education Press",
    "publicationYear": 2020,
    "pages": 450,
    "language": "English",
    "category": "Science",
    "totalCopies": 5,
    "availableCopies": 3
  },
  {
    "isbn": "978-0-234567-89-0",
    "title": "Indonesian History",
    "subtitle": "From Ancient to Modern Times",
    "author": "Dr. Siti Aminah",
    "publisher": "Nusantara Press",
    "publicationYear": 2021,
    "pages": 320,
    "language": "Indonesian",
    "category": "History",
    "totalCopies": 3,
    "availableCopies": 3
  }
]
```

---

## Phase 2: Circulation

### 2.1 Database Setup

**Create Tables:**
```sql
-- LIB_LOAN
CREATE TABLE LIB_LOAN (
    LIB_LOAN_ID             NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_LOAN_UU             VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE              CHAR(1) DEFAULT 'Y',
    CREATED               DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY             NUMBER(10) NOT NULL,
    UPDATED               DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY             NUMBER(10) NOT NULL,
    LIB_BOOK_COPY_ID       NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10),
    HR_EMPLOYEE_ID         NUMBER(10),
    C_BPARTNER_ID          NUMBER(10),
    LOAN_NO                VARCHAR2(20) NOT NULL,
    LOAN_DATE              DATE NOT NULL,
    DUE_DATE               DATE NOT NULL,
    RETURN_DATE            DATE,
    RETURNED_BY            NUMBER(10),
    RECEIVED_CONDITION    VARCHAR2(20),
    LOAN_STATUS           VARCHAR2(20) DEFAULT 'Active',
    RENEWAL_COUNT         NUMBER(2) DEFAULT 0,
    MAX_RENEWALS           NUMBER(2) DEFAULT 2,
    HAS_FINE               CHAR(1) DEFAULT 'N',
    FINE_AMOUNT            NUMBER(10,2),
    FINE_PAID              CHAR(1) DEFAULT 'N',
    FINE_WAIVED           CHAR(1) DEFAULT 'N',
    REMARKS                VARCHAR2(255),
    CONSTRAINT LIB_LOAN_NO UNIQUE (LOAN_NO, AD_CLIENT_ID)
);

-- LIB_FINE
CREATE TABLE LIB_FINE (
    LIB_FINE_ID             NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_FINE_UU             VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE              CHAR(1) DEFAULT 'Y',
    CREATED               DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY             NUMBER(10) NOT NULL,
    UPDATED               DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY             NUMBER(10) NOT NULL,
    LIB_LOAN_ID            NUMBER(10) NOT NULL,
    FINE_DATE              DATE NOT NULL,
    DAYS_OVERDUE          NUMBER(5) NOT NULL,
    FINE_RATE_PER_DAY      NUMBER(10,2) NOT NULL,
    TOTAL_FINE            NUMBER(10,2) NOT NULL,
    FINE_STATUS           VARCHAR2(20) DEFAULT 'Unpaid',
    PAID_AMOUNT           NUMBER(10,2),
    PAID_DATE             DATE,
    PAYMENT_METHOD        VARCHAR2(20),
    PAYMENT_REFERENCE     VARCHAR2(50),
    IS_WAIVED             CHAR(1) DEFAULT 'N',
    WAIVED_BY             NUMBER(10),
    WAIVED_DATE           DATE,
    WAIVER_REASON         VARCHAR2(255),
    REMARKS                VARCHAR2(255)
);

-- LIB_RESERVATION
CREATE TABLE LIB_RESERVATION (
    LIB_RESERVATION_ID     NUMBER(10) NOT NULL PRIMARY KEY,
    LIB_RESERVATION_UU     VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE              CHAR(1) DEFAULT 'Y',
    CREATED               DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY             NUMBER(10) NOT NULL,
    UPDATED               DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY             NUMBER(10) NOT NULL,
    LIB_BOOK_ID            NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10),
    HR_EMPLOYEE_ID         NUMBER(10),
    C_BPARTNER_ID          NUMBER(10),
    RESERVATION_DATE       DATE NOT NULL,
    EXPIRY_DATE            DATE NOT NULL,
    STATUS                VARCHAR2(20) DEFAULT 'Pending',
    NOTIFIED_DATE         DATE,
    NOTIFIED              CHAR(1) DEFAULT 'N',
    REMARKS                VARCHAR2(255)
);

-- Create indexes
CREATE INDEX LIB_LOAN_COPY_IDX ON LIB_LOAN(LIB_BOOK_COPY_ID);
CREATE INDEX LIB_LOAN_STUDENT_IDX ON LIB_LOAN(SCH_STUDENT_ID);
CREATE INDEX LIB_LOAN_EMPLOYEE_IDX ON LIB_LOAN(HR_EMPLOYEE_ID);
CREATE INDEX LIB_LOAN_STATUS_IDX ON LIB_LOAN(LOAN_STATUS);
CREATE INDEX LIB_LOAN_DATE_IDX ON LIB_LOAN(LOAN_DATE);

CREATE INDEX LIB_FINE_LOAN_IDX ON LIB_FINE(LIB_LOAN_ID);
CREATE INDEX LIB_FINE_STATUS_IDX ON LIB_FINE(FINE_STATUS);

CREATE INDEX LIB_RESERVATION_BOOK_IDX ON LIB_RESERVATION(LIB_BOOK_ID);
CREATE INDEX LIB_RESERVATION_STUDENT_IDX ON LIB_RESERVATION(SCH_STUDENT_ID);
CREATE INDEX LIB_RESERVATION_STATUS_IDX ON LIB_RESERVATION(STATUS);
CREATE INDEX LIB_RESERVATION_EXPIRY_IDX ON LIB_RESERVATION(EXPIRY_DATE);
```

### 2.2 API Implementation

**Required Endpoints:**
- [x] `POST /api/v1/library/loans` - Issue book
- [x] `PUT /api/v1/library/loans/{id}/return` - Return book
- [x] `PUT /api/v1/library/loans/{id}/renew` - Renew book
- [x] `GET /api/v1/library/loans` - List loans
- [x] `GET /api/v1/library/loans/member/{id}` - Get member loans
- [x] `POST /api/v1/library/reservations` - Reserve book
- [x] `GET /api/v1/library/reservations` - List reservations
- [x] `DELETE /api/v1/library/reservations/{id}` - Cancel reservation

### 2.3 Circulation Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Book Issue Flow                           │
└─────────────────────────────────────────────────────────┘

    REQUEST              CHECK AVAILABILITY        ISSUE BOOK
    ┌─────────┐          ┌─────────┐          ┌─────────┐
    │ Issue    │──────────▶│ Copy    │──────────▶│ Status= │
    │ Request │          │ Available?│          │ Active  │
    └─────────┘          └─────────┘          └────┬────┘
                                                   │
                         ┌─────────────────────────┘
                         ▼
                    ┌─────────────┐
                    │ Calculate   │
                    │ Due Date   │
                    │ (14 days)  │
                    └──────┬──────┘
                           │
                    ┌────────▼─────────┐
                    │ Create Loan │
                    │ Update Copy│
                    │ Status=On   │
                    └─────────────────┘
```

### 2.4 Business Rules

**Loan Periods:**
- Students: 14 days
- Teachers: 30 days
- Staff: 14 days
- Renewals: +14 days (max 2 renewals)

**Fine Calculation:**
```
DAYS_OVERDUE = TRUNC(RETURN_DATE) - TRUNC(DUE_DATE)
IF DAYS_OVERDUE > 0 THEN:
    FINE = DAYS_OVERDUE × 1000 (default rate)
END IF
```

**Loan Status Flow:**
```
Active → Returned (or Returned Damaged)
Active → Overdue (if past due date)
Active → Lost (if book reported lost)
```

**Renewal Rules:**
- Can renew if:
  - Not overdue
  - No one has reserved the book
  - Renewal count < MAX_RENEWALS
- Due date extended by loan period

**Reservation Rules:**
- Reservation expires after 7 days
- Member notified when book available
- Reservation cancelled if not claimed within 3 days

**Validation Rules:**
- Book must be available
- Member must have active status
- Cannot have unpaid fines
- Cannot exceed max loan limit (e.g., 3 books)

### 2.5 Frontend Components

**Required Pages:**
- `/library/circulation/issue` - Issue book
- `/library/circulation/return` - Return book
- `/library/circulation/renew` - Renew book
- `/library/circulation/loans` - Loan list
- `/library/circulation/fines` - Fines management
- `/library/circulation/reservations` - Reservations

### 2.6 Seed Data

**File:** `docs/api/library/seed/loans.json`

```json
[
  {
    "loanNo": "LN-2024-001",
    "bookCopyId": "BC-001",
    "memberType": "Student",
    "memberId": "STU-001",
    "loanDate": "2024-08-01",
    "dueDate": "2024-08-15",
    "loanStatus": "Active"
  },
  {
    "loanNo": "LN-2024-002",
    "bookCopyId": "BC-004",
    "memberType": "Employee",
    "memberId": "EMP-003",
    "loanDate": "2024-08-05",
    "dueDate": "2024-09-04",
    "loanStatus": "Active"
  }
]
```

---

## Phase 3: Reports

### 3.1 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/library/reports/usage` - Usage report
- [x] `api/v1/library/reports/overdue` - Overdue books report
- [x] `GET /api/v1/library/reports/popular` - Popular books report

### 3.2 Report Queries

**Usage Report:**
```sql
SELECT
    TO_CHAR(l.LOAN_DATE, 'YYYY-MM') as Month,
    COUNT(*) as TotalLoans,
    COUNT(DISTINCT l.C_BPARTNER_ID) as UniqueBorrowers,
    COUNT(DISTINCT l.LIB_BOOK_ID) as UniqueBooks
FROM LIB_LOAN l
WHERE l.LOAN_DATE BETWEEN ? AND ?
  AND l.AD_CLIENT_ID = ?
GROUP BY TO_CHAR(l.LOAN_DATE, 'YYYY-MM')
ORDER BY Month DESC
```

**Overdue Report:**
```sql
SELECT
    l.LOAN_NO,
    b.TITLE,
    bp.NAME as MemberName,
    m.MEMBER_TYPE,
    l.DUE_DATE,
    TRUNC(SYSDATE) - TRUNC(l.DUE_DATE) as DaysOverdue,
    (TRUNC(SYSDATE) - TRUNC(l.DUE_DATE)) * 1000 as FineAmount,
    l.LOAN_STATUS
FROM LIB_LOAN l
INNER JOIN LIB_BOOK_COPY bc ON l.LIB_BOOK_COPY_ID = bc.LIB_BOOK_COPY_ID
INNER JOIN LIB_BOOK b ON bc.LIB_BOOK_ID = b.LIB_BOOK_ID
LEFT JOIN C_BPARTNER bp ON l.C_BPARTNER_ID = bp.C_BPARTNER_ID
LEFT JOIN (
    SELECT 'Student' as MEMBER_TYPE, SCH_STUDENT_ID as ID
    FROM SCH_STUDENT
    UNION ALL
    SELECT 'Employee' as MEMBER_TYPE, HR_EMPLOYEE_ID as ID
    FROM HR_EMPLOYEE
) m ON l.C_BPARTNER_ID = m.ID
WHERE l.LOAN_STATUS = 'Active'
  AND l.DUE_DATE < SYSDATE
  AND l.AD_CLIENT_ID = ?
ORDER BY l.DUE_DATE ASC
```

**Popular Books Report:**
```sql
SELECT
    b.LIB_BOOK_ID,
    b.TITLE,
    b.AUTHOR,
    COUNT(*) as TimesLoaned,
    COUNT(DISTINCT l.C_BPARTNER_ID) as UniqueBorrowers
FROM LIB_LOAN l
INNER JOIN LIB_BOOK_COPY bc ON l.LIB_BOOK_COPY_ID = bc.LIB_BOOK_COPY_ID
INNER JOIN LIB_BOOK b ON bc.LIB_BOOK_ID = b.LIB_BOOK_ID
WHERE l.LOAN_DATE BETWEEN ? AND ?
  AND l.AD_CLIENT_ID = ?
GROUP BY b.LIB_BOOK_ID, b.TITLE, b.AUTHOR
ORDER BY TimesLoaned DESC
FETCH FIRST 20 ROWS ONLY
```

### 3.3 Frontend Components

**Required Pages:**
- `/library/reports/usage` - Usage statistics
- `/library/reports/overdue` - Overdue books list
- `/library/reports/popular` - Popular books

---

## Testing Checklist

### Database Testing

- [ ] LIB_BOOK_CATEGORY table created successfully
- [ ] LIB_BOOK table created successfully
- [ ] LIB_BOOK_COPY table created successfully
- [ ] LIB_LOAN table created successfully
- [ ] LIB_FINE table created successfully
- [ ] LIB_RESERVATION table created successfully
- [ ] All indexes created successfully
- [ ] Unique constraints working

### API Testing

- [ ] Book search returns correct results
- [ ] Book detail returns copy information
- [ ] Book creation creates book and copies
- [ ] Issue book creates loan correctly
- [ ] Return book updates loan and copy status
- [ ] Fine calculated correctly for overdue books
- [ ] Renewal extends due date correctly
- [ ] Reservation created and managed correctly

### Frontend Testing

- [ ] All pages accessible
- [ ] Book search/filter working
- [ ] Issue form validates correctly
- [ ] Return form processes correctly
- [ ] Renewal button working when allowed
- [ ] Fine display and payment working
- [ ] Reservation system working

### Integration Testing

- [ ] Book availability updated on issue
- [ ] Book availability updated on return
- [] Member loan limits enforced
- [ ] Overdue fines calculated correctly
- [ ] Notifications sent for reservations
- [ ] Reports return accurate data

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Mapping](./api-mapping.md)
- [API Specification](../api/library/library-module.md)
