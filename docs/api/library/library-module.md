# Library Module APIs

**Base URL:** `/api/v1/library`

---

## 1. Catalog

### 1.1 Search Books

```http
GET /api/v1/library/books
```

**Query Parameters (iDempiere REST API Standard):**

```
# Search by title
$filter=contains(Title,'Mathematics')

# Filter by category
$filter=Category eq 'Science'

# Filter available books only
$filter=AvailableCopies gt 0

# Filter by publication year
$filter=PublicationYear ge 2020

# Pagination and sorting
$top=20&$skip=0&$orderby=Title asc

# Select specific fields
$select=Title,Author,ISBN,Category,AvailableCopies

# Complex filter - Available science books published after 2020
$filter=Category eq 'Science' AND PublicationYear ge 2020 AND AvailableCopies gt 0
```

**Examples:**

```http
# Example 1: Search books by title
GET /api/v1/library/books?$filter=contains(Title,'Mathematics')&$orderby=Title asc

# Example 2: Get available books by category
GET /api/v1/library/books?$filter=Category eq 'Science' AND AvailableCopies gt 0

# Example 3: Get books by author
GET /api/v1/library/books?$filter=Author eq 'Dr. John Smith'&$orderby=PublicationYear desc

# Example 4: Get recently published books
GET /api/v1/library/books?$filter=PublicationYear ge 2023&$orderby=PublicationYear desc

# Example 5: Case-insensitive search
GET /api/v1/library/books?$filter=contains(tolower(Title),'mathematics') OR contains(tolower(Title),'algebra')
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
      "ISBN": "978-0-123456-78-9",
      "Title": "Mathematics for High School",
      "Subtitle": "Algebra and Geometry",
      "Author": "Dr. John Smith",
      "Publisher": "Education Press",
      "PublicationYear": 2020,
      "Pages": 450,
      "Language": "English",
      "Category": "Science",
      "CallNumber": "510 SM",
      "TotalCopies": 5,
      "AvailableCopies": 3,
      "IsActive": true,
      "model-name": "sms_book"
    }
  ]
}
```

---

## 2. Circulation

### 2.1 Issue Book

```http
POST /api/v1/library/loans
```

**Request Body:**
```json
{
  "bookCopyId": "BCP-001",
  "memberType": "Student",
  "memberId": "STU-001",
  "loanDate": "2024-08-01",
  "dueDate": "2024-08-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN-001",
    "loanNo": "LN-2024-001",
    "dueDate": "2024-08-15",
    "message": "Book issued successfully"
  }
}
```

---

### 2.2 Return Book

```http
PUT /api/v1/library/loans/{loanId}/return
```

**Request Body:**
```json
{
  "returnDate": "2024-08-14",
  "receivedCondition": "Good"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN-001",
    "loanStatus": "Returned",
    "hasFine": false
  },
  "message": "Book returned successfully"
}
```

---

## Seed Data

Seed data untuk module ini tersedia di folder [`../../plans/library/seed/`](../../plans/library/seed/):

- [`books.json`](../../plans/library/seed/books.json) - Data buku (10 records)
- [`loans.json`](../../plans/library/seed/loans.json) - Data peminjaman buku (5 records)

---

**Last Updated:** 2025-01-27
