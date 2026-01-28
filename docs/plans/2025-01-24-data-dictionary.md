# School Management System - Data Dictionary

**Project:** School Management System (K-12 + Vocational + Training Center)
**Date:** 2025-01-24
**Backend:** iDempiere 12 ERP with Custom Extensions

---

## Table of Contents

1. [Academic Core Tables (SCH_)](#academic-core-tables-sch)
2. [HR Custom Tables (HR_)](#hr-custom-tables-hr)
3. [Library Tables (LIB_)](#library-tables-lib)
4. [Portal Tables (SCH_ - Portal Related)](#portal-tables-sch---portal-related)

---

## Academic Core Tables (SCH_)

### SCH_STUDENT - Student Profile Extension

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_STUDENT_UU | VARCHAR2(36) | YES | - | UUID for replication |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client/Tenant ID (FK: AD_CLIENT) |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID (FK: AD_ORG) |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status (Y/N) |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by user (FK: AD_USER) |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by user (FK: AD_USER) |
| STUDENT_NO | VARCHAR2(20) | NO | - | Student registration number (NIS/NISN) - Unique per client |
| C_BPARTNER_ID | NUMBER(10) | NO | - | Business Partner ID (FK: C_BPARTNER) |
| ADMISSION_NO | VARCHAR2(20) | YES | - | Admission number |
| ADMISSION_DATE | DATE | YES | - | Date of admission |
| ACADEMIC_YEAR | VARCHAR2(10) | YES | - | Current academic year |
| GRADE_LEVEL | VARCHAR2(20) | YES | - | Current grade level |
| CLASS_NAME | VARCHAR2(20) | YES | - | Current class name |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type (SD, SMP, SMA, SMK) |
| MAJOR | VARCHAR2(50) | YES | - | Major/Specialization (for SMK) |
| DATE_OF_BIRTH | DATE | YES | - | Date of birth |
| PLACE_OF_BIRTH | VARCHAR2(50) | YES | - | Place of birth |
| GENDER | CHAR(1) | YES | - | Gender (M/F) |
| BLOOD_TYPE | CHAR(2) | YES | - | Blood type |
| RELIGION | VARCHAR2(20) | YES | - | Religion |
| NATIONALITY | VARCHAR2(30) | YES | 'Indonesian' | Nationality |
| ADDRESS | VARCHAR2(255) | YES | - | Home address |
| CITY | VARCHAR2(50) | YES | - | City |
| PROVINCE | VARCHAR2(50) | YES | - | Province |
| POSTAL_CODE | VARCHAR2(10) | YES | - | Postal code |
| PHONE_HOME | VARCHAR2(20) | YES | - | Home phone |
| PHONE_MOBILE | VARCHAR2(20) | YES | - | Mobile phone |
| EMAIL | VARCHAR2(100) | YES | - | Email address |
| FATHER_NAME | VARCHAR2(100) | YES | - | Father's name |
| FATHER_OCCUPATION | VARCHAR2(50) | YES | - | Father's occupation |
| FATHER_PHONE | VARCHAR2(20) | YES | - | Father's phone |
| FATHER_EMAIL | VARCHAR2(100) | YES | - | Father's email |
| MOTHER_NAME | VARCHAR2(100) | YES | - | Mother's name |
| MOTHER_OCCUPATION | VARCHAR2(50) | YES | - | Mother's occupation |
| MOTHER_PHONE | VARCHAR2(20) | YES | - | Mother's phone |
| MOTHER_EMAIL | VARCHAR2(100) | YES | - | Mother's email |
| GUARDIAN_NAME | VARCHAR2(100) | YES | - | Guardian's name |
| GUARDIAN_RELATION | VARCHAR2(20) | YES | - | Guardian relationship |
| GUARDIAN_PHONE | VARCHAR2(20) | YES | - | Guardian's phone |
| EMERGENCY_CONTACT | VARCHAR2(100) | YES | - | Emergency contact name |
| EMERGENCY_PHONE | VARCHAR2(20) | YES | - | Emergency phone |
| PHOTO_PATH | VARCHAR2(255) | YES | - | Student photo file path |
| MEDICAL_INFO | CLOB | YES | - | Medical information |
| ALLERGIES | VARCHAR2(255) | YES | - | Allergies |
| ENROLLMENT_STATUS | VARCHAR2(20) | YES | 'Active' | Enrollment status |
| PREVIOUS_SCHOOL | VARCHAR2(100) | YES | - | Previous school |

**Indexes:**
- `SCH_STUDENT_UU_IDX` on `SCH_STUDENT_UU`
- `SCH_STUDENT_NO_IDX` on `STUDENT_NO`
- `SCH_STUDENT_CLIENT_IDX` on `AD_CLIENT_ID`
- `SCH_STUDENT_ORG_IDX` on `AD_ORG_ID`
- `SCH_STUDENT_STATUS_IDX` on `ENROLLMENT_STATUS`

**Unique Constraints:**
- `STUDENT_NO` + `AD_CLIENT_ID`

---

### SCH_ENROLLMENT - Enrollment History

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ENROLLMENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ENROLLMENT_UU | VARCHAR2(36) | YES | - | UUID for replication |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID (FK: SCH_STUDENT) |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year (e.g., 2024/2025) |
| SEMESTER | VARCHAR2(10) | NO | - | Semester (1, 2, Special) |
| GRADE_LEVEL | VARCHAR2(20) | NO | - | Grade level |
| CLASS_NAME | VARCHAR2(20) | NO | - | Class name |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type |
| MAJOR | VARCHAR2(50) | YES | - | Major |
| ENROLLMENT_DATE | DATE | YES | SYSDATE | Enrollment date |
| COMPLETION_DATE | DATE | YES | - | Completion date |
| ENROLLMENT_STATUS | VARCHAR2(20) | YES | 'Active' | Status (Active, Withdrawn, Graduated) |
| GRADUATION_DATE | DATE | YES | - | Graduation date |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

**Indexes:**
- `SCH_ENROLLMENT_UQ` on `SCH_STUDENT_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`
- `SCH_ENROLLMENT_STUDENT_IDX` on `SCH_STUDENT_ID`
- `SCH_ENROLLMENT_YEAR_IDX` on `ACADEMIC_YEAR`

---

### SCH_STUDENT_PARENT - Parent-Student Relationship

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_STUDENT_PARENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_STUDENT_PARENT_UU | VARCHAR2(36) | YES | - | UUID for replication |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID (FK: SCH_STUDENT) |
| C_BPARTNER_ID | NUMBER(10) | NO | - | Parent BP ID (FK: C_BPARTNER) |
| RELATIONSHIP_TYPE | VARCHAR2(20) | NO | - | Relationship (Father, Mother, Guardian) |
| IS_PRIMARY_CONTACT | CHAR(1) | NO | 'N' | Primary contact (Y/N) |
| IS_EMERGENCY_CONTACT | CHAR(1) | NO | 'N' | Emergency contact (Y/N) |
| HAS_PORTAL_ACCESS | CHAR(1) | NO | 'Y' | Has portal access (Y/N) |
| PORTAL_USERNAME | VARCHAR2(50) | YES | - | Portal username |

**Indexes:**
- `SCH_STUDENT_PARENT_STUDENT_IDX` on `SCH_STUDENT_ID`
- `SCH_STUDENT_PARENT_BP_IDX` on `C_BPARTNER_ID`

---

### SCH_CURRICULUM - Curriculum Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_CURRICULUM_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_CURRICULUM_UU | VARCHAR2(36) | YES | - | UUID for replication |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Curriculum name |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| CURRICULUM_TYPE | VARCHAR2(20) | NO | - | Type (National, International, Custom) |
| SCHOOL_TYPE | VARCHAR2(20) | NO | - | School type (SD, SMP, SMA, SMK) |
| EDUCATION_LEVEL | VARCHAR2(20) | YES | - | Education level |
| MAJOR | VARCHAR2(50) | YES | - | Major (for SMK) |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| VERSION | VARCHAR2(20) | YES | - | Curriculum version |
| IS_APPROVED | CHAR(1) | NO | 'N' | Approved status (Y/N) |
| APPROVED_DATE | DATE | YES | - | Approved date |
| APPROVEDBY | NUMBER(10) | YES | - | Approved by (FK: AD_USER) |
| EFFECTIVE_DATE | DATE | YES | - | Effective date |
| EXPIRY_DATE | DATE | YES | - | Expiry date |
| C_PROJECT_ID | NUMBER(10) | YES | - | Project reference (FK: C_PROJECT) |

---

### SCH_SUBJECT - Subject Master

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_SUBJECT_UU | VARCHAR2(36) | YES | - | UUID for replication |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| CODE | VARCHAR2(20) | NO | - | Subject code |
| NAME | VARCHAR2(100) | NO | - | Subject name |
| NAME_ENGLISH | VARCHAR2(100) | YES | - | English name |
| SUBJECT_TYPE | VARCHAR2(20) | YES | - | Type (Core, Elective, etc) |
| SUBJECT_CATEGORY | VARCHAR2(50) | YES | - | Category |
| CREDIT_HOURS | NUMBER(5,2) | YES | - | Credit hours |
| WEEKLY_HOURS | NUMBER(5,2) | YES | - | Weekly hours |
| THEORY_HOURS | NUMBER(5,2) | YES | - | Theory hours |
| PRACTICAL_HOURS | NUMBER(5,2) | YES | - | Practical hours |
| GRADE_LEVEL_FROM | VARCHAR2(20) | YES | - | Grade from |
| GRADE_LEVEL_TO | VARCHAR2(20) | YES | - | Grade to |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type |
| MAJOR | VARCHAR2(50) | YES | - | Major |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| LEARNING_OUTCOMES | CLOB | YES | - | Learning outcomes |
| PREREQUISITES | VARCHAR2(255) | YES | - | Prerequisites |
| PASSING_SCORE | NUMBER(5,2) | YES | 75.00 | Passing score |
| GRADING_SCALE | VARCHAR2(20) | YES | - | Grading scale |

**Unique:**
- `CODE` + `AD_CLIENT_ID`

---

### SCH_CURRICULUM_SUBJECT - Curriculum Subject Mapping

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_CURRICULUM_SUBJECT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_CURRICULUM_SUBJECT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_CURRICULUM_ID | NUMBER(10) | NO | - | Curriculum ID |
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Subject ID |
| GRADE_LEVEL | VARCHAR2(20) | NO | - | Grade level |
| SEMESTER | VARCHAR2(10) | NO | - | Semester (1, 2) |
| SEQUENCE_NO | NUMBER(5) | YES | - | Sequence number |
| WEEKLY_HOURS | NUMBER(5,2) | YES | - | Override weekly hours |
| THEORY_HOURS | NUMBER(5,2) | YES | - | Override theory hours |
| PRACTICAL_HOURS | NUMBER(5,2) | YES | - | Override practical hours |
| CREDIT_HOURS | NUMBER(5,2) | YES | - | Override credit hours |
| IS_MANDATORY | CHAR(1) | NO | 'Y' | Mandatory subject (Y/N) |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

**Unique:**
- `SCH_CURRICULUM_ID`, `SCH_SUBJECT_ID`, `GRADE_LEVEL`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_CLASS - Class/Group

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_CLASS_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_CLASS_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| CLASS_NAME | VARCHAR2(20) | NO | - | Class name (X-A, XI-IPA-1, etc) |
| GRADE_LEVEL | VARCHAR2(20) | NO | - | Grade level |
| SCHOOL_TYPE | VARCHAR2(20) | NO | - | School type |
| MAJOR | VARCHAR2(50) | YES | - | Major |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| CAPACITY | NUMBER(3) | YES | 40 | Class capacity |
| CURRENT_ENROLLMENT | NUMBER(3) | YES | 0 | Current enrollment |
| HOMEROOM_TEACHER_ID | NUMBER(10) | YES | - | Homeroom teacher (FK: AD_USER) |
| CLASSROOM | VARCHAR2(50) | YES | - | Classroom |
| BUILDING | VARCHAR2(50) | YES | - | Building |
| CLASS_STATUS | VARCHAR2(20) | YES | 'Active' | Status |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

**Unique:**
- `CLASS_NAME`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_CLASS_STUDENT - Student Assignment to Class

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_CLASS_STUDENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_CLASS_STUDENT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_CLASS_ID | NUMBER(10) | NO | - | Class ID |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID |
| SCH_ENROLLMENT_ID | NUMBER(10) | YES | - | Enrollment ID |
| ROLL_NUMBER | NUMBER(3) | YES | - | Roll number |
| ASSIGNMENT_DATE | DATE | YES | SYSDATE | Assignment date |
| STATUS | VARCHAR2(20) | YES | 'Active' | Status |

**Unique:**
- `SCH_CLASS_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

### SCH_TEACHER_SUBJECT - Teacher Subject Assignment

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_TEACHER_SUBJECT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_TEACHER_SUBJECT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | | NO | - | Updated by |
| AD_USER_ID | NUMBER(10) | NO | - | Teacher ID (FK: AD_USER) |
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Subject ID |
| SCH_CLASS_ID | NUMBER(10) | NO | - | Class ID |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| WEEKLY_HOURS | NUMBER(5,2) | YES | - | Weekly teaching hours |
| IS_PRIMARY | CHAR(1) | NO | 'N' | Primary teacher (Y/N) |
| STATUS | VARCHAR2(20) | YES | 'Active' | Status |

**Unique:**
- `AD_USER_ID`, `SCH_SUBJECT_ID`, `SCH_CLASS_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_TIME_SLOT - Time Slot/Jam Pelajaran

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_TIME_SLOT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_TIME_SLOT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(50) | NO | - | Slot name (Jam ke-1, Break Time) |
| CODE | VARCHAR2(20) | YES | - | Code (07:00-07:45) |
| SEQUENCE_NO | NUMBER(3) | NO | - | Sequence number |
| START_TIME | VARCHAR2(5) | NO | - | Start time (HH:MM) |
| END_TIME | VARCHAR2(5) | NO | - | End time (HH:MM) |
| SLOT_TYPE | VARCHAR2(20) | NO | - | Type (Regular, Break, Lunch, Assembly) |
| DURATION_MINUTES | NUMBER(5) | NO | - | Duration in minutes |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type |
| GRADE_LEVEL_FROM | VARCHAR2(20) | YES | - | Grade from |
| GRADE_LEVEL_TO | VARCHAR2(20) | YES | - | Grade to |
| IS_BREAK_TIME | CHAR(1) | NO | 'N' | Break time (Y/N) |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

**Unique:**
- `CODE`, `AD_CLIENT_ID`, `AD_ORG_ID`

---

### SCH_TIMETABLE - Timetable Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_TIMETABLE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_TIMETABLE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Timetable name |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| SCHOOL_TYPE | VARCHAR2(20) | NO | - | School type |
| GRADE_LEVEL | VARCHAR2(20) | YES | - | Grade level |
| MAJOR | VARCHAR2(50) | YES | - | Major |
| EFFECTIVE_FROM | DATE | NO | - | Effective from date |
| EFFECTIVE_TO | DATE | YES | - | Effective to date |
| STATUS | VARCHAR2(20) | YES | 'Draft' | Status |
| IS_PUBLISHED | CHAR(1) | NO | 'N' | Published (Y/N) |
| PUBLISHED_DATE | DATE | YES | - | Published date |
| SCHEDULE_TYPE | VARCHAR2(20) | YES | 'Weekly' | Schedule type |
| DAYS_PATTERN | VARCHAR2(50) | YES | - | Days pattern |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |

---

### SCH_SCHEDULE - Schedule Detail

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_SCHEDULE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_SCHEDULE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_TIMETABLE_ID | NUMBER(10) | NO | - | Timetable ID |
| SCH_CLASS_ID | NUMBER(10) | NO | - | Class ID |
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Subject ID |
| AD_USER_ID | NUMBER(10) | NO | - | Teacher ID |
| DAY_OF_WEEK | NUMBER(1) | NO | - | Day (1=Monday, 7=Sunday) |
| SCH_TIME_SLOT_ID | NUMBER(10) | NO | - | Time slot ID |
| ROOM | VARCHAR2(50) | YES | - | Room |
| BUILDING | VARCHAR2(50) | YES | - | Building |
| S_RESOURCE_ID | NUMBER(10) | YES | - | Resource ID |
| SCHEDULE_TYPE | VARCHAR2(20) | YES | 'Regular' | Schedule type |
| IS_DOUBLE_PERIOD | CHAR(1) | NO | 'N' | Double period (Y/N) |
| NEXT_SCHEDULE_ID | NUMBER(10) | YES | - | Next schedule if double |
| COLOR_CODE | VARCHAR2(20) | YES | - | Color code |
| STATUS | VARCHAR2(20) | YES | 'Scheduled' | Status |
| SUBSTITUTE_TEACHER_ID | NUMBER(10) | YES | - | Substitute teacher |
| SUBSTITUTE_REASON | VARCHAR2(255) | YES | - | Substitute reason |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

**Unique:**
- `SCH_CLASS_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_TEACHER_AVAILABILITY - Teacher Availability

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_TEACHER_AVAIL_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_TEACHER_AVAIL_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| AD_USER_ID | NUMBER(10) | NO | - | Teacher ID |
| DAY_OF_WEEK | NUMBER(1) | NO | - | Day of week |
| SCH_TIME_SLOT_ID | NUMBER(10) | NO | - | Time slot ID |
| AVAILABILITY_TYPE | VARCHAR2(20) | NO | - | Type (Available, Unavailable, Preferred) |
| UNAVAILABLE_REASON | VARCHAR2(100) | YES | - | Reason if unavailable |
| ACADEMIC_YEAR | VARCHAR2(10) | YES | - | Academic year |
| SEMESTER | VARCHAR2(10) | YES | - | Semester |
| EFFECTIVE_FROM | DATE | YES | - | Effective from |
| EFFECTIVE_TO | DATE | YES | - | Effective to |

**Unique:**
- `AD_USER_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_RESOURCE_AVAILABILITY - Resource Availability

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_RESOURCE_AVAIL_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_RESOURCE_AVAIL_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| S_RESOURCE_ID | NUMBER(10) | NO | - | Resource ID |
| DAY_OF_WEEK | NUMBER(1) | NO | - | Day of week |
| SCH_TIME_SLOT_ID | NUMBER(10) | NO | - | Time slot ID |
| IS_AVAILABLE | CHAR(1) | NO | 'Y' | Available (Y/N) |
| UNAVAILABLE_REASON | VARCHAR2(100) | YES | - | Reason |
| ACADEMIC_YEAR | VARCHAR2(10) | YES | - | Academic year |
| SEMESTER | VARCHAR2(10) | YES | - | Semester |
| EFFECTIVE_FROM | DATE | YES | - | Effective from |
| EFFECTIVE_TO | DATE | YES | - | Effective to |

**Unique:**
- `S_RESOURCE_ID`, `DAY_OF_WEEK`, `SCH_TIME_SLOT_ID`, `AD_CLIENT_ID`

---

### SCH_SCHEDULE_EXCEPTION - Schedule Exception

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_EXCEPTION_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_EXCEPTION_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Exception name |
| EXCEPTION_DATE | DATE | NO | - | Exception date |
| EXCEPTION_TYPE | VARCHAR2(20) | NO | - | Type (Holiday, Event, Exam, etc) |
| IS_ALL_SCHOOL | CHAR(1) | NO | 'Y' | All school (Y/N) |
| AFFECTED_CLASSES | VARCHAR2(500) | YES | - | Affected class IDs |
| AFFECTED_GRADES | VARCHAR2(255) | YES | - | Affected grades |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| IS_NO_CLASSES | CHAR(1) | NO | 'N' | No classes (Y/N) |
| IS_NO_EXAMS | CHAR(1) | NO | 'N' | No exams (Y/N) |
| IS_RECURRING | CHAR(1) | NO | 'N' | Recurring (Y/N) |
| RECURRING_PATTERN | VARCHAR2(50) | YES | - | Recurring pattern |
| RECURRING_UNTIL | DATE | YES | - | Recurring until |
| ACADEMIC_YEAR | VARCHAR2(10) | YES | - | Academic year |

**Unique:**
- `EXCEPTION_DATE`, `AD_CLIENT_ID`

---

### SCH_ATTENDANCE_CONFIG - Attendance Configuration

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ATT_CONFIG_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ATT_CONFIG_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Config name |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type |
| GRADE_LEVEL | VARCHAR2(20) | YES | - | Grade level |
| ATTENDANCE_TYPE | VARCHAR2(20) | YES | 'Daily' | Type (Daily, Subject, Session) |
| STATUS_PRESENT | VARCHAR2(20) | YES | 'Present' | Present status label |
| STATUS_ABSENT | VARCHAR2(20) | YES | 'Absent' | Absent status label |
| STATUS_LATE | VARCHAR2(20) | YES | 'Late' | Late status label |
| STATUS_EXCUSED | VARCHAR2(20) | YES | 'Excused' | Excused status label |
| STATUS_PERMISSION | VARCHAR2(20) | YES | 'Permission' | Permission status label |
| LATE_THRESHOLD_MINUTES | NUMBER(5) | YES | 15 | Late threshold |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

---

### SCH_ATTENDANCE - Attendance Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ATTENDANCE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ATTENDANCE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_CLASS_ID | NUMBER(10) | NO | - | Class ID |
| ATTENDANCE_DATE | DATE | NO | - | Attendance date |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| SCH_TIME_SLOT_ID | NUMBER(10) | YES | - | Time slot (if subject-based) |
| ATTENDANCE_FOR | VARCHAR2(20) | YES | 'Class' | For (Class, Subject, Event) |
| SCH_SUBJECT_ID | NUMBER(10) | YES | - | Subject ID |
| STATUS | VARCHAR2(20) | YES | 'Draft' | Status |
| SUBMITTED_DATE | DATE | YES | - | Submitted date |
| SUBMITTEDBY | NUMBER(10) | YES | - | Submitted by |
| APPROVED_DATE | DATE | YES | - | Approved date |
| APPROVEDBY | NUMBER(10) | YES | - | Approved by |
| TOTAL_STUDENTS | NUMBER(3) | YES | 0 | Total students |
| PRESENT_COUNT | NUMBER(3) | YES | 0 | Present count |
| ABSENT_COUNT | NUMBER(3) | YES | 0 | Absent count |
| LATE_COUNT | NUMBER(3) | YES | 0 | Late count |
| EXCUSED_COUNT | NUMBER(3) | YES | 0 | Excused count |
| REMARKS | VARCHAR2(500) | YES | - | Remarks |

**Unique:**
- `SCH_CLASS_ID`, `ATTENDANCE_DATE`, `SCH_SUBJECT_ID`, `AD_CLIENT_ID`

---

### SCH_ATTENDANCE_LINE - Attendance Line (Per Student)

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ATT_LINE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ATT_LINE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_ATTENDANCE_ID | NUMBER(10) | NO | - | Attendance ID |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID |
| ATTENDANCE_STATUS | VARCHAR2(20) | NO | - | Status (Present, Absent, Late, etc) |
| CHECK_IN_TIME | VARCHAR2(5) | YES | - | Check-in time (HH:MM) |
| CHECK_OUT_TIME | VARCHAR2(5) | YES | - | Check-out time (HH:MM) |
| LATE_MINUTES | NUMBER(5) | YES | - | Late minutes |
| ABSENCE_REASON | VARCHAR2(255) | YES | - | Absence reason |
| IS_EXCUSED | CHAR(1) | NO | 'N' | Excused (Y/N) |
| EXCUSED_REASON | VARCHAR2(255) | YES | - | Excused reason |
| HAS_PERMISSION | CHAR(1) | NO | 'N' | Has permission (Y/N) |
| PERMISSION_NO | VARCHAR2(50) | YES | - | Permission number |
| PERMISSION_REASON | VARCHAR2(255) | YES | - | Permission reason |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

**Unique:**
- `SCH_ATTENDANCE_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

### SCH_EXAM_TYPE - Exam Type

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_EXAM_TYPE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_EXAM_TYPE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Type name |
| CODE | VARCHAR2(20) | NO | - | Type code |
| EXAM_CATEGORY | VARCHAR2(20) | YES | - | Category (Formative, Summative, Diagnostic) |
| WEIGHT_PERCENTAGE | NUMBER(5,2) | YES | - | Weight in final grade |
| DESCRIPTION | VARCHAR2(255) | YES | - | Description |

**Unique:**
- `CODE`, `AD_CLIENT_ID`

---

### SCH_EXAM - Exam Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_EXAM_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_EXAM_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Exam name |
| EXAM_CODE | VARCHAR2(20) | YES | - | Exam code |
| SCH_EXAM_TYPE_ID | NUMBER(10) | NO | - | Exam type ID |
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Subject ID |
| SCH_CLASS_ID | NUMBER(10) | YES | - | Class ID |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| GRADE_LEVEL | VARCHAR2(20) | YES | - | Grade level |
| SCHOOL_TYPE | VARCHAR2(20) | YES | - | School type |
| EXAM_DATE | DATE | YES | - | Exam date |
| START_TIME | VARCHAR2(5) | YES | - | Start time |
| END_TIME | VARCHAR2(5) | YES | - | End time |
| DURATION_MINUTES | NUMBER(5) | YES | - | Duration |
| ROOM | VARCHAR2(50) | YES | - | Room |
| BUILDING | VARCHAR2(50) | YES | - | Building |
| MAX_SCORE | NUMBER(5,2) | YES | 100.00 | Max score |
| PASSING_SCORE | NUMBER(5,2) | YES | 75.00 | Passing score |
| WEIGHT_PERCENTAGE | NUMBER(5,2) | YES | - | Weight percentage |
| STATUS | VARCHAR2(20) | YES | 'Scheduled' | Status |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| INSTRUCTIONS | CLOB | YES | - | Instructions |

---

### SCH_GRADE - Student Grade

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_GRADE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_GRADE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_EXAM_ID | NUMBER(10) | NO | - | Exam ID |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID |
| SCORE | NUMBER(5,2) | YES | - | Score |
| MAX_SCORE | NUMBER(5,2) | YES | - | Max score |
| GRADE_STATUS | VARCHAR2(20) | YES | - | Status (Passed, Failed) |
| LETTER_GRADE | VARCHAR2(5) | YES | - | Letter grade |
| GPA_POINTS | NUMBER(3,2) | YES | - | GPA points |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |
| TEACHER_COMMENTS | VARCHAR2(500) | YES | - | Teacher comments |
| SUBMITTED_DATE | DATE | YES | - | Submitted date |
| GRADED_DATE | DATE | YES | - | Graded date |
| GRADED_BY | NUMBER(10) | YES | - | Graded by |

**Unique:**
- `SCH_EXAM_ID`, `SCH_STUDENT_ID`, `AD_CLIENT_ID`

---

### SCH_REPORT_CARD - Report Card Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_REPORT_CARD_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_REPORT_CARD_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| SEMESTER | VARCHAR2(10) | NO | - | Semester |
| SCH_ENROLLMENT_ID | NUMBER(10) | YES | - | Enrollment ID |
| SCH_CLASS_ID | NUMBER(10) | YES | - | Class ID |
| GRADE_LEVEL | VARCHAR2(20) | YES | - | Grade level |
| GPA | NUMBER(3,2) | YES | - | GPA |
| TOTAL_SCORE | NUMBER(5,2) | YES | - | Total score |
| MAX_SCORE | NUMBER(5,2) | YES | - | Max score |
| AVERAGE_SCORE | NUMBER(5,2) | YES | - | Average score |
| CLASS_RANK | NUMBER(3) | YES | - | Class rank |
| TOTAL_STUDENTS | NUMBER(3) | YES | - | Total students |
| TOTAL_DAYS | NUMBER(3) | YES | - | Total days |
| PRESENT_DAYS | NUMBER(3) | YES | - | Present days |
| ABSENT_DAYS | NUMBER(3) | YES | - | Absent days |
| LATE_DAYS | NUMBER(3) | YES | - | Late days |
| EXCUSED_DAYS | NUMBER(3) | YES | - | Excused days |
| ATTENDANCE_PERCENTAGE | NUMBER(5,2) | YES | - | Attendance % |
| STATUS | VARCHAR2(20) | YES | 'Draft' | Status |
| PUBLISHED_DATE | DATE | YES | - | Published date |
| PRINCIPAL_REMARKS | VARCHAR2(500) | YES | - | Principal remarks |
| CLASS_TEACHER_REMARKS | VARCHAR2(500) | YES | - | Class teacher remarks |
| PROMOTED_TO | VARCHAR2(20) | YES | - | Promoted to |
| PROMOTION_STATUS | VARCHAR2(20) | YES | - | Promotion status |

**Unique:**
- `SCH_STUDENT_ID`, `ACADEMIC_YEAR`, `SEMESTER`, `AD_CLIENT_ID`

---

### SCH_REPORT_CARD_LINE - Report Card Subject Line

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_RPT_CARD_LINE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_RPT_CARD_LINE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_REPORT_CARD_ID | NUMBER(10) | NO | - | Report card ID |
| SCH_SUBJECT_ID | NUMBER(10) | NO | - | Subject ID |
| WRITTEN_SCORE | NUMBER(5,2) | YES | - | Written score |
| PRACTICAL_SCORE | NUMBER(5,2) | YES | - | Practical score |
| TOTAL_SCORE | NUMBER(5,2) | YES | - | Total score |
| MAX_SCORE | NUMBER(5,2) | YES | - | Max score |
| LETTER_GRADE | VARCHAR2(5) | YES | - | Letter grade |
| GRADE_POINTS | NUMBER(3,2) | YES | - | Grade points |
| SKILLS_RATING | VARCHAR2(50) | YES | - | Skills rating |
| COMPETENCY_ACHIEVED | CHAR(1) | NO | 'Y' | Competency achieved |
| TOTAL_CLASSES | NUMBER(3) | YES | - | Total classes |
| ATTENDED_CLASSES | NUMBER(3) | YES | - | Attended classes |
| ATTENDANCE_PERCENTAGE | NUMBER(5,2) | YES | - | Attendance % |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

**Unique:**
- `SCH_REPORT_CARD_ID`, `SCH_SUBJECT_ID`, `AD_CLIENT_ID`

---

### SCH_PARENT_ACCESS - Parent Portal Access

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_PARENT_ACCESS_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_PARENT_ACCESS_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_STUDENT_PARENT_ID | NUMBER(10) | NO | - | Student parent ID |
| PORTAL_USERNAME | VARCHAR2(50) | NO | - | Portal username |
| PORTAL_PASSWORD | VARCHAR2(255) | YES | - | Hashed password |
| PASSWORD_CHANGED | CHAR(1) | NO | 'N' | Password changed |
| LAST_PASSWORD_CHANGE | DATE | YES | - | Last password change |
| IS_LOCKED | CHAR(1) | NO | 'N' | Locked |
| LOCKED_DATE | DATE | YES | - | Locked date |
| FAILED_LOGIN_ATTEMPTS | NUMBER(3) | YES | 0 | Failed attempts |
| LAST_LOGIN_DATE | DATE | YES | - | Last login |
| LAST_LOGIN_IP | VARCHAR2(50) | YES | - | Last login IP |
| ACCESS_FROM_DATE | DATE | YES | - | Access from |
| ACCESS_TO_DATE | DATE | YES | - | Access to |
| NOTIFICATION_EMAIL | CHAR(1) | NO | 'Y' | Email notification |
| NOTIFICATION_SMS | CHAR(1) | NO | 'N' | SMS notification |
| NOTIFICATION_LANGUAGE | VARCHAR2(5) | YES | 'id' | Language |

**Unique:**
- `PORTAL_USERNAME`

---

### SCH_STUDENT_PORTAL - Student Portal Access

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_STUDENT_PORTAL_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_STUDENT_PORTAL_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_STUDENT_ID | NUMBER(10) | NO | - | Student ID |
| PORTAL_USERNAME | VARCHAR2(50) | NO | - | Portal username |
| PORTAL_PASSWORD | VARCHAR2(255) | YES | - | Hashed password |
| PASSWORD_CHANGED | CHAR(1) | NO | 'N' | Password changed |
| LAST_PASSWORD_CHANGE | DATE | YES | - | Last password change |
| IS_LOCKED | CHAR(1) | NO | 'N' | Locked |
| LOCKED_DATE | DATE | YES | - | Locked date |
| FAILED_LOGIN_ATTEMPTS | NUMBER(3) | YES | 0 | Failed attempts |
| LAST_LOGIN_DATE | DATE | YES | - | Last login |
| LAST_LOGIN_IP | VARCHAR2(50) | YES | - | Last login IP |
| ACCESS_FROM_DATE | DATE | YES | - | Access from |
| ACCESS_TO_DATE | DATE | YES | - | Access to |
| NOTIFICATION_EMAIL | CHAR(1) | NO | 'Y' | Email notification |
| NOTIFICATION_SMS | CHAR(1) | NO | 'N' | SMS notification |
| NOTIFICATION_LANGUAGE | VARCHAR2(5) | YES | 'id' | Language |

**Unique:**
- `PORTAL_USERNAME`

---

### SCH_ANNOUNCEMENT - School Announcements

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ANNOUNCEMENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ANNOUNCEMENT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| TITLE | VARCHAR2(200) | NO | - | Announcement title |
| ANNOUNCEMENT_TYPE | VARCHAR2(20) | NO | - | Type (General, Exam, Holiday, Event) |
| PRIORITY | VARCHAR2(20) | YES | 'Normal' | Priority (Low, Normal, High, Urgent) |
| CONTENT | CLOB | NO | - | Content |
| TARGET_AUDIENCE | VARCHAR2(50) | NO | - | Target audience |
| TARGET_CLASSES | VARCHAR2(500) | YES | - | Target class IDs |
| TARGET_GRADES | VARCHAR2(255) | YES | - | Target grades |
| PUBLISH_DATE | DATE | YES | SYSDATE | Publish date |
| EXPIRY_DATE | DATE | YES | - | Expiry date |
| STATUS | VARCHAR2(20) | YES | 'Draft' | Status |
| ATTACHMENT_ID | NUMBER(10) | YES | - | Attachment ID |
| REQUIRE_ACKNOWLEDGMENT | CHAR(1) | NO | 'N' | Require acknowledgment |
| AD_NOTE_ID | NUMBER(10) | YES | - | Note ID |

---

### SCH_ANNOUNCEMENT_READ - Announcement Read Receipt

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_ANN_READ_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_ANN_READ_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_ANNOUNCEMENT_ID | NUMBER(10) | NO | - | Announcement ID |
| C_BPARTNER_ID | NUMBER(10) | NO | - | Business partner ID |
| READ_DATE | DATE | YES | SYSDATE | Read date |
| READ_IP | VARCHAR2(50) | YES | - | Read IP |
| IS_ACKNOWLEDGED | CHAR(1) | NO | 'N' | Acknowledged |
| ACKNOWLEDGED_DATE | DATE | YES | - | Acknowledged date |

**Unique:**
- `SCH_ANNOUNCEMENT_ID`, `C_BPARTNER_ID`, `AD_CLIENT_ID`

---

### SCH_MESSAGE - Communication Messages

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_MESSAGE_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_MESSAGE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SUBJECT | VARCHAR2(200) | NO | - | Subject |
| MESSAGE_TYPE | VARCHAR2(20) | NO | - | Type (Email, SMS, Notification) |
| PRIORITY | VARCHAR2(20) | YES | 'Normal' | Priority |
| MESSAGE_BODY | CLOB | YES | - | Message body |
| SENDER_ID | NUMBER(10) | NO | - | Sender ID |
| SENDER_TYPE | VARCHAR2(20) | YES | 'System' | Sender type |
| RECIPIENT_TYPE | VARCHAR2(20) | NO | - | Recipient type |
| RECIPIENT_COUNT | NUMBER(5) | YES | - | Recipient count |
| STATUS | VARCHAR2(20) | YES | 'Pending' | Status |
| SENT_DATE | DATE | YES | - | Sent date |
| R_REQUEST_ID | NUMBER(10) | YES | - | Request ID |
| AD_NOTE_ID | NUMBER(10) | YES | - | Note ID |

---

### SCH_MESSAGE_RECIPIENT - Message Recipients

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| SCH_MSG_RECIPIENT_ID | NUMBER(10) | NO | - | Primary Key |
| SCH_MSG_RECIPIENT_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| SCH_MESSAGE_ID | NUMBER(10) | NO | - | Message ID |
| C_BPARTNER_ID | NUMBER(10) | NO | - | Business partner ID |
| RECIPIENT_TYPE | VARCHAR2(20) | YES | - | Recipient type |
| EMAIL | VARCHAR2(100) | YES | - | Email |
| PHONE | VARCHAR2(20) | YES | - | Phone |
| DELIVERY_STATUS | VARCHAR2(20) | YES | 'Pending' | Delivery status |
| DELIVERY_DATE | DATE | YES | - | Delivery date |
| DELIVERY_ATTEMPT | NUMBER(3) | YES | 0 | Delivery attempts |
| IS_READ | CHAR(1) | NO | 'N' | Read |
| READ_DATE | DATE | YES | - | Read date |
| ERROR_MESSAGE | VARCHAR2(500) | YES | - | Error message |

**Unique:**
- `SCH_MESSAGE_ID`, `C_BPARTNER_ID`, `AD_CLIENT_ID`

---

## HR Custom Tables (HR_)

### HR_EMPLOYEE - Employee Extension

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| HR_EMPLOYEE_ID | NUMBER(10) | NO | - | Primary Key |
| HR_EMPLOYEE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| C_BPARTNER_ID | NUMBER(10) | NO | - | Business partner ID |
| AD_USER_ID | NUMBER(10) | YES | - | User ID |
| EMPLOYEE_NO | VARCHAR2(20) | NO | - | Employee number |
| EMPLOYEE_TYPE | VARCHAR2(20) | YES | - | Type (Teaching, Non-Teaching, Contract) |
| IS_TEACHER | CHAR(1) | NO | 'N' | Is teacher |
| TEACHER_QUALIFICATION | VARCHAR2(100) | YES | - | Teacher qualification |
| SUBJECTS_EXPERTISE | VARCHAR2(255) | YES | - | Subjects expertise |
| JOINING_DATE | DATE | YES | - | Joining date |
| DEPARTMENT | VARCHAR2(50) | YES | - | Department |
| DESIGNATION | VARCHAR2(100) | YES | - | Designation |
| EMPLOYMENT_STATUS | VARCHAR2(20) | YES | 'Active' | Employment status |
| LEAVING_DATE | DATE | YES | - | Leaving date |
| LEAVING_REASON | VARCHAR2(255) | YES | - | Leaving reason |
| HIGHEST_QUALIFICATION | VARCHAR2(100) | YES | - | Highest qualification |
| QUALIFICATION_DETAILS | CLOB | YES | - | Qualification details |
| BANK_NAME | VARCHAR2(50) | YES | - | Bank name |
| BANK_ACCOUNT_NO | VARCHAR2(30) | YES | - | Bank account |
| BANK_ACCOUNT_NAME | VARCHAR2(100) | YES | - | Account name |
| TAX_ID | VARCHAR2(30) | YES | - | Tax ID |
| EMERGENCY_CONTACT_NAME | VARCHAR2(100) | YES | - | Emergency contact |
| EMERGENCY_CONTACT_PHONE | VARCHAR2(20) | YES | - | Emergency phone |
| EMERGENCY_CONTACT_RELATION | VARCHAR2(50) | YES | - | Emergency relation |

**Unique:**
- `EMPLOYEE_NO`, `AD_CLIENT_ID`

---

### HR_LEAVE_REQUEST - Leave Request

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| HR_LEAVE_REQUEST_ID | NUMBER(10) | NO | - | Primary Key |
| HR_LEAVE_REQUEST_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| HR_EMPLOYEE_ID | NUMBER(10) | NO | - | Employee ID |
| LEAVE_TYPE | VARCHAR2(20) | NO | - | Leave type |
| FROM_DATE | DATE | NO | - | From date |
| TO_DATE | DATE | NO | - | To date |
| TOTAL_DAYS | NUMBER(5) | NO | - | Total days |
| REASON | VARCHAR2(500) | YES | - | Reason |
| CONTACT_ADDRESS | VARCHAR2(255) | YES | - | Contact address |
| CONTACT_PHONE | VARCHAR2(20) | YES | - | Contact phone |
| SUBSTITUTE_EMPLOYEE_ID | NUMBER(10) | YES | - | Substitute employee |
| HANDOVER_NOTES | CLOB | YES | - | Handover notes |
| STATUS | VARCHAR2(20) | YES | 'Pending' | Status |
| APPROVED_BY | NUMBER(10) | YES | - | Approved by |
| APPROVED_DATE | DATE | YES | - | Approved date |
| APPROVAL_REMARKS | VARCHAR2(255) | YES | - | Approval remarks |
| RETURN_DATE | DATE | YES | - | Return date |
| RETURN_REMARKS | VARCHAR2(255) | YES | - | Return remarks |
| ATTACHMENT_ID | NUMBER(10) | YES | - | Attachment ID |

---

### HR_LEAVE_BALANCE - Leave Balance

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| HR_LEAVE_BALANCE_ID | NUMBER(10) | NO | - | Primary Key |
| HR_LEAVE_BALANCE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| HR_EMPLOYEE_ID | NUMBER(10) | NO | - | Employee ID |
| LEAVE_TYPE | VARCHAR2(20) | NO | - | Leave type |
| ACADEMIC_YEAR | VARCHAR2(10) | NO | - | Academic year |
| ALLOTTED_DAYS | NUMBER(5) | YES | 12 | Allotted days |
| USED_DAYS | NUMBER(5) | YES | 0 | Used days |
| PENDING_DAYS | NUMBER(5) | YES | 0 | Pending days |
| CARRIED_FORWARD_DAYS | NUMBER(5) | YES | 0 | Carried forward |

**Unique:**
- `HR_EMPLOYEE_ID`, `LEAVE_TYPE`, `ACADEMIC_YEAR`, `AD_CLIENT_ID`

---

### HR_PAYROLL - Payroll Header

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| HR_PAYROLL_ID | NUMBER(10) | NO | - | Primary Key |
| HR_PAYROLL_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Payroll name |
| PAYROLL_TYPE | VARCHAR2(20) | YES | 'Monthly' | Payroll type |
| PAYROLL_YEAR | NUMBER(4) | NO | - | Payroll year |
| PAYROLL_MONTH | NUMBER(2) | NO | - | Payroll month |
| FROM_DATE | DATE | NO | - | From date |
| TO_DATE | DATE | NO | - | To date |
| PAY_DATE | DATE | YES | - | Pay date |
| STATUS | VARCHAR2(20) | YES | 'Draft' | Status |
| PROCESSED_DATE | DATE | YES | - | Processed date |
| POSTED_DATE | DATE | YES | - | Posted date |
| TOTAL_EMPLOYEES | NUMBER(3) | YES | 0 | Total employees |
| TOTAL_GROSS_PAY | NUMBER(15,2) | YES | 0 | Total gross |
| TOTAL_DEDUCTIONS | NUMBER(15,2) | YES | 0 | Total deductions |
| TOTAL_NET_PAY | NUMBER(15,2) | YES | 0 | Total net |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| PROCESSING_LOG | CLOB | YES | - | Processing log |

---

### HR_PAYROLL_LINE - Payroll Line

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| HR_PAYROLL_LINE_ID | NUMBER(10) | NO | - | Primary Key |
| HR_PAYROLL_LINE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| HR_PAYROLL_ID | NUMBER(10) | NO | - | Payroll ID |
| HR_EMPLOYEE_ID | NUMBER(10) | NO | - | Employee ID |
| BASIC_SALARY | NUMBER(15,2) | NO | - | Basic salary |
| WORKING_DAYS | NUMBER(3) | YES | 22 | Working days |
| PAID_DAYS | NUMBER(3) | YES | 22 | Paid days |
| HOUSING_ALLOWANCE | NUMBER(15,2) | YES | 0 | Housing allowance |
| TRANSPORT_ALLOWANCE | NUMBER(15,2) | YES | 0 | Transport allowance |
| MEDICAL_ALLOWANCE | NUMBER(15,2) | YES | 0 | Medical allowance |
| OTHER_ALLOWANCE | NUMBER(15,2) | YES | 0 | Other allowance |
| TOTAL_ALLOWANCES | NUMBER(15,2) | YES | 0 | Total allowances |
| TAX_DEDUCTION | NUMBER(15,2) | YES | 0 | Tax deduction |
| INSURANCE_DEDUCTION | NUMBER(15,2) | YES | 0 | Insurance deduction |
| OTHER_DEDUCTIONS | NUMBER(15,2) | YES | 0 | Other deductions |
| TOTAL_DEDUCTIONS | NUMBER(15,2) | YES | 0 | Total deductions |
| GROSS_PAY | NUMBER(15,2) | YES | - | Gross pay |
| NET_PAY | NUMBER(15,2) | YES | - | Net pay |
| PAYMENT_METHOD | VARCHAR2(20) | YES | - | Payment method |
| BANK_ACCOUNT_NO | VARCHAR2(30) | YES | - | Bank account |
| PAYMENT_REFERENCE | VARCHAR2(50) | YES | - | Payment reference |
| IS_PAID | CHAR(1) | NO | 'N' | Paid |
| PAID_DATE | DATE | YES | - | Paid date |

**Unique:**
- `HR_PAYROLL_ID`, `HR_EMPLOYEE_ID`, `AD_CLIENT_ID`

---

## Library Tables (LIB_)

### LIB_BOOK_CATEGORY - Book Category

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_CATEGORY_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_CATEGORY_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| NAME | VARCHAR2(100) | NO | - | Category name |
| CODE | VARCHAR2(20) | NO | - | Category code |
| PARENT_CATEGORY_ID | NUMBER(10) | YES | - | Parent category (self-ref) |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |

**Unique:**
- `CODE`, `AD_CLIENT_ID`

---

### LIB_BOOK - Book/Bibliography

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_BOOK_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_BOOK_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| ISBN | VARCHAR2(20) | YES | - | ISBN |
| TITLE | VARCHAR2(255) | NO | - | Title |
| SUBTITLE | VARCHAR2(255) | YES | - | Subtitle |
| EDITION | VARCHAR2(50) | YES | - | Edition |
| AUTHOR | VARCHAR2(255) | NO | - | Author |
| CO_AUTHORS | VARCHAR2(500) | YES | - | Co-authors |
| PUBLISHER | VARCHAR2(150) | YES | - | Publisher |
| PUBLICATION_YEAR | NUMBER(4) | YES | - | Publication year |
| PUBLICATION_PLACE | VARCHAR2(100) | YES | - | Publication place |
| PAGES | NUMBER(5) | YES | - | Pages |
| LANGUAGE | VARCHAR2(50) | YES | 'Indonesian' | Language |
| LIB_CATEGORY_ID | NUMBER(10) | YES | - | Category ID |
| CALL_NUMBER | VARCHAR2(50) | YES | - | Call number |
| SUBJECT_KEYWORDS | VARCHAR2(500) | YES | - | Subject keywords |
| TOTAL_COPIES | NUMBER(3) | YES | 1 | Total copies |
| AVAILABLE_COPIES | NUMBER(3) | YES | 1 | Available copies |
| ACQUISITION_DATE | DATE | YES | - | Acquisition date |
| ACQUISITION_SOURCE | VARCHAR2(100) | YES | - | Acquisition source |
| SUPPLIER | VARCHAR2(150) | YES | - | Supplier |
| PRICE | NUMBER(10,2) | YES | - | Price |
| A_ASSET_ID | NUMBER(10) | YES | - | Asset ID |
| BOOK_STATUS | VARCHAR2(20) | YES | 'Available' | Status |
| DESCRIPTION | VARCHAR2(500) | YES | - | Description |
| NOTES | VARCHAR2(500) | YES | - | Notes |

---

### LIB_BOOK_COPY - Book Copy

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_BOOK_COPY_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_BOOK_COPY_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| LIB_BOOK_ID | NUMBER(10) | NO | - | Book ID |
| COPY_NUMBER | NUMBER(3) | NO | - | Copy number |
| BARCODE | VARCHAR2(50) | NO | - | Barcode |
| ACCESSION_NO | VARCHAR2(50) | YES | - | Accession number |
| COPY_STATUS | VARCHAR2(20) | YES | 'Available' | Status |
| CONDITION | VARCHAR2(20) | YES | 'Good' | Condition |
| CONDITION_NOTES | VARCHAR2(255) | YES | - | Condition notes |
| LOCATION | VARCHAR2(50) | YES | - | Location |
| SHELF | VARCHAR2(20) | YES | - | Shelf |
| ROW | VARCHAR2(20) | YES | - | Row |

**Unique:**
- `BARCODE`
- `LIB_BOOK_ID`, `COPY_NUMBER`, `AD_CLIENT_ID`

---

### LIB_LOAN - Loan Transaction

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_LOAN_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_LOAN_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| LIB_BOOK_COPY_ID | NUMBER(10) | NO | - | Book copy ID |
| SCH_STUDENT_ID | NUMBER(10) | YES | - | Student ID |
| HR_EMPLOYEE_ID | NUMBER(10) | YES | - | Employee ID |
| C_BPARTNER_ID | NUMBER(10) | YES | - | Business partner ID |
| LOAN_NO | VARCHAR2(20) | NO | - | Loan number |
| LOAN_DATE | DATE | NO | SYSDATE | Loan date |
| DUE_DATE | DATE | NO | - | Due date |
| RETURN_DATE | DATE | YES | - | Return date |
| RETURNED_BY | NUMBER(10) | YES | - | Returned by |
| RECEIVED_CONDITION | VARCHAR2(20) | YES | - | Received condition |
| LOAN_STATUS | VARCHAR2(20) | YES | 'Active' | Loan status |
| RENEWAL_COUNT | NUMBER(2) | YES | 0 | Renewal count |
| MAX_RENEWALS | NUMBER(2) | YES | 2 | Max renewals |
| HAS_FINE | CHAR(1) | NO | 'N' | Has fine |
| FINE_AMOUNT | NUMBER(10,2) | YES | 0 | Fine amount |
| FINE_PAID | CHAR(1) | NO | 'N' | Fine paid |
| FINE_WAIVED | CHAR(1) | NO | 'N' | Fine waived |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

**Unique:**
- `LOAN_NO`, `AD_CLIENT_ID`

---

### LIB_FINE - Fine Record

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_FINE_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_FINE_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| LIB_LOAN_ID | NUMBER(10) | NO | - | Loan ID |
| FINE_DATE | DATE | NO | SYSDATE | Fine date |
| DAYS_OVERDUE | NUMBER(5) | NO | - | Days overdue |
| FINE_RATE_PER_DAY | NUMBER(10,2) | NO | - | Fine rate |
| TOTAL_FINE | NUMBER(10,2) | NO | - | Total fine |
| FINE_STATUS | VARCHAR2(20) | YES | 'Unpaid' | Fine status |
| PAID_AMOUNT | NUMBER(10,2) | YES | 0 | Paid amount |
| PAID_DATE | DATE | YES | - | Paid date |
| PAYMENT_METHOD | VARCHAR2(20) | YES | - | Payment method |
| PAYMENT_REFERENCE | VARCHAR2(50) | YES | - | Payment reference |
| IS_WAIVED | CHAR(1) | NO | 'N' | Waived |
| WAIVED_BY | NUMBER(10) | YES | - | Waived by |
| WAIVED_DATE | DATE | YES | - | Waived date |
| WAIVER_REASON | VARCHAR2(255) | YES | - | Waiver reason |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

---

### LIB_RESERVATION - Book Reservation

| Column | Data Type | Nullable | Default | Description |
|--------|-----------|----------|---------|-------------|
| LIB_RESERVATION_ID | NUMBER(10) | NO | - | Primary Key |
| LIB_RESERVATION_UU | VARCHAR2(36) | YES | - | UUID |
| AD_CLIENT_ID | NUMBER(10) | NO | - | Client ID |
| AD_ORG_ID | NUMBER(10) | NO | - | Organization ID |
| ISACTIVE | CHAR(1) | NO | 'Y' | Active status |
| CREATED | DATE | NO | SYSDATE | Created date |
| CREATEDBY | NUMBER(10) | NO | - | Created by |
| UPDATED | DATE | NO | SYSDATE | Updated date |
| UPDATEDBY | NUMBER(10) | NO | - | Updated by |
| LIB_BOOK_ID | NUMBER(10) | NO | - | Book ID |
| SCH_STUDENT_ID | NUMBER(10) | YES | - | Student ID |
| HR_EMPLOYEE_ID | NUMBER(10) | YES | - | Employee ID |
| C_BPARTNER_ID | NUMBER(10) | YES | - | Business partner ID |
| RESERVATION_DATE | DATE | NO | SYSDATE | Reservation date |
| EXPIRY_DATE | DATE | NO | - | Expiry date |
| STATUS | VARCHAR2(20) | YES | 'Pending' | Status |
| NOTIFIED_DATE | DATE | YES | - | Notified date |
| NOTIFIED | CHAR(1) | NO | 'N' | Notified |
| REMARKS | VARCHAR2(255) | YES | - | Remarks |

---

## Summary

### Table Statistics

| Category | Tables | Columns (est) |
|----------|--------|---------------|
| Academic Core (SCH_) | 28 | ~700 |
| HR Custom (HR_) | 5 | ~100 |
| Library (LIB_) | 6 | ~108 |
| **Total** | **39** | **~908** |

### Mandatory Columns

All tables include these standard iDempiere columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `<TABLE>_ID` | NUMBER(10) | YES | Primary Key |
| `<TABLE>_UU` | VARCHAR2(36) | NO | UUID for replication |
| `AD_CLIENT_ID` | NUMBER(10) | YES | Client/Tenant |
| `AD_ORG_ID` | NUMBER(10) | YES | Organization |
| `ISACTIVE` | CHAR(1) | YES | Active status (Y/N) |
| `CREATED` | DATE | YES | Created timestamp |
| `CREATEDBY` | NUMBER(10) | YES | Created by user |
| `UPDATED` | DATE | YES | Updated timestamp |
| `UPDATEDBY` | NUMBER(10) | YES | Updated by user |

### Data Type Reference

| Data Type | Description | Example |
|-----------|-------------|---------|
| `NUMBER(10)` | ID/Foreign Key | 1000000 |
| `NUMBER(5,2)` | Decimal values | 75.50 |
| `NUMBER(3)` | Small count | 40 |
| `VARCHAR2(n)` | String | 'John Doe' |
| `CHAR(1)` | Flag (Y/N) | 'Y' |
| `DATE` | Date | SYSDATE |
| `CLOB` | Large text | Long description |

---

**Document Version:** 1.0
**Last Updated:** 2025-01-24
**Author:** School Management System Development Team
