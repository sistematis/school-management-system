"use client";

import { useState } from "react";

import {
  Calendar,
  Download,
  Filter,
  GraduationCap,
  Loader2,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// iDempiere API imports
import {
  useDeleteStudent,
  useIdempiereAuthActions,
  useIdempiereAuthenticated,
  useSearchStudents,
  useStudentStats,
  useStudents,
} from "@/lib/hooks/use-idempiere-data";

function StudentCard({
  student,
}: {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    initials: string;
    email?: string;
    phone?: string;
    grade: string;
    parentName?: string;
    dateOfBirth?: string;
    status: string;
  };
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-primary/10">
              <span className="font-semibold text-primary text-sm">{student.initials}</span>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-muted-foreground text-sm">{student.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 px-6">
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.grade}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.email ?? "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.phone ?? "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.parentName ?? "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">DOB: {student.dateOfBirth ?? "N/A"}</span>
        </div>
      </div>

      <div className="flex gap-2 px-6 pt-4 pb-6">
        <Button variant="outline" size="sm" className="flex-1">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

function StatsCards({
  stats,
  isLoading,
}: {
  stats: {
    label: string;
    value: string | number;
  }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-8 w-12 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <p className="text-muted-foreground text-sm">{stat.label}</p>
          <p className="mt-1 font-bold text-3xl">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}

export default function StudentsPage() {
  const isAuthenticated = useIdempiereAuthenticated();
  const { login } = useIdempiereAuthActions();

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 9; // Show 9 cards per page (3x3 grid)

  // Fetch students data with React Query
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents({ page, pageSize });

  // Fetch search results when searching
  const { data: searchData, isLoading: searchLoading } = useSearchStudents(
    searchTerm,
    { page, pageSize },
    {
      enabled: searchTerm.length > 0,
    },
  );

  // Fetch student statistics
  const { data: statsData, isLoading: statsLoading } = useStudentStats();

  // Delete mutation
  const _deleteStudent = useDeleteStudent();

  // Use search results if searching, otherwise use regular results
  const displayData = searchTerm.length > 0 ? searchData : studentsData;
  const isLoading = searchTerm.length > 0 ? searchLoading : studentsLoading;
  const students = displayData?.records ?? [];

  // Calculate stats from data
  const stats = [
    { label: "Total Students", value: statsData?.total ?? displayData?.totalRecords ?? "-" },
    { label: "Active", value: statsData?.active ?? "-" },
    { label: "Grade 9", value: "-" },
    { label: "Grade 10", value: "-" },
    { label: "Grade 11-12", value: "-" },
  ];

  const totalPages = displayData?.totalPages ?? 1;

  // Handle login for demo
  const handleLogin = async () => {
    // This is a demo login - in production, you'd have a proper login form
    await login("demo", "demo");
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h2 className="mb-4 font-bold text-2xl">iDempiere Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please configure your iDempiere REST API credentials in the environment variables to access the student
            data.
          </p>
          <div className="space-y-4 text-left text-sm">
            <p className="font-semibold">Required Environment Variables:</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>NEXT_PUBLIC_IDEMPIERE_API_URL</li>
              <li>NEXT_PUBLIC_IDEMPIERE_CLIENT_ID</li>
              <li>NEXT_PUBLIC_IDEMPIERE_ROLE_ID</li>
              <li>NEXT_PUBLIC_IDEMPIERE_ORG_ID</li>
            </ul>
          </div>
          <Button onClick={handleLogin} className="mt-6" disabled>
            Connect to iDempiere
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Student Information System</h1>
          <p className="mt-2 text-muted-foreground">Manage student profiles and enrollment (Powered by iDempiere)</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to page 1 when searching
              }}
            />
          </div>
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Error State */}
      {studentsError && (
        <Card className="border-destructive/50 bg-destructive/10 p-6">
          <p className="font-semibold text-destructive">Failed to load students from iDempiere</p>
          <p className="mt-1 text-destructive/80 text-sm">
            {(studentsError as Error).message ?? "Please check your API configuration and try again."}
          </p>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading students from iDempiere...</p>
          </div>
        </div>
      )}

      {/* Student Cards Grid */}
      {!isLoading && students.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-lg">No students found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm ? "No students match your search criteria." : "No students exist in the system yet."}
          </p>
        </Card>
      )}

      {!isLoading && students.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Records Info */}
          <p className="text-center text-muted-foreground text-sm">
            Showing {students.length} of {displayData?.totalRecords ?? 0} students
          </p>
        </>
      )}
    </div>
  );
}
