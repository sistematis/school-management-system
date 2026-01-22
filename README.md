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
- **Data Fetching**: TanStack Query (React Query)
- **Tables & Data Handling**: TanStack Table
- **ERP Integration**: iDempiere REST API
- **Tooling & DX**: Biome, Husky, Vitest

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
├── lib/
│   ├── api/
│   │   └── idempiere/       # iDempiere REST API integration
│   │       ├── client.ts    # HTTP client with auth
│   │       ├── config.ts    # API configuration
│   │       ├── types.ts     # TypeScript types
│   │       ├── transformers.ts # Data mapping
│   │       └── services/    # Per-entity services
│   ├── hooks/               # Custom React hooks
│   │   ├── use-debounce.ts  # Debounce hook for search inputs
│   │   └── use-idempiere-data.ts # React Query hooks
│   ├── stores/              # Zustand stores
│   │   └── idempiere-auth.store.ts
│   └── utils.ts
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
- **Zero-Latency Input Focus**: Cursor remains active in search field during and after API hits/state updates
- **Debounced auto-search** (300ms delay) that automatically triggers as you type
- **Ref-based focus management**: Uses `useRef` with focus tracking and automatic restoration after re-renders
- **Optimistic UI/Non-blocking loading**: Loading indicator doesn't overlay or disable the input field
- **Loading indicator** (subtle spinner) during search operations
- **Empty state handling** with helpful messages when no results are found
- Grade filtering and export capabilities
- Statistics dashboard

**Technical Details:**
- Uses `useDebounce` hook for efficient search debouncing (300ms)
- Maintains input focus across re-renders using controlled inputs, refs, and focus restoration
- React Query for data fetching with automatic caching
- iDempiere REST API integration

**Focus Management Implementation:**
- `inputFocusedRef` tracks whether the search input was interacted with
- `useEffect` with `setTimeout(0)` ensures focus is restored after React completes rendering
- `onFocus` and `onBlur` handlers properly track focus state
- Focus is restored whenever `isLoading` or `isSearchLoading` state changes

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

## Communication Module Details

### Parent Portal (`/communication/parent-portal`)
Parent communication and child academic progress monitoring system.

**Features:**
- Student information cards with avatars and initials
- Attendance percentage tracking
- Academic performance with average grades and trend indicators
- Behavior status tracking (Excellent, Good, Needs Improvement)
- Outstanding fees display with payment links
- Parent-teacher messaging with read/unread indicators
- School announcements with type and priority badges
- Statistics dashboard (Total Students, Unread Messages, Upcoming Meetings, Outstanding Fees)
- Search by student name, ID, or announcement
- Filter by student class, message status, and announcement urgency

### Student Portal (`/communication/student-portal`)
Student academic dashboard with class management tools.

**Features:**
- Today's class schedule with teacher, room, and time information
- Assignment tracking with status (Not Submitted, Submitted, Graded, Late)
- Grade display with percentage breakdown and letter grades
- Academic performance table with trend indicators
- Achievement badges with emoji icons and categories
- GPA and attendance statistics
- Search by class subject or assignment name
- Filter by assignment status and achievement category
- Subject-based navigation and resource links

### Notifications (`/communication/notifications`)
System-wide notification management and alerts.

**Features:**
- Notification list with priority-based sorting (Urgent, High, Normal, Low)
- Notification type categories (System, Academic, Behavior, Event, Fee, Emergency)
- Read/unread status tracking with visual indicators
- Relative time display (e.g., "2h ago", "Yesterday", "3d ago")
- Action buttons for relevant notifications (Pay Now, Add to Calendar, etc.)
- Quick actions for bulk management (Mark Read, Archive, Delete)
- Notification preferences with enable/disable toggles
- Statistics dashboard (Unread, High Priority, Archived, Total)
- Search by title, message, or sender
- Filter by type, priority, and status

## Resources Module Details

### Asset Management (`/resources/asset-management`)
School property and equipment inventory tracking system.

**Features:**
- Asset cards with unique IDs and detailed information
- Category classification (Electronics, Furniture, Equipment, Vehicles)
- Condition tracking (Excellent, Good, Fair, Poor, Needs Repair, Retired)
- Location and assignment tracking
- Purchase date and current value display
- Warranty information with expiry date alerts
- Statistics dashboard (Total Assets, Electronics, Needs Repair, Total Value)
- Search by asset name, ID, or location
- Filter by category and condition
- Quick actions (Audit Assets, Schedule Maintenance, Report Issue)

### Facilities (`/resources/facilities`)
Room booking and facility maintenance management system.

**Features:**
- Room cards with type icons and capacity information
- Room status tracking (Available, Occupied, Maintenance, Closed, Booked)
- Location and equipment details
- Maintenance scheduling with last/next due dates
- Room type filtering (Classroom, Laboratory, Library, Auditorium, Gymnasium, Cafeteria, Office)
- Recent bookings list with approval workflow
- Booking information (purpose, requester, attendees, time range)
- Approve/Reject actions for pending bookings
- Statistics dashboard (Total Rooms, Available, In Use, Maintenance)
- Search by room name, ID, or location
- Filter by type and status
- Quick actions (View Schedule, Maintenance, Report Issue)

### Library (`/resources/library`)
Book catalog and borrowing management system.

**Features:**
- Book catalog with detailed information
- Book category classification (Fiction, Non-Fiction, Reference, Textbook, Periodical)
- Availability tracking (Available, Borrowed, Overdue, Reserved, Lost, Damaged)
- Location and ISBN tracking
- Author and publisher information
- Page count and language details
- Active borrow records with student information
- Fine calculation and payment tracking
- Digital resources section (E-books, Audiobooks, Videos, Databases)
- Access type badges (Free, Subscription, Paid)
- Statistics dashboard (Total Books, Available, Borrowed, Overdue)
- Search by title, author, or ISBN
- Filter by category and status
- Quick actions (Process Returns, Manage Reservations, Overdue Alerts)

## iDempiere ERP Integration

The School Management System now integrates with **iDempiere ERP** via REST API for enterprise-grade data management.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│  - UI Components, Forms, Tables, Dashboard                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              API Integration Layer                          │
│  - lib/api/idempiere/client.ts      # HTTP client         │
│  - lib/api/idempiere/services/      # Entity services     │
│  - lib/hooks/use-idempiere-data.ts   # React Query hooks   │
│  - lib/stores/idempiere-auth.store.ts # Auth state        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  iDempiere REST API                         │
│  - C_BPartner (Students/Staff)                             │
│  - C_Invoice (Billing)                                     │
│  - C_Payment (Transactions)                                │
│  - A_Asset (Inventory)                                     │
│  - M_Product (Library)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Configuration

Create a `.env.local` file with your iDempiere credentials:

```env
# iDempiere REST API Configuration
NEXT_PUBLIC_IDEMPIERE_API_URL=https://backend-school-management-system.sistematis.co.id/api/v1
NEXT_PUBLIC_IDEMPIERE_CLIENT_ID=1000000
NEXT_PUBLIC_IDEMPIERE_ROLE_ID=1000000
NEXT_PUBLIC_IDEMPIERE_ORG_ID=1000000
NEXT_PUBLIC_IDEMPIERE_WAREHOUSE_ID=1000000
NEXT_PUBLIC_IDEMPIERE_LANGUAGE=en_US
```

**Sistematis Backend Configuration**:
- Backend: `backend-school-management-system.sistematis.co.id`
- Protocol: `https`
- Test Credentials: `sistematis` / `s1stemat1s`

### Features

- **Authentication**: Token-based auth with automatic refresh
- **Pagination**: Handle large datasets (15,000+ records) efficiently
- **Caching**: React Query caching with configurable stale time
- **Error Handling**: Comprehensive error handling and retry logic
- **Type Safety**: Full TypeScript support for all iDempiere entities

### Entity Mapping

| School Management | iDempiere Table | REST Endpoint |
|-------------------|-----------------|---------------|
| Students | C_BPartner | /models/C_BPartner |
| Staff | C_BPartner | /models/C_BPartner |
| Invoices | C_Invoice | /models/C_Invoice |
| Payments | C_Payment | /models/C_Payment |
| Assets | A_Asset | /models/A_Asset |
| Library Books | M_Product | /models/M_Product |

### Usage Example

```typescript
import { useStudents, useStudentStats } from "@/lib/hooks/use-idempiere-data";

function StudentsPage() {
  // Fetch paginated students
  const { data: studentsData, isLoading, error } = useStudents({
    page: 1,
    pageSize: 100,
  });

  // Fetch student statistics
  const { data: stats } = useStudentStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Total Students: {stats?.total}</p>
      {studentsData?.records.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

### Authentication Flow

1. **Login**: POST `/api/v1/auth/tokens` with credentials
2. **Get Options**: Fetch available roles, organizations, warehouses
3. **Finalize**: PUT `/api/v1/auth/tokens` with selected options
4. **Use Token**: Include `Authorization: Bearer {token}` header
5. **Auto Refresh**: Token refreshes automatically on 401 response

### Token Refresh Implementation

The application implements best practices for refresh token handling:

- **Automatic Token Refresh**: When a 401 Unauthorized response is received, the client automatically attempts to refresh the access token using the stored refresh token
- **Refresh Endpoint**: POST `/api/v1/auth/refresh` with body:
  ```json
  {
    "refresh_token": "{{refreshToken}}",
    "clientId": {{clientId}},
    "userId": {{userId}}
  }
  ```
- **Response**: Returns new access token and refresh token:
  ```json
  {
    "token": "eyJraWQiOiJpZ....",
    "refresh_token": "eyJraWQiOiJpZG..."
  }
  ```
- **Token Expiration**: Access tokens expire after 1 hour, refresh tokens expire after 24 hours
- **Concurrent Request Handling**: Prevents multiple simultaneous refresh attempts using a promise queue
- **Storage**: Tokens are stored in localStorage with keys `idempiere_token` and `idempiere_refresh_token`
- **Fallback**: If refresh fails, the user is automatically logged out and redirected to login

Based on: [iDempiere REST API Documentation](https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication#-refresh-token)

## Testing Coverage

The application has comprehensive test coverage across Academic, Finance, Human Resources, Communication, and Resources modules:

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

### Communication Module

| Page | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Notifications | 81.81% | 68.57% | 81.81% | 88% |
| Parent Portal | 82% | 59.57% | 85.71% | 82% |
| Student Portal | 87.93% | 70.45% | 93.33% | 90.74% |
| **Overall** | **83.91%** | **66.01% | **86.62%** | **86.91%** |

### Resources Module

| Page | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Asset Management | 92.59% | 80% | 100% | 92.59% |
| Facilities | 89.83% | 76.92% | 90.9% | 89.83% |
| Library | 87.75% | 72.22% | 90% | 88.23% |
| **Overall** | **90.06%** | **76.38%** | **93.63%** | **90.22%** |

### Overall Project Coverage

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| Academic | 92.42% | 84.61% | 96.55% | 93.33% |
| Finance | 93.9% | 81.98% | 92.53% | 94.24% |
| Human Resources | 90.58% | 66.24% | 86.77% | 90.33% |
| Communication | 83.91% | 66.01% | 86.62% | 86.91% |
| Resources | 90.06% | 76.38% | 93.63% | 90.22% |
| **Overall** | **90.18%** | **74.35%** | **90.5%** | **91.18%** |

**Test Configuration:**
- Testing Framework: Vitest 4.0.17
- Total Tests: 240 tests passing
- Coverage Provider: v8
- Overall Coverage: 90.18% statements, 74.35% branches, 90.5% functions, 91.18% lines

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
