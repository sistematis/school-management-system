"use client";

import { useState } from "react";

import { AlertCircle, Check, CheckCheck, Clock, MapPin, TrendingUp, X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock student attendance data
const mockStudents = [
  {
    id: "10A-001",
    name: "John Smith",
    initials: "JS",
    rollNumber: "10A-001",
    status: "present" as const,
  },
  {
    id: "10A-002",
    name: "Sarah Johnson",
    initials: "SJ",
    rollNumber: "10A-002",
    status: "present" as const,
  },
  {
    id: "10A-003",
    name: "Michael Chen",
    initials: "MC",
    rollNumber: "10A-003",
    status: "present" as const,
  },
  {
    id: "10A-004",
    name: "Emily Davis",
    initials: "ED",
    rollNumber: "10A-004",
    status: "present" as const,
  },
  {
    id: "10A-005",
    name: "David Wilson",
    initials: "DW",
    rollNumber: "10A-005",
    status: "present" as const,
  },
  {
    id: "10A-006",
    name: "Lisa Anderson",
    initials: "LA",
    rollNumber: "10A-006",
    status: "present" as const,
  },
  {
    id: "10A-007",
    name: "Robert Brown",
    initials: "RB",
    rollNumber: "10A-007",
    status: "present" as const,
  },
  {
    id: "10A-008",
    name: "Jessica White",
    initials: "JW",
    rollNumber: "10A-008",
    status: "late" as const,
  },
];

type AttendanceStatus = "present" | "absent" | "late" | "excused";

const attendanceButtons = [
  {
    status: "present" as const,
    label: "Present",
    icon: Check,
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  { status: "late" as const, label: "Late", icon: Clock, color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  { status: "absent" as const, label: "Absent", icon: X, color: "bg-red-100 text-red-700 hover:bg-red-200" },
  {
    status: "excused" as const,
    label: "Excused",
    icon: AlertCircle,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
];

function getAttendanceCount(status: AttendanceStatus) {
  return mockStudents.filter((s) => s.status === status).length;
}

function AttendanceRow({ student }: { student: (typeof mockStudents)[0] }) {
  const [status, setStatus] = useState<AttendanceStatus>(student.status);

  return (
    <div className="flex items-center border-b p-4 transition-colors last:border-0 hover:bg-muted/30">
      <div className="flex flex-1 items-center gap-3">
        <Avatar className="h-10 w-10 bg-primary/10">
          <span className="font-semibold text-primary text-sm">{student.initials}</span>
        </Avatar>
        <div>
          <div className="font-medium">{student.name}</div>
          <div className="text-muted-foreground text-sm">{student.rollNumber}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {attendanceButtons.map((btn) => (
          <button
            type="button"
            key={btn.status}
            onClick={() => setStatus(btn.status)}
            className={`rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              status === btn.status
                ? `${btn.color} ring-2 ring-primary ring-offset-2`
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <btn.icon className="mr-2 inline h-4 w-4" />
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const present = getAttendanceCount("present");
  const absent = getAttendanceCount("absent");
  const late = getAttendanceCount("late");
  const excused = getAttendanceCount("excused");
  const total = mockStudents.length;
  const attendanceRate = ((present / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Attendance Tracking</h1>
        <p className="mt-2 text-muted-foreground">Mark student attendance for your classes</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="date-select" className="font-medium text-sm">
              Date
            </label>
            <Select>
              <SelectTrigger id="date-select">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="class-select" className="font-medium text-sm">
              Select Class
            </label>
            <Select>
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Grade 10 - Section A - Mathematics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10a-math">Grade 10 - Section A - Mathematics</SelectItem>
                <SelectItem value="11b-math">Grade 11 - Section B - Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full">Mark All Present</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Schedule</p>
          </div>
          <p className="font-bold text-2xl">08:00 - 09:30</p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Room</p>
          </div>
          <p className="font-bold text-2xl">Room 201</p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Present</p>
          </div>
          <p className="font-bold text-2xl">
            {present}/{total}
          </p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Attendance Rate</p>
          </div>
          <p className="font-bold text-2xl">{attendanceRate}%</p>
        </Card>
        <Card className="p-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="mb-1 text-muted-foreground text-xs">Absent</p>
              <p className="font-semibold text-lg">{absent}</p>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-muted-foreground text-xs">Late</p>
              <p className="font-semibold text-lg">{late}</p>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-muted-foreground text-xs">Excused</p>
              <p className="font-semibold text-lg">{excused}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <Card className="p-0">
        <div className="border-b p-4">
          <h2 className="font-semibold text-lg">Students ({total})</h2>
        </div>
        <div>
          {mockStudents.map((student) => (
            <AttendanceRow key={student.id} student={student} />
          ))}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2">
          <CheckCheck className="h-5 w-5" />
          Submit Attendance
        </Button>
      </div>
    </div>
  );
}
