# School Management System - Role & Menu Structure

**Project:** School Management System (K-12 + Vocational + Training Center)
**Date:** 2025-01-24
**Backend:** iDempiere 12 ERP with Custom Extensions

---

## Table of Contents

1. [Role Definitions](#role-definitions)
2. [Role Hierarchy](#role-hierarchy)
3. [Menu Structure](#menu-structure)
4. [Permission Matrix](#permission-matrix)
5. [Organization Access Control](#organization-access-control)
6. [Role Assignment Guidelines](#role-assignment-guidelines)

---

## Role Definitions

### Tier 1: System Administration

#### 1. SYS_ADMIN - System Administrator
| Attribute | Value |
|-----------|-------|
| **Role Code** | `SYS_ADMIN` |
| **Description** | Full system access, manages all configurations, user management, and organizational settings |
| **Scope** | All organizations (System-wide) |
| **Primary Responsibilities** | - User & role management<br>- System configuration<br>- Organization management<br>- Module access control<br>- System monitoring |
| **Key Permissions** | `*.*` (All access) |
| **iDempiere Base Role** | `System Administrator` |

#### 2. SYS_FINANCE_MGR - Finance Manager
| Attribute | Value |
|-----------|-------|
| **Role Code** | `SYS_FINANCE_MGR` |
| **Description** | Multi-division financial oversight, consolidated reporting, financial controls |
| **Scope** | All organizations |
| **Primary Responsibilities** | - Financial oversight across all divisions<br>- Consolidated financial reporting<br>- Budget management<br>- Financial approvals<br>- Audit compliance |
| **Key Permissions** | All Finance modules across all orgs |
| **iDempiere Base Role** | `Finance Administrator` |

#### 3. SYS_AUDITOR - System Auditor
| Attribute | Value |
|-----------|-------|
| **Role Code** | `SYS_AUDITOR` |
| **Description** | Read-only access for audit, compliance, and internal controls |
| **Scope** | All organizations |
| **Primary Responsibilities** | - Audit trails review<br>- Compliance monitoring<br>- Report generation<br>- Data verification |
| **Key Permissions** | Read-only access to all modules |
| **iDempiere Base Role** | Custom (Read-only) |

---

### Tier 2: Division Administration

#### 4. K12_ADMIN - K-12 Division Admin
| Attribute | Value |
|-----------|-------|
| **Role Code** | `K12_ADMIN` |
| **Description** | Manages K-12 division operations (SD, SMP, SMA) |
| **Scope** | K-12 Organizations only |
| **Primary Responsibilities** | - Division academic management<br>- Student enrollment<br>- Staff assignment<br>- Division-specific reporting |
| **Key Permissions** | Dashboard, Academic (K-12), Finance (K-12), HR (K-12), Resources (K-12) |
| **Organization Access** | `AD_ORG_ID` IN (SD_Orgs, SMP_Orgs, SMA_Orgs) |

#### 5. VOC_ADMIN - Vocational Division Admin
| Attribute | Value |
|-----------|-------|
| **Role Code** | `VOC_ADMIN` |
| **Description** | Manages vocational division (SMK) operations |
| **Scope** | Vocational Organizations only |
| **Primary Responsibilities** | - Division academic management<br>- Skills tracking<br>- Industry partnership coordination<br>- Certification management |
| **Key Permissions** | Dashboard, Academic (Vocational), Skills Tracking, Industry Partnership, Finance (VOC) |
| **Organization Access** | `AD_ORG_ID` IN (SMK_Orgs) |

#### 6. TRAIN_ADMIN - Training Center Admin
| Attribute | Value |
|-----------|-------|
| **Role Code** | `TRAIN_ADMIN` |
| **Description** | Manages training center operations |
| **Scope** | Training Center Organizations only |
| **Primary Responsibilities** | - Course management<br>- Certification programs<br>- Instructor assignment<br>- Training reporting |
| **Key Permissions** | Dashboard, Course Management, Certification, Finance (TRAIN) |
| **Organization Access** | `AD_ORG_ID` IN (Training_Orgs) |

---

### Tier 3: Academic Leadership

#### 7. PRINCIPAL - Principal/Director
| Attribute | Value |
|-----------|-------|
| **Role Code** | `PRINCIPAL` |
| **Description** | School-level leadership and oversight |
| **Scope** | Single Organization (School) |
| **Primary Responsibilities** | - School operations oversight<br>- Academic performance monitoring<br>- Staff supervision<br>- Parent communication<br>- School reporting |
| **Key Permissions** | Dashboard (School), Academic (View All), Students (View All), Reports, Approvals |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 8. ACADEMIC_COORDINATOR - Academic Coordinator
| Attribute | Value |
|-----------|-------|
| **Role Code** | `ACADEMIC_COORDINATOR` |
| **Description** | Manages curriculum and academic programs |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Curriculum planning<br>- Subject assignments<br>- Timetable coordination<br>- Academic quality control |
| **Key Permissions** | Dashboard, Curriculum, Subjects, Timetable (View/Edit), Teacher Assignments |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

---

### Tier 4: Academic Staff

#### 9. TEACHER - Teacher/Lecturer
| Attribute | Value |
|-----------|-------|
| **Role Code** | `TEACHER` |
| **Description** | Classroom instruction and student assessment |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Classroom teaching<br>- Attendance marking<br>- Grade entry<br>- Student progress tracking |
| **Key Permissions** | Dashboard (Personal), My Classes, Attendance (My Classes), Grades (My Classes), Student Info (My Students) |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |
| **Data Access** | `SCH_CLASS` records where `AD_USER_ID` = assigned teacher |

#### 10. HOMEROOM_TEACHER - Homeroom Teacher
| Attribute | Value |
|-----------|-------|
| **Role Code** | `HOMEROOM_TEACHER` |
| **Description** | Class teacher with additional responsibilities |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Homeroom class management<br>- Student counseling<br>- Parent communication<br>- Class attendance oversight |
| **Key Permissions** | All TEACHER permissions + Homeroom Class (Full Access), Student Behavior Records |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |
| **Data Access** | `SCH_CLASS` where `HOMEROOM_TEACHER_ID` = current user |

#### 11. COUNSELOR - Academic Counselor
| Attribute | Value |
|-----------|-------|
| **Role Code** | `COUNSELOR` |
| **Description** | Student guidance and counseling |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Student academic counseling<br>- Course selection guidance<br>- Career guidance<br>- At-risk student monitoring |
| **Key Permissions** | Dashboard, Students (View All), Academic Records, Counseling Notes, Reports |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 12. REGISTRAR - Registrar
| Attribute | Value |
|-----------|-------|
| **Role Code** | `REGISTRAR` |
| **Description** | Enrollment and records management |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Student enrollment<br>- Record management<br>- Transcript generation<br>- Academic reporting |
| **Key Permissions** | Dashboard, Enrollment (Full), Student Records (Full), Curriculum, Reports, Transcripts |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

---

### Tier 5: Student Services

#### 13. STUDENT_AFFAIRS - Student Affairs Officer
| Attribute | Value |
|-----------|-------|
| **Role Code** | `STUDENT_AFFAIRS` |
| **Description** | Student welfare and discipline management |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Student discipline<br>- Welfare programs<br>- Extra-curricular activities<br>- Dormitory (if applicable) |
| **Key Permissions** | Dashboard, Students (View/Edit), Attendance (View All), Disciplinary Records, Activities |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 14. LIB_STAFF - Library Staff
| Attribute | Value |
|-----------|-------|
| **Role Code** | `LIB_STAFF` |
| **Description** | Library operations management |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Book cataloging<br>- Circulation management<br>- Fine collection<br>- Library reporting |
| **Key Permissions** | Dashboard, Library (Full), Book Management, Loans, Fines, Reports |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 15. FACILITY_MGR - Facility Manager
| Attribute | Value |
|-----------|-------|
| **Role Code** | `FACILITY_MGR` |
| **Description** | Facility and asset management |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Facility maintenance<br>- Asset tracking<br>- Room booking<br>- Inventory management |
| **Key Permissions** | Dashboard, Resources (Full), Facilities, Asset Booking, Maintenance |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

---

### Tier 6: Finance & HR

#### 16. FINANCE_MGR - Finance Manager
| Attribute | Value |
|-----------|-------|
| **Role Code** | `FINANCE_MGR` |
| **Description** | Financial operations and accounting |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Financial transactions<br>- Invoicing<br>- Payment collection<br>- Financial reporting |
| **Key Permissions** | Dashboard, Finance (Full): Invoices, Payments, Reports, Accounting |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 17. ACCOUNTANT - Accountant
| Attribute | Value |
|-----------|-------|
| **Role Code** | `ACCOUNTANT` |
| **Description** | Financial transaction processing |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Invoice creation<br>- Payment processing<br>- Reconciliation<br>- Voucher entry |
| **Key Permissions** | Finance: Invoices (Create/Edit), Payments (Create/Edit), Reports (View) |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 18. CASHIER - Cashier
| Attribute | Value |
|-----------|-------|
| **Role Code** | `CASHIER` |
| **Description** | Payment collection and receipting |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Receive payments<br>- Issue receipts<br>- Payment entry<br>- Cash handling |
| **Key Permissions** | Finance: Payments (Create Only), Payment History (View) |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 19. HR_MGR - HR Manager
| Attribute | Value |
|-----------|-------|
| **Role Code** | `HR_MGR` |
| **Description** | Human resources management |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Staff management<br>- Leave approval<br>- Payroll processing<br>- Performance management |
| **Key Permissions** | Dashboard, HR (Full): Staff, Leave (Approve), Payroll, Performance |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

#### 20. HR_STAFF - HR Staff
| Attribute | Value |
|-----------|-------|
| **Role Code** | `HR_STAFF` |
| **Description** | HR operations support |
| **Scope** | Single Organization |
| **Primary Responsibilities** | - Staff record maintenance<br>- Leave processing<br>- Payroll preparation<br>- HR documentation |
| **Key Permissions** | HR: Staff (View/Edit), Leave (View/Process), Payroll (Assist) |
| **Organization Access** | `AD_ORG_ID` = (Specific School Org) |

---

### Tier 7: External Users

#### 21. PARENT - Parent
| Attribute | Value |
|-----------|-------|
| **Role Code** | `PARENT` |
| **Description** | Student guardian with portal access |
| **Scope** | Own children's data only |
| **Primary Responsibilities** | - Monitor children's progress<br>- View attendance<br>- View grades<br>- Pay fees<br>- Communication |
| **Key Permissions** | Parent Portal: Children Info, Attendance (View), Grades (View), Fees (View/Pay), Communications |
| **Data Access** | `SCH_STUDENT` records linked via `SCH_STUDENT_PARENT` where `C_BPARTNER_ID` = current user |
| **Portal** | Web Portal Only |

#### 22. STUDENT - Student
| Attribute | Value |
|-----------|-------|
| **Role Code** | `STUDENT` |
| **Description** | Student with self-service portal access |
| **Scope** | Own data only |
| **Primary Responsibilities** | - View schedule<br>- View attendance<br>- View grades<br>- Access learning materials<br>- Submit assignments (Phase 2) |
| **Key Permissions** | Student Portal: My Classes, Attendance (View), Grades (View), Schedule, Materials |
| **Data Access** | `SCH_STUDENT` record where `SCH_STUDENT_ID` = current user |
| **Portal** | Web Portal Only |

#### 23. VENDOR - Vendor
| Attribute | Value |
|-----------|-------|
| **Role Code** | `VENDOR` |
| **Description** | External service providers |
| **Scope** | Related transactions only |
| **Primary Responsibilities** | - View purchase orders<br>- View invoices<br>- Submit invoices<br>- Payment status |
| **Key Permissions** | Limited: Purchase Orders (View Own), Invoices (View Own), Payments (View Own) |
| **Data Access** | `C_BPARTNER` records where `C_BPARTNER_ID` = current user |
| **Portal** | Web Portal Only |

---

### Tier 8: Limited Access

#### 24. REPORT_VIEWER - Report Viewer
| Attribute | Value |
|-----------|-------|
| **Role Code** | `REPORT_VIEWER` |
| **Description** | Read-only report access |
| **Scope** | Based on organization access |
| **Primary Responsibilities** | - View reports<br>- Export data<br>- Analytics |
| **Key Permissions** | Dashboard, Reports (View All), No Edit/Delete |
| **Organization Access** | As assigned |

#### 25. DATA_ENTRY - Data Entry Clerk
| Attribute | Value |
|-----------|-------|
| **Role Code** | `DATA_ENTRY` |
| **Description** | Data input operators |
| **Scope** | Based on organization access |
| **Primary Responsibilities** | - Data entry<br>- Record creation<br>- Basic edits |
| **Key Permissions** | Limited to specific forms (Create/Edit), No Delete access |
| **Organization Access** | As assigned |

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                   SYSTEM ADMINISTRATION                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SYS_ADMIN   │  │SYS_FINANCE_  │  │ SYS_AUDITOR  │      │
│  │ (Full)      │  │MGR           │  │ (Read-Only)  │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│ DIVISION       │  │ ACADEMIC       │  │ FINANCE & HR   │
│ ADMIN          │  │ LEADERSHIP     │  │               │
│                │  │                │  │                │
│• K12_ADMIN     │  │• PRINCIPAL     │  │• FINANCE_MGR   │
│• VOC_ADMIN     │  │• ACADEMIC_     │  │• ACCOUNTANT    │
│• TRAIN_ADMIN   │  │  COORDINATOR   │  │• CASHIER       │
└───────────────┘  │                │  │• HR_MGR        │
                   │                │  │• HR_STAFF      │
                   └───────┬────────┘  └────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌───────▼────────┐ ┌──────▼─────────┐
│ ACADEMIC STAFF  │ │ STUDENT        │ │ EXTERNAL       │
│                │ │ SERVICES       │ │                │
│• TEACHER       │ │• STUDENT_      │ │• PARENT        │
│• HOMEROOM_     │ │  AFFAIRS       │ │• STUDENT       │
│  TEACHER       │ │• LIB_STAFF     │ │• VENDOR        │
│• COUNSELOR     │ │• FACILITY_     │ │                │
│• REGISTRAR     │ │  MGR           │ │                │
└────────────────┘ └────────────────┘ └────────────────┘
```

---

## Menu Structure

### Complete Menu Hierarchy

```
Dashboard
├── Personal Dashboard
│   ├── Overview Widgets
│   ├── Quick Actions
│   ├── Notifications
│   └── My Tasks
│
Academic Management
├── Students
│   ├── Student List
│   ├── Student Profile
│   ├── Enrollment
│   ├── Student Search
│   ├── Student Transfer
│   └── Student Reports
│
├── Curriculum
│   ├── Curriculum List
│   ├── Subject Master
│   ├── Curriculum Mapping
│   ├── Class Management
│   └── Curriculum Reports
│
├── Timetable
│   ├── Timetable List
│   ├── Schedule View (Daily/Weekly)
│   ├── Class Schedule
│   ├── Teacher Schedule
│   ├── Room Schedule
│   ├── Conflict Detection
│   └── Timetable Reports
│
├── Attendance
│   ├── Daily Attendance
│   ├── Subject Attendance
│   ├── Attendance Entry
│   ├── Attendance Reports
│   ├── Absence Alerts
│   └── Attendance Summary
│
└── Grades & Exams
    ├── Exam Management
    │   ├── Exam List
    │   ├── Exam Schedule
    │   ├── Exam Types
    │   └── Exam Results
    │
    ├── Grade Entry
    │   ├── Student Grades
    │   ├── Subject Grades
    │   ├── Grade Calculation
    │   └── Grade Approval
    │
    ├── Report Cards
    │   ├── Generate Report Card
    │   ├── Report Card View
    │   ├── Transcript
    │   └── Academic Performance
    │
    └── Assessment Reports
        ├── Grade Distribution
        ├── Subject Performance
        ├── Class Performance
        └── Student Ranking

Finance Management
├── Invoices
│   ├── Invoice List
│   ├── Create Invoice
│   ├── Invoice Types
│   │   ├── Tuition Fee
│   │   ├── Admission Fee
│   │   ├── Examination Fee
│   │   ├── Transport Fee
│   │   └── Other Charges
│   ├── Invoice Print
│   └── Invoice Reports
│
├── Payments
│   ├── Payment Entry
│   ├── Payment List
│   ├── Payment History
│   ├── Receipt Print
│   ├── Payment Methods
│   │   ├── Cash
│   │   ├── Bank Transfer
│   │   ├── Check
│   │   ├── Credit Card
│   │   └── Online Payment
│   └── Payment Reports
│
├── Payroll
│   ├── Payroll Processing
│   ├── Payroll List
│   ├── Salary Structure
│   ├── Allowances
│   ├── Deductions
│   ├── Pay Slips
│   └── Payroll Reports
│
└── Financial Reports
    ├── Fee Collection Report
    ├── Outstanding Fees
    ├── Payment Summary
    ├── Income Statement
    ├── Balance Sheet
    └── Cash Flow

Human Resources
├── Staff Directory
│   ├── Staff List
│   ├── Staff Profile
│   ├── Teaching Staff
│   ├── Non-Teaching Staff
│   └── Organizational Chart
│
├── Leave Management
│   ├── Leave Request
│   ├── Leave Approval
│   ├── Leave Balance
│   ├── Leave Calendar
│   ├── Leave Types
│   │   ├── Annual Leave
│   │   ├── Sick Leave
│   │   ├── Maternity Leave
│   │   ├── Paternity Leave
│   │   ├── Study Leave
│   │   └── Unpaid Leave
│   └── Leave Reports
│
├── Performance
│   ├── Goal Setting
│   ├── Performance Review
│   ├── Appraisal Cycle
│   ├── Teacher Evaluation
│   ├── KPI Tracking
│   └── Performance Reports
│
└── Recruitment (Optional)
    ├── Job Vacancies
    ├── Applications
    ├── Interviews
    ├── Hiring
    └── Onboarding

Communication
├── Announcements
│   ├── Create Announcement
│   ├── Announcement List
│   ├── Target Audience
│   ├── Priority Levels
│   ├── Publish/Unpublish
│   └── Read Receipts
│
├── Messages
│   ├── Compose Message
│   ├── Inbox
│   ├── Sent Items
│   ├── Message Templates
│   └── Bulk Messaging
│
└── Notifications
    ├── Notification Center
    ├── Alert Configuration
    ├── Notification History
    └── Notification Preferences

Portals
├── Parent Portal
│   ├── Dashboard
│   │   ├── Children Overview
│   │   ├── Fee Status
│   │   ├── Announcements
│   │   └── Quick Actions
│   ├── My Children
│   │   ├── Profile
│   │   ├── Attendance
│   │   ├── Grades
│   │   ├── Report Cards
│   │   └── Schedule
│   ├── Fees
│   │   ├── Fee Details
│   │   ├── Payment History
│   │   ├── Make Payment
│   │   └── Receipt Download
│   ├── Communications
│   │   ├── Messages
│   │   ├── Announcements
│   │   └── Notifications
│   └── Settings
│       ├── Profile
│       ├── Password
│       └── Preferences
│
├── Student Portal
│   ├── Dashboard
│   │   ├── Overview
│   │   ├── Today's Schedule
│   │   ├── Announcements
│   │   └── Upcoming Events
│   ├── My Academics
│   │   ├── Class Schedule
│   │   ├── Subjects
│   │   ├── Attendance
│   │   ├── Grades
│   │   ├── Report Cards
│   │   └── Exam Results
│   ├── Resources
│   │   ├── Library
│   │   ├── Materials (Phase 2)
│   │   └── Assignments (Phase 2)
│   ├── Communications
│   │   ├── Messages
│   │   ├── Announcements
│   │   └── Notifications
│   └── Settings
│       ├── Profile
│       ├── Password
│       └── Preferences
│
└── Teacher Portal
    ├── Dashboard
    │   ├── Overview
    │   ├── My Classes
    │   ├── Today's Schedule
    │   ├── Pending Tasks
    │   └── Announcements
    ├── My Classes
    │   ├── Class List
    │   ├── Student List
    │   ├── Attendance Entry
    │   ├── Grade Entry
    │   └── Class Materials (Phase 2)
    ├── Timetable
    │   ├── My Schedule
    │   ├── Exam Schedule
    │   └── Free Periods
    ├── Students
    │   ├── My Students
    │   ├── Student Profile
    │   ├── Attendance Records
    │   └── Grade Records
    ├── Resources
    │   ├── Book Facilities
    │   ├── My Bookings
    │   └── Available Resources
    ├── Communications
    │   ├── Messages
    │   ├── Send to Parents
    │   ├── Send to Students
    │   └── Announcements
    └── Settings
        ├── Profile
        ├── Password
        └── Preferences

Resources
├── Asset Management
│   ├── Asset List
│   ├── Asset Categories
│   ├── Asset Registration
│   ├── Asset Assignment
│   ├── Asset Tracking
│   ├── Depreciation
│   ├── Maintenance
│   └── Asset Reports
│
├── Library
│   ├── Catalog
│   │   ├── Book List
│   │   ├── Categories
│   │   ├── Search
│   │   └── Advanced Search
│   ├── Circulation
│   │   ├── Issue Book
│   │   ├── Return Book
│   │   ├── Renew Book
│   │   ├── Reserve Book
│   │   └── Loan History
│   ├── Fines
│   │   ├── Fine List
│   │   ├── Collect Fine
│   │   ├── Fine Waiver
│   │   └── Fine Reports
│   ├── Members
│   │   ├── Member List
│   │   ├── Membership
│   │   └── Member History
│   └── Reports
│       ├── Usage Report
│       ├── Overdue Report
│       ├── Popular Books
│       └── Collection Statistics
│
└── Facilities
    ├── Facility List
    ├── Facility Types
    │   ├── Classrooms
    │   ├── Laboratories
    │   ├── Library
    │   ├── Auditorium
    │   ├── Sports Facilities
    │   └── Other Facilities
    ├── Booking
    │   ├── Book Facility
    │   ├── My Bookings
    │   ├── Availability
    │   └── Approval
    ├── Maintenance
    │   ├── Maintenance Request
    │   ├── Work Orders
    │   ├── Repair History
    │   └── Maintenance Schedule
    └── Reports
        ├── Utilization Report
        ├── Maintenance Report
        └── Facility Inventory

System Administration
├── User Management
│   ├── User List
│   ├── Create User
│   ├── User Roles
│   ├── Role Permissions
│   └── User Activity
│
├── Organization
│   ├── Organization Structure
│   ├── Create Organization
│   ├── Organization Hierarchy
│   └── Organization Info
│
├── Configuration
│   ├── System Settings
│   ├── Academic Config
│   │   ├── Academic Years
│   │   ├── Semesters
│   │   ├── Grade Levels
│   │   └── School Types
│   ├── Attendance Config
│   │   ├── Attendance Types
│   │   ├── Late Threshold
│   │   └── Status Options
│   ├── Grade Config
│   │   ├── Grading Scales
│   │   ├── Passing Scores
│   │   └── GPA Settings
│   ├── Fee Config
│   │   ├── Fee Types
│   │   ├── Fee Structure
│   │   └── Discount Rules
│   └── Notification Config
│       ├── Notification Types
│       ├── Alert Rules
│       └── Templates
│
├── Security
│   ├── Session Management
│   ├── Login History
│   ├── Failed Attempts
│   └── Password Policy
│
├── Data Management
│   ├── Import/Export
│   ├── Data Backup
│   ├── Data Restore
│   └── Data Archive
│
└── Audit & Logs
    ├── Audit Trail
    ├── Change Logs
    ├── Access Logs
    └── System Logs
```

---

## Permission Matrix

### Dashboard Access

| Role | Personal Dashboard | School Dashboard | Division Dashboard | System Dashboard |
|------|-------------------|-----------------|-------------------|-----------------|
| SYS_ADMIN | ✅ | ✅ | ✅ | ✅ |
| SYS_FINANCE_MGR | ✅ | ✅ | ✅ | ✅ |
| SYS_AUDITOR | ✅ | ✅ | ✅ | ✅ |
| K12_ADMIN | ✅ | ✅ | ✅ | ❌ |
| VOC_ADMIN | ✅ | ✅ | ✅ | ❌ |
| TRAIN_ADMIN | ✅ | ✅ | ✅ | ❌ |
| PRINCIPAL | ✅ | ✅ | ❌ | ❌ |
| ACADEMIC_COORDINATOR | ✅ | ✅ | ❌ | ❌ |
| TEACHER | ✅ | ✅ | ❌ | ❌ |
| HOMEROOM_TEACHER | ✅ | ✅ | ❌ | ❌ |
| COUNSELOR | ✅ | ✅ | ❌ | ❌ |
| REGISTRAR | ✅ | ✅ | ❌ | ❌ |
| STUDENT_AFFAIRS | ✅ | ✅ | ❌ | ❌ |
| LIB_STAFF | ✅ | ✅ | ❌ | ❌ |
| FACILITY_MGR | ✅ | ✅ | ❌ | ❌ |
| FINANCE_MGR | ✅ | ✅ | ❌ | ❌ |
| ACCOUNTANT | ✅ | ✅ | ❌ | ❌ |
| CASHIER | ✅ | ❌ | ❌ | ❌ |
| HR_MGR | ✅ | ✅ | ❌ | ❌ |
| HR_STAFF | ✅ | ✅ | ❌ | ❌ |
| PARENT | ✅ | ❌ | ❌ | ❌ |
| STUDENT | ✅ | ❌ | ❌ | ❌ |
| VENDOR | ✅ | ❌ | ❌ | ❌ |
| REPORT_VIEWER | ✅ | ✅ | ✅ | ❌ |
| DATA_ENTRY | ✅ | ✅ | ❌ | ❌ |

---

### Academic Module Permissions

#### Students Menu

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | TEACHER | COUNSELOR | REGISTRAR | PARENT | STUDENT |
|--------|-----------|------------|-----------|---------|-----------|-----------|--------|---------|
| View All Students | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Student Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 👶 |
| Create Student | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Edit Student | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Delete Student | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enrollment | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Transfer Student | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Student Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

**👶 = Limited to own children (Parent) or self (Student)**

#### Curriculum Menu

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | ACADEMIC_ COORD | TEACHER | REGISTRAR |
|--------|-----------|------------|-----------|-----------------|---------|-----------|
| View Curriculum | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Curriculum | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Edit Curriculum | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Delete Curriculum | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Subjects | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Curriculum Mapping | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Class Management | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Teacher Assignment | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

#### Timetable Menu

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | ACADEMIC_ COORD | TEACHER |
|--------|-----------|------------|-----------|-----------------|---------|
| View Timetable | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Timetable | ✅ | ✅ | ❌ | ✅ | ❌ |
| Edit Timetable | ✅ | ✅ | ❌ | ✅ | ❌ |
| Delete Timetable | ✅ | ❌ | ❌ | ❌ | ❌ |
| View My Schedule | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Class Schedule | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Teacher Schedule | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Room Schedule | ✅ | ✅ | ✅ | ✅ | ✅ |
| Conflict Detection | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Exceptions | ✅ | ✅ | ✅ | ✅ | ❌ |

#### Attendance Menu

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | TEACHER | COUNSELOR | REGISTRAR | PARENT | STUDENT |
|--------|-----------|------------|-----------|---------|-----------|-----------|--------|---------|
| View All Attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 👶 |
| Mark Attendance | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Attendance | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Attendance | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Attendance Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 👶 |
| View My Attendance | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Exceptions | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

#### Grades & Exams Menu

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | TEACHER | COUNSELOR | REGISTRAR | PARENT | STUDENT |
|--------|-----------|------------|-----------|---------|-----------|-----------|--------|---------|
| View All Grades | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 👶 |
| Create Exam | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Exam | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Exam | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enter Grades | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Edit Own Grades | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Approve Grades | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Generate Report Card | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Report Card | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 👶 |
| Generate Transcript | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Academic Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

---

### Finance Module Permissions

| Action | SYS_ ADMIN | SYS_ FINANCE | DIV_ ADMIN | FINANCE_ MGR | ACCOUNTANT | CASHIER | PARENT | VENDOR |
|--------|-----------|--------------|------------|-------------|------------|---------|--------|--------|
| View All Invoices | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 💼 |
| Create Invoice | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Invoice | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Invoice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Post Invoice | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Payments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👶 | 💼 |
| Create Payment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Process Receipt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Payment Reconciliation | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financial Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Make Payment (Portal) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Pay Online | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Fee Structure | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 👶 | ❌ |

**👶 = Parent: View own children's fees only**
**💼 = Vendor: View own invoices/payments only**

---

### HR Module Permissions

| Action | SYS_ ADMIN | DIV_ ADMIN | HR_ MGR | HR_ STAFF | PRINCIPAL | TEACHER |
|--------|-----------|------------|---------|-----------|-----------|---------|
| View All Staff | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Staff Record | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Staff Record | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Staff Record | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Leave Balance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request Leave | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve Leave | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Process Payroll | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| View Payroll | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Generate Payslip | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Performance Review | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Own Leave | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Own Payslip | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

---

### Library Module Permissions

| Action | SYS_ ADMIN | DIV_ ADMIN | LIB_ STAFF | FACILITY_ MGR | TEACHER | PARENT | STUDENT |
|--------|-----------|------------|-----------|--------------|---------|--------|---------|
| View All Books | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Book | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Book | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Book | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Issue Book | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Return Book | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reserve Book | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Renew Book | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Manage Fines | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Waive Fine | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Catalog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Library Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Own Loans | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### Communication Module Permissions

| Action | SYS_ ADMIN | DIV_ ADMIN | PRINCIPAL | TEACHER | PARENT | STUDENT |
|--------|-----------|------------|-----------|---------|--------|---------|
| View All Announcements | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Announcement | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Own Announcement | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Announcement | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Publish Announcement | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Target Audience | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Message | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk Message | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Message Templates | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Read Receipts | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Notification | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configure Alerts | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### System Administration Permissions

| Action | SYS_ ADMIN | DIV_ ADMIN | REPORT_ VIEWER | DATA_ ENTRY |
|--------|-----------|------------|----------------|-------------|
| View All Users | ✅ | ✅ | ❌ | ❌ |
| Create User | ✅ | ❌ | ❌ | ❌ |
| Edit User | ✅ | ❌ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ |
| Assign Roles | ✅ | ❌ | ❌ | ❌ |
| Manage Organizations | ✅ | ❌ | ❌ | ❌ |
| System Configuration | ✅ | ❌ | ❌ | ❌ |
| Academic Configuration | ✅ | ✅ | ❌ | ❌ |
| Security Settings | ✅ | ❌ | ❌ | ❌ |
| Import/Export Data | ✅ | ❌ | ❌ | ✅ |
| View Audit Logs | ✅ | ✅ | ❌ | ❌ |
| Generate Reports | ✅ | ✅ | ✅ | ❌ |
| Backup & Restore | ✅ | ❌ | ❌ | ❌ |

---

## Organization Access Control

### iDempiere Organization Structure

```
AD_CLIENT (School Management System)
│
├── HEADQUARTERS (Main Office)
│   ├── SYS_ADMIN users
│   ├── SYS_FINANCE_MGR users
│   └── SYS_AUDITOR users
│
├── K-12 DIVISION
│   ├── SD_UNIT (SD Organizations)
│   │   ├── SD_Jakarta
│   │   ├── SD_Bandung
│   │   └── SD_Surabaya
│   │
│   ├── SMP_UNIT (SMP Organizations)
│   │   ├── SMP_Jakarta
│   │   ├── SMP_Bandung
│   │   └── SMP_Surabaya
│   │
│   └── SMA_UNIT (SMA Organizations)
│       ├── SMA_Jakarta
│       ├── SMA_Bandung
│       └── SMA_Surabaya
│
├── VOCATIONAL DIVISION
│   ├── SMK_Jakarta
│   │   ├── SMK_Jakarta_TKJ
│   │   ├── SMK_Jakarta_RPL
│   │   └── SMK_Jakarta_Mesin
│   │
│   └── SMK_Bandung
│       ├── SMK_Bandung_TKJ
│       └── SMK_Bandung_Elektronik
│
└── TRAINING CENTER
    ├── TRAINING_Jakarta
    ├── TRAINING_Bandung
    └── TRAINING_Surabaya
```

### Organization Access per Role

| Role | Access Level | Organizations |
|------|--------------|---------------|
| `SYS_ADMIN` | All | All organizations |
| `SYS_FINANCE_MGR` | All | All organizations |
| `SYS_AUDITOR` | All (Read-only) | All organizations |
| `K12_ADMIN` | Division | All K-12 organizations (SD, SMP, SMA units) |
| `VOC_ADMIN` | Division | All Vocational organizations (SMK) |
| `TRAIN_ADMIN` | Division | All Training Center organizations |
| `PRINCIPAL` | School | Single organization (e.g., SD_Jakarta) |
| `TEACHER` | School | Single organization |
| `STUDENT_AFFAIRS` | School | Single organization |
| `FINANCE_MGR` | School | Single organization |
| `HR_MGR` | School | Single organization |
| `PARENT` | Data Row | Children's organizations |
| `STUDENT` | Data Row | Own organization |

### Organization Access Implementation

**Using `AD_ROLE_ORGACCESS`:**

```sql
-- Example: K12_ADMIN has access to all K-12 organizations
INSERT INTO AD_ROLE_ORGACCESS (
    AD_ROLE_ORGACCESS_ID,
    AD_CLIENT_ID,
    AD_ORG_ID,
    AD_ROLE_ID,
    ISREADONLY
) VALUES (
    (SELECT MAX(AD_ROLE_ORGACCESS_ID) + 1 FROM AD_ROLE_ORGACCESS),
    1000000,  -- AD_CLIENT_ID
    1000005,  -- SD_UNIT Org ID
    (SELECT AD_ROLE_ID FROM AD_ROLE WHERE VALUE = 'K12_ADMIN'),
    'N'
);

-- Repeat for all K-12 organizations
```

**Using `AD_USER_ORGACCESS`:**

```sql
-- Example: Principal assigned to specific school
INSERT INTO AD_USER_ORGACCESS (
    AD_USER_ORGACCESS_ID,
    AD_CLIENT_ID,
    AD_ORG_ID,
    AD_USER_ID,
    ISREADONLY
) VALUES (
    (SELECT MAX(AD_USER_ORGACCESS_ID) + 1 FROM AD_USER_ORGACCESS),
    1000000,
    1000010,  -- SD_Jakarta Org ID
    (SELECT AD_USER_ID FROM AD_USER WHERE NAME = 'Principal SD Jakarta'),
    'N'
);
```

---

## Role Assignment Guidelines

### User Role Assignment Rules

1. **One Primary Role per User**
   - Each user should have ONE primary role
   - Additional roles can be assigned if needed (rare cases)

2. **System Administrator Role Assignment**
   - Only assigned to IT/system administrators
   - Maximum 2-3 users per organization
   - Requires approval from school director

3. **Division Admin Role Assignment**
   - Assigned to division heads
   - One per division
   - Requires approval from system administration

4. **Principal Role Assignment**
   - One principal per school
   - Cannot be assigned to multiple schools simultaneously

5. **Teacher Role Assignment**
   - All teachers get TEACHER role
   - Additional HOMEROOM_TEACHER role if assigned as homeroom
   - Organization must match school where teacher works

6. **Parent Role Assignment**
   - Automatically created when child is enrolled
   - One parent account can be linked to multiple children
   - Roles are managed via `SCH_STUDENT_PARENT` table

7. **Student Role Assignment**
   - Automatically created upon enrollment
   - Role is managed via `SCH_STUDENT_PORTAL` table
   - Disabled upon graduation/transfer

### Role Assignment Workflow

```
┌──────────────────────────────────────────────────────────┐
│                   ROLE ASSIGNMENT FLOW                    │
└──────────────────────────────────────────────────────────┘

     REQUEST                APPROVAL               ASSIGNMENT
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │  User   │           │ Manager │           │   Sys   │
    │ Request│───────────▶│ Approve│───────────▶│ Assign  │
    │ Role   │           │ Request │           │ Role    │
    └─────────┘           └─────────┘           └─────────┘
         │                     │                     │
         ▼                     ▼                     ▼
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Notify  │           │ Notify  │           │ Notify  │
    │ Request │           │ Manager │           │ User    │
    │ Pending │           │ Action  │           │ Active  │
    └─────────┘           └─────────┘           └─────────┘

                        HIGH-LEVEL ROLES
    ┌───────────────────────────────────────────┐
    │  SYS_ADMIN, DIV_ADMIN                     │
    │  → Requires Board/Director approval       │
    │  → Limited number of users                │
    │  → Annual review required                 │
    └───────────────────────────────────────────┘

                        STANDARD ROLES
    ┌───────────────────────────────────────────┐
    │  Teacher, Staff, Principal                │
    │  → HR approval                            │
    │  → Based on employment/assignment         │
    │  → Role changes with position changes     │
    └───────────────────────────────────────────┘

                        EXTERNAL ROLES
    ┌───────────────────────────────────────────┐
    │  Parent, Student, Vendor                  │
    │  → Automatic based on relationship        │
    │  → Self-service portal creation            │
    │  → Role expiry based on relationship      │
    └───────────────────────────────────────────┘
```

### Role Expiration & Review

| Role Type | Review Period | Auto-Expire | Notes |
|-----------|--------------|-------------|-------|
| System Admin | Annually | No | Board approval required for renewal |
| Division Admin | Annually | No | Director approval required |
| Principal | On Appointment | No | Linked to position |
| Teacher | Academic Year | No | Linked to employment |
| Parent | Ongoing | Yes | When last child leaves |
| Student | Academic Year | Yes | On graduation/transfer |
| Vendor | Contract | Yes | Contract end date |

---

## Appendix

### A. Role Code Reference

Complete list of role codes for system configuration:

```javascript
const ROLE_CODES = {
  // Tier 1: System Administration
  SYS_ADMIN: 'SYS_ADMIN',
  SYS_FINANCE_MGR: 'SYS_FINANCE_MGR',
  SYS_AUDITOR: 'SYS_AUDITOR',

  // Tier 2: Division Administration
  K12_ADMIN: 'K12_ADMIN',
  VOC_ADMIN: 'VOC_ADMIN',
  TRAIN_ADMIN: 'TRAIN_ADMIN',

  // Tier 3: Academic Leadership
  PRINCIPAL: 'PRINCIPAL',
  ACADEMIC_COORDINATOR: 'ACADEMIC_COORDINATOR',

  // Tier 4: Academic Staff
  TEACHER: 'TEACHER',
  HOMEROOM_TEACHER: 'HOMEROOM_TEACHER',
  COUNSELOR: 'COUNSELOR',
  REGISTRAR: 'REGISTRAR',

  // Tier 5: Student Services
  STUDENT_AFFAIRS: 'STUDENT_AFFAIRS',
  LIB_STAFF: 'LIB_STAFF',
  FACILITY_MGR: 'FACILITY_MGR',

  // Tier 6: Finance & HR
  FINANCE_MGR: 'FINANCE_MGR',
  ACCOUNTANT: 'ACCOUNTANT',
  CASHIER: 'CASHIER',
  HR_MGR: 'HR_MGR',
  HR_STAFF: 'HR_STAFF',

  // Tier 7: External Users
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
  VENDOR: 'VENDOR',

  // Tier 8: Limited Access
  REPORT_VIEWER: 'REPORT_VIEWER',
  DATA_ENTRY: 'DATA_ENTRY'
};
```

### B. Menu Access Control Implementation

**iDempiere Access Control Tables:**

- `AD_WINDOW_ACCESS` - Window/menu access per role
- `AD_PROCESS_ACCESS` - Process/report access per role
- `AD_FORM_ACCESS` - Form access per role
- `AD_TABLE_ACCESS` - Table-level access per role
- `AD_RECORD_ACCESS` - Record-level access per role

### C. Permission Levels

| Level | Description | Implementation |
|-------|-------------|----------------|
| **Full Access** | Create, Read, Update, Delete | All CRUD permissions |
| **Edit Access** | Create, Read, Update | No delete permission |
| **Read-Only** | View only | No create/edit/delete |
| **Limited** | Own records only | Record-level security |
| **None** | No access | Explicit denial |

### D. Related Documents

- [Database Schema Summary](./2025-01-24-database-schema-summary.md)
- [iDempiere Security Documentation](https://wiki.idempiere.org/en/Access_and_Security)
- [iDempiere Role Management](https://wiki.idempiere.org/en/Org/User)

---

**Document Version:** 1.0
**Last Updated:** 2025-01-24
**Author:** School Management System Development Team
