"use client";

import { useState } from "react";

import { Calendar, Check, DollarSign, Download, Filter, Play, Search, Users } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock payroll data
const mockPayroll = [
  {
    id: "PAY-2025-001",
    employeeName: "Dr. Sarah Johnson",
    employeeId: "EMP-001",
    position: "Principal",
    department: "Administration",
    baseSalary: 15000000,
    allowances: 3500000,
    incentives: 2000000,
    deductions: 1500000,
    attendance: 22,
    netSalary: 19000000,
    status: "paid" as const,
    period: "January 2025",
  },
  {
    id: "PAY-2025-002",
    employeeName: "Prof. Michael Chen",
    employeeId: "EMP-002",
    position: "Senior Teacher",
    department: "Science",
    baseSalary: 12000000,
    allowances: 2500000,
    incentives: 1000000,
    deductions: 1200000,
    attendance: 22,
    netSalary: 14300000,
    status: "paid" as const,
    period: "January 2025",
  },
  {
    id: "PAY-2025-003",
    employeeName: "Ms. Emily Davis",
    employeeId: "EMP-003",
    position: "Teacher",
    department: "English",
    baseSalary: 10000000,
    allowances: 2000000,
    incentives: 500000,
    deductions: 1000000,
    attendance: 21,
    netSalary: 11500000,
    status: "processing" as const,
    period: "January 2025",
  },
  {
    id: "PAY-2025-004",
    employeeName: "Mr. David Wilson",
    employeeId: "EMP-004",
    position: "Teacher",
    department: "Mathematics",
    baseSalary: 10000000,
    allowances: 2000000,
    incentives: 750000,
    deductions: 1000000,
    attendance: 20,
    netSalary: 11750000,
    status: "pending" as const,
    period: "January 2025",
  },
  {
    id: "PAY-2025-005",
    employeeName: "Dr. Lisa Anderson",
    employeeId: "EMP-005",
    position: "Department Head",
    department: "Science",
    baseSalary: 13000000,
    allowances: 3000000,
    incentives: 1500000,
    deductions: 1300000,
    attendance: 22,
    netSalary: 16200000,
    status: "paid" as const,
    period: "January 2025",
  },
  {
    id: "PAY-2025-006",
    employeeName: "Prof. Robert Brown",
    employeeId: "EMP-006",
    position: "Senior Teacher",
    department: "Social Studies",
    baseSalary: 11500000,
    allowances: 2500000,
    incentives: 800000,
    deductions: 1100000,
    attendance: 19,
    netSalary: 13700000,
    status: "pending" as const,
    period: "January 2025",
  },
];

type PayrollStatus = "paid" | "pending" | "processing";

const getStatusColor = (status: PayrollStatus) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const payrollStats = [
  { label: "Total Payroll", value: "Rp 86.45M", icon: DollarSign },
  { label: "Paid Amount", value: "Rp 49.5M", icon: Check },
  { label: "Pending Amount", value: "Rp 25.25M", icon: Calendar },
  { label: "Employees", value: "42", icon: Users },
];

export default function PayrollPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("2025-01");

  const filteredPayroll = mockPayroll.filter((payroll) => {
    const matchesSearch =
      payroll.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Payroll Management</h1>
          <p className="mt-2 text-muted-foreground">Manage staff salaries and compensation</p>
        </div>
        <Button className="gap-2">
          <Play className="h-5 w-5" />
          Process Payroll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {payrollStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
              placeholder="Search by name, ID, or position..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-01">January 2025</SelectItem>
              <SelectItem value="2024-12">December 2024</SelectItem>
              <SelectItem value="2024-11">November 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
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

      {/* Payroll Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Employee</th>
                <th className="p-4 text-left font-semibold">Position</th>
                <th className="p-4 text-center font-semibold">Base Salary</th>
                <th className="p-4 text-center font-semibold">Allowances</th>
                <th className="p-4 text-center font-semibold">Incentives</th>
                <th className="p-4 text-center font-semibold">Deductions</th>
                <th className="p-4 text-center font-semibold">Attendance</th>
                <th className="p-4 text-center font-semibold">Net Salary</th>
                <th className="p-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map((payroll) => (
                <tr key={payroll.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/10">
                        <span className="font-semibold text-primary text-sm">
                          {payroll.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </Avatar>
                      <div>
                        <div className="font-medium">{payroll.employeeName}</div>
                        <div className="text-muted-foreground text-sm">{payroll.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{payroll.position}</div>
                    <div className="text-muted-foreground text-sm">{payroll.department}</div>
                  </td>
                  <td className="p-4 text-center text-sm">{formatCurrency(payroll.baseSalary)}</td>
                  <td className="p-4 text-center text-sm">{formatCurrency(payroll.allowances)}</td>
                  <td className="p-4 text-center text-sm">{formatCurrency(payroll.incentives)}</td>
                  <td className="p-4 text-center text-red-600 text-sm">-{formatCurrency(payroll.deductions)}</td>
                  <td className="p-4 text-center text-sm">{payroll.attendance} days</td>
                  <td className="p-4 text-center font-bold text-green-600">{formatCurrency(payroll.netSalary)}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(payroll.status)}>
                      {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                    </Badge>
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
