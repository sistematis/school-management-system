"use client";

import { useState } from "react";

import {
  Briefcase,
  Download,
  Filter,
  GraduationCap,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock staff data
const mockStaff = [
  {
    id: "STF-001",
    name: "Dr. Sarah Mitchell",
    initials: "SM",
    department: "Teaching",
    position: "Senior Mathematics Teacher",
    email: "sarah.mitchell@school.edu",
    phone: "+62 812 3456 7890",
    joinDate: "2018-03-15",
    status: "active" as const,
  },
  {
    id: "STF-002",
    name: "Prof. James Wilson",
    initials: "JW",
    department: "Teaching",
    position: "Head of Science Department",
    email: "james.wilson@school.edu",
    phone: "+62 812 3456 7891",
    joinDate: "2016-07-20",
    status: "active" as const,
  },
  {
    id: "STF-003",
    name: "Ms. Emily Chen",
    initials: "EC",
    department: "Administration",
    position: "School Administrator",
    email: "emily.chen@school.edu",
    phone: "+62 812 3456 7892",
    joinDate: "2019-09-10",
    status: "active" as const,
  },
  {
    id: "STF-004",
    name: "Mr. Michael Brown",
    initials: "MB",
    department: "Teaching",
    position: "English Literature Teacher",
    email: "michael.brown@school.edu",
    phone: "+62 812 3456 7893",
    joinDate: "2020-01-15",
    status: "on_leave" as const,
  },
  {
    id: "STF-005",
    name: "Mrs. Linda Garcia",
    initials: "LG",
    department: "Support Staff",
    position: "Library Assistant",
    email: "linda.garcia@school.edu",
    phone: "+62 812 3456 7894",
    joinDate: "2021-05-20",
    status: "active" as const,
  },
  {
    id: "STF-006",
    name: "Dr. Robert Kim",
    initials: "RK",
    department: "Teaching",
    position: "Physics Teacher",
    email: "robert.kim@school.edu",
    phone: "+62 812 3456 7895",
    joinDate: "2019-02-28",
    status: "active" as const,
  },
];

type StaffStatus = "active" | "on_leave" | "inactive";

const getStatusColor = (status: StaffStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "on_leave":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusLabel = (status: StaffStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "on_leave":
      return "On Leave";
    case "inactive":
      return "Inactive";
  }
};

const stats = [
  { label: "Total Staff", value: "156", icon: Users, color: "text-blue-600" },
  { label: "Active", value: "142", icon: UserCheck, color: "text-green-600" },
  { label: "On Leave", value: "8", icon: UserX, color: "text-yellow-600" },
  { label: "Teaching Staff", value: "98", icon: GraduationCap, color: "text-purple-600" },
  { label: "Non-Teaching", value: "58", icon: Briefcase, color: "text-orange-600" },
];

export default function StaffDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Staff Directory</h1>
          <p className="mt-2 text-muted-foreground">View and manage staff information.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
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
              placeholder="Search by name, ID, department, or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Teaching">Teaching</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
              <SelectItem value="Support Staff">Support Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Staff Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Staff Member</th>
                <th className="p-4 text-left font-semibold">Department</th>
                <th className="p-4 text-left font-semibold">Position</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Join Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/10">
                        <span className="font-semibold text-primary text-sm">{staff.initials}</span>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-muted-foreground text-sm">{staff.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{staff.department}</td>
                  <td className="p-4 text-sm">{staff.position}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {staff.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {staff.phone}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{staff.joinDate}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(staff.status)}>{getStatusLabel(staff.status)}</Badge>
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
    </div>
  );
}
