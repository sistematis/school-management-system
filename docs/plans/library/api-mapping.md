# Library Module - API Mapping

**Module:** Library Management
**Base URL:** `/api/v1/library`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Overview](#overview)
2. [Catalog API](#catalog-api)
3. [Circulation API](#circulation-api)
4. [Field Mapping Reference](#field-mapping-reference)

---

## Overview

### API to Database Table Mapping

| API Endpoint | Primary Table | Related Tables |
|-------------|---------------|----------------|
| `GET /books` | `LIB_BOOK` | `LIB_BOOK_CATEGORY`, `LIB_BOOK_COPY` |
| `POST /books` | `LIB_BOOK` + `LIB_BOOK_COPY` | `LIB_BOOK_CATEGORY` |
| `GET /books/{id}` | `LIB_BOOK` | `LIB_BOOK_COPY` |
| `POST /loans` | `LIB_LOAN` | `LIB_BOOK_COPY`, `SCH_STUDENT`/`HR_EMPLOYEE`/`C_BPARTNER` |
| `PUT /loans/{id}/return` | `LIB_LOAN` + `LIB_FINE` | `LIB_BOOK_COPY` |
| `POST /reservations` | `LIB_RESERVATION` | `LIB_BOOK`, `SCH_STUDENT`/`HR_EMPLOYEE` |

---

## Catalog API

### Search Books → LIB_BOOK

```http
GET /api/v1/library/books
```

**Database Query:**
```sql
SELECT
    b.LIB_BOOK_ID as id,
    b.LIB_BOOK_UU as uid,
    b.ISBN as ISBN,
    b.TITLE as Title,
    b.SUBTITLE as Subtitle,
    b.AUTHOR as Author,
    b.PUBLISHER as Publisher,
    b.PUBLICATION_YEAR as PublicationYear,
    b.PAGES as Pages,
    b.LANGUAGE as Language,
    c.NAME as Category,
    b.CALL_NUMBER as CallNumber,
    b.TOTAL_COPIES as TotalCopies,
    b.AVAILABLE_COPIES as AvailableCopies,
    b.BOOK_STATUS as BookStatus,
    b.ISACTIVE as IsActive,
    'sms_book' as model-name
FROM LIB_BOOK b
LEFT JOIN LIB_BOOK_CATEGORY c ON b.LIB_CATEGORY_ID = c.LIB_CATEGORY_ID
WHERE b.AD_CLIENT_ID = ?
  AND b.ISACTIVE = 'Y'
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=contains(Title,'Mathematics')` | `b.TITLE LIKE '%Mathematics%'` |
| `$filter=Category eq 'Science'` | `c.NAME = 'Science'` |
| `$filter=AvailableCopies gt 0` | `b.AVAILABLE_COPIES > 0` |
| `$filter=PublicationYear ge 2020` | `b.PUBLICATION_YEAR >= 2020` |
| `$filter=Author eq 'Dr. John Smith'` | `b.AUTHOR = 'Dr. John Smith'` |
| `$orderby=Title asc` | `ORDER BY b.TITLE ASC` |
| `$top=20&$skip=0` | `FETCH FIRST 20 ROWS ONLY` |

---

### Get Book Detail → LIB_BOOK + LIB_BOOK_COPY

```http
GET /api/v1/library/books/{bookId}
```

**Database Query:**
```sql
-- Main book info
SELECT
    b.LIB_BOOK_ID,
    b.ISBN,
    b.TITLE,
    b.SUBTITLE,
    b.EDITION,
    b.AUTHOR,
    b.CO_AUTHORS,
    b.PUBLISHER,
    b.PUBLICATION_YEAR,
    b.PUBLICATION_PLACE,
    b.PAGES,
    b.LANGUAGE,
    b.CALL_NUMBER,
    b.SUBJECT_KEYWORDS,
    b.DESCRIPTION,
    b.NOTES
FROM LIB_BOOK b
WHERE b.LIB_BOOK_ID = ?

-- Book copies
SELECT
    bc.LIB_BOOK_COPY_ID,
    bc.COPY_NUMBER,
    bc.BARCODE,
    bc.ACCESSION_NO,
    bc.COPY_STATUS,
    bc.CONDITION,
    bc.LOCATION,
    bc.SHELF,
    bc.ROW
FROM LIB_BOOK_COPY bc
WHERE bc.LIB_BOOK_ID = ?
  AND bc.ISACTIVE = 'Y'
ORDER BY bc.COPY_NUMBER
```

---

### Create Book → LIB_BOOK + LIB_BOOK_COPY

```http
POST /api/v1/library/books
```

**Transaction Flow:**
```sql
-- Step 1: Create LIB_BOOK
INSERT INTO LIB_BOOK (
    LIB_BOOK_ID, LIB_BOOK_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    ISBN, TITLE, SUBTITLE, EDITION,
    AUTHOR, CO_AUTHORS, PUBLISHER, PUBLICATION_YEAR,
    PUBLICATION_PLACE, PAGES, LANGUAGE,
    LIB_CATEGORY_ID, CALL_NUMBER, SUBJECT_KEYWORDS,
    TOTAL_COPIES, AVAILABLE_COPIES,
    ACQUISITION_DATE, ACQUISITION_SOURCE, SUPPLIER,
    PRICE, BOOK_STATUS, DESCRIPTION, NOTES
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);

-- Step 2: Create LIB_BOOK_COPY for each copy
DECLARE
    v_copy_count NUMBER := ?;
BEGIN
    FOR i IN 1..v_copy_count LOOP
        INSERT INTO LIB_BOOK_COPY (
            LIB_BOOK_COPY_ID, LIB_BOOK_COPY_UU, AD_CLIENT_ID, AD_ORG_ID,
            ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
            LIB_BOOK_ID, COPY_NUMBER, BARCODE,
            COPY_STATUS, CONDITION, LOCATION
        ) VALUES (
            ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
            ?, i, 'BC-' || LPAD(TO_CHAR(i), 4, '0') || '-' || ?,
            'Available', 'Good', 'Main Library'
        );
    END LOOP;
END;
```

---

## Circulation API

### Issue Book → LIB_LOAN

```http
POST /api/v1/library/loans
```

**Database Query:**
```sql
-- Step 1: Create LIB_LOAN
INSERT INTO LIB_LOAN (
    LIB_LOAN_ID, LIB_LOAN_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    LIB_BOOK_COPY_ID, SCH_STUDENT_ID, HR_EMPLOYEE_ID, C_BPARTNER_ID,
    LOAN_NO, LOAN_DATE, DUE_DATE, LOAN_STATUS
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, NULL, NULL,
    ?, SYSDATE, ?, 'Active'
);

-- Step 2: Update book copy status
UPDATE LIB_BOOK_COPY
SET COPY_STATUS = 'On Loan'
WHERE LIB_BOOK_COPY_ID = ?

-- Step 3: Update book available copies
UPDATE LIB_BOOK
SET AVAILABLE_COPIES = AVAILABLE_COPIES - 1
WHERE LIB_BOOK_ID = ?
```

**Due Date Calculation:**
```sql
-- Standard loan period: 14 days
DUE_DATE = LOAN_DATE + 14

-- For teachers: 30 days
-- For renewals: DUE_DATE + 14
```

---

### Return Book → LIB_LOAN + LIB_BOOK_COPY + LIB_FINE

```http
PUT /api/v1/library/loans/{loanId}/return
```

**Transaction Flow:**
```sql
-- Step 1: Calculate fine if overdue
DECLARE
    v_days_overdue NUMBER;
    v_fine_amount NUMBER(10,2);
    v_fine_rate NUMBER(10,2) := 1000; -- Per day

SELECT TRUNC(SYSDATE) - TRUNC(l.DUE_DATE)
INTO v_days_overdue
FROM LIB_LOAN l
WHERE l.LIB_LOAN_ID = ?;

IF v_days_overdue > 0 THEN
    v_fine_amount := v_days_overdue * v_fine_rate;

    -- Create fine record
    INSERT INTO LIB_FINE (
        LIB_FINE_ID, LIB_FINE_UU, AD_CLIENT_ID, AD_ORG_ID,
        ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
        LIB_LOAN_ID, FINE_DATE, DAYS_OVERDUE,
        FINE_RATE_PER_DAY, TOTAL_FINE, FINE_STATUS
    ) VALUES (
        ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
        ?, SYSDATE, v_days_overdue,
        v_fine_rate, v_fine_amount, 'Unpaid'
    );

    -- Update loan with fine info
    UPDATE LIB_LOAN
    SET HAS_FINE = 'Y',
        FINE_AMOUNT = v_fine_amount
    WHERE LIB_LOAN_ID = ?;
END IF;

-- Step 2: Update loan status
UPDATE LIB_LOAN
SET RETURN_DATE = SYSDATE,
    RETURNED_BY = ?,
    LOAN_STATUS = 'Returned',
    RECEIVED_CONDITION = ?
WHERE LIB_LOAN_ID = ?;

-- Step 3: Update book copy status
UPDATE LIB_BOOK_COPY
SET COPY_STATUS = 'Available'
WHERE LIB_BOOK_COPY_ID = (
    SELECT LIB_BOOK_COPY_ID FROM LIB_LOAN WHERE LIB_LOAN_ID = ?
);

-- Step 4: Update book available copies
UPDATE LIB_BOOK
SET AVAILABLE_COPIES = AVAILABLE_COPIES + 1
WHERE LIB_BOOK_ID = (
    SELECT LIB_BOOK_ID FROM LIB_BOOK_COPY WHERE LIB_BOOK_COPY_ID = (
        SELECT LIB_BOOK_COPY_ID FROM LIB_LOAN WHERE LIB_LOAN_ID = ?
    )
);
```

---

### Create Reservation → LIB_RESERVATION

```http
POST /api/v1/library/reservations
```

**Database Query:**
```sql
INSERT INTO LIB_RESERVATION (
    LIB_RESERVATION_ID, LIB_RESERVATION_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    LIB_BOOK_ID, SCH_STUDENT_ID, HR_EMPLOYEE_ID, C_BPARTNER_ID,
    RESERVATION_DATE, EXPIRY_DATE, STATUS
) VALUES (
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ?, ?, NULL, NULL,
    SYSDATE, SYSDATE + 7, 'Pending'
);
```

**Expiry:** 7 days from reservation date (configurable)

---

## Field Mapping Reference

### Book Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `bookId` | `LIB_BOOK` | `LIB_BOOK_ID` |
| `isbn` | `LIB_BOOK` | `ISBN` |
| `title` | `LIB_BOOK` | `TITLE` |
| `subtitle` | `LIB_BOOK` | `SUBTITLE` |
| `author` | `LIB_BOOK` | `AUTHOR` |
| `coAuthors` | `LIB_BOOK` | `CO_AUTHORS` |
| `publisher` | `LIB_BOOK` | `PUBLISHER` |
| `publicationYear` | `LIB_BOOK` | `PUBLICATION_YEAR` |
| `pages` | `LIB_BOOK` | `PAGES` |
| `language` | `LIB_BOOK` | `LANGUAGE` |
| `category` | `LIB_BOOK_CATEGORY` | `NAME` (via JOIN) |
| `callNumber` | `LIB_BOOK` | `CALL_NUMBER` |
| `totalCopies` | `LIB_BOOK` | `TOTAL_COPIES` |
| `availableCopies` | `LIB_BOOK` | `AVAILABLE_COPIES` |

### Book Copy Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `bookCopyId` | `LIB_BOOK_COPY` | `LIB_BOOK_COPY_ID` |
| `bookId` | `LIB_BOOK_COPY` | `LIB_BOOK_ID` |
| `copyNumber` | `LIB_BOOK_COPY` | `COPY_NUMBER` |
| `barcode` | `LIB_BOOK_COPY` | `BARCODE` |
| `accessionNo` | `LIB_BOOK_COPY` | `ACCESSION_NO` |
| `status` | `LIB_BOOK_COPY` | `COPY_STATUS` |
| `condition` | `LIB_BOOK_COPY` | `CONDITION` |
| `location` | `LIB_BOOK_COPY` | `LOCATION` |
| `shelf` | `LIB_BOOK_COPY` | `SHELF` |
| `row` | `LIB_BOOK_COPY` | `ROW` |

### Loan Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `loanId` | `LIB_LOAN` | `LIB_LOAN_ID` |
| `loanNo` | `LIB_LOAN` | `LOAN_NO` |
| `bookCopyId` | `LIB_LOAN` | `LIB_BOOK_COPY_ID` |
| `memberType` | Computed | From SCH_STUDENT_ID, HR_EMPLOYEE_ID, or C_BPARTNER_ID |
| `memberId` | `LIB_LOAN` | From SCH_STUDENT_ID, HR_EMPLOYEE_ID, or C_BPARTNER_ID |
| `loanDate` | `LIB_LOAN` | `LOAN_DATE` |
| `dueDate` | `LIB_LOAN` | `DUE_DATE` |
| `returnDate` | `LIB_LOAN` | `RETURN_DATE` |
| `loanStatus` | `LIB_LOAN` | `LOAN_STATUS` |
| `hasFine` | `LIB_LOAN` | `HAS_FINE` |
| `fineAmount` | `LIB_LOAN` | `FINE_AMOUNT` |
| `renewalCount` | `LIB_LOAN` | `RENEWAL_COUNT` |

### Fine Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `fineId` | `LIB_FINE` | `LIB_FINE_ID` |
| `loanId` | `LIB_FINE` | `LIB_LOAN_ID` |
| `fineDate` | `LIB_FINE` | `FINE_DATE` |
| `daysOverdue` | `LIB_FINE` | `DAYS_OVERDUE` |
| `fineRatePerDay` | `LIB_FINE` | `FINE_RATE_PER_DAY` |
| `totalFine` | `LIB_FINE` | `TOTAL_FINE` |
| `fineStatus` | `LIB_FINE` | `FINE_STATUS` |
| `paidAmount` | `LIB_FINE` | `PAID_AMOUNT` |
| `isWaived` | `LIB_FINE` | `IS_WAIVED` |

### Reservation Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `reservationId` | `LIB_RESERVATION` | `LIB_RESERVATION_ID` |
| `bookId` | `LIB_RESERVATION` | `LIB_BOOK_ID` |
| `memberType` | Computed | From SCH_STUDENT_ID, HR_EMPLOYEE_ID, or C_BPARTNER_ID |
| `memberId` | `LIB_RESERVATION` | From SCH_STUDENT_ID, HR_EMPLOYEE_ID, or C_BPARTNER_ID |
| `reservationDate` | `LIB_RESERVATION` | `RESERVATION_DATE` |
| `expiryDate` | `LIB_RESERVATION` | `EXPIRY_DATE` |
| `status` | `LIB_RESERVATION` | `STATUS` |
| `notified` | `LIB_RESERVATION` | `NOTIFIED` |
| `notifiedDate` | `LIB_RESERVATION` | `NOTIFIED_DATE` |

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Specification](../api/library/library-module.md)
- [Implementation Guide](./implementation-guide.md)
