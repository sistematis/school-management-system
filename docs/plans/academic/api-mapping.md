# Academic Module - API Mapping

**Module:** Academic Management
**Base URL:** `/api/v1/academic`
**Last Updated:** 2025-01-28

---

## Table of Contents

1. [Overview](#overview)
2. [Students API](#students-api)
3. [Enrollment API](#enrollment-api)
4. [Curriculum API](#curriculum-api)
5. [Subjects API](#subjects-api)
6. [Classes API](#classes-api)
7. [Timetable API](#timetable-api)
8. [Attendance API](#attendance-api)
9. [Grades & Exams API](#grades--exams-api)
10. [Report Cards API](#report-cards-api)

---

## Overview

### API to Database Table Mapping

| API Endpoint | Primary Table | Related Tables |
|-------------|---------------|----------------|
| `GET/POST /students` | `SCH_STUDENT` | `C_BPARTNER` |
| `GET/POST /students/{id}/enrollments` | `SCH_ENROLLMENT` | `SCH_STUDENT` |
| `GET /curricula` | `SCH_CURRICULUM` | `SCH_CURRICULUM_SUBJECT`, `SCH_SUBJECT` |
| `GET/POST /subjects` | `SCH_SUBJECT` | - |
| `GET /classes` | `SCH_CLASS` | `AD_USER` (Homeroom) |
| `GET /classes/{id}/students` | `SCH_CLASS_STUDENT` | `SCH_CLASS`, `SCH_STUDENT` |
| `GET /timetables` | `SCH_TIMETABLE` | `SCH_SCHEDULE` |
| `GET /timetables/{id}/schedule` | `SCH_SCHEDULE` | `SCH_TIME_SLOT`, `SCH_SUBJECT`, `AD_USER` |
| `POST /attendance/daily` | `SCH_ATTENDANCE` | `SCH_ATTENDANCE_LINE` |
| `GET /attendance/summary` | `SCH_ATTENDANCE_LINE` | `SCH_STUDENT` |
| `GET/POST /exams` | `SCH_EXAM` | `SCH_EXAM_TYPE`, `SCH_SUBJECT`, `SCH_CLASS` |
| `POST /exams/{id}/grades` | `SCH_GRADE` | `SCH_EXAM`, `SCH_STUDENT` |
| `POST /report-cards/generate` | `SCH_REPORT_CARD` | `SCH_REPORT_CARD_LINE` |

---

## Students API

### List Students → SCH_STUDENT

```http
GET /api/v1/academic/students
```

**Database Query:**
```sql
SELECT
    s.SCH_STUDENT_ID as id,
    s.SCH_STUDENT_UU as uid,
    s.STUDENT_NO as StudentNo,
    bp.NAME as Name,
    bp.C_BPARTNER_ID,
    s.GRADE_LEVEL as GradeLevel,
    s.CLASS_NAME as ClassName,
    s.SCHOOL_TYPE as SchoolType,
    s.GENDER as Gender,
    s.PHONE_MOBILE as Phone,
    s.EMAIL as Email,
    s.ISACTIVE as IsActive,
    'sms_student' as model-name
FROM SCH_STUDENT s
LEFT JOIN C_BPARTNER bp ON s.C_BPARTNER_ID = bp.C_BPARTNER_ID
WHERE s.AD_CLIENT_ID = ?
  AND s.ISACTIVE = 'Y'
ORDER BY s.STUDENT_NO
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=IsActive eq true` | `s.ISACTIVE = 'Y'` |
| `$filter=GradeLevel eq '10'` | `s.GRADE_LEVEL = '10'` |
| `$filter=startswith(Name,'John')` | `bp.NAME LIKE 'John%'` |
| `$orderby=StudentNo desc` | `ORDER BY s.STUDENT_NO DESC` |
| `$top=20&$skip=0` | `FETCH FIRST 20 ROWS ONLY` |

---

### Get Student Detail → SCH_STUDENT

```http
GET /api/v1/academic/students/{studentId}
```

**Database Query:**
```sql
SELECT
    s.SCH_STUDENT_ID,
    s.STUDENT_NO,
    s.C_BPARTNER_ID,
    s.ADMISSION_NO,
    s.ADMISSION_DATE,
    s.ACADEMIC_YEAR,
    s.GRADE_LEVEL,
    s.CLASS_NAME,
    s.SCHOOL_TYPE,
    s.MAJOR,
    s.DATE_OF_BIRTH,
    s.PLACE_OF_BIRTH,
    s.GENDER,
    s.BLOOD_TYPE,
    s.RELIGION,
    s.NATIONALITY,
    s.ADDRESS,
    s.CITY,
    s.PROVINCE,
    s.POSTAL_CODE,
    s.PHONE_HOME,
    s.PHONE_MOBILE,
    s.EMAIL,
    s.FATHER_NAME,
    s.FATHER_OCCUPATION,
    s.FATHER_PHONE,
    s.FATHER_EMAIL,
    s.MOTHER_NAME,
    s.MOTHER_OCCUPATION,
    s.MOTHER_PHONE,
    s.MOTHER_EMAIL,
    s.GUARDIAN_NAME,
    s.GUARDIAN_RELATION,
    s.GUARDIAN_PHONE,
    s.EMERGENCY_CONTACT,
    s.EMERGENCY_PHONE,
    s.PHOTO_PATH,
    s.MEDICAL_INFO,
    s.ALLERGIES,
    s.ENROLLMENT_STATUS,
    s.PREVIOUS_SCHOOL,
    s.CREATED,
    s.UPDATED
FROM SCH_STUDENT s
WHERE s.SCH_STUDENT_ID = ?
```

---

### Create Student → SCH_STUDENT + C_BPARTNER

```http
POST /api/v1/academic/students
```

**Transaction Flow:**
```sql
-- Step 1: Create/Update C_BPARTNER
INSERT INTO C_BPARTNER (
    C_BPARTNER_ID, C_BPARTNER_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    NAME, NAME2, ISCUSTOMER, BP_GROUP_ID
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, NULL, 'Y', ?);

-- Step 2: Create SCH_STUDENT
INSERT INTO SCH_STUDENT (
    SCH_STUDENT_ID, SCH_STUDENT_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    STUDENT_NO, C_BPARTNER_ID, ADMISSION_NO, ADMISSION_DATE,
    ACADEMIC_YEAR, GRADE_LEVEL, CLASS_NAME, SCHOOL_TYPE, MAJOR,
    DATE_OF_BIRTH, PLACE_OF_BIRTH, GENDER, BLOOD_TYPE, RELIGION,
    NATIONALITY, ADDRESS, CITY, PROVINCE, POSTAL_CODE,
    PHONE_HOME, PHONE_MOBILE, EMAIL,
    FATHER_NAME, FATHER_OCCUPATION, FATHER_PHONE, FATHER_EMAIL,
    MOTHER_NAME, MOTHER_OCCUPATION, MOTHER_PHONE, MOTHER_EMAIL,
    GUARDIAN_NAME, GUARDIAN_RELATION, GUARDIAN_PHONE,
    EMERGENCY_CONTACT, EMERGENCY_PHONE,
    PHOTO_PATH, MEDICAL_INFO, ALLERGIES,
    ENROLLMENT_STATUS, PREVIOUS_SCHOOL
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

---

## Enrollment API

### Get Enrollment History → SCH_ENROLLMENT

```http
GET /api/v1/academic/students/{studentId}/enrollments
```

**Database Query:**
```sql
SELECT
    e.SCH_ENROLLMENT_ID as enrollmentId,
    e.ACADEMIC_YEAR as academicYear,
    e.SEMESTER as semester,
    e.GRADE_LEVEL as gradeLevel,
    e.CLASS_NAME as className,
    e.SCHOOL_TYPE as schoolType,
    e.MAJOR as major,
    e.ENROLLMENT_DATE as enrollmentDate,
    e.ENROLLMENT_STATUS as enrollmentStatus,
    e.COMPLETION_DATE as completionDate,
    e.REMARKS
FROM SCH_ENROLLMENT e
WHERE e.SCH_STUDENT_ID = ?
  AND e.AD_CLIENT_ID = ?
ORDER BY e.ACADEMIC_YEAR DESC, e.SEMESTER DESC
```

---

### Create Enrollment → SCH_ENROLLMENT

```http
POST /api/v1/academic/students/{studentId}/enrollments
```

**Database Query:**
```sql
INSERT INTO SCH_ENROLLMENT (
    SCH_ENROLLMENT_ID, SCH_ENROLLMENT_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_STUDENT_ID, ACADEMIC_YEAR, SEMESTER, GRADE_LEVEL,
    CLASS_NAME, SCHOOL_TYPE, MAJOR, ENROLLMENT_DATE,
    ENROLLMENT_STATUS
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

---

## Curriculum API

### List Curricula → SCH_CURRICULUM

```http
GET /api/v1/academic/curricula
```

**Database Query:**
```sql
SELECT
    c.SCH_CURRICULUM_ID as curriculumId,
    c.NAME as name,
    c.DESCRIPTION as description,
    c.CURRICULUM_TYPE as curriculumType,
    c.SCHOOL_TYPE as schoolType,
    c.EDUCATION_LEVEL as educationLevel,
    c.MAJOR as major,
    c.ACADEMIC_YEAR as academicYear,
    c.VERSION as version,
    c.IS_APPROVED as isApproved,
    c.EFFECTIVE_DATE as effectiveDate,
    c.STATUS
FROM SCH_CURRICULUM c
WHERE c.AD_CLIENT_ID = ?
  AND c.ISACTIVE = 'Y'
ORDER BY c.ACADEMIC_YEAR DESC, c.NAME
```

---

### Get Curriculum with Subjects → SCH_CURRICULUM + SCH_CURRICULUM_SUBJECT + SCH_SUBJECT

```http
GET /api/v1/academic/curricula/{curriculumId}
```

**Database Query:**
```sql
-- Main query
SELECT
    c.SCH_CURRICULUM_ID as curriculumId,
    c.NAME as name,
    c.DESCRIPTION as description,
    c.CURRICULUM_TYPE as curriculumType,
    c.SCHOOL_TYPE as schoolType,
    c.EDUCATION_LEVEL as educationLevel,
    c.MAJOR as major,
    c.ACADEMIC_YEAR as academicYear,
    c.VERSION as version,
    c.IS_APPROVED as isApproved,
    c.EFFECTIVE_DATE as effectiveDate,
    c.STATUS
FROM SCH_CURRICULUM c
WHERE c.SCH_CURRICULUM_ID = ?

-- Subjects query
SELECT
    cs.SCH_CURRICULUM_SUBJECT_ID,
    sub.SCH_SUBJECT_ID as subjectId,
    sub.CODE as subjectCode,
    sub.NAME as subjectName,
    cs.GRADE_LEVEL as gradeLevel,
    cs.SEMESTER as semester,
    cs.WEEKLY_HOURS as weeklyHours,
    cs.THEORY_HOURS as theoryHours,
    cs.PRACTICAL_HOURS as practicalHours,
    cs.IS_MANDATORY as isMandatory
FROM SCH_CURRICULUM_SUBJECT cs
INNER JOIN SCH_SUBJECT sub ON cs.SCH_SUBJECT_ID = sub.SCH_SUBJECT_ID
WHERE cs.SCH_CURRICULUM_ID = ?
  AND cs.ISACTIVE = 'Y'
ORDER BY cs.GRADE_LEVEL, cs.SEMESTER, cs.SEQUENCE_NO
```

---

## Subjects API

### List Subjects → SCH_SUBJECT

```http
GET /api/v1/academic/subjects
```

**Database Query:**
```sql
SELECT
    s.SCH_SUBJECT_ID as id,
    s.SCH_SUBJECT_UU as uid,
    s.CODE as SubjectCode,
    s.NAME as SubjectName,
    s.NAME_ENGLISH as NameEnglish,
    s.SUBJECT_TYPE as SubjectType,
    s.SUBJECT_CATEGORY as SubjectCategory,
    s.CREDIT_HOURS as CreditHours,
    s.WEEKLY_HOURS as WeeklyHours,
    s.THEORY_HOURS as TheoryHours,
    s.PRACTICAL_HOURS as PracticalHours,
    s.GRADE_LEVEL_FROM as GradeLevelFrom,
    s.GRADE_LEVEL_TO as GradeLevelTo,
    s.SCHOOL_TYPE as SchoolType,
    s.MAJOR as Major,
    s.PASSING_SCORE as PassingScore,
    s.ISACTIVE as IsActive,
    'sms_subject' as model-name
FROM SCH_SUBJECT s
WHERE s.AD_CLIENT_ID = ?
  AND s.ISACTIVE = 'Y'
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=SchoolType eq 'SMA'` | `s.SCHOOL_TYPE = 'SMA'` |
| `$filter=Major eq 'IPA'` | `s.MAJOR = 'IPA'` |
| `$filter=GradeLevelFrom eq '10'` | `s.GRADE_LEVEL_FROM = '10'` |
| `$filter=SubjectType eq 'Core'` | `s.SUBJECT_TYPE = 'Core'` |
| `$filter=contains(SubjectName,'Matematika')` | `s.NAME LIKE '%Matematika%'` |
| `$orderby=SubjectName asc` | `ORDER BY s.NAME ASC` |

---

## Classes API

### List Classes → SCH_CLASS

```http
GET /api/v1/academic/classes
```

**Database Query:**
```sql
SELECT
    c.SCH_CLASS_ID as id,
    c.SCH_CLASS_UU as uid,
    c.CLASS_NAME as ClassName,
    c.GRADE_LEVEL as GradeLevel,
    c.SCHOOL_TYPE as SchoolType,
    c.MAJOR as Major,
    c.ACADEMIC_YEAR as AcademicYear,
    c.SEMESTER as Semester,
    c.CAPACITY as Capacity,
    c.CURRENT_ENROLLMENT as CurrentEnrollment,
    c.HOMEROOM_TEACHER_ID as HomeroomTeacher_ID,
    c.CLASSROOM as Classroom,
    c.BUILDING as Building,
    c.ISACTIVE as IsActive,
    'sms_class' as model-name
FROM SCH_CLASS c
WHERE c.AD_CLIENT_ID = ?
  AND c.ISACTIVE = 'Y'
```

**Query Parameters Mapping:**
| API Parameter | SQL Clause |
|---------------|-----------|
| `$filter=AcademicYear eq '2024/2025'` | `c.ACADEMIC_YEAR = '2024/2025'` |
| `$filter=GradeLevel eq '10'` | `c.GRADE_LEVEL = '10'` |
| `$filter=Capacity gt CurrentEnrollment` | `c.CAPACITY > c.CURRENT_ENROLLMENT` |
| `$expand=ad_user` | JOIN with `AD_USER` table |

---

### Add Student to Class → SCH_CLASS_STUDENT

```http
POST /api/v1/academic/classes/{classId}/students
```

**Database Query:**
```sql
INSERT INTO SCH_CLASS_STUDENT (
    SCH_CLASS_STUDENT_ID, SCH_CLASS_STUDENT_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_CLASS_ID, SCH_STUDENT_ID, SCH_ENROLLMENT_ID,
    ROLL_NUMBER, ASSIGNMENT_DATE, STATUS
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, 'Active');

-- Update class enrollment count
UPDATE SCH_CLASS
SET CURRENT_ENROLLMENT = CURRENT_ENROLLMENT + 1
WHERE SCH_CLASS_ID = ?
```

---

## Timetable API

### List Timetables → SCH_TIMETABLE

```http
GET /api/v1/academic/timetables
```

**Database Query:**
```sql
SELECT
    t.SCH_TIMETABLE_ID as timetableId,
    t.NAME as name,
    t.ACADEMIC_YEAR as academicYear,
    t.SEMESTER as semester,
    t.SCHOOL_TYPE as schoolType,
    t.GRADE_LEVEL as gradeLevel,
    t.MAJOR as major,
    t.EFFECTIVE_FROM as effectiveFrom,
    t.EFFECTIVE_TO as effectiveTo,
    t.STATUS as status,
    t.IS_PUBLISHED as isPublished,
    t.PUBLISHED_DATE as publishedDate
FROM SCH_TIMETABLE t
WHERE t.AD_CLIENT_ID = ?
  AND t.ISACTIVE = 'Y'
ORDER BY t.ACADEMIC_YEAR DESC, t.EFFECTIVE_FROM DESC
```

---

### Get Schedule → SCH_SCHEDULE + SCH_TIME_SLOT

```http
GET /api/v1/academic/timetables/{timetableId}/schedule?view=weekly&classId=CLS-001
```

**Database Query:**
```sql
SELECT
    sch.DAY_OF_WEEK as dayOfWeek,
    CASE sch.DAY_OF_WEEK
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
        WHEN 7 THEN 'Sunday'
    END as dayName,
    ts.SCH_TIME_SLOT_ID as timeSlotId,
    ts.START_TIME as startTime,
    ts.END_TIME as endTime,
    sub.NAME as subject,
    u.NAME as teacher,
    sch.AD_USER_ID as teacherId,
    sch.ROOM as room,
    sch.BUILDING as building
FROM SCH_SCHEDULE sch
INNER JOIN SCH_TIME_SLOT ts ON sch.SCH_TIME_SLOT_ID = ts.SCH_TIME_SLOT_ID
LEFT JOIN SCH_SUBJECT sub ON sch.SCH_SUBJECT_ID = sub.SCH_SUBJECT_ID
LEFT JOIN AD_USER u ON sch.AD_USER_ID = u.AD_USER_ID
WHERE sch.SCH_TIMETABLE_ID = ?
  AND sch.SCH_CLASS_ID = ?
  AND sch.ISACTIVE = 'Y'
ORDER BY sch.DAY_OF_WEEK, ts.SEQUENCE_NO
```

---

### Get Teacher Schedule → SCH_SCHEDULE (by teacher)

```http
GET /api/v1/academic/timetables/teacher/{teacherId}
```

**Database Query:**
```sql
SELECT
    sch.DAY_OF_WEEK as dayOfWeek,
    ts.SCH_TIME_SLOT_ID as timeSlotId,
    ts.START_TIME as startTime,
    ts.END_TIME as endTime,
    c.CLASS_NAME as class,
    sub.NAME as subject,
    sch.ROOM as room
FROM SCH_SCHEDULE sch
INNER JOIN SCH_TIME_SLOT ts ON sch.SCH_TIME_SLOT_ID = ts.SCH_TIME_SLOT_ID
LEFT JOIN SCH_CLASS c ON sch.SCH_CLASS_ID = c.SCH_CLASS_ID
LEFT JOIN SCH_SUBJECT sub ON sch.SCH_SUBJECT_ID = sub.SCH_SUBJECT_ID
WHERE sch.AD_USER_ID = ?
  AND sch.ISACTIVE = 'Y'
ORDER BY sch.DAY_OF_WEEK, ts.SEQUENCE_NO
```

---

## Attendance API

### Mark Daily Attendance → SCH_ATTENDANCE + SCH_ATTENDANCE_LINE

```http
POST /api/v1/academic/attendance/daily
```

**Transaction Flow:**
```sql
-- Step 1: Create attendance header
INSERT INTO SCH_ATTENDANCE (
    SCH_ATTENDANCE_ID, SCH_ATTENDANCE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_CLASS_ID, ATTENDANCE_DATE, ACADEMIC_YEAR, SEMESTER,
    SCH_TIME_SLOT_ID, ATTENDANCE_FOR, SCH_SUBJECT_ID,
    TOTAL_STUDENTS, PRESENT_COUNT, ABSENT_COUNT,
    LATE_COUNT, EXCUSED_COUNT, STATUS
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft');

-- Step 2: Create attendance lines
INSERT INTO SCH_ATTENDANCE_LINE (
    SCH_ATT_LINE_ID, SCH_ATT_LINE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_ATTENDANCE_ID, SCH_STUDENT_ID, ATTENDANCE_STATUS,
    CHECK_IN_TIME, CHECK_OUT_TIME, LATE_MINUTES,
    ABSENCE_REASON, IS_EXCUSED, EXCUSED_REASON,
    HAS_PERMISSION, PERMISSION_NO, PERMISSION_REASON, REMARKS
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
-- Repeat for each student
```

---

### Get Attendance Summary → SCH_ATTENDANCE_LINE aggregation

```http
GET /api/v1/academic/attendance/summary?classId=CLS-001&startDate=2024-08-01&endDate=2024-08-31
```

**Database Query:**
```sql
SELECT
    COUNT(DISTINCT a.ATTENDANCE_DATE) as totalDays,
    SUM(CASE WHEN al.ATTENDANCE_STATUS = 'Present' THEN 1 ELSE 0 END) as presentDays,
    SUM(CASE WHEN al.ATTENDANCE_STATUS = 'Absent' THEN 1 ELSE 0 END) as absentDays,
    SUM(CASE WHEN al.ATTENDANCE_STATUS = 'Late' THEN 1 ELSE 0 END) as lateDays,
    SUM(CASE WHEN al.IS_EXCUSED = 'Y' THEN 1 ELSE 0 END) as excusedDays,
    ROUND(
        SUM(CASE WHEN al.ATTENDANCE_STATUS IN ('Present', 'Late') THEN 1 ELSE 0 END) * 100.0 /
        COUNT(DISTINCT a.ATTENDANCE_DATE), 2
    ) as attendancePercentage
FROM SCH_ATTENDANCE a
INNER JOIN SCH_ATTENDANCE_LINE al ON a.SCH_ATTENDANCE_ID = al.SCH_ATTENDANCE_ID
WHERE a.SCH_CLASS_ID = ?
  AND a.ATTENDANCE_DATE BETWEEN ? AND ?
  AND a.AD_CLIENT_ID = ?
```

---

## Grades & Exams API

### List Exams → SCH_EXAM

```http
GET /api/v1/academic/exams?classId=CLS-001&subjectId=SUBJ-001
```

**Database Query:**
```sql
SELECT
    e.SCH_EXAM_ID as examId,
    e.NAME as name,
    e.EXAM_CODE as examCode,
    et.NAME as examType,
    sub.NAME as subjectName,
    c.CLASS_NAME as className,
    e.EXAM_DATE as examDate,
    e.START_TIME as startTime,
    e.END_TIME as endTime,
    e.DURATION_MINUTES as durationMinutes,
    e.ROOM as room,
    e.MAX_SCORE as maxScore,
    e.PASSING_SCORE as passingScore,
    e.WEIGHT_PERCENTAGE as weightPercentage,
    e.STATUS as status
FROM SCH_EXAM e
LEFT JOIN SCH_EXAM_TYPE et ON e.SCH_EXAM_TYPE_ID = et.SCH_EXAM_TYPE_ID
LEFT JOIN SCH_SUBJECT sub ON e.SCH_SUBJECT_ID = sub.SCH_SUBJECT_ID
LEFT JOIN SCH_CLASS c ON e.SCH_CLASS_ID = c.SCH_CLASS_ID
WHERE e.AD_CLIENT_ID = ?
  AND e.ISACTIVE = 'Y'
  AND (? IS NULL OR e.SCH_CLASS_ID = ?)
  AND (? IS NULL OR e.SCH_SUBJECT_ID = ?)
ORDER BY e.EXAM_DATE DESC
```

---

### Create Exam → SCH_EXAM

```http
POST /api/v1/academic/exams
```

**Database Query:**
```sql
INSERT INTO SCH_EXAM (
    SCH_EXAM_ID, SCH_EXAM_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    NAME, EXAM_CODE, SCH_EXAM_TYPE_ID, SCH_SUBJECT_ID, SCH_CLASS_ID,
    ACADEMIC_YEAR, SEMESTER, GRADE_LEVEL, SCHOOL_TYPE,
    EXAM_DATE, START_TIME, END_TIME, DURATION_MINUTES,
    ROOM, BUILDING, MAX_SCORE, PASSING_SCORE,
    WEIGHT_PERCENTAGE, STATUS, DESCRIPTION, INSTRUCTIONS
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

---

### Enter Grades → SCH_GRADE

```http
POST /api/v1/academic/exams/{examId}/grades
```

**Database Query:**
```sql
INSERT INTO SCH_GRADE (
    SCH_GRADE_ID, SCH_GRADE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_EXAM_ID, SCH_STUDENT_ID, SCORE, MAX_SCORE,
    GRADE_STATUS, LETTER_GRADE, GPA_POINTS,
    REMARKS, TEACHER_COMMENTS, SUBMITTED_DATE, GRADED_DATE, GRADED_BY
) VALUES (?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE, SYSDATE, ?);
-- Repeat for each student
```

---

## Report Cards API

### Generate Report Card → SCH_REPORT_CARD + SCH_REPORT_CARD_LINE

```http
POST /api/v1/academic/report-cards/generate
```

**Transaction Flow:**
```sql
-- Step 1: Calculate and create report card header
INSERT INTO SCH_REPORT_CARD (
    SCH_REPORT_CARD_ID, SCH_REPORT_CARD_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_STUDENT_ID, ACADEMIC_YEAR, SEMESTER, SCH_ENROLLMENT_ID,
    SCH_CLASS_ID, GRADE_LEVEL, GPA, TOTAL_SCORE, MAX_SCORE,
    AVERAGE_SCORE, CLASS_RANK, TOTAL_STUDENTS,
    TOTAL_DAYS, PRESENT_DAYS, ABSENT_DAYS, LATE_DAYS, EXCUSED_DAYS,
    ATTENDANCE_PERCENTAGE, STATUS, PRINCIPAL_REMARKS, CLASS_TEACHER_REMARKS,
    PROMOTED_TO, PROMOTION_STATUS
)
SELECT
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    SCH_STUDENT_ID, ?, ?, ?,
    (SELECT SCH_CLASS_ID FROM SCH_ENROLLMENT WHERE SCH_ENROLLMENT_ID = ?),
    GRADE_LEVEL,
    ROUND(AVG(g.GPA_POINTS), 2) as GPA,
    SUM(g.SCORE) as TOTAL_SCORE,
    SUM(e.MAX_SCORE) as MAX_SCORE,
    ROUND(AVG(g.SCORE * 100.0 / e.MAX_SCORE), 2) as AVERAGE_SCORE,
    RANK() OVER (ORDER BY AVG(g.SCORE) DESC) as CLASS_RANK,
    COUNT(*) as TOTAL_STUDENTS,
    ? as TOTAL_DAYS,
    ? as PRESENT_DAYS, ? as ABSENT_DAYS, ? as LATE_DAYS, ? as EXCUSED_DAYS,
    ROUND(? * 100.0 / ?, 2) as ATTENDANCE_PERCENTAGE,
    'Draft', ?, ?, ?, ?
FROM SCH_GRADE g
INNER JOIN SCH_EXAM e ON g.SCH_EXAM_ID = e.SCH_EXAM_ID
WHERE e.ACADEMIC_YEAR = ?
  AND e.SEMESTER = ?
  AND e.SCH_CLASS_ID = ?
GROUP BY SCH_STUDENT_ID;

-- Step 2: Create report card lines for each subject
INSERT INTO SCH_REPORT_CARD_LINE (
    SCH_RPT_CARD_LINE_ID, SCH_RPT_CARD_LINE_UU, AD_CLIENT_ID, AD_ORG_ID,
    ISACTIVE, CREATED, CREATEDBY, UPDATED, UPDATEDBY,
    SCH_REPORT_CARD_ID, SCH_SUBJECT_ID,
    WRITTEN_SCORE, PRACTICAL_SCORE, TOTAL_SCORE, MAX_SCORE,
    LETTER_GRADE, GRADE_POINTS, SKILLS_RATING, COMPETENCY_ACHIEVED,
    TOTAL_CLASSES, ATTENDED_CLASSES, ATTENDANCE_PERCENTAGE, REMARKS
)
SELECT
    ?, ?, ?, ?, 'Y', SYSDATE, ?, SYSDATE, ?,
    ? as SCH_REPORT_CARD_ID,
    e.SCH_SUBJECT_ID,
    AVG(g.SCORE) as TOTAL_SCORE,
    e.MAX_SCORE,
    g.LETTER_GRADE,
    g.GPA_POINTS,
    NULL as SKILLS_RATING,
    'Y' as COMPETENCY_ACHIEVED,
    ? as TOTAL_CLASSES,
    ? as ATTENDED_CLASSES,
    ROUND(? * 100.0 / ?, 2) as ATTENDANCE_PERCENTAGE,
    'Good' as REMARKS
FROM SCH_GRADE g
INNER JOIN SCH_EXAM e ON g.SCH_EXAM_ID = e.SCH_EXAM_ID
WHERE e.SCH_SUBJECT_ID IS NOT NULL
  AND e.ACADEMIC_YEAR = ?
  AND e.SEMESTER = ?
  AND g.SCH_STUDENT_ID = ?
GROUP BY e.SCH_SUBJECT_ID;
```

---

## Field Mapping Reference

### Student Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `studentId` | `SCH_STUDENT` | `SCH_STUDENT_ID` |
| `studentNo` | `SCH_STUDENT` | `STUDENT_NO` |
| `bpartnerId` | `SCH_STUDENT` | `C_BPARTNER_ID` |
| `name` | `C_BPARTNER` | `NAME` |
| `gradeLevel` | `SCH_STUDENT` | `GRADE_LEVEL` |
| `className` | `SCH_STUDENT` | `CLASS_NAME` |
| `schoolType` | `SCH_STUDENT` | `SCHOOL_TYPE` |
| `major` | `SCH_STUDENT` | `MAJOR` |
| `dateOfBirth` | `SCH_STUDENT` | `DATE_OF_BIRTH` |
| `gender` | `SCH_STUDENT` | `GENDER` |
| `email` | `SCH_STUDENT` | `EMAIL` |
| `phoneMobile` | `SCH_STUDENT` | `PHONE_MOBILE` |
| `isActive` | `SCH_STUDENT` | `ISACTIVE` |

### Subject Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `subjectId` | `SCH_SUBJECT` | `SCH_SUBJECT_ID` |
| `subjectCode` | `SCH_SUBJECT` | `CODE` |
| `subjectName` | `SCH_SUBJECT` | `NAME` |
| `nameEnglish` | `SCH_SUBJECT` | `NAME_ENGLISH` |
| `subjectType` | `SCH_SUBJECT` | `SUBJECT_TYPE` |
| `creditHours` | `SCH_SUBJECT` | `CREDIT_HOURS` |
| `weeklyHours` | `SCH_SUBJECT` | `WEEKLY_HOURS` |
| `theoryHours` | `SCH_SUBJECT` | `THEORY_HOURS` |
| `practicalHours` | `SCH_SUBJECT` | `PRACTICAL_HOURS` |
| `schoolType` | `SCH_SUBJECT` | `SCHOOL_TYPE` |
| `major` | `SCH_SUBJECT` | `MAJOR` |
| `passingScore` | `SCH_SUBJECT` | `PASSING_SCORE` |

### Class Field Mapping

| API Field | Database Table | Database Column |
|-----------|----------------|-----------------|
| `classId` | `SCH_CLASS` | `SCH_CLASS_ID` |
| `className` | `SCH_CLASS` | `CLASS_NAME` |
| `gradeLevel` | `SCH_CLASS` | `GRADE_LEVEL` |
| `schoolType` | `SCH_CLASS` | `SCHOOL_TYPE` |
| `academicYear` | `SCH_CLASS` | `ACADEMIC_YEAR` |
| `semester` | `SCH_CLASS` | `SEMESTER` |
| `capacity` | `SCH_CLASS` | `CAPACITY` |
| `currentEnrollment` | `SCH_CLASS` | `CURRENT_ENROLLMENT` |
| `homeroomTeacherId` | `SCH_CLASS` | `HOMEROOM_TEACHER_ID` |
| `classroom` | `SCH_CLASS` | `CLASSROOM` |
| `building` | `SCH_CLASS` | `BUILDING` |

---

**Document Version:** 1.0
**Related:**
- [Database Schema](./database-schema.md)
- [API Specification](../api/academic/academic-module.md)
- [Implementation Guide](./implementation-guide.md)
