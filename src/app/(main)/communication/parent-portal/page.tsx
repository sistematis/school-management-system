"use client";

import { useState } from "react";

import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Filter,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  User,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock student data
const mockStudents = [
  {
    id: "STU-001",
    name: "Emma Johnson",
    initials: "EJ",
    class: "Grade 10-A",
    attendance: { present: 145, absent: 5, late: 3, percentage: 95 },
    academics: { averageGrade: "A-", totalScore: 92, gradeTrend: "up" as const, lastUpdated: "2024-01-15" },
    behavior: { status: "excellent" as const, comments: "Demonstrates leadership qualities" },
    outstandingFees: 1250.0,
  },
  {
    id: "STU-002",
    name: "Liam Johnson",
    initials: "LJ",
    class: "Grade 8-B",
    attendance: { present: 138, absent: 8, late: 7, percentage: 89 },
    academics: { averageGrade: "B+", totalScore: 87, gradeTrend: "stable" as const, lastUpdated: "2024-01-14" },
    behavior: { status: "good" as const, comments: "Consistent effort in all subjects" },
    outstandingFees: 850.0,
  },
];

// Mock parent-teacher messages
const mockMessages = [
  {
    id: "MSG-001",
    teacherId: "TCH-001",
    teacherName: "Ms. Sarah Williams",
    initials: "SW",
    subject: "Mathematics",
    message: "Emma has shown significant improvement in algebra this semester. Keep up the great work!",
    timestamp: "2024-01-15T10:30:00",
    isRead: true,
  },
  {
    id: "MSG-002",
    teacherId: "TCH-002",
    teacherName: "Mr. James Rodriguez",
    initials: "JR",
    subject: "Science",
    message: "Liam's science project is due next Friday. Please ensure he has all materials ready.",
    timestamp: "2024-01-14T14:20:00",
    isRead: false,
  },
  {
    id: "MSG-003",
    teacherId: "TCH-003",
    teacherName: "Mrs. Emily Chen",
    initials: "EC",
    subject: "English",
    message: "Parent-teacher conference scheduled for January 25th at 3:00 PM.",
    timestamp: "2024-01-13T09:15:00",
    isRead: true,
  },
];

// Mock announcements
const mockAnnouncements = [
  {
    id: "ANN-001",
    title: "Winter Break Schedule",
    content: "School will be closed from December 23rd to January 3rd for winter break.",
    type: "general" as const,
    priority: "normal" as const,
    date: "2024-01-15",
  },
  {
    id: "ANN-002",
    title: "Parent-Teacher Conference",
    content: "Quarterly parent-teacher conferences will be held January 24-26. Please sign up for a slot.",
    type: "event" as const,
    priority: "high" as const,
    date: "2024-01-14",
  },
  {
    id: "ANN-003",
    title: "Fee Payment Reminder",
    content: "Second semester fees are due by January 31st. Late payment penalties apply after this date.",
    type: "fee" as const,
    priority: "urgent" as const,
    date: "2024-01-13",
  },
];

type GradeTrend = "up" | "down" | "stable";
type BehaviorStatus = "excellent" | "good" | "needs-improvement";
type AnnouncementType = "general" | "event" | "fee" | "emergency";
type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

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

const getBehaviorStatusColor = (status: BehaviorStatus) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "good":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "needs-improvement":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }
};

const getAnnouncementTypeColor = (type: AnnouncementType) => {
  switch (type) {
    case "general":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "event":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "fee":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "emergency":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

const getAnnouncementPriorityColor = (priority: AnnouncementPriority) => {
  switch (priority) {
    case "low":
      return "text-gray-600";
    case "normal":
      return "text-blue-600";
    case "high":
      return "text-orange-600";
    case "urgent":
      return "text-red-600";
  }
};

const stats = [
  { label: "Total Students", value: "2", icon: User, color: "text-blue-600" },
  { label: "Unread Messages", value: "1", icon: MessageSquare, color: "text-green-600" },
  { label: "Upcoming Meetings", value: "2", icon: Calendar, color: "text-purple-600" },
  { label: "Outstanding Fees", value: "$2,100", icon: DollarSign, color: "text-orange-600" },
];

export default function ParentPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [messageFilter, setMessageFilter] = useState<string>("all");
  const [announcementFilter, setAnnouncementFilter] = useState<string>("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = studentFilter === "all" || student.class === studentFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      messageFilter === "all" ||
      (messageFilter === "read" && message.isRead) ||
      (messageFilter === "unread" && !message.isRead);
    return matchesSearch && matchesFilter;
  });

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      announcementFilter === "all" ||
      (announcementFilter === "urgent" && (announcement.priority === "urgent" || announcement.priority === "high"));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Parent Portal</h1>
          <p className="mt-2 text-muted-foreground">Monitor your child's academic progress and communication.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          New Message
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
              placeholder="Search students, messages, or announcements..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
              <SelectItem value="Grade 8-B">Grade 8-B</SelectItem>
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

      {/* Students Section */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <h2 className="font-semibold text-xl">My Children</h2>
        </div>
        <div className="divide-y">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-6 hover:bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <Avatar className="h-16 w-16 bg-primary/10">
                    <span className="font-bold text-primary text-lg">{student.initials}</span>
                  </Avatar>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {student.id} • {student.class}
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-muted-foreground text-xs">Attendance</p>
                        <p className="font-semibold text-sm">{student.attendance.percentage}% Present</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Average Grade</p>
                        <p className="flex items-center gap-1 font-semibold text-sm">
                          {student.academics.averageGrade}
                          <span className={getGradeTrendColor(student.academics.gradeTrend)}>
                            {getGradeTrendIcon(student.academics.gradeTrend)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Behavior</p>
                        <Badge className={getBehaviorStatusColor(student.behavior.status)}>
                          {student.behavior.status.charAt(0).toUpperCase() +
                            student.behavior.status.slice(1).replace("-", " ")}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Outstanding Fees</p>
                        <p className="font-semibold text-sm text-orange-600">${student.outstandingFees.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Messages Section */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Messages from Teachers</h2>
            <Select value={messageFilter} onValueChange={setMessageFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Messages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="divide-y">
          {filteredMessages.map((message) => (
            <div key={message.id} className={`p-4 hover:bg-muted/30 ${!message.isRead ? "bg-blue-50/50" : ""}`}>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <span className="font-semibold text-primary text-xs">{message.initials}</span>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{message.teacherName}</h4>
                        {!message.isRead && <span className="bg-blue-500 rounded-full p-1" />}
                        <Badge variant="outline">{message.subject}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {new Date(message.timestamp).toLocaleDateString()} at{" "}
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm">{message.message}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Announcements Section */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">School Announcements</h2>
            <Select value={announcementFilter} onValueChange={setAnnouncementFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="divide-y">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-4 hover:bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <Badge className={getAnnouncementTypeColor(announcement.type)}>
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                    {announcement.priority === "urgent" && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span className="font-semibold">Urgent</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">{announcement.content}</p>
                  <p className="mt-2 text-muted-foreground text-xs">{announcement.date}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
