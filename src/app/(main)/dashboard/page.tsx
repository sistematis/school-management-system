import { BookOpen, CheckSquare, DollarSign, FileText, Plus, UserCheck, Users } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { EventsCard } from "@/components/dashboard/events-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardHeader } from "@/components/layout/dashboard-shell";

// Mock data - replace with actual data fetching
const statsData = [
  {
    id: "1",
    title: "Total Students",
    value: "1,247",
    trend: "+12% from last month",
    trendUp: true,
    icon: Users,
  },
  {
    id: "2",
    title: "Revenue This Month",
    value: "IDR 450M",
    trend: "+8% from last month",
    trendUp: true,
    icon: DollarSign,
  },
  {
    id: "3",
    title: "Active Classes",
    value: "48",
    trend: "3 new this semester",
    trendUp: true,
    icon: BookOpen,
  },
  {
    id: "4",
    title: "Staff Members",
    value: "86",
    trend: "+5 this month",
    trendUp: true,
    icon: UserCheck,
  },
];

const activitiesData = [
  {
    id: "1",
    message: "Payment received from John Smith - IDR 2,500,000",
    time: "5 minutes ago",
  },
  {
    id: "2",
    message: "New student enrollment: Sarah Johnson - Grade 10",
    time: "15 minutes ago",
  },
  {
    id: "3",
    message: "5 invoices are overdue this month",
    time: "1 hour ago",
  },
  {
    id: "4",
    message: "Exam results published for Grade 9 Mathematics",
    time: "2 hours ago",
  },
  {
    id: "5",
    message: "Staff meeting scheduled for tomorrow at 10:00 AM",
    time: "3 hours ago",
  },
];

const eventsData = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    date: "Jan 15, 2026",
    time: "09:00 AM",
  },
  {
    id: "2",
    title: "Mid-term Examinations",
    date: "Jan 20-25, 2026",
    time: "All Day",
  },
  {
    id: "3",
    title: "Sports Day",
    date: "Jan 28, 2026",
    time: "08:00 AM",
  },
  {
    id: "4",
    title: "Fee Payment Deadline",
    date: "Jan 31, 2026",
    time: "11:59 PM",
  },
];

const quickActionsData = [
  { id: "1", label: "Add Student", icon: Plus, href: "/academic/students/new" },
  {
    id: "2",
    label: "Generate Invoice",
    icon: FileText,
    href: "/finance/invoices/new",
  },
  { id: "3", label: "Create Class", icon: BookOpen, href: "/academic/timetable" },
  {
    id: "4",
    label: "Mark Attendance",
    icon: CheckSquare,
    href: "/academic/attendance",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Dashboard Overview" description="Welcome back! Here's what's happening today." />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Activity Feed and Events */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Recent Activity</h2>
            <ActivityFeed activities={activitiesData} />
          </div>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-xl">Upcoming Events</h2>
          <EventsCard events={eventsData} />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 font-semibold text-xl">Quick Actions</h2>
        <QuickActions actions={quickActionsData} />
      </div>
    </div>
  );
}
