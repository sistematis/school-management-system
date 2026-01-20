"use client";

import { useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Filter,
  IndianRupee,
  PieChart,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock report data
const mockReports = [
  {
    id: "RPT-2025-001",
    name: "Monthly Revenue Report",
    type: "revenue" as const,
    period: "January 2025",
    generatedBy: "Dr. Sarah Johnson",
    generatedAt: "2025-01-25",
    status: "completed" as const,
    amount: 125000000,
    change: 12.5,
  },
  {
    id: "RPT-2025-002",
    name: "Expense Summary",
    type: "expense" as const,
    period: "January 2025",
    generatedBy: "Prof. Michael Chen",
    generatedAt: "2025-01-24",
    status: "completed" as const,
    amount: 85000000,
    change: -5.2,
  },
  {
    id: "RPT-2025-003",
    name: "Outstanding Invoices",
    type: "invoices" as const,
    period: "January 2025",
    generatedBy: "Ms. Emily Davis",
    generatedAt: "2025-01-23",
    status: "completed" as const,
    amount: 32000000,
    change: 8.3,
  },
  {
    id: "RPT-2025-004",
    name: "Payroll Summary",
    type: "payroll" as const,
    period: "January 2025",
    generatedBy: "Mr. David Wilson",
    generatedAt: "2025-01-22",
    status: "completed" as const,
    amount: 86450000,
    change: 3.1,
  },
  {
    id: "RPT-2025-005",
    name: "Payment Method Analysis",
    type: "payments" as const,
    period: "January 2025",
    generatedBy: "Dr. Lisa Anderson",
    generatedAt: "2025-01-21",
    status: "processing" as const,
    amount: 74700000,
    change: 15.7,
  },
];

type ReportType = "revenue" | "expense" | "invoices" | "payroll" | "payments";
type ReportStatus = "completed" | "processing" | "pending";

const getReportTypeLabel = (type: ReportType) => {
  switch (type) {
    case "revenue":
      return "Revenue";
    case "expense":
      return "Expense";
    case "invoices":
      return "Invoices";
    case "payroll":
      return "Payroll";
    case "payments":
      return "Payments";
  }
};

const getReportTypeIcon = (type: ReportType) => {
  switch (type) {
    case "revenue":
      return TrendingUp;
    case "expense":
      return BarChart3;
    case "invoices":
      return FileText;
    case "payroll":
      return IndianRupee;
    case "payments":
      return PieChart;
  }
};

const getReportTypeColor = (type: ReportType) => {
  switch (type) {
    case "revenue":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "expense":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "invoices":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "payroll":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "payments":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }
};

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const summaryStats = [
  { label: "Total Revenue", value: "Rp 125M", change: "+12.5%", positive: true },
  { label: "Total Expenses", value: "Rp 85M", change: "-5.2%", positive: false },
  { label: "Net Income", value: "Rp 40M", change: "+18.3%", positive: true },
  { label: "Pending Amount", value: "Rp 32M", change: "+8.3%", positive: true },
];

export default function FinanceReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Financial Reports</h1>
          <p className="mt-2 text-muted-foreground">View financial reports and analytics</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Generate Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <div className={`flex items-center gap-1 text-sm ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{stat.change}</span>
              </div>
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
              placeholder="Search by report name or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="invoices">Invoices</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
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

      {/* Reports Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const TypeIcon = getReportTypeIcon(report.type);
          return (
            <Card key={report.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <TypeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <p className="text-muted-foreground text-sm">{report.id}</p>
                  </div>
                </div>
                <Badge className={getReportTypeColor(report.type)}>{getReportTypeLabel(report.type)}</Badge>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">{report.period}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Generated By</span>
                  <span className="font-medium">{report.generatedBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Generated At</span>
                  <span className="font-medium">{report.generatedAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="mb-1 text-muted-foreground text-sm">Total Amount</p>
                  <p className="font-bold text-2xl">{formatCurrency(report.amount)}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`mb-1 flex items-center gap-1 text-sm ${report.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {report.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span>{Math.abs(report.change)}% vs last month</span>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
