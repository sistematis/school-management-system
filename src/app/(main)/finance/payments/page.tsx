"use client";

import { useState } from "react";

import { CreditCard, Download, Filter, IndianRupee, Search, Wallet } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock payment data
const mockPayments = [
  {
    id: "TXN-2025-001234",
    invoiceId: "INV-2025-001",
    studentName: "John Smith",
    studentId: "10A-001",
    amount: 2500000,
    method: "virtual_account" as const,
    status: "completed" as const,
    date: "2025-01-15",
    time: "10:30:00",
  },
  {
    id: "TXN-2025-001235",
    invoiceId: "INV-2025-002",
    studentName: "Sarah Johnson",
    studentId: "10A-002",
    amount: 1800000,
    method: "credit_card" as const,
    status: "completed" as const,
    date: "2025-01-16",
    time: "14:22:15",
  },
  {
    id: "TXN-2025-001236",
    invoiceId: "INV-2025-003",
    studentName: "Michael Chen",
    studentId: "11B-023",
    amount: 3200000,
    method: "ewallet" as const,
    status: "pending" as const,
    date: "2025-01-17",
    time: "09:15:30",
  },
  {
    id: "TXN-2025-001237",
    invoiceId: "INV-2025-004",
    studentName: "Emily Davis",
    studentId: "10A-004",
    amount: 950000,
    method: "cash" as const,
    status: "completed" as const,
    date: "2025-01-18",
    time: "11:45:00",
  },
  {
    id: "TXN-2025-001238",
    invoiceId: "INV-2025-005",
    studentName: "David Wilson",
    studentId: "12A-005",
    amount: 4500000,
    method: "virtual_account" as const,
    status: "failed" as const,
    date: "2025-01-19",
    time: "16:20:45",
  },
  {
    id: "TXN-2025-001239",
    invoiceId: "INV-2025-006",
    studentName: "Lisa Anderson",
    studentId: "09A-015",
    amount: 1200000,
    method: "ewallet" as const,
    status: "completed" as const,
    date: "2025-01-20",
    time: "08:30:00",
  },
];

type PaymentMethod = "virtual_account" | "credit_card" | "ewallet" | "cash";
type PaymentStatus = "completed" | "pending" | "failed";

const getMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case "virtual_account":
      return "Virtual Account";
    case "credit_card":
      return "Credit Card";
    case "ewallet":
      return "E-Wallet";
    case "cash":
      return "Cash";
  }
};

const getMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case "virtual_account":
      return IndianRupee;
    case "credit_card":
      return CreditCard;
    case "ewallet":
      return Wallet;
    case "cash":
      return IndianRupee;
  }
};

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const paymentStats = [
  { label: "Virtual Account", value: "Rp 35.2M", icon: IndianRupee, count: 15 },
  { label: "Credit Card", value: "Rp 18.5M", icon: CreditCard, count: 8 },
  { label: "E-Wallet", value: "Rp 12.8M", icon: Wallet, count: 12 },
  { label: "Cash", value: "Rp 8.2M", icon: IndianRupee, count: 5 },
];

const overallStats = [
  { label: "Total Transactions", value: "40" },
  { label: "Total Amount", value: "Rp 74.7M" },
  { label: "Completed", value: "35" },
  { label: "Pending", value: "3" },
  { label: "Failed", value: "2" },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Payment Tracking</h1>
        <p className="mt-2 text-muted-foreground">Monitor all payment transactions and methods</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-5 gap-4">
        {overallStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="mt-1 font-bold text-3xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Payment Method Stats */}
      <div className="grid grid-cols-4 gap-4">
        {paymentStats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
            <p className="font-bold text-2xl">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.count} transactions</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by transaction, student, or invoice..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="virtual_account">Virtual Account</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
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

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Transaction</th>
                <th className="p-4 text-left font-semibold">Invoice</th>
                <th className="p-4 text-left font-semibold">Student</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-left font-semibold">Method</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const MethodIcon = getMethodIcon(payment.method);
                return (
                  <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-medium">{payment.id}</div>
                      <div className="text-muted-foreground text-sm">{payment.time}</div>
                    </td>
                    <td className="p-4 text-sm">{payment.invoiceId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-primary/10">
                          <span className="font-semibold text-primary text-xs">
                            {payment.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </Avatar>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-muted-foreground text-sm">{payment.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MethodIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{getMethodLabel(payment.method)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{payment.date}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
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
