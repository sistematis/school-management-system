import { Award, Edit, GraduationCap, TrendingUp, Users, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock student grade data
const mockGrades = [
  {
    id: "10A-001",
    name: "John Smith",
    assignments: 85,
    midterm: 88,
    final: 92,
    participation: 90,
    totalScore: 89,
    grade: "A",
  },
  {
    id: "10A-002",
    name: "Sarah Johnson",
    assignments: 92,
    midterm: 94,
    final: 95,
    participation: 95,
    totalScore: 94,
    grade: "A",
  },
  {
    id: "10A-003",
    name: "Michael Chen",
    assignments: 78,
    midterm: 82,
    final: 85,
    participation: 80,
    totalScore: 81,
    grade: "B+",
  },
  {
    id: "10A-004",
    name: "Emily Davis",
    assignments: 88,
    midterm: 90,
    final: 87,
    participation: 92,
    totalScore: 89,
    grade: "A",
  },
  {
    id: "10A-005",
    name: "David Wilson",
    assignments: 75,
    midterm: 78,
    final: 80,
    participation: 85,
    totalScore: 79,
    grade: "B+",
  },
  {
    id: "10A-006",
    name: "Lisa Anderson",
    assignments: null,
    midterm: null,
    final: null,
    participation: null,
    totalScore: 0,
    grade: null,
  },
];

const gradingWeights = [
  { category: "Assignments", weight: "30%" },
  { category: "Midterm Exam", weight: "30%" },
  { category: "Final Exam", weight: "30%" },
  { category: "Participation", weight: "10%" },
];

const stats = [
  { label: "Students", value: "6", icon: Users },
  { label: "Class Average", value: "72.0", icon: TrendingUp },
  { label: "Grade A", value: "3", icon: Award },
  { label: "Grade B", value: "2", icon: GraduationCap },
  { label: "Grade C", value: "0", icon: Award },
  { label: "Grade D/F", value: "0", icon: XCircle },
];

const getGradeColor = (grade: string | null) => {
  if (!grade) return "text-muted-foreground";
  if (grade.startsWith("A")) return "text-green-600 dark:text-green-400";
  if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400";
  if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

function GradeInput({ value }: { value: number | null }) {
  return (
    <div className="text-center">
      <span className={value === null ? "text-muted-foreground" : ""}>{value ?? "-"}</span>
    </div>
  );
}

export default function GradesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Gradebook Management</h1>
          <p className="mt-2 text-muted-foreground">Enter and manage student grades and assessments</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="h-5 w-5" />
          Edit Mode
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <label htmlFor="semester-input" className="font-medium text-sm">
              Semester
            </label>
            <Input id="semester-input" value="Semester 1 - 2025/2026" readOnly />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4">
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

      {/* Grading Weights */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Grading Weights</h3>
        <div className="flex gap-8 text-sm">
          {gradingWeights.map((item) => (
            <div key={item.category} className="flex gap-2">
              <span className="text-muted-foreground">{item.category}:</span>
              <span className="font-medium">{item.weight}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Grades Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-semibold">Student</th>
              <th className="p-4 text-center font-semibold">
                <div>
                  <div>Assignments</div>
                  <div className="font-normal text-muted-foreground text-xs">(30%)</div>
                </div>
              </th>
              <th className="p-4 text-center font-semibold">
                <div>
                  <div>Midterm</div>
                  <div className="font-normal text-muted-foreground text-xs">(30%)</div>
                </div>
              </th>
              <th className="p-4 text-center font-semibold">
                <div>
                  <div>Final</div>
                  <div className="font-normal text-muted-foreground text-xs">(30%)</div>
                </div>
              </th>
              <th className="p-4 text-center font-semibold">
                <div>
                  <div>Participation</div>
                  <div className="font-normal text-muted-foreground text-xs">(10%)</div>
                </div>
              </th>
              <th className="p-4 text-center font-semibold">Total Score</th>
              <th className="p-4 text-center font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {mockGrades.map((student, _index) => (
              <tr key={student.id} className="border-b last:border-0">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-muted-foreground text-sm">{student.id}</div>
                  </div>
                </td>
                <td className="p-4">
                  <GradeInput value={student.assignments} />
                </td>
                <td className="p-4">
                  <GradeInput value={student.midterm} />
                </td>
                <td className="p-4">
                  <GradeInput value={student.final} />
                </td>
                <td className="p-4">
                  <GradeInput value={student.participation} />
                </td>
                <td className="p-4 text-center font-medium">{student.totalScore > 0 ? student.totalScore : "-"}</td>
                <td className="p-4 text-center">
                  <span className={`font-bold text-lg ${getGradeColor(student.grade)}`}>{student.grade ?? "-"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
