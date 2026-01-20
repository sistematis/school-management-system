import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock timetable data
const mockSchedule = [
  {
    id: 1,
    time: "08:00 - 09:30",
    subject: "Mathematics",
    teacher: "Dr. Sarah Johnson",
    room: "Room 201",
    grade: "Grade 10A",
    day: "Monday",
  },
  {
    id: 2,
    time: "09:45 - 11:15",
    subject: "Physics",
    teacher: "Prof. Michael Chen",
    room: "Lab 102",
    grade: "Grade 10A",
    day: "Monday",
  },
  {
    id: 3,
    time: "11:30 - 13:00",
    subject: "English Literature",
    teacher: "Ms. Emily Davis",
    room: "Room 305",
    grade: "Grade 10A",
    day: "Monday",
  },
  {
    id: 4,
    time: "13:30 - 15:00",
    subject: "Computer Science",
    teacher: "Mr. David Wilson",
    room: "Computer Lab 1",
    grade: "Grade 10A",
    day: "Monday",
  },
  {
    id: 5,
    time: "08:00 - 09:30",
    subject: "Chemistry",
    teacher: "Dr. Lisa Anderson",
    room: "Lab 103",
    grade: "Grade 10A",
    day: "Tuesday",
  },
  {
    id: 6,
    time: "09:45 - 11:15",
    subject: "Biology",
    teacher: "Prof. Robert Brown",
    room: "Lab 101",
    grade: "Grade 10A",
    day: "Tuesday",
  },
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = ["08:00 - 09:30", "09:45 - 11:15", "11:30 - 13:00", "13:30 - 15:00", "15:15 - 16:45"];

const getScheduleForSlot = (day: string, time: string) => {
  return mockSchedule.find((s) => s.day === day && s.time === time);
};

function TimetableCell({ day, time }: { day: string; time: string }) {
  const schedule = getScheduleForSlot(day, time);

  if (!schedule) {
    return (
      <div className="flex h-full min-h-[80px] items-center justify-center border border-muted-foreground/30 border-dashed p-2">
        <span className="text-muted-foreground text-xs">Free Period</span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[80px] border bg-primary/5 p-3 transition-colors hover:bg-primary/10">
      <div className="font-medium text-sm">{schedule.subject}</div>
      <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
        <User className="h-3 w-3" />
        <span className="truncate">{schedule.teacher}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
        <MapPin className="h-3 w-3" />
        <span>{schedule.room}</span>
      </div>
      <Badge variant="outline" className="mt-2 text-xs">
        {schedule.grade}
      </Badge>
    </div>
  );
}

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Class Timetable</h1>
          <p className="mt-2 text-muted-foreground">Manage class schedules and weekly timetables</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Total Classes</p>
          </div>
          <p className="font-bold text-3xl">24</p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Hours/Week</p>
          </div>
          <p className="font-bold text-3xl">36</p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Teachers</p>
          </div>
          <p className="font-bold text-3xl">6</p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Rooms</p>
          </div>
          <p className="font-bold text-3xl">8</p>
        </Card>
      </div>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h3 className="font-semibold">Week 24</h3>
              <p className="text-muted-foreground text-sm">June 10 - June 14, 2025</p>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="outline" size="sm">
              This Week
            </Button>
            <Button variant="outline" size="sm">
              This Month
            </Button>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="overflow-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-[140px] p-3 text-left font-semibold">Time</th>
                {weekDays.map((day) => (
                  <th key={day} className="min-w-[140px] p-3 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, _index) => (
                <tr key={time} className="border-b last:border-0">
                  <td className="border-r p-2 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {time}
                    </div>
                  </td>
                  {weekDays.map((day) => (
                    <td key={day} className="border-r p-1 last:border-r-0">
                      <TimetableCell day={day} time={time} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Class Types</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary/20" />
            <span>Core Subjects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blue-500/20" />
            <span>Lab Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500/20" />
            <span>Electives</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
