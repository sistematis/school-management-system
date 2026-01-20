import {
  Calendar,
  Download,
  Filter,
  GraduationCap,
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

// Mock student data
const mockStudents = [
  {
    id: "10A-001",
    firstName: "John",
    lastName: "Smith",
    initials: "JS",
    email: "john.smith@student.edu",
    phone: "+62 812 3456 7890",
    grade: "Grade 10 - Section A",
    parentName: "Robert Smith",
    dateOfBirth: "2010-05-15",
    status: "active",
  },
  {
    id: "09A-015",
    firstName: "Sarah",
    lastName: "Johnson",
    initials: "SJ",
    email: "sarah.j@student.edu",
    phone: "+62 813 4567 8901",
    grade: "Grade 9 - Section A",
    parentName: "Michael Johnson",
    dateOfBirth: "2011-08-22",
    status: "active",
  },
  {
    id: "11B-023",
    firstName: "Michael",
    lastName: "Chen",
    initials: "MC",
    email: "michael.c@student.edu",
    phone: "+62 814 5678 9012",
    grade: "Grade 11 - Section B",
    parentName: "David Chen",
    dateOfBirth: "2009-03-10",
    status: "active",
  },
  {
    id: "10A-004",
    firstName: "Emily",
    lastName: "Davis",
    initials: "ED",
    email: "emily.d@student.edu",
    phone: "+62 815 6789 0123",
    grade: "Grade 10 - Section A",
    parentName: "Jennifer Davis",
    dateOfBirth: "2010-11-28",
    status: "active",
  },
  {
    id: "12A-005",
    firstName: "David",
    lastName: "Wilson",
    initials: "DW",
    email: "david.w@student.edu",
    phone: "+62 816 7890 1234",
    grade: "Grade 12 - Section A",
    parentName: "James Wilson",
    dateOfBirth: "2008-07-05",
    status: "active",
  },
];

const stats = [
  { label: "Total Students", value: "5" },
  { label: "Active", value: "5" },
  { label: "Grade 9", value: "1" },
  { label: "Grade 10", value: "2" },
  { label: "Grade 11-12", value: "2" },
];

function StudentCard({ student }: { student: (typeof mockStudents)[0] }) {
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
          <span className="text-muted-foreground">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{student.parentName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">DOB: {student.dateOfBirth}</span>
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

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Student Information System</h1>
          <p className="mt-2 text-muted-foreground">Manage student profiles and enrollment</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="mt-1 font-bold text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search by name, roll number, or email..." className="pl-10" />
          </div>
          <Select>
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

      {/* Student Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
