# Academic Module - Database Schema

**Module:** Academic Management
**Prefix:** `SCH_`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Core Tables](#core-tables)
3. [Student Management](#student-management)
4. [Curriculum & Subjects](#curriculum--subjects)
5. [Class Management](#class-management)
6. [Timetable & Scheduling](#timetable--scheduling)
7. [Attendance](#attendance)
8. [Grades & Exams](#grades--exams)
9. [Portals](#portals)
10. [Relationships Summary](#relationships-summary)

---

## Module Overview

### Table Statistics

| Category | Table Count | Est. Columns |
|----------|-------------|--------------|
| Student Management | 3 | ~150 |
| Curriculum & Subjects | 3 | ~80 |
| Class Management | 4 | ~100 |
| Timetable & Scheduling | 7 | ~200 |
| Attendance | 3 | ~80 |
| Grades & Exams | 6 | ~150 |
| Portals | 2 | ~40 |
| **Total** | **28** | **~800** |

### Integration with iDempiere

| iDempiere Table | Purpose |
|-----------------|---------|
| `C_BPARTNER` | Students, Parents linked as Business Partners |
| `AD_USER` | Teachers, Homeroom Teachers linked as System Users |
| `C_PROJECT` | Optional curriculum base reference |
| `S_RESOURCE` | Room/Facility booking for schedules |
| `AD_NOTE` | Optional communication integration |

---

## Core Tables

### Mandatory Columns (All Tables)

All `SCH_*` tables include these iDempiere standard columns:

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

## Student Management

### SCH_STUDENT - Student Profile

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `STUDENT_NO` | VARCHAR2(20) | YES | Student registration number (unique per client) |
| `C_BPARTNER_ID` | NUMBER(10) | YES | Link to C_BPARTNER |
| `ADMISSION_NO` | VARCHAR2(20) | NO | Admission number |
| `ADMISSION_DATE` | DATE | NO | Date of admission |
| `ACADEMIC_YEAR` | VARCHAR2(10) | NO | Current academic year |
| `GRADE_LEVEL` | VARCHAR2(20) | NO | Current grade level |
| `CLASS_NAME` | VARCHAR2(20) | NO | Current class name |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type (SD, SMP, SMA, SMK) |
| `MAJOR` | VARCHAR2(50) | NO | Major/Specialization |
| `DATE_OF_BIRTH` | DATE | NO | Date of birth |
| `PLACE_OF_BIRTH` | VARCHAR2(50) | NO | Place of birth |
| `GENDER` | CHAR(1) | NO | Gender (M/F) |
| `BLOOD_TYPE` | CHAR(2) | NO | Blood type |
| `RELIGION` | VARCHAR2(20) | NO | Religion |
| `NATIONALITY` | VARCHAR2(30) | NO | Nationality (default: Indonesian) |
| `ADDRESS` | VARCHAR2(255) | NO | Home address |
| `CITY` | VARCHAR2(50) | NO | City |
| `PROVINCE` | VARCHAR2(50) | NO | Province |
| `POSTAL_CODE` | VARCHAR2(10) | NO | Postal code |
| `PHONE_HOME` | VARCHAR2(20) | NO | Home phone |
| `PHONE_MOBILE` | VARCHAR2(20) | NO | Mobile phone |
| `EMAIL` | VARCHAR2(100) | NO | Email address |
| `FATHER_NAME` | VARCHAR2(100) | NO | Father's name |
| `FATHER_OCCUPATION` | VARCHAR2(50) | NO | Father's occupation |
| `FATHER_PHONE` | VARCHAR2(20) | NO | Father's phone |
| `FATHER_EMAIL` | VARCHAR2(100) | NO | Father's email |
| `MOTHER_NAME` | VARCHAR2(100) | NO | Mother's name |
| `MOTHER_OCCUPATION` | VARCHAR2(50) | NO | Mother's occupation |
| `MOTHER_PHONE` | VARCHAR2(20) | NO | Mother's phone |
| `MOTHER_EMAIL` | VARCHAR2(100) | NO | Mother's email |
| `GUARDIAN_NAME` | VARCHAR2(100) | NO | Guardian's name |
| `GUARDIAN_RELATION` | VARCHAR2(20) | NO | Guardian relationship |
| `GUARDIAN_PHONE` | VARCHAR2(20) | NO | Guardian's phone |
| `EMERGENCY_CONTACT` | VARCHAR2(100) | NO | Emergency contact name |
| `EMERGENCY_PHONE` | VARCHAR2(20) | NO | Emergency phone |
| `PHOTO_PATH` | VARCHAR2(255) | NO | Student photo file path |
| `MEDICAL_INFO` | CLOB | NO | Medical information |
| `ALLERGIES` | VARCHAR2(255) | NO | Allergies |
| `ENROLLMENT_STATUS` | VARCHAR2(20) | NO | Enrollment status |
| `PREVIOUS_SCHOOL` | VARCHAR2(100) | NO | Previous school |

**Indexes:**
- `SCH_STUDENT_UU_IDX` on `SCH_STUDENT_UU`
- `SCH_STUDENT_NO_IDX` on `STUDENT_NO`
- `SCH_STUDENT_BP_IDX` on `C_BPARTNER_ID`

**Unique Constraints:**
- `STUDENT_NO` + `AD_CLIENT_ID`

---

### SCH_ENROLLMENT - Enrollment History

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Link to SCH_STUDENT |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester (1, 2, Special) |
| `GRADE_LEVEL` | VARCHAR2(20) | YES | Grade level |
| `CLASS_NAME` | VARCHAR2(20) | YES | Class name |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type |
| `MAJOR` | VARCHAR2(50) | NO | Major |
| `ENROLLMENT_DATE` | DATE | NO | Enrollment date |
| `COMPLETION_DATE` | DATE | NO | Completion date |
| `ENROLLMENT_STATUS` | VARCHAR2(20) | NO | Status (Active, Withdrawn, Graduated) |
| `GRADUATION_DATE` | DATE | NO | Graduation date |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

**Unique:**
- `SCH_STUDENT_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_STUDENT_PARENT - Parent Link

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Link to SCH_STUDENT |
| `C_BPARTNER_ID` | NUMBER(10) | YES | Parent BP ID |
| `RELATIONSHIP_TYPE` | VARCHAR2(20) | YES | Relationship (Father, Mother, Guardian) |
| `IS_PRIMARY_CONTACT` | CHAR(1) | NO | Primary contact (Y/N) |
| `IS_EMERGENCY_CONTACT` | CHAR(1) | NO | Emergency contact (Y/N) |
| `HAS_PORTAL_ACCESS` | CHAR(1) | NO | Has portal access (Y/N) |
| `PORTAL_USERNAME` | VARCHAR2(50) | NO | Portal username |

---

## Curriculum & Subjects

### SCH_CURRICULUM - Curriculum Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Curriculum name |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `CURRICULUM_TYPE` | VARCHAR2(20) | YES | Type (National, International, Custom) |
| `SCHOOL_TYPE` | VARCHAR2(20) | YES | School type (SD, SMP, SMA, SMK) |
| `EDUCATION_LEVEL` | VARCHAR2(20) | NO | Education level |
| `MAJOR` | VARCHAR2(50) | NO | Major (for SMK) |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `VERSION` | VARCHAR2(20) | NO | Curriculum version |
| `IS_APPROVED` | CHAR(1) | NO | Approved status (Y/N) |
| `APPROVED_DATE` | DATE | NO | Approved date |
| `APPROVEDBY` | NUMBER(10) | NO | Approved by (AD_USER) |
| `EFFECTIVE_DATE` | DATE | NO | Effective date |
| `EXPIRY_DATE` | DATE | NO | Expiry date |
| `C_PROJECT_ID` | NUMBER(10) | NO | Project reference |

---

### SCH_SUBJECT - Subject Master

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `CODE` | VARCHAR2(20) | YES | Subject code (unique per client) |
| `NAME` | VARCHAR2(100) | YES | Subject name |
| `NAME_ENGLISH` | VARCHAR2(100) | NO | English name |
| `SUBJECT_TYPE` | VARCHAR2(20) | NO | Type (Core, Elective, etc) |
| `SUBJECT_CATEGORY` | VARCHAR2(50) | NO | Category |
| `CREDIT_HOURS` | NUMBER(5,2) | NO | Credit hours |
| `WEEKLY_HOURS` | NUMBER(5,2) | NO | Weekly hours |
| `THEORY_HOURS` | NUMBER(5,2) | NO | Theory hours |
| `PRACTICAL_HOURS` | NUMBER(5,2) | NO | Practical hours |
| `GRADE_LEVEL_FROM` | VARCHAR2(20) | NO | Grade from |
| `GRADE_LEVEL_TO` | VARCHAR2(20) | NO | Grade to |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type |
| `MAJOR` | VARCHAR2(50) | NO | Major |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `LEARNING_OUTCOMES` | CLOB | NO | Learning outcomes |
| `PREREQUISITES` | VARCHAR2(255) | NO | Prerequisites |
| `PASSING_SCORE` | NUMBER(5,2) | NO | Passing score (default: 75) |
| `GRADING_SCALE` | VARCHAR2(20) | NO | Grading scale |

**Unique:**
- `CODE` + `AD_CLIENT_ID`

---

### SCH_CURRICULUM_SUBJECT - Curriculum Subject Mapping

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_CURRICULUM_ID` | NUMBER(10) | YES | Curriculum ID |
| `SCH_SUBJECT_ID` | NUMBER(10) | YES | Subject ID |
| `GRADE_LEVEL` | VARCHAR2(20) | YES | Grade level |
| `SEMESTER` | VARCHAR2(10) | YES | Semester (1, 2) |
| `SEQUENCE_NO` | NUMBER(5) | NO | Sequence number |
| `WEEKLY_HOURS` | NUMBER(5,2) | NO | Override weekly hours |
| `THEORY_HOURS` | NUMBER(5,2) | NO | Override theory hours |
| `PRACTICAL_HOURS` | NUMBER(5,2) | NO | Override practical hours |
| `CREDIT_HOURS` | NUMBER(5,2) | NO | Override credit hours |
| `IS_MANDATORY` | CHAR(1) | NO | Mandatory subject (Y/N) |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

**Unique:**
- `SCH_CURRICULUM_ID`, `SCH_SUBJECT_ID`, `GRADE_LEVEL`, `SEMESTER`, `AD_CLIENT_ID`

---

## Class Management

### SCH_CLASS - Class/Group

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `CLASS_NAME` | VARCHAR2(20) | YES | Class name (X-A, XI-IPA-1, etc) |
| `GRADE_LEVEL` | VARCHAR2(20) | YES | Grade level |
| `SCHOOL_TYPE` | VARCHAR2(20) | YES | School type |
| `MAJOR` | VARCHAR2(50) | NO | Major |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `CAPACITY` | NUMBER(3) | NO | Class capacity (default: 40) |
| `CURRENT_ENROLLMENT` | NUMBER(3) | NO | Current enrollment |
| `HOMEROOM_TEACHER_ID` | NUMBER(10) | NO | Homeroom teacher (AD_USER) |
| `CLASSROOM` | VARCHAR2(50) | NO | Classroom |
| `BUILDING` | VARCHAR2(50) | NO | Building |
| `CLASS_STATUS` | VARCHAR2(20) | NO | Status |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

**Unique:**
- `CLASS_NAME`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_CLASS_STUDENT - Student Assignment

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_CLASS_ID` | NUMBER(10) | YES | Class ID |
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Student ID |
| `SCH_ENROLLMENT_ID` | NUMBER(10) | NO | Enrollment ID |
| `ROLL_NUMBER` | NUMBER(3) | NO | Roll number |
| `ASSIGNMENT_DATE` | DATE | NO | Assignment date |
| `STATUS` | VARCHAR2(20) | NO | Status |

**Unique:**
- `SCH_CLASS_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

### SCH_TEACHER_SUBJECT - Teacher Assignment

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `AD_USER_ID` | NUMBER(10) | YES | Teacher ID (AD_USER) |
| `SCH_SUBJECT_ID` | NUMBER(10) | YES | Subject ID |
| `SCH_CLASS_ID` | NUMBER(10) | YES | Class ID |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `WEEKLY_HOURS` | NUMBER(5,2) | NO | Weekly teaching hours |
| `IS_PRIMARY` | CHAR(1) | NO | Primary teacher (Y/N) |
| `STATUS` | VARCHAR2(20) | NO | Status |

**Unique:**
- `AD_USER_ID`, `SCH_SUBJECT_ID`, `SCH_CLASS_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

## Timetable & Scheduling

### SCH_TIME_SLOT - Time Periods

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(50) | YES | Slot name (Jam ke-1, Break Time) |
| `CODE` | VARCHAR2(20) | NO | Code (07:00-07:45) |
| `SEQUENCE_NO` | NUMBER(3) | YES | Sequence number |
| `START_TIME` | VARCHAR2(5) | YES | Start time (HH:MM) |
| `END_TIME` | VARCHAR2(5) | YES | End time (HH:MM) |
| `SLOT_TYPE` | VARCHAR2(20) | YES | Type (Regular, Break, Lunch, Assembly) |
| `DURATION_MINUTES` | NUMBER(5) | YES | Duration in minutes |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type |
| `GRADE_LEVEL_FROM` | VARCHAR2(20) | NO | Grade from |
| `GRADE_LEVEL_TO` | VARCHAR2(20) | NO | Grade to |
| `IS_BREAK_TIME` | CHAR(1) | NO | Break time (Y/N) |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

**Unique:**
- `CODE`, `AD_CLIENT_ID`, `AD_ORG_ID`

---

### SCH_TIMETABLE - Timetable Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Timetable name |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `SCHOOL_TYPE` | VARCHAR2(20) | YES | School type |
| `GRADE_LEVEL` | VARCHAR2(20) | NO | Grade level |
| `MAJOR` | VARCHAR2(50) | NO | Major |
| `EFFECTIVE_FROM` | DATE | YES | Effective from date |
| `EFFECTIVE_TO` | DATE | NO | Effective to date |
| `STATUS` | VARCHAR2(20) | NO | Status (Draft) |
| `IS_PUBLISHED` | CHAR(1) | NO | Published (Y/N) |
| `PUBLISHED_DATE` | DATE | NO | Published date |
| `SCHEDULE_TYPE` | VARCHAR2(20) | NO | Schedule type (Weekly) |
| `DAYS_PATTERN` | VARCHAR2(50) | NO | Days pattern |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |

---

### SCH_SCHEDULE - Schedule Detail

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_TIMETABLE_ID` | NUMBER(10) | YES | Timetable ID |
| `SCH_CLASS_ID` | NUMBER(10) | YES | Class ID |
| `SCH_SUBJECT_ID` | NUMBER(10) | YES | Subject ID |
| `AD_USER_ID` | NUMBER(10) | YES | Teacher ID |
| `DAY_OF_WEEK` | NUMBER(1) | YES | Day (1=Monday, 7=Sunday) |
| `SCH_TIME_SLOT_ID` | NUMBER(10) | YES | Time slot ID |
| `ROOM` | VARCHAR2(50) | NO | Room |
| `BUILDING` | VARCHAR2(50) | NO | Building |
| `S_RESOURCE_ID` | NUMBER(10) | NO | Resource ID |
| `SCHEDULE_TYPE` | VARCHAR2(20) | NO | Schedule type (Regular) |
| `IS_DOUBLE_PERIOD` | CHAR(1) | NO | Double period (Y/N) |
| `NEXT_SCHEDULE_ID` | NUMBER(10) | NO | Next schedule if double |
| `COLOR_CODE` | VARCHAR2(20) | NO | Color code |
| `STATUS` | VARCHAR2(20) | NO | Status (Scheduled) |
| `SUBSTITUTE_TEACHER_ID` | NUMBER(10) | NO | Substitute teacher |
| `SUBSTITUTE_REASON` | VARCHAR2(255) | NO | Substitute reason |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Unique:**
- `SCH_CLASS_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_TEACHER_AVAILABILITY - Teacher Availability

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `AD_USER_ID` | NUMBER(10) | YES | Teacher ID |
| `DAY_OF_WEEK` | NUMBER(1) | YES | Day of week |
| `SCH_TIME_SLOT_ID` | NUMBER(10) | YES | Time slot ID |
| `AVAILABILITY_TYPE` | VARCHAR2(20) | YES | Type (Available, Unavailable, Preferred) |
| `UNAVAILABLE_REASON` | VARCHAR2(100) | NO | Reason if unavailable |
| `ACADEMIC_YEAR` | VARCHAR2(10) | NO | Academic year |
| `SEMESTER` | VARCHAR2(10) | NO | Semester |
| `EFFECTIVE_FROM` | DATE | NO | Effective from |
| `EFFECTIVE_TO` | DATE | NO | Effective to |

**Unique:**
- `AD_USER_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_RESOURCE_AVAILABILITY - Room Availability

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `S_RESOURCE_ID` | NUMBER(10) | YES | Resource ID |
| `DAY_OF_WEEK` | NUMBER(1) | YES | Day of week |
| `SCH_TIME_SLOT_ID` | NUMBER(10) | YES | Time slot ID |
| `IS_AVAILABLE` | CHAR(1) | NO | Available (Y/N) |
| `UNAVAILABLE_REASON` | VARCHAR2(100) | NO | Reason |
| `ACADEMIC_YEAR` | VARCHAR2(10) | NO | Academic year |
| `SEMESTER` | VARCHAR2(10) | NO | Semester |
| `EFFECTIVE_FROM` | DATE | NO | Effective from |
| `EFFECTIVE_TO` | DATE | NO | Effective to |

**Unique:**
- `S_RESOURCE_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_SCHEDULE_EXCEPTION - Schedule Exceptions

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Exception name |
| `EXCEPTION_DATE` | DATE | YES | Exception date |
| `EXCEPTION_TYPE` | VARCHAR2(20) | YES | Type (Holiday, Event, Exam, etc) |
| `IS_ALL_SCHOOL` | CHAR(1) | NO | All school (Y/N) |
| `AFFECTED_CLASSES` | VARCHAR2(500) | NO | Affected class IDs |
| `AFFECTED_GRADES` | VARCHAR2(255) | NO | Affected grades |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `IS_NO_CLASSES` | CHAR(1) | NO | No classes (Y/N) |
| `IS_NO_EXAMS` | CHAR(1) | NO | No exams (Y/N) |
| `IS_RECURRING` | CHAR(1) | NO | Recurring (Y/N) |
| `RECURRING_PATTERN` | VARCHAR2(50) | NO | Recurring pattern |
| `RECURRING_UNTIL` | DATE | NO | Recurring until |
| `ACADEMIC_YEAR` | VARCHAR2(10) | NO | Academic year |

**Unique:**
- `EXCEPTION_DATE`, `AD_CLIENT_ID`

---

## Attendance

### SCH_ATTENDANCE_CONFIG - Configuration

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Config name |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type |
| `GRADE_LEVEL` | VARCHAR2(20) | NO | Grade level |
| `ATTENDANCE_TYPE` | VARCHAR2(20) | NO | Type (Daily, Subject, Session) |
| `STATUS_PRESENT` | VARCHAR2(20) | NO | Present status label |
| `STATUS_ABSENT` | VARCHAR2(20) | NO | Absent status label |
| `STATUS_LATE` | VARCHAR2(20) | NO | Late status label |
| `STATUS_EXCUSED` | VARCHAR2(20) | NO | Excused status label |
| `STATUS_PERMISSION` | VARCHAR2(20) | NO | Permission status label |
| `LATE_THRESHOLD_MINUTES` | NUMBER(5) | NO | Late threshold (default: 15) |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

---

### SCH_ATTENDANCE - Attendance Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_CLASS_ID` | NUMBER(10) | YES | Class ID |
| `ATTENDANCE_DATE` | DATE | YES | Attendance date |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `SCH_TIME_SLOT_ID` | NUMBER(10) | NO | Time slot (if subject-based) |
| `ATTENDANCE_FOR` | VARCHAR2(20) | NO | For (Class, Subject, Event) |
| `SCH_SUBJECT_ID` | NUMBER(10) | NO | Subject ID |
| `STATUS` | VARCHAR2(20) | NO | Status (Draft) |
| `SUBMITTED_DATE` | DATE | NO | Submitted date |
| `SUBMITTEDBY` | NUMBER(10) | NO | Submitted by |
| `APPROVED_DATE` | DATE | NO | Approved date |
| `APPROVEDBY` | NUMBER(10) | NO | Approved by |
| `TOTAL_STUDENTS` | NUMBER(3) | NO | Total students |
| `PRESENT_COUNT` | NUMBER(3) | NO | Present count |
| `ABSENT_COUNT` | NUMBER(3) | NO | Absent count |
| `LATE_COUNT` | NUMBER(3) | NO | Late count |
| `EXCUSED_COUNT` | NUMBER(3) | NO | Excused count |
| `REMARKS` | VARCHAR2(500) | NO | Remarks |

**Unique:**
- `SCH_CLASS_ID`, `ATTENDANCE_DATE`, `SCH_SUBJECT_ID`, `AD_CLIENT_ID`

---

### SCH_ATTENDANCE_LINE - Per Student Attendance

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_ATTENDANCE_ID` | NUMBER(10) | YES | Attendance ID |
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Student ID |
| `ATTENDANCE_STATUS` | VARCHAR2(20) | YES | Status (Present, Absent, Late, etc) |
| `CHECK_IN_TIME` | VARCHAR2(5) | NO | Check-in time (HH:MM) |
| `CHECK_OUT_TIME` | VARCHAR2(5) | NO | Check-out time (HH:MM) |
| `LATE_MINUTES` | NUMBER(5) | NO | Late minutes |
| `ABSENCE_REASON` | VARCHAR2(255) | NO | Absence reason |
| `IS_EXCUSED` | CHAR(1) | NO | Excused (Y/N) |
| `EXCUSED_REASON` | VARCHAR2(255) | NO | Excused reason |
| `HAS_PERMISSION` | CHAR(1) | NO | Has permission (Y/N) |
| `PERMISSION_NO` | VARCHAR2(50) | NO | Permission number |
| `PERMISSION_REASON` | VARCHAR2(255) | NO | Permission reason |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Unique:**
- `SCH_ATTENDANCE_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

## Grades & Exams

### SCH_EXAM_TYPE - Exam Type

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Type name |
| `CODE` | VARCHAR2(20) | YES | Type code |
| `EXAM_CATEGORY` | VARCHAR2(20) | NO | Category (Formative, Summative, Diagnostic) |
| `WEIGHT_PERCENTAGE` | NUMBER(5,2) | NO | Weight in final grade |
| `DESCRIPTION` | VARCHAR2(255) | NO | Description |

**Unique:**
- `CODE`, `AD_CLIENT_ID`

---

### SCH_EXAM - Exam Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `NAME` | VARCHAR2(100) | YES | Exam name |
| `EXAM_CODE` | VARCHAR2(20) | NO | Exam code |
| `SCH_EXAM_TYPE_ID` | NUMBER(10) | YES | Exam type ID |
| `SCH_SUBJECT_ID` | NUMBER(10) | YES | Subject ID |
| `SCH_CLASS_ID` | NUMBER(10) | NO | Class ID |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `GRADE_LEVEL` | VARCHAR2(20) | NO | Grade level |
| `SCHOOL_TYPE` | VARCHAR2(20) | NO | School type |
| `EXAM_DATE` | DATE | NO | Exam date |
| `START_TIME` | VARCHAR2(5) | NO | Start time |
| `END_TIME` | VARCHAR2(5) | NO | End time |
| `DURATION_MINUTES` | NUMBER(5) | NO | Duration |
| `ROOM` | VARCHAR2(50) | NO | Room |
| `BUILDING` | VARCHAR2(50) | NO | Building |
| `MAX_SCORE` | NUMBER(5,2) | NO | Max score (default: 100) |
| `PASSING_SCORE` | NUMBER(5,2) | NO | Passing score (default: 75) |
| `WEIGHT_PERCENTAGE` | NUMBER(5,2) | NO | Weight percentage |
| `STATUS` | VARCHAR2(20) | NO | Status (Scheduled) |
| `DESCRIPTION` | VARCHAR2(500) | NO | Description |
| `INSTRUCTIONS` | CLOB | NO | Instructions |

---

### SCH_GRADE - Student Grade

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_EXAM_ID` | NUMBER(10) | YES | Exam ID |
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Student ID |
| `SCORE` | NUMBER(5,2) | NO | Score |
| `MAX_SCORE` | NUMBER(5,2) | NO | Max score |
| `GRADE_STATUS` | VARCHAR2(20) | NO | Status (Passed, Failed) |
| `LETTER_GRADE` | VARCHAR2(5) | NO | Letter grade |
| `GPA_POINTS` | NUMBER(3,2) | NO | GPA points |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |
| `TEACHER_COMMENTS` | VARCHAR2(500) | NO | Teacher comments |
| `SUBMITTED_DATE` | DATE | NO | Submitted date |
| `GRADED_DATE` | DATE | NO | Graded date |
| `GRADED_BY` | NUMBER(10) | NO | Graded by |

**Unique:**
- `SCH_EXAM_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

### SCH_REPORT_CARD - Report Card Header

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Student ID |
| `ACADEMIC_YEAR` | VARCHAR2(10) | YES | Academic year |
| `SEMESTER` | VARCHAR2(10) | YES | Semester |
| `SCH_ENROLLMENT_ID` | NUMBER(10) | NO | Enrollment ID |
| `SCH_CLASS_ID` | NUMBER(10) | NO | Class ID |
| `GRADE_LEVEL` | VARCHAR2(20) | NO | Grade level |
| `GPA` | NUMBER(3,2) | NO | GPA |
| `TOTAL_SCORE` | NUMBER(5,2) | NO | Total score |
| `MAX_SCORE` | NUMBER(5,2) | NO | Max score |
| `AVERAGE_SCORE` | NUMBER(5,2) | NO | Average score |
| `CLASS_RANK` | NUMBER(3) | NO | Class rank |
| `TOTAL_STUDENTS` | NUMBER(3) | NO | Total students |
| `TOTAL_DAYS` | NUMBER(3) | NO | Total days |
| `PRESENT_DAYS` | NUMBER(3) | NO | Present days |
| `ABSENT_DAYS` | NUMBER(3) | NO | Absent days |
| `LATE_DAYS` | NUMBER(3) | NO | Late days |
| `EXCUSED_DAYS` | NUMBER(3) | NO | Excused days |
| `ATTENDANCE_PERCENTAGE` | NUMBER(5,2) | NO | Attendance % |
| `STATUS` | VARCHAR2(20) | NO | Status (Draft) |
| `PUBLISHED_DATE` | DATE | NO | Published date |
| `PRINCIPAL_REMARKS` | VARCHAR2(500) | NO | Principal remarks |
| `CLASS_TEACHER_REMARKS` | VARCHAR2(500) | NO | Class teacher remarks |
| `PROMOTED_TO` | VARCHAR2(20) | NO | Promoted to |
| `PROMOTION_STATUS` | VARCHAR2(20) | NO | Promotion status |

**Unique:**
- `SCH_STUDENT_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_REPORT_CARD_LINE - Subject Line

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_REPORT_CARD_ID` | NUMBER(10) | YES | Report card ID |
| `SCH_SUBJECT_ID` | NUMBER(10) | YES | Subject ID |
| `WRITTEN_SCORE` | NUMBER(5,2) | NO | Written score |
| `PRACTICAL_SCORE` | NUMBER(5,2) | NO | Practical score |
| `TOTAL_SCORE` | NUMBER(5,2) | NO | Total score |
| `MAX_SCORE` | NUMBER(5,2) | NO | Max score |
| `LETTER_GRADE` | VARCHAR2(5) | NO | Letter grade |
| `GRADE_POINTS` | NUMBER(3,2) | NO | Grade points |
| `SKILLS_RATING` | VARCHAR2(50) | NO | Skills rating |
| `COMPETENCY_ACHIEVED` | CHAR(1) | NO | Competency achieved (Y/N) |
| `TOTAL_CLASSES` | NUMBER(3) | NO | Total classes |
| `ATTENDED_CLASSES` | NUMBER(3) | NO | Attended classes |
| `ATTENDANCE_PERCENTAGE` | NUMBER(5,2) | NO | Attendance % |
| `REMARKS` | VARCHAR2(255) | NO | Remarks |

**Unique:**
- `SCH_REPORT_CARD_ID`, `SCH_SUBJECT_ID`, `AD_CLIENT_ID`

---

## Portals

### SCH_PARENT_ACCESS - Parent Portal

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_STUDENT_PARENT_ID` | NUMBER(10) | YES | Student parent ID |
| `PORTAL_USERNAME` | VARCHAR2(50) | YES | Portal username (unique) |
| `PORTAL_PASSWORD` | VARCHAR2(255) | NO | Hashed password |
| `PASSWORD_CHANGED` | CHAR(1) | NO | Password changed (Y/N) |
| `LAST_PASSWORD_CHANGE` | DATE | NO | Last password change |
| `IS_LOCKED` | CHAR(1) | NO | Locked (Y/N) |
| `LOCKED_DATE` | DATE | NO | Locked date |
| `FAILED_LOGIN_ATTEMPTS` | NUMBER(3) | NO | Failed attempts |
| `LAST_LOGIN_DATE` | DATE | NO | Last login |
| `LAST_LOGIN_IP` | VARCHAR2(50) | NO | Last login IP |
| `ACCESS_FROM_DATE` | DATE | NO | Access from |
| `ACCESS_TO_DATE` | DATE | NO | Access to |
| `NOTIFICATION_EMAIL` | CHAR(1) | NO | Email notification (Y/N) |
| `NOTIFICATION_SMS` | CHAR(1) | NO | SMS notification (Y/N) |
| `NOTIFICATION_LANGUAGE` | VARCHAR2(5) | NO | Language (default: id) |

**Unique:**
- `PORTAL_USERNAME`

---

### SCH_STUDENT_PORTAL - Student Portal

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `SCH_STUDENT_ID` | NUMBER(10) | YES | Student ID |
| `PORTAL_USERNAME` | VARCHAR2(50) | YES | Portal username (unique) |
| `PORTAL_PASSWORD` | VARCHAR2(255) | NO | Hashed password |
| `PASSWORD_CHANGED` | CHAR(1) | NO | Password changed (Y/N) |
| `LAST_PASSWORD_CHANGE` | DATE | NO | Last password change |
| `IS_LOCKED` | CHAR(1) | NO | Locked (Y/N) |
| `LOCKED_DATE` | DATE | NO | Locked date |
| `FAILED_LOGIN_ATTEMPTS` | NUMBER(3) | NO | Failed attempts |
| `LAST_LOGIN_DATE` | DATE | NO | Last login |
| `LAST_LOGIN_IP` | VARCHAR2(50) | NO | Last login IP |
| `ACCESS_FROM_DATE` | DATE | NO | Access from |
| `ACCESS_TO_DATE` | DATE | NO | Access to |
| `NOTIFICATION_EMAIL` | CHAR(1) | NO | Email notification (Y/N) |
| `NOTIFICATION_SMS` | CHAR(1) | NO | SMS notification (Y/N) |
| `NOTIFICATION_LANGUAGE` | VARCHAR2(5) | NO | Language (default: id) |

**Unique:**
- `PORTAL_USERNAME`

---

## Relationships Summary

### Student Relationships
```
C_BPARTNER (iDempiere)
    ↓ 1:1
SCH_STUDENT
    ↓ 1:N
    ├── SCH_ENROLLMENT
    ├── SCH_STUDENT_PARENT → C_BPARTNER (Parent)
    ├── SCH_CLASS_STUDENT → SCH_CLASS
    ├── SCH_ATTENDANCE_LINE → SCH_ATTENDANCE
    ├── SCH_GRADE → SCH_EXAM
    └── SCH_REPORT_CARD
        ↓ 1:N
        └── SCH_REPORT_CARD_LINE → SCH_SUBJECT
```

### Curriculum Relationships
```
SCH_CURRICULUM
    ↓ 1:N
SCH_CURRICULUM_SUBJECT ← SCH_SUBJECT
    ↓ 1:N
SCH_CLASS ← AD_USER (Homeroom)
    ↓ 1:N
├── SCH_CLASS_STUDENT ← SCH_STUDENT
└── SCH_TEACHER_SUBJECT ← AD_USER, SCH_SUBJECT
```

### Timetable Relationships
```
SCH_TIMETABLE
    ↓ 1:N
SCH_SCHEDULE
    ├── SCH_CLASS
    ├── SCH_SUBJECT
    ├── AD_USER (Teacher)
    ├── SCH_TIME_SLOT
    └── S_RESOURCE (iDempiere)
```

### Exam Relationships
```
SCH_EXAM_TYPE
    ↓ 1:N
SCH_EXAM
    ├── SCH_SUBJECT
    ├── SCH_CLASS
    └── 1:N → SCH_GRADE ← SCH_STUDENT
```

---

**Document Version:** 1.0
**Related:**
- [API Specification](../api/academic/academic-module.md)
- [Implementation Guide](./implementation-guide.md)
- [API Mapping](./api-mapping.md)
