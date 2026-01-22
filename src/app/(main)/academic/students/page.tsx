"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Calendar,
  Download,
  Filter,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  useDeleteStudent,
  useIdempiereAuthenticated,
  useSearchStudents,
  useStudentStats,
  useStudents,
} from "@/lib/hooks/use-idempiere-data";
// iDempiere API imports
import { useIdempiereAuth } from "@/lib/stores/idempiere-auth.store";

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
  const router = useRouter();
  const isAuthenticated = useIdempiereAuthenticated();
  const isCheckingAuth = useIdempiereAuth((state) => state.isCheckingAuth);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 9; // Show 9 cards per page (3x3 grid)

  // Ref to maintain input focus across re-renders
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Track if input was focused to restore it after re-renders
  const inputFocusedRef = useRef(false);

  // Debounce search term with 300ms delay for auto-search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch students data with React Query
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents({ page, pageSize });

  // Fetch search results when debounced search term changes
  const { data: searchData, isLoading: searchLoading } = useSearchStudents(
    debouncedSearchTerm,
    { page, pageSize },
    {
      enabled: debouncedSearchTerm.length > 0,
    },
  );

  // Determine if we're showing a loading state for search
  const isSearchLoading = searchTerm !== debouncedSearchTerm || searchLoading;

  // Fetch student statistics
  const { data: statsData, isLoading: statsLoading } = useStudentStats();

  // Delete mutation
  const _deleteStudent = useDeleteStudent();

  // Use search results if searching (using debounced term), otherwise use regular results
  const displayData = debouncedSearchTerm.length > 0 ? searchData : studentsData;
  const isLoading = debouncedSearchTerm.length > 0 ? searchLoading : studentsLoading;
  const students = displayData?.records ?? [];

  // Reset page when debounced search term changes
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Effect to maintain input focus across re-renders
  // This ensures the search input never loses focus when the component updates due to loading state changes
  useEffect(() => {
    // Restore focus if the input was previously focused and we have an active search or content
    if (inputFocusedRef.current && searchInputRef.current) {
      // Use setTimeout to ensure focus is restored after React completes the render
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSearchLoading]);

  // Handle search input change - maintains focus by using controlled input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Track that the input has been interacted with
    inputFocusedRef.current = true;
    setSearchTerm(e.target.value);
  }, []);

  // Track when input gains focus
  const handleSearchFocus = useCallback(() => {
    inputFocusedRef.current = true;
  }, []);

  // Track when input loses focus
  const handleSearchBlur = useCallback(() => {
    // Only clear the focused ref if not searching
    if (!searchTerm) {
      inputFocusedRef.current = false;
    }
  }, [searchTerm]);

  // Calculate stats from data
  const stats = [
    { label: "Total Students", value: statsData?.total ?? displayData?.totalRecords ?? "-" },
    { label: "Active", value: statsData?.active ?? "-" },
    { label: "Grade 9", value: "-" },
    { label: "Grade 10", value: "-" },
    { label: "Grade 11-12", value: "-" },
  ];

  const totalPages = displayData?.totalPages ?? 1;

  // Show loading spinner while checking authentication on initial load
  // This prevents the "session expired" flash when page loads with valid token
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt only after auth check is complete and user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-2xl">Login Required</h2>
          <p className="mb-6 text-muted-foreground">
            Your session has expired. Please login to access the student information system.
          </p>
          <Button onClick={() => router.push("/auth/login")} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Go to Login Page
          </Button>
        </Card>
      </div>
    );
  }

  // Show loading spinner while loading data
  if (isLoading && students.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
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
              ref={searchInputRef}
              placeholder="Search by name, roll number, or email..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {/* Search loading indicator - subtle spinner */}
            {isSearchLoading && (
              <Loader2 className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 animate-spin text-muted-foreground opacity-60" />
            )}
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
            <p className="mt-2 text-muted-foreground">
              {debouncedSearchTerm ? "Searching students..." : "Loading students from iDempiere..."}
            </p>
          </div>
        </div>
      )}

      {/* Student Cards Grid - Empty State */}
      {!isLoading && students.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-lg">
            {debouncedSearchTerm ? "No results found" : "No students found"}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {debouncedSearchTerm
              ? `No students match "${debouncedSearchTerm}". Try a different search term.`
              : "No students exist in the system yet."}
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
