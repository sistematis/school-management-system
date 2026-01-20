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

## Testing Coverage

The application has comprehensive test coverage across Academic and Finance modules:

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

**Test Configuration:**
- Testing Framework: Vitest 4.0.17
- Total Tests: 105 tests passing
- Coverage Provider: v8

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
