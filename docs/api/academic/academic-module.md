# Academic Module APIs

**Base URL:** `/api/v1/academic`

---

## 1. Students

### 1.1 List All Students

```http
GET /api/v1/academic/students
```

**Query Parameters (iDempiere REST API Standard):**

```
# Filter active students in grade 10
$filter=IsActive eq true AND GradeLevel eq '10'

# Filter by name starting with "John" and sort by student number
$filter=startswith(Name,'John')&$orderby=StudentNo desc

# Pagination - get first 20 students
$top=20&$skip=0

# Select specific fields only
$select=StudentNo,Name,GradeLevel,ClassName,Status

# Combine multiple query options
$top=20&$skip=0&$filter=IsActive eq true AND GradeLevel eq '10'&$orderby=StudentNo asc&$select=StudentNo,Name,GradeLevel,ClassName

# With expanded related records
$expand=c_bpartner($select=Name,Email)
```

**Examples:**

```http
# Example 1: Get active students in grade 10, sorted by name
GET /api/v1/academic/students?$filter=IsActive eq true AND GradeLevel eq '10'&$orderby=Name asc&$top=20

# Example 2: Search students by name (case-insensitive)
GET /api/v1/academic/students?$filter=contains(tolower(Name),'john')&$top=10

# Example 3: Get students with specific IDs
GET /api/v1/academic/students?$filter=Student_ID in (1001,1002,1003)

# Example 4: Get students with enrollment data
GET /api/v1/academic/students?$expand=sms_enrollment&$filter=IsActive eq true
```

**Response (iDempiere REST API Format):**

```json
{
  "page-count": 8,
  "records-size": 20,
  "skip-records": 0,
  "row-count": 150,
  "array-count": 20,
  "records": [
    {
      "id": 1001,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "StudentNo": "2024001",
      "Name": "John Doe",
      "GradeLevel": "10",
      "ClassName": "X-A",
      "SchoolType": "SMA",
      "IsActive": true,
      "DateOfBirth": "2008-05-15",
      "Gender": "M",
      "Phone": "08123456789",
      "Email": "john@example.com",
      "model-name": "sms_student"
    },
    {
      "id": 1002,
      "uid": "4a9f96fc-05b3-5f52-bf56-f8e60e8cf188",
      "StudentNo": "2024002",
      "Name": "Jane Smith",
      "GradeLevel": "10",
      "ClassName": "X-A",
      "SchoolType": "SMA",
      "IsActive": true,
      "DateOfBirth": "2008-03-20",
      "Gender": "F",
      "Phone": "08123456790",
      "Email": "jane@example.com",
      "model-name": "sms_student"
    }
  ]
}
```

---

### 1.2 Get Student Detail

```http
GET /api/v1/academic/students/{studentId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "studentId": "STU-001",
    "studentNo": "2024001",
    "bpartnerId": "BP-001",
    "admissionNo": "ADM-2024-001",
    "admissionDate": "2024-07-15",
    "academicYear": "2024/2025",
    "gradeLevel": "10",
    "className": "X-A",
    "schoolType": "SMA",
    "major": "IPA",
    "dateOfBirth": "2008-05-15",
    "placeOfBirth": "Jakarta",
    "gender": "M",
    "bloodType": "O",
    "religion": "Islam",
    "nationality": "Indonesian",
    "address": "Jl. Example No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345",
    "phoneHome": "021-1234567",
    "phoneMobile": "08123456789",
    "email": "john@example.com",
    "fatherName": "John Doe Sr",
    "fatherOccupation": "Employee",
    "fatherPhone": "08123456788",
    "fatherEmail": "father@example.com",
    "motherName": "Jane Doe",
    "motherOccupation": "Teacher",
    "motherPhone": "08123456789",
    "motherEmail": "mother@example.com",
    "guardianName": null,
    "guardianRelation": null,
    "guardianPhone": null,
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "08123456789",
    "photoPath": "/uploads/students/STU-001.jpg",
    "medicalInfo": null,
    "allergies": null,
    "status": "Active",
    "enrollmentStatus": "Enrolled",
    "previousSchool": "SMP Negeri 1 Jakarta",
    "createdAt": "2024-07-15T10:00:00Z",
    "updatedAt": "2024-07-15T10:00:00Z"
  }
}
```

---

### 1.3 Create Student

```http
POST /api/v1/academic/students
```

**Request Body:**

```json
{
  "studentNo": "2024001",
  "admissionNo": "ADM-2024-001",
  "admissionDate": "2024-07-15",
  "academicYear": "2024/2025",
  "gradeLevel": "10",
  "className": "X-A",
  "schoolType": "SMA",
  "major": "IPA",
  "dateOfBirth": "2008-05-15",
  "placeOfBirth": "Jakarta",
  "gender": "M",
  "bloodType": "O",
  "religion": "Islam",
  "nationality": "Indonesian",
  "address": "Jl. Example No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postalCode": "12345",
  "phoneHome": "021-1234567",
  "phoneMobile": "08123456789",
  "email": "john@example.com",
  "fatherName": "John Doe Sr",
  "fatherOccupation": "Employee",
  "fatherPhone": "08123456788",
  "fatherEmail": "father@example.com",
  "motherName": "Jane Doe",
  "motherOccupation": "Teacher",
  "motherPhone": "08123456789",
  "motherEmail": "mother@example.com",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "08123456789",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "studentId": "STU-001",
    "studentNo": "2024001",
    "message": "Student created successfully"
  },
  "message": "Student created successfully"
}
```

---

### 1.4 Update Student

```http
PUT /api/v1/academic/students/{studentId}
```

**Request Body:**

```json
{
  "gradeLevel": "11",
  "className": "XI-IPA-1",
  "phoneMobile": "08123456790",
  "address": "Jl. New Address No. 456",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "studentId": "STU-001",
    "updatedFields": ["gradeLevel", "className", "phoneMobile", "address"]
  },
  "message": "Student updated successfully"
}
```

---

### 1.5 Delete Student

```http
DELETE /api/v1/academic/students/{studentId}
```

**Response:**

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 2. Enrollment

### 2.1 Get Enrollment History

```http
GET /api/v1/academic/students/{studentId}/enrollments
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "enrollmentId": "ENR-001",
        "academicYear": "2024/2025",
        "semester": "1",
        "gradeLevel": "10",
        "className": "X-A",
        "schoolType": "SMA",
        "major": "IPA",
        "enrollmentDate": "2024-07-15",
        "enrollmentStatus": "Active",
        "completionDate": null,
        "remarks": null
      }
    ]
  }
}
```

---

### 2.2 Create Enrollment

```http
POST /api/v1/academic/students/{studentId}/enrollments
```

**Request Body:**

```json
{
  "academicYear": "2025/2026",
  "semester": "1",
  "gradeLevel": "11",
  "className": "XI-IPA-1",
  "schoolType": "SMA",
  "major": "IPA",
  "enrollmentDate": "2025-07-15",
  "enrollmentStatus": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "enrollmentId": "ENR-002"
  },
  "message": "Enrollment created successfully"
}
```

---

## 3. Curriculum

### 3.1 List All Curricula

```http
GET /api/v1/academic/curricula
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "curriculumId": "CURR-001",
        "name": "Kurikulum Merdeka SMA 2024",
        "description": "Kurikulum Merdeka untuk SMA IPA",
        "curriculumType": "National",
        "schoolType": "SMA",
        "educationLevel": "High",
        "major": "IPA",
        "academicYear": "2024/2025",
        "version": "Merdeka",
        "isApproved": true,
        "effectiveDate": "2024-07-01",
        "status": "Active"
      }
    ]
  }
}
```

---

### 3.2 Get Curriculum Detail with Subjects

```http
GET /api/v1/academic/curricula/{curriculumId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "curriculumId": "CURR-001",
    "name": "Kurikulum Merdeka SMA 2024",
    "subjects": [
      {
        "subjectId": "SUBJ-001",
        "subjectCode": "MAT",
        "subjectName": "Matematika",
        "gradeLevel": "10",
        "semester": "1",
        "weeklyHours": 4,
        "theoryHours": 3,
        "practicalHours": 1,
        "isMandatory": true
      },
      {
        "subjectId": "SUBJ-002",
        "subjectCode": "FIS",
        "subjectName": "Fisika",
        "gradeLevel": "10",
        "semester": "1",
        "weeklyHours": 3,
        "theoryHours": 2,
        "practicalHours": 1,
        "isMandatory": true
      }
    ]
  }
}
```

---

## 4. Subjects

### 4.1 List All Subjects

```http
GET /api/v1/academic/subjects
```

**Query Parameters (iDempiere REST API Standard):**

```
# Filter by school type and grade level
$filter=SchoolType eq 'SMA' AND GradeLevelFrom eq '10'

# Filter by major
$filter=Major eq 'IPA'&$orderby=SubjectName asc

# Get subjects for multiple grade levels
$filter=GradeLevelFrom ge '10' AND GradeLevelTo le '12'

# Select specific fields
$select=SubjectCode,SubjectName,CreditHours,WeeklyHours

# With pagination
$top=20&$skip=0&$orderby=SubjectName asc

# Complex filter - Core subjects for SMA IPA
$filter=SchoolType eq 'SMA' AND Major eq 'IPA' AND SubjectType eq 'Core' AND IsActive eq true

# Case-insensitive search
$filter=contains(tolower(SubjectName),'matematika')
```

**Examples:**

```http
# Example 1: Get all SMA IPA subjects
GET /api/v1/academic/subjects?$filter=SchoolType eq 'SMA' AND Major eq 'IPA'&$orderby=SubjectName asc

# Example 2: Get core subjects only
GET /api/v1/academic/subjects?$filter=SubjectType eq 'Core'&$top=20

# Example 3: Search subjects by name
GET /api/v1/academic/subjects?$filter=contains(SubjectName,'Matematika') OR contains(SubjectName,'Mathematics')

# Example 4: Get subjects with passing score >= 75
GET /api/v1/academic/subjects?$filter=PassingScore ge 75&$orderby=PassingScore desc

# Example 5: Get specific subject by code
GET /api/v1/academic/subjects?$filter=SubjectCode eq 'MAT'
```

**Response:**

```json
{
  "page-count": 1,
  "records-size": 2,
  "skip-records": 0,
  "row-count": 2,
  "array-count": 2,
  "records": [
    {
      "id": 1001,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "SubjectCode": "MAT",
      "SubjectName": "Matematika",
      "NameEnglish": "Mathematics",
      "SubjectType": "Core",
      "SubjectCategory": "Academic",
      "CreditHours": 4,
      "WeeklyHours": 4,
      "TheoryHours": 3,
      "PracticalHours": 1,
      "GradeLevelFrom": "10",
      "GradeLevelTo": "12",
      "SchoolType": "SMA",
      "Major": "IPA",
      "PassingScore": 75.0,
      "IsActive": true,
      "model-name": "sms_subject"
    },
    {
      "id": 1002,
      "uid": "4a9f96fc-05b3-5f52-bf56-f8e60e8cf188",
      "SubjectCode": "FIS",
      "SubjectName": "Fisika",
      "NameEnglish": "Physics",
      "SubjectType": "Core",
      "SubjectCategory": "Academic",
      "CreditHours": 3,
      "WeeklyHours": 3,
      "TheoryHours": 2,
      "PracticalHours": 1,
      "GradeLevelFrom": "10",
      "GradeLevelTo": "12",
      "SchoolType": "SMA",
      "Major": "IPA",
      "PassingScore": 75.0,
      "IsActive": true,
      "model-name": "sms_subject"
    }
  ]
}
```

---

### 4.2 Create Subject

```http
POST /api/v1/academic/subjects
```

**Request Body:**

```json
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
}
```

---

## 5. Classes

### 5.1 List All Classes

```http
GET /api/v1/academic/classes
```

**Query Parameters (iDempiere REST API Standard):**

```
# Filter by academic year and semester
$filter=AcademicYear eq '2024/2025' AND Semester eq '1'

# Filter by grade level and school type
$filter=GradeLevel eq '10' AND SchoolType eq 'SMA'

# Get classes with available capacity
$filter=Capacity gt CurrentEnrollment

# Select specific fields
$select=ClassName,GradeLevel,SchoolType,Capacity,CurrentEnrollment

# Sort by class name
$orderby=ClassName asc

# With homeroom teacher expanded
$expand=ad_user($select=Name,Email)

# Complex filter - Active classes with students
$filter=IsActive eq true AND CurrentEnrollment gt 0&$orderby=ClassName asc
```

**Examples:**

```http
# Example 1: Get all active classes for 2024/2025
GET /api/v1/academic/classes?$filter=AcademicYear eq '2024/2025' AND IsActive eq true&$orderby=GradeLevel asc,ClassName asc

# Example 2: Get classes with available space
GET /api/v1/academic/classes?$filter=Capacity gt CurrentEnrollment AND GradeLevel eq '10'

# Example 3: Get SMA IPA classes
GET /api/v1/academic/classes?$filter=SchoolType eq 'SMA' AND Major eq 'IPA'&$top=20

# Example 4: Get classes for a specific building
GET /api/v1/academic/classes?$filter=Building eq 'Main'&$orderby=Classroom

# Example 5: Get class with expanded homeroom teacher info
GET /api/v1/academic/classes?$filter=Class_ID eq 1001&$expand=ad_user($select=Name,Email,Phone)
```

**Response:**

```json
{
  "page-count": 1,
  "records-size": 2,
  "skip-records": 0,
  "row-count": 2,
  "array-count": 2,
  "records": [
    {
      "id": 1001,
      "uid": "39e85feb-94a2-4e41-ae45-e7d49d7be077",
      "ClassName": "X-A",
      "GradeLevel": "10",
      "SchoolType": "SMA",
      "Major": null,
      "AcademicYear": "2024/2025",
      "Semester": "1",
      "Capacity": 40,
      "CurrentEnrollment": 35,
      "HomeroomTeacher_ID": 1001,
      "Classroom": "R-101",
      "Building": "Main",
      "IsActive": true,
      "model-name": "sms_class"
    },
    {
      "id": 1002,
      "uid": "4a9f96fc-05b3-5f52-bf56-f8e60e8cf188",
      "ClassName": "X-B",
      "GradeLevel": "10",
      "SchoolType": "SMA",
      "Major": null,
      "AcademicYear": "2024/2025",
      "Semester": "1",
      "Capacity": 40,
      "CurrentEnrollment": 38,
      "HomeroomTeacher_ID": 1002,
      "Classroom": "R-102",
      "Building": "Main",
      "IsActive": true,
      "model-name": "sms_class"
    }
  ]
}
```

---

### 5.2 Add Student to Class

```http
POST /api/v1/academic/classes/{classId}/students
```

**Request Body:**

```json
{
  "studentId": "STU-001",
  "rollNumber": 1,
  "assignmentDate": "2024-07-15",
  "status": "Active"
}
```

---

## 6. Timetable

### 6.1 Get Timetable List

```http
GET /api/v1/academic/timetables
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "timetableId": "TT-001",
        "name": "Timetable Kelas X-A 2024/2025",
        "academicYear": "2024/2025",
        "semester": "1",
        "schoolType": "SMA",
        "gradeLevel": "10",
        "effectiveFrom": "2024-07-15",
        "effectiveTo": "2024-12-15",
        "status": "Active",
        "isPublished": true
      }
    ]
  }
}
```

---

### 6.2 Get Schedule (Daily/Weekly View)

```http
GET /api/v1/academic/timetables/{timetableId}/schedule
```

**Query Parameters:**

```
?view=weekly&classId=CLS-001&startDate=2024-08-01
```

**Response:**

```json
{
  "success": true,
  "data": {
    "schedule": [
      {
        "scheduleId": "SCH-001",
        "dayOfWeek": 1,
        "dayName": "Monday",
        "slots": [
          {
            "timeSlotId": "TS-001",
            "startTime": "07:00",
            "endTime": "07:45",
            "subject": "Matematika",
            "teacher": "Mrs. Sarah",
            "teacherId": "USR-001",
            "room": "R-101",
            "building": "Main"
          },
          {
            "timeSlotId": "TS-002",
            "startTime": "07:45",
            "endTime": "08:30",
            "subject": "Bahasa Indonesia",
            "teacher": "Mr. John",
            "teacherId": "USR-002",
            "room": "R-101",
            "building": "Main"
          }
        ]
      }
    ]
  }
}
```

---

### 6.3 Get Teacher Schedule

```http
GET /api/v1/academic/timetables/teacher/{teacherId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "teacherId": "USR-001",
    "teacherName": "Mrs. Sarah",
    "schedule": [
      {
        "dayOfWeek": 1,
        "dayName": "Monday",
        "slots": [
          {
            "timeSlotId": "TS-001",
            "startTime": "07:00",
            "endTime": "07:45",
            "class": "X-A",
            "subject": "Matematika",
            "room": "R-101"
          }
        ]
      }
    ]
  }
}
```

---

### 6.4 Get Room Schedule

```http
GET /api/v1/academic/timetables/room/{roomId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "roomId": "R-101",
    "roomName": "R-101",
    "schedule": [
      {
        "dayOfWeek": 1,
        "dayName": "Monday",
        "slots": [
          {
            "timeSlotId": "TS-001",
            "startTime": "07:00",
            "endTime": "07:45",
            "class": "X-A",
            "subject": "Matematika",
            "teacher": "Mrs. Sarah"
          }
        ]
      }
    ]
  }
}
```

---

## 7. Attendance

### 7.1 Mark Daily Attendance

```http
POST /api/v1/academic/attendance/daily
```

**Request Body:**

```json
{
  "classId": "CLS-001",
  "attendanceDate": "2024-08-01",
  "academicYear": "2024/2025",
  "semester": "1",
  "attendanceLines": [
    {
      "studentId": "STU-001",
      "attendanceStatus": "Present",
      "checkInTime": "06:55",
      "checkOutTime": "14:00",
      "lateMinutes": 0,
      "remarks": null
    },
    {
      "studentId": "STU-002",
      "attendanceStatus": "Late",
      "checkInTime": "07:10",
      "checkOutTime": "14:00",
      "lateMinutes": 10,
      "remarks": "Traffic jam"
    },
    {
      "studentId": "STU-003",
      "attendanceStatus": "Absent",
      "absenceReason": "Sick",
      "isExcused": true,
      "excusedReason": "Medical certificate",
      "remarks": "Submitted MC"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "attendanceId": "ATT-001",
    "totalStudents": 35,
    "presentCount": 32,
    "lateCount": 2,
    "absentCount": 1
  },
  "message": "Attendance marked successfully"
}
```

---

### 7.2 Get Attendance Summary

```http
GET /api/v1/academic/attendance/summary
```

**Query Parameters:**

```
?classId=CLS-001&studentId=STU-001&startDate=2024-08-01&endDate=2024-08-31
```

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDays": 22,
      "presentDays": 20,
      "lateDays": 1,
      "absentDays": 1,
      "excusedDays": 1,
      "attendancePercentage": 95.45,
      "byStudent": [
        {
          "studentId": "STU-001",
          "studentName": "John Doe",
          "totalDays": 22,
          "presentDays": 21,
          "lateDays": 1,
          "absentDays": 0,
          "attendancePercentage": 100
        }
      ]
    }
  }
}
```

---

## 8. Grades & Exams

### 8.1 List Exams

```http
GET /api/v1/academic/exams
```

**Query Parameters:**

```
?classId=CLS-001&subjectId=SUBJ-001&examDate=2024-08-15
```

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "examId": "EXAM-001",
        "name": "Ulangan Harian Matematika 1",
        "examCode": "UH-MAT-001",
        "examType": "Formative",
        "subjectId": "SUBJ-001",
        "subjectName": "Matematika",
        "classId": "CLS-001",
        "className": "X-A",
        "examDate": "2024-08-15",
        "startTime": "07:00",
        "endTime": "08:30",
        "durationMinutes": 90,
        "room": "R-101",
        "maxScore": 100,
        "passingScore": 75,
        "weightPercentage": 10,
        "status": "Scheduled"
      }
    ]
  }
}
```

---

### 8.2 Create Exam

```http
POST /api/v1/academic/exams
```

**Request Body:**

```json
{
  "name": "Ulangan Harian Matematika 1",
  "examCode": "UH-MAT-001",
  "examTypeId": "ETYPE-001",
  "subjectId": "SUBJ-001",
  "classId": "CLS-001",
  "academicYear": "2024/2025",
  "semester": "1",
  "gradeLevel": "10",
  "schoolType": "SMA",
  "examDate": "2024-08-15",
  "startTime": "07:00",
  "endTime": "08:30",
  "durationMinutes": 90,
  "room": "R-101",
  "building": "Main",
  "maxScore": 100,
  "passingScore": 75,
  "weightPercentage": 10,
  "instructions": "Answer all questions. No calculator allowed."
}
```

---

### 8.3 Enter Grades

```http
POST /api/v1/academic/exams/{examId}/grades
```

**Request Body:**

```json
{
  "grades": [
    {
      "studentId": "STU-001",
      "score": 85,
      "maxScore": 100,
      "gradeStatus": "Passed",
      "letterGrade": "A",
      "gpaPoints": 4.0,
      "remarks": "Excellent work",
      "teacherComments": "Keep up the good work!"
    },
    {
      "studentId": "STU-002",
      "score": 72,
      "maxScore": 100,
      "gradeStatus": "Failed",
      "letterGrade": "C",
      "gpaPoints": 2.0,
      "remarks": "Need improvement",
      "teacherComments": "Please study more for next exam"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "examId": "EXAM-001",
    "gradesEntered": 35,
    "grades": [
      {
        "gradeId": "GRD-001",
        "studentId": "STU-001",
        "score": 85
      }
    ]
  },
  "message": "Grades entered successfully"
}
```

---

### 8.4 Generate Report Card

```http
POST /api/v1/academic/report-cards/generate
```

**Request Body:**

```json
{
  "studentId": "STU-001",
  "academicYear": "2024/2025",
  "semester": "1",
  "includeAttendance": true,
  "includeRemarks": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reportCardId": "RC-001",
    "student": {
      "studentId": "STU-001",
      "studentName": "John Doe",
      "studentNo": "2024001",
      "gradeLevel": "10",
      "className": "X-A"
    },
    "academicPerformance": {
      "gpa": 3.5,
      "averageScore": 85.5,
      "classRank": 5,
      "totalStudents": 35,
      "subjects": [
        {
          "subjectId": "SUBJ-001",
          "subjectName": "Matematika",
          "writtenScore": 85,
          "practicalScore": 88,
          "totalScore": 86,
          "maxScore": 100,
          "letterGrade": "A",
          "gradePoints": 4.0,
          "totalClasses": 32,
          "attendedClasses": 30,
          "attendancePercentage": 93.75,
          "remarks": "Very Good"
        }
      ]
    },
    "attendanceSummary": {
      "totalDays": 120,
      "presentDays": 115,
      "absentDays": 3,
      "lateDays": 2,
      "excusedDays": 2,
      "attendancePercentage": 95.83
    },
    "remarks": {
      "principalRemarks": "John has shown excellent progress this semester.",
      "classTeacherRemarks": "A dedicated student with good leadership qualities."
    },
    "promotionStatus": "Promoted"
  },
  "message": "Report card generated successfully"
}
```

---

## Seed Data

Seed data untuk module ini tersedia di folder [`../../plans/academic/seed/`](../../plans/academic/seed/):

- [`students.json`](../../plans/academic/seed/students.json) - Data siswa (5 records)
- [`subjects.json`](../../plans/academic/seed/subjects.json) - Data mata pelajaran (10 records)
- [`classes.json`](../../plans/academic/seed/classes.json) - Data kelas (6 records)

---

**Last Updated:** 2025-01-27
