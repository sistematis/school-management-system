"use client";

import { useState } from "react";

import { Calendar, CheckCircle, Clock, Download, Filter, MoreVertical, Plus, Search, TrendingUp } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock leave request data
const mockLeaveRequests = [
  {
    id: "LV-2024-001",
    staffId: "STF-001",
    staffName: "Dr. Sarah Mitchell",
    initials: "SM",
    leaveType: "Sick Leave",
    fromDate: "2024-01-15",
    toDate: "2024-01-17",
    days: 3,
    reason: "Medical treatment and recovery",
    status: "pending" as const,
    appliedOn: "2024-01-14",
  },
  {
    id: "LV-2024-002",
    staffId: "STF-002",
    staffName: "Prof. James Wilson",
    initials: "JW",
    leaveType: "Annual Leave",
    fromDate: "2024-01-20",
    toDate: "2024-01-25",
    days: 6,
    reason: "Family vacation",
    status: "approved" as const,
    appliedOn: "2024-01-10",
  },
  {
    id: "LV-2024-003",
    staffId: "STF-003",
    staffName: "Ms. Emily Chen",
    initials: "EC",
    leaveType: "Personal",
    fromDate: "2024-01-18",
    toDate: "2024-01-19",
    days: 2,
    reason: "Personal matters",
    status: "approved" as const,
    appliedOn: "2024-01-12",
  },
  {
    id: "LV-2024-004",
    staffId: "STF-004",
    staffName: "Mr. Michael Brown",
    initials: "MB",
    leaveType: "Emergency",
    fromDate: "2024-01-22",
    toDate: "2024-01-23",
    days: 2,
    reason: "Family emergency",
    status: "pending" as const,
    appliedOn: "2024-01-21",
  },
  {
    id: "LV-2024-005",
    staffId: "STF-005",
    staffName: "Mrs. Linda Garcia",
    initials: "LG",
    leaveType: "Sick Leave",
    fromDate: "2024-01-16",
    toDate: "2024-01-16",
    days: 1,
    reason: "Not feeling well",
    status: "rejected" as const,
    appliedOn: "2024-01-15",
  },
  {
    id: "LV-2024-006",
    staffId: "STF-006",
    staffName: "Dr. Robert Kim",
    initials: "RK",
    leaveType: "Annual Leave",
    fromDate: "2024-01-28",
    toDate: "2024-01-30",
    days: 3,
    reason: "Attend conference",
    status: "pending" as const,
    appliedOn: "2024-01-13",
  },
];

type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

type LeaveType = "Sick Leave" | "Annual Leave" | "Personal" | "Emergency";

const getStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getLeaveTypeColor = (type: LeaveType) => {
  switch (type) {
    case "Sick Leave":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "Annual Leave":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Personal":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Emergency":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  }
};

const stats = [
  { label: "Pending Requests", value: "12", icon: Clock, color: "text-yellow-600" },
  { label: "Approved This Month", value: "28", icon: CheckCircle, color: "text-green-600" },
  { label: "On Leave Today", value: "5", icon: Calendar, color: "text-blue-600" },
  { label: "Total Leave Days", value: "45", icon: TrendingUp, color: "text-purple-600" },
];

export default function LeaveManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [_departmentFilter, _setDepartmentFilter] = useState<string>("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("all");

  const filteredRequests = mockLeaveRequests.filter((request) => {
    const matchesSearch =
      request.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = leaveTypeFilter === "all" || request.leaveType === leaveTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Leave Management</h1>
          <p className="mt-2 text-muted-foreground">Manage staff leave requests and balances.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Apply for Leave
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
              placeholder="Search by staff name or request ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Requests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Annual Leave">Annual Leave</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
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

      {/* Leave Requests Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Request ID</th>
                <th className="p-4 text-left font-semibold">Staff Member</th>
                <th className="p-4 text-left font-semibold">Leave Type</th>
                <th className="p-4 text-left font-semibold">From Date</th>
                <th className="p-4 text-left font-semibold">To Date</th>
                <th className="p-4 text-left font-semibold">Days</th>
                <th className="p-4 text-left font-semibold">Reason</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Applied On</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-medium text-sm">{request.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <span className="font-semibold text-primary text-xs">{request.initials}</span>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{request.staffName}</div>
                        <div className="text-muted-foreground text-xs">{request.staffId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getLeaveTypeColor(request.leaveType)}>{request.leaveType}</Badge>
                  </td>
                  <td className="p-4 text-sm">{request.fromDate}</td>
                  <td className="p-4 text-sm">{request.toDate}</td>
                  <td className="p-4 text-sm">{request.days}</td>
                  <td className="max-w-[200px] truncate p-4 text-sm" title={request.reason}>
                    {request.reason}
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{request.appliedOn}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 text-green-600">
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-red-600">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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
