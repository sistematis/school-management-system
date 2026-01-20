import { BookOpen, Clock, FileText, GraduationCap, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock subject data
const mockSubjects = [
  {
    id: "MATH-401",
    name: "Advanced Mathematics",
    code: "MATH-401",
    description: "Comprehensive mathematics covering algebra, geomet",
    grade: "Grade 10",
    credits: 4,
    hoursPerWeek: 6,
    type: "Core",
  },
  {
    id: "PHY-401",
    name: "Physics",
    code: "PHY-401",
    description: "Introduction to classical mechanics, thermodynamic",
    grade: "Grade 10",
    credits: 4,
    hoursPerWeek: 5,
    type: "Core",
  },
  {
    id: "ENG-401",
    name: "English Literature",
    code: "ENG-401",
    description: "Advanced English language arts with focus on liter",
    grade: "Grade 10",
    credits: 3,
    hoursPerWeek: 4,
    type: "Language",
  },
  {
    id: "CHEM-401",
    name: "Chemistry",
    code: "CHEM-401",
    description: "Organic and inorganic chemistry with practical lab",
    grade: "Grade 10",
    credits: 4,
    hoursPerWeek: 5,
    type: "Core",
  },
  {
    id: "CS-401",
    name: "Computer Science",
    code: "CS-401",
    description: "Programming fundamentals and computational thinkin",
    grade: "Grade 10",
    credits: 3,
    hoursPerWeek: 4,
    type: "Elective",
  },
  {
    id: "BIO-401",
    name: "Biology",
    code: "BIO-401",
    description: "Life sciences covering cell biology, genetics, and",
    grade: "Grade 10",
    credits: 4,
    hoursPerWeek: 5,
    type: "Core",
  },
];

const stats = [
  { label: "Total Subjects", value: "6", icon: BookOpen },
  { label: "Total Credits", value: "22", icon: FileText },
  { label: "Core Subjects", value: "4", icon: GraduationCap },
  { label: "Electives", value: "1", icon: Clock },
];

const getSubjectTypeColor = (type: string) => {
  switch (type) {
    case "Core":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Language":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Elective":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

function SubjectCard({ subject }: { subject: (typeof mockSubjects)[0] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{subject.name}</h3>
              <p className="text-muted-foreground text-sm">{subject.code}</p>
            </div>
          </div>
          <Badge className={getSubjectTypeColor(subject.type)}>{subject.type}</Badge>
        </div>
      </div>

      <p className="line-clamp-2 px-6 text-muted-foreground text-sm">{subject.description}</p>

      <div className="space-y-3 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Grade</span>
          <span className="font-medium">{subject.grade}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Credits</span>
          <span className="font-medium">{subject.credits}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Hours/Week</span>
          <span className="font-medium">{subject.hoursPerWeek}</span>
        </div>
      </div>

      <div className="flex gap-2 px-6 pt-2 pb-6">
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

export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Curriculum Management</h1>
          <p className="mt-2 text-muted-foreground">Define courses, syllabus, and credit hours</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Subject
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
            <p className="font-bold text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search subjects by name or code..." className="pl-10" />
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
        </div>
      </Card>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {mockSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
