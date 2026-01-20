"use client";

import { useState } from "react";

import { Calendar, Check, Download, Eye, FileText, Filter, Plus, Search, Trash2, X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-2025-001",
    studentName: "John Smith",
    studentId: "10A-001",
    amount: 2500000,
    dueDate: "2025-02-15",
    status: "paid" as const,
    items: "Tuition Fee - Semester 2",
  },
  {
    id: "INV-2025-002",
    studentName: "Sarah Johnson",
    studentId: "10A-002",
    amount: 1800000,
    dueDate: "2025-02-20",
    status: "pending" as const,
    items: "Books & Materials",
  },
  {
    id: "INV-2025-003",
    studentName: "Michael Chen",
    studentId: "11B-023",
    amount: 3200000,
    dueDate: "2025-02-10",
    status: "overdue" as const,
    items: "Tuition Fee - Semester 2",
  },
  {
    id: "INV-2025-004",
    studentName: "Emily Davis",
    studentId: "10A-004",
    amount: 950000,
    dueDate: "2025-02-25",
    status: "pending" as const,
    items: "Activity Fee",
  },
  {
    id: "INV-2025-005",
    studentName: "David Wilson",
    studentId: "12A-005",
    amount: 4500000,
    dueDate: "2025-02-08",
    status: "paid" as const,
    items: "Tuition Fee - Semester 2 + Lab Fee",
  },
  {
    id: "INV-2025-006",
    studentName: "Lisa Anderson",
    studentId: "09A-015",
    amount: 1200000,
    dueDate: "2025-02-18",
    status: "cancelled" as const,
    items: "Library Fine",
  },
];

type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "";
  }
};

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case "paid":
      return Check;
    case "pending":
      return Calendar;
    case "overdue":
      return X;
    case "cancelled":
      return X;
    default:
      return null;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const stats = [
  { label: "Total Invoices", value: "24", icon: FileText, color: "text-blue-600" },
  { label: "Total Amount", value: "Rp 58.5M", icon: FileText, color: "text-green-600" },
  { label: "Paid", value: "15", icon: Check, color: "text-green-600" },
  { label: "Pending", value: "6", icon: Calendar, color: "text-yellow-600" },
  { label: "Overdue", value: "3", icon: X, color: "text-red-600" },
];

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Invoice Management</h1>
          <p className="mt-2 text-muted-foreground">Create and manage school invoices</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Create Invoice
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
              placeholder="Search by invoice, student name, or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Invoice</th>
                <th className="p-4 text-left font-semibold">Student</th>
                <th className="p-4 text-left font-semibold">Items</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-left font-semibold">Due Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status);
                return (
                  <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-medium">{invoice.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-primary/10">
                          <span className="font-semibold text-primary text-xs">
                            {invoice.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </Avatar>
                        <div>
                          <div className="font-medium">{invoice.studentName}</div>
                          <div className="text-muted-foreground text-sm">{invoice.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{invoice.items}</td>
                    <td className="p-4 font-medium">{formatCurrency(invoice.amount)}</td>
                    <td className="p-4 text-sm">{invoice.dueDate}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(invoice.status)}>
                        {StatusIcon && <StatusIcon className="mr-1 h-3 w-3" />}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
