# School Management System

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI
- Responsive and mobile-friendly
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)
- Flexible layouts (collapsible sidebar, variable content widths)
- Authentication flows and screens
- **School Management Modules**:
  - Academic (Students, Curriculum, Timetable, Attendance, Grades & Exams)
  - Finance (Invoices, Payments, Payroll, Reports)
  - Human Resources (Staff Directory, Leave Management, Performance)
  - Communication (Parent Portal, Student Portal, Notifications)
  - Resources (Asset Management, Library, Facilities)
- Dashboard with stats, activity feed, events, and quick actions

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):
>
> - Tangerine
> - Neo Brutalism
> - Soft Pop
>
> You can create more presets by following the same structure as the existing ones.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod
- **Forms & State Management**: React Hook Form, Zustand
- **Tables & Data Handling**: TanStack Table
- **Tooling & DX**: Biome, Husky

## Project Structure

```
src/
├── app/(main)/
│   ├── dashboard/           # Main dashboard page
│   ├── academic/            # Academic management modules
│   │   ├── students/
│   │   ├── curriculum/
│   │   ├── timetable/
│   │   ├── attendance/
│   │   └── grades/
│   ├── finance/             # Finance management modules
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── payroll/
│   │   └── reports/
│   ├── hr/                  # Human Resources modules
│   │   ├── staff-directory/
│   │   ├── leave-management/
│   │   └── performance/
│   ├── communication/       # Communication modules
│   │   ├── parent-portal/
│   │   ├── student-portal/
│   │   └── notifications/
│   └── resources/           # Resource management modules
│       ├── assets/
│       ├── library/
│       └── facilities/
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── stat-card.tsx
│   │   ├── activity-feed.tsx
│   │   ├── events-card.tsx
│   │   └── quick-actions.tsx
│   ├── layout/              # Shared layout components
│   │   └── dashboard-shell.tsx
│   └── ui/                  # Shadcn UI components
└── navigation/
    └── sidebar/             # Sidebar navigation configuration
        └── sidebar-items.ts
```

## Dashboard Components

### StatCard
Displays key metrics with trend indicators and icons.

### ActivityFeed
Shows recent activity items with timestamps.

### EventsCard
Lists upcoming events with dates and times.

### QuickActions
Provides quick access buttons for common actions.

## Navigation

The sidebar navigation is organized into modules:
- **Dashboard** - Main overview page
- **Academic** - Student and curriculum management
- **Finance** - Financial management and reporting
- **Human Resources** - Staff and HR management
- **Communication** - Portal and notification management
- **Resources** - Asset and facility management

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format

# Run all checks
npm run check

# Run tests
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Academic Module Details

### Students (`/academic/students`)
Student Information System with comprehensive profile management including personal information, grade assignments, and parent details.

**Features:**
- Card-based student display with avatars
- Search and filter functionality
- Export capabilities
- Statistics dashboard

### Curriculum (`/academic/curriculum`)
Course and syllabus management with credit hour tracking.

**Features:**
- Subject cards with detailed information
- Subject type classification (Core, Language, Elective)
- Grading weights configuration
- Grade level filtering

### Gradebook (`/academic/grades`)
Student grade management with automatic calculations.

**Features:**
- Weighted grade calculation (Assignments 30%, Midterm 30%, Final 30%, Participation 10%)
- Automatic letter grade assignment with color coding
- Class statistics and grade distribution tracking

### Timetable (`/academic/timetable`)
Weekly class schedule management.

**Features:**
- Weekly grid view with time slots
- Class details (subject, teacher, room, grade)
- Week navigation with date range display
- Free period indicators

### Attendance (`/academic/attendance`)
Student attendance tracking system.

**Features:**
- Interactive attendance marking (Present, Late, Absent, Excused)
- Real-time statistics calculation
- Attendance rate tracking
- Filter by date and class

## Finance Module Details

### Invoices (`/finance/invoices`)
Invoice management system for school billing.

**Features:**
- Invoice creation and tracking with student information
- Multiple payment status tracking (Paid, Pending, Overdue, Cancelled)
- Invoice items and amount breakdown
- Due date management
- Search and filter by invoice, student name, or ID
- Export capabilities

### Payments (`/finance/payments`)
Payment transaction tracking and monitoring.

**Features:**
- Transaction history with IDs and timestamps
- Multiple payment methods (Virtual Account, Credit Card, E-Wallet, Cash)
- Payment method statistics dashboard
- Real-time transaction status tracking (Completed, Pending, Failed)
- Student and invoice reference tracking
- Search and filter functionality

### Payroll (`/finance/payroll`)
Staff salary and compensation management.

**Features:**
- Employee payroll records with position details
- Salary breakdown (Base Salary, Allowances, Incentives, Deductions)
- Attendance-based calculations
- Net salary computation
- Payment status tracking (Paid, Pending, Processing)
- Period-based filtering
- Search by employee name, ID, or position

### Reports (`/finance/reports`)
Financial reporting and analytics dashboard.

**Features:**
- Summary statistics with trend indicators
- Multiple report types (Revenue, Expense, Invoices, Payroll, Payments)
- Report cards with detailed information
- Period-based reporting
- Generated-by tracking
- Search and filter by report name or ID
- Date range filtering

## Human Resources Module Details

### Staff Directory (`/hr/staff-directory`)
Comprehensive staff information management system.

**Features:**
- Staff profile cards with avatars displaying initials
- Department classification (Teaching, Administration, Support Staff)
- Employment status tracking (Active, On Leave, Inactive)
- Position and contact information management
- Join date tracking
- Statistics dashboard (Total Staff, Active, On Leave, Teaching Staff, Non-Teaching)
- Search by name, ID, department, or email
- Export capabilities

### Leave Management (`/hr/leave-management`)
Staff leave request and balance management system.

**Features:**
- Leave request tracking with unique request IDs
- Multiple leave types (Sick Leave, Annual Leave, Personal, Emergency)
- Leave status workflow (Pending, Approved, Rejected, Cancelled)
- Date range and duration calculation
- Approve/Reject actions for pending requests
- Staff member information with avatars
- Reason tracking for each request
- Statistics dashboard (Pending Requests, Approved This Month, On Leave Today, Total Leave Days)
- Search by staff name or request ID
- Filter by leave type and status

### Performance (`/hr/performance`)
Staff performance evaluation and review tracking system.

**Features:**
- Performance review records with unique IDs
- Star rating display (1-5 stars with half-star support)
- Color-coded ratings (4.5+ green, 4.0-4.4 blue, 3.5-3.9 yellow, <3.5 red)
- Review status tracking (Completed, In Progress, Pending, Draft)
- Review period filtering by quarter
- Department and staff member assignment
- Reviewer assignment and date tracking
- Goals and objectives management per review
- Statistics dashboard (Reviews This Quarter, Average Rating, Top Performers, Improvement Needed)
- Search by staff name or review ID
- Filter by rating, status, and quarter

## Testing Coverage

The application has comprehensive test coverage across Academic, Finance, and Human Resources modules:

### Academic Module

| Page | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Students | 100% | 100% | 100% | 100% |
| Timetable | 100% | 100% | 100% | 100% |
| Attendance | 93.75% | 100% | 85.71% | 93.33% |
| Curriculum | 91.66% | 75% | 100% | 91.66% |
| Grades | 83.33% | 81.25% | 100% | 85.71% |
| **Overall** | **92.42%** | **84.61%** | **96.55%** | **93.33%** |

### Finance Module

| Page | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Payments | 97.29% | 80.95% | 90.9% | 97.29% |
| Payroll | 95.23% | 70% | 87.5% | 95.23% |
| Reports | 95.34% | 88.57% | 90% | 95.34% |
| Invoices | 90% | 73.68% | 88.88% | 90% |
| **Overall** | **93.9%** | **81.98%** | **92.53%** | **94.24%** |

### Human Resources Module

| Page | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Leave Management | 92.59% | 78.94% | 85.71% | 92.59% |
| Performance | 91.66% | 60.97% | 88.88% | 90.9% |
| Staff Directory | 87.5% | 58.82% | 85.71% | 87.5% |
| **Overall** | **90.58%** | **66.24%** | **86.77%** | **90.33%** |

### Overall Project Coverage

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| Academic | 92.42% | 84.61% | 96.55% | 93.33% |
| Finance | 93.9% | 81.98% | 92.53% | 94.24% |
| Human Resources | 90.58% | 66.24% | 86.77% | 90.33% |
| **Overall** | **92.9%** | **75% | **91.11%** | **93%** |

**Test Configuration:**
- Testing Framework: Vitest 4.0.17
- Total Tests: 138 tests passing
- Coverage Provider: v8
- Overall Coverage: 92.9% statements, 75% branches, 91.11% functions, 93% lines

### Formatting and Linting

Format, lint, and organize imports

```bash
npx @biomejs/biome check --write
```

> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

---

> [!IMPORTANT]
> This project is updated frequently. If you're working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.

**Happy Vibe Coding!**
