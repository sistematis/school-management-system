import {
  Banknote,
  Bell,
  BookOpen,
  Building,
  CalendarClock,
  Calendar as CalendarIcon,
  ChartBar,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  type LucideIcon,
  MessageSquare,
  Package,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Academic",
        url: "#",
        icon: GraduationCap,
        subItems: [
          { title: "Students", url: "/academic/students", icon: Users },
          { title: "Curriculum", url: "/academic/curriculum", icon: BookOpen },
          { title: "Timetable", url: "/academic/timetable", icon: CalendarIcon },
          { title: "Attendance", url: "/academic/attendance", icon: ClipboardCheck },
          { title: "Grades & Exams", url: "/academic/grades", icon: FileText },
        ],
      },
      {
        title: "Finance",
        url: "#",
        icon: Banknote,
        subItems: [
          { title: "Invoices", url: "/finance/invoices", icon: FileText },
          { title: "Payments", url: "/finance/payments", icon: CreditCard },
          { title: "Payroll", url: "/finance/payroll", icon: Wallet },
          { title: "Reports", url: "/finance/reports", icon: ChartBar },
        ],
      },
      {
        title: "Human Resources",
        url: "#",
        icon: UserCheck,
        subItems: [
          { title: "Staff Directory", url: "/hr/staff-directory", icon: Users },
          { title: "Leave Management", url: "/hr/leave-management", icon: CalendarClock },
          { title: "Performance", url: "/hr/performance", icon: TrendingUp },
        ],
      },
      {
        title: "Communication",
        url: "#",
        icon: MessageSquare,
        subItems: [
          { title: "Parent Portal", url: "/communication/parent-portal", icon: Users },
          { title: "Student Portal", url: "/communication/student-portal", icon: GraduationCap },
          { title: "Notifications", url: "/communication/notifications", icon: Bell },
        ],
      },
      {
        title: "Resources",
        url: "#",
        icon: Package,
        subItems: [
          { title: "Asset Management", url: "/resources/asset-management", icon: Package },
          { title: "Library", url: "/resources/library", icon: Library },
          { title: "Facilities", url: "/resources/facilities", icon: Building },
        ],
      },
    ],
  },
];
