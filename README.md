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
```

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
