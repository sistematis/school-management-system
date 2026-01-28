# Academic Module - Implementation Guide

**Module:** Academic Management
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Implementation Phases](#implementation-phases)
2. [Phase 1: Student Management](#phase-1-student-management)
3. [Phase 2: Curriculum & Subjects](#phase-2-curriculum--subjects)
4. [Phase 3: Class Management](#phase-3-class-management)
5. [Phase 4: Timetable & Scheduling](#phase-4-timetable--scheduling)
6. [Phase 5: Attendance](#phase-5-attendance)
7. [Phase 6: Grades & Exams](#phase-6-grades--exams)
8. [Phase 7: Portals](#phase-7-portals)
9. [Testing Checklist](#testing-checklist)

---

## Implementation Phases

### Phase Overview

| Phase | Feature | Priority | Estimated Effort | Dependencies |
|-------|---------|----------|------------------|--------------|
| 1 | Student Management | High | 3 days | iDempiere C_BPARTNER |
| 2 | Curriculum & Subjects | High | 2 days | - |
| 3 | Class Management | High | 2 days | Phase 1, 2 |
| 4 | Timetable & Scheduling | Medium | 4 days | Phase 2, 3 |
| 5 | Attendance | High | 3 days | Phase 3 |
| 6 | Grades & Exams | High | 4 days | Phase 2, 3 |
| 7 | Portals | Medium | 3 days | Phase 1 |

**Total Estimated Effort:** ~21 days

---

## Phase 1: Student Management

### 1.1 Database Setup

**Create Tables:**
```sql
-- SCH_STUDENT
CREATE TABLE SCH_STUDENT (
    SCH_STUDENT_ID          NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_STUDENT_UU          VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    STUDENT_NO              VARCHAR2(20) NOT NULL,
    C_BPARTNER_ID           NUMBER(10) NOT NULL,
    ADMISSION_NO            VARCHAR2(20),
    ADMISSION_DATE          DATE,
    ACADEMIC_YEAR           VARCHAR2(10),
    GRADE_LEVEL             VARCHAR2(20),
    CLASS_NAME              VARCHAR2(20),
    SCHOOL_TYPE             VARCHAR2(20),
    MAJOR                   VARCHAR2(50),
    DATE_OF_BIRTH           DATE,
    PLACE_OF_BIRTH          VARCHAR2(50),
    GENDER                  CHAR(1),
    BLOOD_TYPE              CHAR(2),
    RELIGION                VARCHAR2(20),
    NATIONALITY             VARCHAR2(30) DEFAULT 'Indonesian',
    ADDRESS                 VARCHAR2(255),
    CITY                    VARCHAR2(50),
    PROVINCE                VARCHAR2(50),
    POSTAL_CODE             VARCHAR2(10),
    PHONE_HOME              VARCHAR2(20),
    PHONE_MOBILE            VARCHAR2(20),
    EMAIL                   VARCHAR2(100),
    FATHER_NAME             VARCHAR2(100),
    FATHER_OCCUPATION       VARCHAR2(50),
    FATHER_PHONE            VARCHAR2(20),
    FATHER_EMAIL            VARCHAR2(100),
    MOTHER_NAME             VARCHAR2(100),
    MOTHER_OCCUPATION       VARCHAR2(50),
    MOTHER_PHONE            VARCHAR2(20),
    MOTHER_EMAIL            VARCHAR2(100),
    GUARDIAN_NAME           VARCHAR2(100),
    GUARDIAN_RELATION       VARCHAR2(20),
    GUARDIAN_PHONE          VARCHAR2(20),
    EMERGENCY_CONTACT       VARCHAR2(100),
    EMERGENCY_PHONE         VARCHAR2(20),
    PHOTO_PATH              VARCHAR2(255),
    MEDICAL_INFO            CLOB,
    ALLERGIES               VARCHAR2(255),
    ENROLLMENT_STATUS       VARCHAR2(20),
    PREVIOUS_SCHOOL         VARCHAR2(100),
    CONSTRAINT SCH_STUDENT_CLIENT UNIQUE (STUDENT_NO, AD_CLIENT_ID)
);

-- SCH_ENROLLMENT
CREATE TABLE SCH_ENROLLMENT (
    SCH_ENROLLMENT_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_ENROLLMENT_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    SCH_STUDENT_ID          NUMBER(10) NOT NULL,
    ACADEMIC_YEAR           VARCHAR2(10) NOT NULL,
    SEMESTER                VARCHAR2(10) NOT NULL,
    GRADE_LEVEL             VARCHAR2(20) NOT NULL,
    CLASS_NAME              VARCHAR2(20) NOT NULL,
    SCHOOL_TYPE             VARCHAR2(20),
    MAJOR                   VARCHAR2(50),
    ENROLLMENT_DATE         DATE,
    COMPLETION_DATE         DATE,
    ENROLLMENT_STATUS       VARCHAR2(20),
    GRADUATION_DATE         DATE,
    REMARKS                 VARCHAR2(255),
    DESCRIPTION             VARCHAR2(255),
    CONSTRAINT SCH_ENROLLMENT_UQ UNIQUE (SCH_STUDENT_ID, ACADEMIC_YEAR, SEMESTER, AD_CLIENT_ID)
);

-- SCH_STUDENT_PARENT
CREATE TABLE SCH_STUDENT_PARENT (
    SCH_STUDENT_PARENT_ID   NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_STUDENT_PARENT_UU   VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    SCH_STUDENT_ID          NUMBER(10) NOT NULL,
    C_BPARTNER_ID           NUMBER(10) NOT NULL,
    RELATIONSHIP_TYPE       VARCHAR2(20) NOT NULL,
    IS_PRIMARY_CONTACT      CHAR(1) DEFAULT 'N',
    IS_EMERGENCY_CONTACT    CHAR(1) DEFAULT 'N',
    HAS_PORTAL_ACCESS       CHAR(1) DEFAULT 'Y',
    PORTAL_USERNAME         VARCHAR2(50)
);

-- Create indexes
CREATE INDEX SCH_STUDENT_UU_IDX ON SCH_STUDENT(SCH_STUDENT_UU);
CREATE INDEX SCH_STUDENT_NO_IDX ON SCH_STUDENT(STUDENT_NO);
CREATE INDEX SCH_STUDENT_BP_IDX ON SCH_STUDENT(C_BPARTNER_ID);
CREATE INDEX SCH_STUDENT_CLIENT_IDX ON SCH_STUDENT(AD_CLIENT_ID);

CREATE INDEX SCH_ENROLLMENT_STUDENT_IDX ON SCH_ENROLLMENT(SCH_STUDENT_ID);
CREATE INDEX SCH_ENROLLMENT_YEAR_IDX ON SCH_ENROLLMENT(ACADEMIC_YEAR);

CREATE INDEX SCH_STUDENT_PARENT_STUDENT_IDX ON SCH_STUDENT_PARENT(SCH_STUDENT_ID);
CREATE INDEX SCH_STUDENT_PARENT_BP_IDX ON SCH_STUDENT_PARENT(C_BPARTNER_ID);
```

### 1.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/academic/students` - List students
- [x] `GET /api/v1/academic/students/{id}` - Get student detail
- [x] `POST /api/v1/academic/students` - Create student
- [x] `PUT /api/v1/academic/students/{id}` - Update student
- [x] `DELETE /api/v1/academic/students/{id}` - Delete student (soft delete)
- [x] `GET /api/v1/academic/students/{id}/enrollments` - Get enrollment history
- [x] `POST /api/v1/academic/students/{id}/enrollments` - Create enrollment

### 1.3 Frontend Components

**Required Pages:**
- `/academic/students` - Student list with search/filter
- `/academic/students/[id]` - Student detail/profile
- `/academic/students/new` - Create new student
- `/academic/students/[id]/edit` - Edit student
- `/academic/students/[id]/enrollments` - Enrollment management

### 1.4 Seed Data

**File:** `docs/api/academic/seed/students.json`

```json
[
  {
    "studentNo": "2024001",
    "name": "Ahmad Rizky",
    "gradeLevel": "10",
    "className": "X-A",
    "schoolType": "SMA",
    "major": "IPA",
    "dateOfBirth": "2008-05-15",
    "gender": "M",
    "email": "ahmad.rizky@student.sch.id",
    "phoneMobile": "081234567001"
  },
  {
    "studentNo": "2024002",
    "name": "Sarah Putri",
    "gradeLevel": "10",
    "className": "X-A",
    "schoolType": "SMA",
    "major": "IPA",
    "dateOfBirth": "2008-03-20",
    "gender": "F",
    "email": "sarah.putri@student.sch.id",
    "phoneMobile": "081234567002"
  }
]
```

---

## Phase 2: Curriculum & Subjects

### 2.1 Database Setup

**Create Tables:**
```sql
-- SCH_CURRICULUM
CREATE TABLE SCH_CURRICULUM (
    SCH_CURRICULUM_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_CURRICULUM_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    NAME                    VARCHAR2(100) NOT NULL,
    DESCRIPTION             VARCHAR2(500),
    CURRICULUM_TYPE         VARCHAR2(20) NOT NULL,
    SCHOOL_TYPE             VARCHAR2(20) NOT NULL,
    EDUCATION_LEVEL         VARCHAR2(20),
    MAJOR                   VARCHAR2(50),
    ACADEMIC_YEAR           VARCHAR2(10) NOT NULL,
    VERSION                 VARCHAR2(20),
    IS_APPROVED             CHAR(1) DEFAULT 'N',
    APPROVED_DATE           DATE,
    APPROVEDBY              NUMBER(10),
    EFFECTIVE_DATE          DATE,
    EXPIRY_DATE             DATE,
    C_PROJECT_ID            NUMBER(10)
);

-- SCH_SUBJECT
CREATE TABLE SCH_SUBJECT (
    SCH_SUBJECT_ID          NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_SUBJECT_UU          VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    CODE                    VARCHAR2(20) NOT NULL,
    NAME                    VARCHAR2(100) NOT NULL,
    NAME_ENGLISH            VARCHAR2(100),
    SUBJECT_TYPE            VARCHAR2(20),
    SUBJECT_CATEGORY        VARCHAR2(50),
    CREDIT_HOURS            NUMBER(5,2),
    WEEKLY_HOURS            NUMBER(5,2),
    THEORY_HOURS            NUMBER(5,2),
    PRACTICAL_HOURS         NUMBER(5,2),
    GRADE_LEVEL_FROM        VARCHAR2(20),
    GRADE_LEVEL_TO          VARCHAR2(20),
    SCHOOL_TYPE             VARCHAR2(20),
    MAJOR                   VARCHAR2(50),
    DESCRIPTION             VARCHAR2(500),
    LEARNING_OUTCOMES       CLOB,
    PREREQUISITES           VARCHAR2(255),
    PASSING_SCORE           NUMBER(5,2) DEFAULT 75.00,
    GRADING_SCALE           VARCHAR2(20),
    CONSTRAINT SCH_SUBJECT_CODE UNIQUE (CODE, AD_CLIENT_ID)
);

-- SCH_CURRICULUM_SUBJECT
CREATE TABLE SCH_CURRICULUM_SUBJECT (
    SCH_CURRICULUM_SUBJECT_ID NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_CURRICULUM_SUBJECT_UU VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID            NUMBER(10) NOT NULL,
    AD_ORG_ID               NUMBER(10) NOT NULL,
    ISACTIVE                CHAR(1) DEFAULT 'Y',
    CREATED                 DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY               NUMBER(10) NOT NULL,
    UPDATED                 DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY               NUMBER(10) NOT NULL,
    SCH_CURRICULUM_ID       NUMBER(10) NOT NULL,
    SCH_SUBJECT_ID          NUMBER(10) NOT NULL,
    GRADE_LEVEL             VARCHAR2(20) NOT NULL,
    SEMESTER                VARCHAR2(10) NOT NULL,
    SEQUENCE_NO             NUMBER(5),
    WEEKLY_HOURS            NUMBER(5,2),
    THEORY_HOURS            NUMBER(5,2),
    PRACTICAL_HOURS         NUMBER(5,2),
    CREDIT_HOURS            NUMBER(5,2),
    IS_MANDATORY            CHAR(1) DEFAULT 'Y',
    DESCRIPTION             VARCHAR2(255),
    CONSTRAINT SCH_CURR_SUBJECT_UQ UNIQUE (SCH_CURRICULUM_ID, SCH_SUBJECT_ID, GRADE_LEVEL, SEMESTER, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX SCH_SUBJECT_CODE_IDX ON SCH_SUBJECT(CODE);
CREATE INDEX SCH_CURRICULUM_SUBJECT_CURR_IDX ON SCH_CURRICULUM_SUBJECT(SCH_CURRICULUM_ID);
CREATE INDEX SCH_CURRICULUM_SUBJECT_SUBJ_IDX ON SCH_CURRICULUM_SUBJECT(SCH_SUBJECT_ID);
```

### 2.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/academic/curricula` - List curricula
- [x] `GET /api/v1/academic/curricula/{id}` - Get curriculum with subjects
- [x] `POST /api/v1/academic/curricula` - Create curriculum
- [x] `GET /api/v1/academic/subjects` - List subjects
- [x] `POST /api/v1/academic/subjects` - Create subject

### 2.3 Frontend Components

**Required Pages:**
- `/academic/curricula` - Curriculum list
- `/academic/curricula/[id]` - Curriculum detail with subjects
- `/academic/subjects` - Subject master data
- `/academic/subjects/new` - Create new subject

### 2.4 Seed Data

**File:** `docs/api/academic/seed/subjects.json`

```json
[
  {
    "code": "MAT",
    "name": "Matematika",
    "nameEnglish": "Mathematics",
    "subjectType": "Core",
    "subjectCategory": "Academic",
    "creditHours": 4,
    "weeklyHours": 4,
    "theoryHours": 3,
    "practicalHours": 1,
    "gradeLevelFrom": "10",
    "gradeLevelTo": "12",
    "schoolType": "SMA",
    "major": "IPA",
    "passingScore": 75.0
  },
  {
    "code": "FIS",
    "name": "Fisika",
    "nameEnglish": "Physics",
    "subjectType": "Core",
    "subjectCategory": "Academic",
    "creditHours": 3,
    "weeklyHours": 3,
    "theoryHours": 2,
    "practicalHours": 1,
    "gradeLevelFrom": "10",
    "gradeLevelTo": "12",
    "schoolType": "SMA",
    "major": "IPA",
    "passingScore": 75.0
  }
]
```

---

## Phase 3: Class Management

### 3.1 Database Setup

**Create Tables:**
```sql
-- SCH_CLASS
CREATE TABLE SCH_CLASS (
    SCH_CLASS_ID           NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_CLASS_UU           VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    CLASS_NAME             VARCHAR2(20) NOT NULL,
    GRADE_LEVEL            VARCHAR2(20) NOT NULL,
    SCHOOL_TYPE            VARCHAR2(20) NOT NULL,
    MAJOR                  VARCHAR2(50),
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    CAPACITY               NUMBER(3) DEFAULT 40,
    CURRENT_ENROLLMENT     NUMBER(3) DEFAULT 0,
    HOMEROOM_TEACHER_ID    NUMBER(10),
    CLASSROOM              VARCHAR2(50),
    BUILDING               VARCHAR2(50),
    CLASS_STATUS           VARCHAR2(20),
    DESCRIPTION            VARCHAR2(255),
    CONSTRAINT SCH_CLASS_UQ UNIQUE (CLASS_NAME, ACADEMIC_YEAR, SEMESTER, AD_CLIENT_ID)
);

-- SCH_CLASS_STUDENT
CREATE TABLE SCH_CLASS_STUDENT (
    SCH_CLASS_STUDENT_ID   NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_CLASS_STUDENT_UU   VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_CLASS_ID           NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10) NOT NULL,
    SCH_ENROLLMENT_ID      NUMBER(10),
    ROLL_NUMBER            NUMBER(3),
    ASSIGNMENT_DATE        DATE,
    STATUS                 VARCHAR2(20),
    CONSTRAINT SCH_CLASS_STUDENT_UQ UNIQUE (SCH_CLASS_ID, SCH_STUDENT_ID, AD_CLIENT_ID)
);

-- SCH_TEACHER_SUBJECT
CREATE TABLE SCH_TEACHER_SUBJECT (
    SCH_TEACHER_SUBJECT_ID NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_TEACHER_SUBJECT_UU VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    AD_USER_ID             NUMBER(10) NOT NULL,
    SCH_SUBJECT_ID         NUMBER(10) NOT NULL,
    SCH_CLASS_ID           NUMBER(10) NOT NULL,
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    WEEKLY_HOURS           NUMBER(5,2),
    IS_PRIMARY             CHAR(1) DEFAULT 'N',
    STATUS                 VARCHAR2(20),
    CONSTRAINT SCH_TEACHER_SUBJECT_UQ UNIQUE (AD_USER_ID, SCH_SUBJECT_ID, SCH_CLASS_ID, ACADEMIC_YEAR, SEMESTER, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX SCH_CLASS_NAME_IDX ON SCH_CLASS(CLASS_NAME, ACADEMIC_YEAR, SEMESTER);
CREATE INDEX SCH_CLASS_HOMEROOM_IDX ON SCH_CLASS(HOMEROOM_TEACHER_ID);
CREATE INDEX SCH_CLASS_STUDENT_CLASS_IDX ON SCH_CLASS_STUDENT(SCH_CLASS_ID);
CREATE INDEX SCH_CLASS_STUDENT_STUDENT_IDX ON SCH_CLASS_STUDENT(SCH_STUDENT_ID);
CREATE INDEX SCH_TEACHER_SUBJECT_TEACHER_IDX ON SCH_TEACHER_SUBJECT(AD_USER_ID);
```

### 3.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/academic/classes` - List classes
- [x] `GET /api/v1/academic/classes/{id}` - Get class detail with students
- [x] `POST /api/v1/academic/classes` - Create class
- [x] `POST /api/v1/academic/classes/{id}/students` - Add student to class
- [x] `DELETE /api/v1/academic/classes/{id}/students/{studentId}` - Remove student from class

### 3.3 Frontend Components

**Required Pages:**
- `/academic/classes` - Class list
- `/academic/classes/[id]` - Class detail with student list
- `/academic/classes/new` - Create new class
- `/academic/classes/[id]/students` - Manage class students

### 3.4 Seed Data

**File:** `docs/api/academic/seed/classes.json`

```json
[
  {
    "className": "X-A",
    "gradeLevel": "10",
    "schoolType": "SMA",
    "academicYear": "2024/2025",
    "semester": "1",
    "capacity": 40,
    "currentEnrollment": 35,
    "classroom": "R-101",
    "building": "Main"
  },
  {
    "className": "X-B",
    "gradeLevel": "10",
    "schoolType": "SMA",
    "academicYear": "2024/2025",
    "semester": "1",
    "capacity": 40,
    "currentEnrollment": 38,
    "classroom": "R-102",
    "building": "Main"
  }
]
```

---

## Phase 4: Timetable & Scheduling

### 4.1 Database Setup

**Create Tables:**
```sql
-- SCH_TIME_SLOT
CREATE TABLE SCH_TIME_SLOT (
    SCH_TIME_SLOT_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_TIME_SLOT_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(50) NOT NULL,
    CODE                   VARCHAR2(20),
    SEQUENCE_NO            NUMBER(3) NOT NULL,
    START_TIME             VARCHAR2(5) NOT NULL,
    END_TIME               VARCHAR2(5) NOT NULL,
    SLOT_TYPE              VARCHAR2(20) NOT NULL,
    DURATION_MINUTES       NUMBER(5) NOT NULL,
    SCHOOL_TYPE            VARCHAR2(20),
    GRADE_LEVEL_FROM       VARCHAR2(20),
    GRADE_LEVEL_TO         VARCHAR2(20),
    IS_BREAK_TIME          CHAR(1) DEFAULT 'N',
    DESCRIPTION            VARCHAR2(255),
    CONSTRAINT SCH_TIME_SLOT_UQ UNIQUE (CODE, AD_CLIENT_ID, AD_ORG_ID)
);

-- SCH_TIMETABLE
CREATE TABLE SCH_TIMETABLE (
    SCH_TIMETABLE_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_TIMETABLE_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(100) NOT NULL,
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    SCHOOL_TYPE            VARCHAR2(20) NOT NULL,
    GRADE_LEVEL            VARCHAR2(20),
    MAJOR                  VARCHAR2(50),
    EFFECTIVE_FROM         DATE NOT NULL,
    EFFECTIVE_TO           DATE,
    STATUS                 VARCHAR2(20),
    IS_PUBLISHED           CHAR(1) DEFAULT 'N',
    PUBLISHED_DATE         DATE,
    SCHEDULE_TYPE          VARCHAR2(20),
    DAYS_PATTERN           VARCHAR2(50),
    DESCRIPTION            VARCHAR2(500)
);

-- SCH_SCHEDULE
CREATE TABLE SCH_SCHEDULE (
    SCH_SCHEDULE_ID        NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_SCHEDULE_UU        VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_TIMETABLE_ID       NUMBER(10) NOT NULL,
    SCH_CLASS_ID           NUMBER(10) NOT NULL,
    SCH_SUBJECT_ID         NUMBER(10) NOT NULL,
    AD_USER_ID             NUMBER(10) NOT NULL,
    DAY_OF_WEEK            NUMBER(1) NOT NULL,
    SCH_TIME_SLOT_ID       NUMBER(10) NOT NULL,
    ROOM                   VARCHAR2(50),
    BUILDING               VARCHAR2(50),
    S_RESOURCE_ID          NUMBER(10),
    SCHEDULE_TYPE          VARCHAR2(20),
    IS_DOUBLE_PERIOD       CHAR(1) DEFAULT 'N',
    NEXT_SCHEDULE_ID       NUMBER(10),
    COLOR_CODE             VARCHAR2(20),
    STATUS                 VARCHAR2(20),
    SUBSTITUTE_TEACHER_ID  NUMBER(10),
    SUBSTITUTE_REASON      VARCHAR2(255),
    REMARKS                VARCHAR2(255),
    CONSTRAINT SCH_SCHEDULE_UQ UNIQUE (SCH_CLASS_ID, DAY_OF_WEEK, SCH_TIME_SLOT_ID, AD_CLIENT_ID)
);

-- SCH_SCHEDULE_EXCEPTION
CREATE TABLE SCH_SCHEDULE_EXCEPTION (
    SCH_EXCEPTION_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_EXCEPTION_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(100) NOT NULL,
    EXCEPTION_DATE         DATE NOT NULL,
    EXCEPTION_TYPE         VARCHAR2(20) NOT NULL,
    IS_ALL_SCHOOL          CHAR(1) DEFAULT 'Y',
    AFFECTED_CLASSES       VARCHAR2(500),
    AFFECTED_GRADES        VARCHAR2(255),
    DESCRIPTION            VARCHAR2(500),
    IS_NO_CLASSES          CHAR(1) DEFAULT 'N',
    IS_NO_EXAMS            CHAR(1) DEFAULT 'N',
    IS_RECURRING           CHAR(1) DEFAULT 'N',
    RECURRING_PATTERN      VARCHAR2(50),
    RECURRING_UNTIL        DATE,
    ACADEMIC_YEAR          VARCHAR2(10),
    CONSTRAINT SCH_EXCEPTION_UQ UNIQUE (EXCEPTION_DATE, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX SCH_TIMETABLE_YEAR_IDX ON SCH_TIMETABLE(ACADEMIC_YEAR, SEMESTER);
CREATE INDEX SCH_SCHEDULE_TIMETABLE_IDX ON SCH_SCHEDULE(SCH_TIMETABLE_ID);
CREATE INDEX SCH_SCHEDULE_CLASS_IDX ON SCH_SCHEDULE(SCH_CLASS_ID);
CREATE INDEX SCH_SCHEDULE_TEACHER_IDX ON SCH_SCHEDULE(AD_USER_ID);
CREATE INDEX SCH_EXCEPTION_DATE_IDX ON SCH_SCHEDULE_EXCEPTION(EXCEPTION_DATE);
```

### 4.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/academic/timetables` - List timetables
- [x] `GET /api/v1/academic/timetables/{id}/schedule` - Get weekly schedule
- [x] `GET /api/v1/academic/timetables/teacher/{id}` - Get teacher schedule
- [x] `GET /api/v1/academic/timetables/room/{id}` - Get room schedule

### 4.3 Frontend Components

**Required Pages:**
- `/academic/timetables` - Timetable list
- `/academic/timetables/[id]` - Weekly/daily view
- `/academic/timetables/teacher/[id]` - Teacher schedule
- `/academic/timetables/conflicts` - Conflict detection

---

## Phase 5: Attendance

### 5.1 Database Setup

**Create Tables:**
```sql
-- SCH_ATTENDANCE
CREATE TABLE SCH_ATTENDANCE (
    SCH_ATTENDANCE_ID      NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_ATTENDANCE_UU      VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_CLASS_ID           NUMBER(10) NOT NULL,
    ATTENDANCE_DATE        DATE NOT NULL,
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    SCH_TIME_SLOT_ID       NUMBER(10),
    ATTENDANCE_FOR         VARCHAR2(20),
    SCH_SUBJECT_ID         NUMBER(10),
    STATUS                 VARCHAR2(20),
    SUBMITTED_DATE         DATE,
    SUBMITTEDBY            NUMBER(10),
    APPROVED_DATE          DATE,
    APPROVEDBY             NUMBER(10),
    TOTAL_STUDENTS         NUMBER(3),
    PRESENT_COUNT          NUMBER(3),
    ABSENT_COUNT           NUMBER(3),
    LATE_COUNT             NUMBER(3),
    EXCUSED_COUNT          NUMBER(3),
    REMARKS                VARCHAR2(500),
    CONSTRAINT SCH_ATTENDANCE_UQ UNIQUE (SCH_CLASS_ID, ATTENDANCE_DATE, SCH_SUBJECT_ID, AD_CLIENT_ID)
);

-- SCH_ATTENDANCE_LINE
CREATE TABLE SCH_ATTENDANCE_LINE (
    SCH_ATT_LINE_ID        NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_ATT_LINE_UU        VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_ATTENDANCE_ID      NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10) NOT NULL,
    ATTENDANCE_STATUS      VARCHAR2(20) NOT NULL,
    CHECK_IN_TIME          VARCHAR2(5),
    CHECK_OUT_TIME         VARCHAR2(5),
    LATE_MINUTES           NUMBER(5),
    ABSENCE_REASON         VARCHAR2(255),
    IS_EXCUSED             CHAR(1) DEFAULT 'N',
    EXCUSED_REASON         VARCHAR2(255),
    HAS_PERMISSION         CHAR(1) DEFAULT 'N',
    PERMISSION_NO          VARCHAR2(50),
    PERMISSION_REASON      VARCHAR2(255),
    REMARKS                VARCHAR2(255),
    CONSTRAINT SCH_ATTENDANCE_LINE_UQ UNIQUE (SCH_ATTENDANCE_ID, SCH_STUDENT_ID, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX SCH_ATTENDANCE_DATE_IDX ON SCH_ATTENDANCE(ATTENDANCE_DATE);
CREATE INDEX SCH_ATTENDANCE_CLASS_IDX ON SCH_ATTENDANCE(SCH_CLASS_ID);
CREATE INDEX SCH_ATTENDANCE_LINE_STUDENT_IDX ON SCH_ATTENDANCE_LINE(SCH_STUDENT_ID);
```

### 5.2 API Implementation

**Required Endpoints:**
- [x] `POST /api/v1/academic/attendance/daily` - Mark attendance
- [x] `GET /api/v1/academic/attendance/summary` - Get attendance summary
- [x] `GET /api/v1/academic/attendance/student/{id}` - Get student attendance

### 5.3 Frontend Components

**Required Pages:**
- `/academic/attendance` - Attendance entry
- `/academic/attendance/summary` - Attendance reports
- `/academic/attendance/student/[id]` - Student attendance detail

---

## Phase 6: Grades & Exams

### 6.1 Database Setup

**Create Tables:**
```sql
-- SCH_EXAM_TYPE
CREATE TABLE SCH_EXAM_TYPE (
    SCH_EXAM_TYPE_ID       NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_EXAM_TYPE_UU       VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(100) NOT NULL,
    CODE                   VARCHAR2(20) NOT NULL,
    EXAM_CATEGORY          VARCHAR2(20),
    WEIGHT_PERCENTAGE      NUMBER(5,2),
    DESCRIPTION            VARCHAR2(255),
    CONSTRAINT SCH_EXAM_TYPE_UQ UNIQUE (CODE, AD_CLIENT_ID)
);

-- SCH_EXAM
CREATE TABLE SCH_EXAM (
    SCH_EXAM_ID            NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_EXAM_UU            VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    NAME                   VARCHAR2(100) NOT NULL,
    EXAM_CODE              VARCHAR2(20),
    SCH_EXAM_TYPE_ID       NUMBER(10) NOT NULL,
    SCH_SUBJECT_ID         NUMBER(10) NOT NULL,
    SCH_CLASS_ID           NUMBER(10),
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    GRADE_LEVEL            VARCHAR2(20),
    SCHOOL_TYPE            VARCHAR2(20),
    EXAM_DATE              DATE,
    START_TIME             VARCHAR2(5),
    END_TIME               VARCHAR2(5),
    DURATION_MINUTES       NUMBER(5),
    ROOM                   VARCHAR2(50),
    BUILDING               VARCHAR2(50),
    MAX_SCORE              NUMBER(5,2) DEFAULT 100.00,
    PASSING_SCORE          NUMBER(5,2) DEFAULT 75.00,
    WEIGHT_PERCENTAGE      NUMBER(5,2),
    STATUS                 VARCHAR2(20),
    DESCRIPTION            VARCHAR2(500),
    INSTRUCTIONS           CLOB
);

-- SCH_GRADE
CREATE TABLE SCH_GRADE (
    SCH_GRADE_ID           NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_GRADE_UU           VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_EXAM_ID            NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10) NOT NULL,
    SCORE                  NUMBER(5,2),
    MAX_SCORE              NUMBER(5,2),
    GRADE_STATUS           VARCHAR2(20),
    LETTER_GRADE           VARCHAR2(5),
    GPA_POINTS             NUMBER(3,2),
    REMARKS                VARCHAR2(255),
    TEACHER_COMMENTS       VARCHAR2(500),
    SUBMITTED_DATE         DATE,
    GRADED_DATE            DATE,
    GRADED_BY              NUMBER(10),
    CONSTRAINT SCH_GRADE_UQ UNIQUE (SCH_EXAM_ID, SCH_STUDENT_ID, AD_CLIENT_ID)
);

-- SCH_REPORT_CARD
CREATE TABLE SCH_REPORT_CARD (
    SCH_REPORT_CARD_ID     NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_REPORT_CARD_UU     VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10) NOT NULL,
    ACADEMIC_YEAR          VARCHAR2(10) NOT NULL,
    SEMESTER               VARCHAR2(10) NOT NULL,
    SCH_ENROLLMENT_ID      NUMBER(10),
    SCH_CLASS_ID           NUMBER(10),
    GRADE_LEVEL            VARCHAR2(20),
    GPA                    NUMBER(3,2),
    TOTAL_SCORE            NUMBER(5,2),
    MAX_SCORE              NUMBER(5,2),
    AVERAGE_SCORE          NUMBER(5,2),
    CLASS_RANK             NUMBER(3),
    TOTAL_STUDENTS         NUMBER(3),
    TOTAL_DAYS             NUMBER(3),
    PRESENT_DAYS           NUMBER(3),
    ABSENT_DAYS            NUMBER(3),
    LATE_DAYS              NUMBER(3),
    EXCUSED_DAYS           NUMBER(3),
    ATTENDANCE_PERCENTAGE  NUMBER(5,2),
    STATUS                 VARCHAR2(20),
    PUBLISHED_DATE         DATE,
    PRINCIPAL_REMARKS      VARCHAR2(500),
    CLASS_TEACHER_REMARKS  VARCHAR2(500),
    PROMOTED_TO            VARCHAR2(20),
    PROMOTION_STATUS       VARCHAR2(20),
    CONSTRAINT SCH_REPORT_CARD_UQ UNIQUE (SCH_STUDENT_ID, ACADEMIC_YEAR, SEMESTER, AD_CLIENT_ID)
);

-- SCH_REPORT_CARD_LINE
CREATE TABLE SCH_REPORT_CARD_LINE (
    SCH_RPT_CARD_LINE_ID   NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_RPT_CARD_LINE_UU   VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_REPORT_CARD_ID     NUMBER(10) NOT NULL,
    SCH_SUBJECT_ID         NUMBER(10) NOT NULL,
    WRITTEN_SCORE          NUMBER(5,2),
    PRACTICAL_SCORE        NUMBER(5,2),
    TOTAL_SCORE            NUMBER(5,2),
    MAX_SCORE              NUMBER(5,2),
    LETTER_GRADE           VARCHAR2(5),
    GRADE_POINTS           NUMBER(3,2),
    SKILLS_RATING          VARCHAR2(50),
    COMPETENCY_ACHIEVED    CHAR(1) DEFAULT 'Y',
    TOTAL_CLASSES          NUMBER(3),
    ATTENDED_CLASSES       NUMBER(3),
    ATTENDANCE_PERCENTAGE  NUMBER(5,2),
    REMARKS                VARCHAR2(255),
    CONSTRAINT SCH_RPT_CARD_LINE_UQ UNIQUE (SCH_REPORT_CARD_ID, SCH_SUBJECT_ID, AD_CLIENT_ID)
);

-- Create indexes
CREATE INDEX SCH_EXAM_TYPE_CODE_IDX ON SCH_EXAM_TYPE(CODE);
CREATE INDEX SCH_EXAM_SUBJECT_IDX ON SCH_EXAM(SCH_SUBJECT_ID);
CREATE INDEX SCH_EXAM_CLASS_IDX ON SCH_EXAM(SCH_CLASS_ID);
CREATE INDEX SCH_GRADE_EXAM_IDX ON SCH_GRADE(SCH_EXAM_ID);
CREATE INDEX SCH_GRADE_STUDENT_IDX ON SCH_GRADE(SCH_STUDENT_ID);
CREATE INDEX SCH_REPORT_CARD_STUDENT_IDX ON SCH_REPORT_CARD(SCH_STUDENT_ID);
CREATE INDEX SCH_RPT_CARD_LINE_RC_IDX ON SCH_REPORT_CARD_LINE(SCH_REPORT_CARD_ID);
```

### 6.2 API Implementation

**Required Endpoints:**
- [x] `GET /api/v1/academic/exams` - List exams
- [x] `POST /api/v1/academic/exams` - Create exam
- [x] `POST /api/v1/academic/exams/{id}/grades` - Enter grades
- [x] `POST /api/v1/academic/report-cards/generate` - Generate report card
- [x] `GET /api/v1/academic/report-cards/{id}` - Get report card

### 6.3 Frontend Components

**Required Pages:**
- `/academic/exams` - Exam list
- `/academic/exams/new` - Create exam
- `/academic/exams/[id]/grades` - Grade entry
- `/academic/report-cards` - Report card list
- `/academic/report-cards/[id]` - View report card

---

## Phase 7: Portals

### 7.1 Database Setup

**Create Tables:**
```sql
-- SCH_PARENT_ACCESS
CREATE TABLE SCH_PARENT_ACCESS (
    SCH_PARENT_ACCESS_ID   NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_PARENT_ACCESS_UU   VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_STUDENT_PARENT_ID  NUMBER(10) NOT NULL,
    PORTAL_USERNAME        VARCHAR2(50) NOT NULL,
    PORTAL_PASSWORD        VARCHAR2(255),
    PASSWORD_CHANGED       CHAR(1) DEFAULT 'N',
    LAST_PASSWORD_CHANGE   DATE,
    IS_LOCKED              CHAR(1) DEFAULT 'N',
    LOCKED_DATE            DATE,
    FAILED_LOGIN_ATTEMPTS  NUMBER(3) DEFAULT 0,
    LAST_LOGIN_DATE        DATE,
    LAST_LOGIN_IP          VARCHAR2(50),
    ACCESS_FROM_DATE       DATE,
    ACCESS_TO_DATE         DATE,
    NOTIFICATION_EMAIL     CHAR(1) DEFAULT 'Y',
    NOTIFICATION_SMS       CHAR(1) DEFAULT 'N',
    NOTIFICATION_LANGUAGE  VARCHAR2(5) DEFAULT 'id',
    CONSTRAINT SCH_PARENT_ACCESS_UQ UNIQUE (PORTAL_USERNAME)
);

-- SCH_STUDENT_PORTAL
CREATE TABLE SCH_STUDENT_PORTAL (
    SCH_STUDENT_PORTAL_ID  NUMBER(10) NOT NULL PRIMARY KEY,
    SCH_STUDENT_PORTAL_UU  VARCHAR2(36) UNIQUE,
    AD_CLIENT_ID           NUMBER(10) NOT NULL,
    AD_ORG_ID              NUMBER(10) NOT NULL,
    ISACTIVE               CHAR(1) DEFAULT 'Y',
    CREATED                DATE DEFAULT SYSDATE NOT NULL,
    CREATEDBY              NUMBER(10) NOT NULL,
    UPDATED                DATE DEFAULT SYSDATE NOT NULL,
    UPDATEDBY              NUMBER(10) NOT NULL,
    SCH_STUDENT_ID         NUMBER(10) NOT NULL,
    PORTAL_USERNAME        VARCHAR2(50) NOT NULL,
    PORTAL_PASSWORD        VARCHAR2(255),
    PASSWORD_CHANGED       CHAR(1) DEFAULT 'N',
    LAST_PASSWORD_CHANGE   DATE,
    IS_LOCKED              CHAR(1) DEFAULT 'N',
    LOCKED_DATE            DATE,
    FAILED_LOGIN_ATTEMPTS  NUMBER(3) DEFAULT 0,
    LAST_LOGIN_DATE        DATE,
    LAST_LOGIN_IP          VARCHAR2(50),
    ACCESS_FROM_DATE       DATE,
    ACCESS_TO_DATE         DATE,
    NOTIFICATION_EMAIL     CHAR(1) DEFAULT 'Y',
    NOTIFICATION_SMS       CHAR(1) DEFAULT 'N',
    NOTIFICATION_LANGUAGE  VARCHAR2(5) DEFAULT 'id',
    CONSTRAINT SCH_STUDENT_PORTAL_UQ UNIQUE (PORTAL_USERNAME)
);

-- Create indexes
CREATE INDEX SCH_PARENT_ACCESS_STUDENT_IDX ON SCH_PARENT_ACCESS(SCH_STUDENT_PARENT_ID);
CREATE INDEX SCH_STUDENT_PORTAL_STUDENT_IDX ON SCH_STUDENT_PORTAL(SCH_STUDENT_ID);
```

### 7.2 API Implementation

**Required Endpoints:**
- [x] `POST /api/v1/academic/portals/parent/login` - Parent portal login
- [x] `POST /api/v1/academic/portals/student/login` - Student portal login
- [x] `GET /api/v1/academic/portals/parent/children` - Get parent's children
- [x] `GET /api/v1/academic/portals/student/dashboard` - Student dashboard data

### 7.3 Frontend Components

**Required Pages:**
- `/portal/parent` - Parent portal login
- `/portal/parent/dashboard` - Parent dashboard
- `/portal/parent/children/[id]` - Child details
- `/portal/student` - Student portal login
- `/portal/student/dashboard` - Student dashboard
- `/portal/student/grades` - Student grades
- `/portal/student/schedule` - Student schedule

---

## Testing Checklist

### Database Testing

- [ ] All tables created successfully
- [ ] All indexes created successfully
- [ ] All unique constraints working
- [ ] Foreign key relationships working
- [ ] Cascade delete working correctly
- [ ] Soft delete (ISACTIVE flag) working

### API Testing

- [ ] List endpoints return correct data
- [ ] Detail endpoints return complete data
- [ ] Create endpoints insert data correctly
- [ ] Update endpoints modify data correctly
- [ ] Delete endpoints soft delete correctly
- [ ] Filter queries working correctly
- [ ] Pagination working correctly
- [ ] Expands (joins) working correctly

### Frontend Testing

- [ ] All pages accessible
- [ ] Forms validate correctly
- [ ] Search/filter working
- [ ] Pagination working
- [ ] Error handling working
- [ ] Loading states working

### Integration Testing

- [ ] Student creation with BP creation
- [ ] Enrollment creation
- [ ] Class assignment
- [ ] Teacher assignment
- [ ] Attendance marking
- [ ] Grade entry
- [ ] Report card generation

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Mapping](./api-mapping.md)
- [API Specification](../api/academic/academic-module.md)
