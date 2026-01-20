"use client";

import { useState } from "react";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  GraduationCap,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock class schedule
const mockClasses = [
  {
    id: "CLS-001",
    subject: "Mathematics",
    teacher: "Ms. Sarah Williams",
    room: "Room 201",
    time: "08:00 AM - 09:00 AM",
    dayOfWeek: "Monday",
    duration: "60 min",
  },
  {
    id: "CLS-002",
    subject: "English",
    teacher: "Mrs. Emily Chen",
    room: "Room 105",
    time: "09:15 AM - 10:15 AM",
    dayOfWeek: "Monday",
    duration: "60 min",
  },
  {
    id: "CLS-003",
    subject: "Science",
    teacher: "Mr. James Rodriguez",
    room: "Lab 301",
    time: "10:30 AM - 11:30 AM",
    dayOfWeek: "Monday",
    duration: "60 min",
  },
  {
    id: "CLS-004",
    subject: "History",
    teacher: "Dr. Robert Kim",
    room: "Room 302",
    time: "01:00 PM - 02:00 PM",
    dayOfWeek: "Monday",
    duration: "60 min",
  },
  {
    id: "CLS-005",
    subject: "Physical Education",
    teacher: "Coach Mike",
    room: "Gymnasium",
    time: "02:15 PM - 03:15 PM",
    dayOfWeek: "Monday",
    duration: "60 min",
  },
];

// Mock assignments
const mockAssignments = [
  {
    id: "ASN-001",
    title: "Algebra Problem Set",
    subject: "Mathematics",
    description: "Complete exercises 1-20 from Chapter 5",
    dueDate: "2024-01-20",
    submittedDate: "2024-01-18",
    status: "graded" as const,
    grade: 95,
    feedback: "Excellent work! Keep it up.",
    attachments: ["worksheet.pdf"],
  },
  {
    id: "ASN-002",
    title: "Essay: Shakespeare's Sonnets",
    subject: "English",
    description: "Write a 500-word analysis of Sonnet 18",
    dueDate: "2024-01-22",
    submittedDate: "2024-01-21",
    status: "submitted" as const,
    feedback: "",
    attachments: [],
  },
  {
    id: "ASN-003",
    title: "Science Lab Report",
    subject: "Science",
    description: "Document your findings from the chemistry experiment",
    dueDate: "2024-01-25",
    status: "not-submitted" as const,
    feedback: "",
    attachments: ["lab_template.docx"],
  },
  {
    id: "ASN-004",
    title: "History Research Project",
    subject: "History",
    description: "Research and present on World War II events",
    dueDate: "2024-01-15",
    status: "late" as const,
    grade: 78,
    feedback: "Submitted late. Good content overall.",
    attachments: [],
  },
];

// Mock achievements
const mockAchievements = [
  {
    id: "ACH-001",
    title: "Math Wizard",
    description: "Scored above 90% in 3 consecutive math tests",
    icon: "🏆",
    earnedDate: "2024-01-10",
    category: "academic" as const,
  },
  {
    id: "ACH-002",
    title: "Perfect Attendance",
    description: "No absences for the entire semester",
    icon: "⭐",
    earnedDate: "2024-01-05",
    category: "behavior" as const,
  },
  {
    id: "ACH-003",
    title: "Sports Champion",
    description: "Won first place in inter-school basketball tournament",
    icon: "🥇",
    earnedDate: "2023-12-20",
    category: "sports" as const,
  },
  {
    id: "ACH-004",
    title: "Art Excellence",
    description: "Artwork selected for school exhibition",
    icon: "🎨",
    earnedDate: "2023-12-15",
    category: "arts" as const,
  },
  {
    id: "ACH-005",
    title: "Class President",
    description: "Elected as class president for Student Council",
    icon: "👑",
    earnedDate: "2023-09-01",
    category: "leadership" as const,
  },
];

// Mock grades
const mockGrades = [
  {
    id: "GRD-001",
    subject: "Mathematics",
    midterm: 92,
    assignments: 88,
    final: 95,
    overall: 92,
    letterGrade: "A-",
    trend: "up" as const,
  },
  {
    id: "GRD-002",
    subject: "English",
    midterm: 85,
    assignments: 90,
    final: 87,
    overall: 87,
    letterGrade: "B+",
    trend: "stable" as const,
  },
  {
    id: "GRD-003",
    subject: "Science",
    midterm: 78,
    assignments: 82,
    final: 80,
    overall: 80,
    letterGrade: "B",
    trend: "up" as const,
  },
  {
    id: "GRD-004",
    subject: "History",
    midterm: 88,
    assignments: 85,
    final: 90,
    overall: 88,
    letterGrade: "A-",
    trend: "stable" as const,
  },
];

type AssignmentStatus = "not-submitted" | "submitted" | "graded" | "late";
type AchievementCategory = "academic" | "behavior" | "sports" | "arts" | "leadership";
type GradeTrend = "up" | "down" | "stable";

const getAssignmentStatusColor = (status: AssignmentStatus) => {
  switch (status) {
    case "not-submitted":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "submitted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "graded":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "late":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

const getAchievementCategoryColor = (category: AchievementCategory) => {
  switch (category) {
    case "academic":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "behavior":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "sports":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "arts":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    case "leadership":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
};

const getGradeTrendColor = (trend: GradeTrend) => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    case "stable":
      return "text-blue-600";
  }
};

const getGradeTrendIcon = (trend: GradeTrend) => {
  return trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
};

const getLetterGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-green-600";
  if (grade.startsWith("B")) return "text-blue-600";
  if (grade.startsWith("C")) return "text-yellow-600";
  if (grade.startsWith("D")) return "text-orange-600";
  return "text-red-600";
};

const stats = [
  { label: "GPA", value: "3.7", icon: GraduationCap, color: "text-blue-600" },
  { label: "Attendance", value: "95%", icon: CheckCircle, color: "text-green-600" },
  { label: "Assignments", value: "12", icon: BookOpen, color: "text-purple-600" },
  { label: "Achievements", value: "5", icon: Award, color: "text-orange-600" },
];

export default function StudentPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  const [achievementFilter, setAchievementFilter] = useState<string>("all");

  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch =
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = subjectFilter === "all" || cls.subject === subjectFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAssignments = mockAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = assignmentFilter === "all" || assignment.status === assignmentFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAchievements = mockAchievements.filter((achievement) => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = achievementFilter === "all" || achievement.category === achievementFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Student Portal</h1>
          <p className="mt-2 text-muted-foreground">Welcome back! Here's your academic overview.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
            <p className="font-bold text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search classes, assignments, or achievements..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="History">History</SelectItem>
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

      {/* Today's Schedule */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Today's Schedule</h2>
            <Badge variant="outline">Monday, January 15, 2024</Badge>
          </div>
        </div>
        <div className="divide-y">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              <Avatar className="h-12 w-12 bg-primary/10">
                <span className="font-semibold text-primary text-sm">{cls.subject.slice(0, 2).toUpperCase()}</span>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{cls.subject}</h3>
                <p className="text-muted-foreground text-sm">
                  {cls.teacher} • {cls.room}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{cls.time}</p>
                <p className="text-muted-foreground text-xs">{cls.duration}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Assignments Section */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Assignments</h2>
            <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-submitted">Not Submitted</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Assignment</th>
                <th className="p-4 text-left font-semibold">Subject</th>
                <th className="p-4 text-left font-semibold">Due Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Grade</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-sm">{assignment.title}</div>
                      <div className="text-muted-foreground text-xs">{assignment.description}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{assignment.subject}</td>
                  <td className="p-4 text-sm">{assignment.dueDate}</td>
                  <td className="p-4">
                    <Badge className={getAssignmentStatusColor(assignment.status)}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1).replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {assignment.grade !== undefined ? (
                      <span className="font-semibold text-green-600">{assignment.grade}%</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grades Overview */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <h2 className="font-semibold text-xl">Academic Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Subject</th>
                <th className="p-4 text-left font-semibold">Midterm</th>
                <th className="p-4 text-left font-semibold">Assignments</th>
                <th className="p-4 text-left font-semibold">Final</th>
                <th className="p-4 text-left font-semibold">Overall</th>
                <th className="p-4 text-left font-semibold">Letter Grade</th>
                <th className="p-4 text-left font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {mockGrades.map((grade) => (
                <tr key={grade.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-medium text-sm">{grade.subject}</td>
                  <td className="p-4 text-sm">{grade.midterm}%</td>
                  <td className="p-4 text-sm">{grade.assignments}%</td>
                  <td className="p-4 text-sm">{grade.final}%</td>
                  <td className="p-4 font-semibold text-sm">{grade.overall}%</td>
                  <td className="p-4">
                    <span className={`font-bold ${getLetterGradeColor(grade.letterGrade)}`}>{grade.letterGrade}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${getGradeTrendColor(grade.trend)}`}>
                      {getGradeTrendIcon(grade.trend)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Achievements Section */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Achievements</h2>
            <Select value={achievementFilter} onValueChange={setAchievementFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {filteredAchievements.map((achievement) => (
            <Card key={achievement.id} className="p-4 hover:bg-muted/30">
              <div className="flex items-start gap-3">
                <span className="text-4xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <Badge className={getAchievementCategoryColor(achievement.category)}>
                      {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">{achievement.description}</p>
                  <p className="mt-2 text-muted-foreground text-xs">Earned: {achievement.earnedDate}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
