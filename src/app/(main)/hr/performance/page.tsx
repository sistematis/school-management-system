"use client";

import { useState } from "react";

import { AlertCircle, Award, Download, FileText, Filter, MoreVertical, Plus, Search, Star } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock performance review data
const mockReviews = [
  {
    id: "PR-2024-Q1-001",
    staffId: "STF-001",
    staffName: "Dr. Sarah Mitchell",
    initials: "SM",
    department: "Teaching",
    reviewPeriod: "Q1 2024",
    rating: 4.5,
    reviewer: "Principal Johnson",
    reviewDate: "2024-01-10",
    status: "completed" as const,
    goals: ["Improve student engagement", "Lead curriculum development"],
  },
  {
    id: "PR-2024-Q1-002",
    staffId: "STF-002",
    staffName: "Prof. James Wilson",
    initials: "JW",
    department: "Teaching",
    reviewPeriod: "Q1 2024",
    rating: 4.8,
    reviewer: "Principal Johnson",
    reviewDate: "2024-01-12",
    status: "completed" as const,
    goals: ["Mentor junior teachers", "Publish research paper"],
  },
  {
    id: "PR-2024-Q1-003",
    staffId: "STF-003",
    staffName: "Ms. Emily Chen",
    initials: "EC",
    department: "Administration",
    reviewPeriod: "Q1 2024",
    rating: 4.2,
    reviewer: "HR Director",
    reviewDate: "2024-01-08",
    status: "completed" as const,
    goals: ["Streamline admin processes", "Improve communication"],
  },
  {
    id: "PR-2024-Q1-004",
    staffId: "STF-004",
    staffName: "Mr. Michael Brown",
    initials: "MB",
    department: "Teaching",
    reviewPeriod: "Q1 2024",
    rating: 3.8,
    reviewer: "Dept. Head Smith",
    reviewDate: "2024-01-15",
    status: "in_progress" as const,
    goals: ["Enhance teaching methods", "Complete certification"],
  },
  {
    id: "PR-2024-Q1-005",
    staffId: "STF-005",
    staffName: "Mrs. Linda Garcia",
    initials: "LG",
    department: "Support Staff",
    reviewPeriod: "Q1 2024",
    rating: 4.0,
    reviewer: "Library Manager",
    reviewDate: "2024-01-18",
    status: "completed" as const,
    goals: ["Digitize library records", "Organize book clubs"],
  },
  {
    id: "PR-2024-Q1-006",
    staffId: "STF-006",
    staffName: "Dr. Robert Kim",
    initials: "RK",
    department: "Teaching",
    reviewPeriod: "Q1 2024",
    rating: 3.5,
    reviewer: "Dept. Head Wilson",
    reviewDate: "2024-01-20",
    status: "pending" as const,
    goals: ["Improve lab safety", "Update equipment inventory"],
  },
];

type ReviewStatus = "pending" | "in_progress" | "completed" | "draft";

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-blue-600";
  if (rating >= 3.5) return "text-yellow-600";
  return "text-red-600";
};

const getRatingStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="h-4 w-4 fill-current" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Star key={i} className="h-4 w-4 fill-current opacity-50" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4" />);
    }
  }
  return stars;
};

const getStatusColor = (status: ReviewStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusLabel = (status: ReviewStatus) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "pending":
      return "Pending";
    case "draft":
      return "Draft";
  }
};

const stats = [
  { label: "Reviews This Quarter", value: "24", icon: FileText, color: "text-blue-600" },
  { label: "Average Rating", value: "4.2", icon: Star, color: "text-yellow-600" },
  { label: "Top Performers", value: "8", icon: Award, color: "text-green-600" },
  { label: "Improvement Needed", value: "3", icon: AlertCircle, color: "text-red-600" },
];

export default function PerformancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [quarterFilter, setQuarterFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesQuarter = quarterFilter === "all" || review.reviewPeriod === quarterFilter;
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "excellent" && review.rating >= 4.5) ||
      (ratingFilter === "good" && review.rating >= 4.0 && review.rating < 4.5) ||
      (ratingFilter === "average" && review.rating >= 3.5 && review.rating < 4.0) ||
      (ratingFilter === "below_average" && review.rating < 3.5);
    return matchesSearch && matchesStatus && matchesQuarter && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Performance Management</h1>
          <p className="mt-2 text-muted-foreground">Track and evaluate staff performance.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          New Review
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
              placeholder="Search by staff name or review ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={quarterFilter} onValueChange={setQuarterFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="Q1 2024">Q1 2024</SelectItem>
              <SelectItem value="Q4 2023">Q4 2023</SelectItem>
              <SelectItem value="Q3 2023">Q3 2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="excellent">Excellent (4.5+)</SelectItem>
              <SelectItem value="good">Good (4.0-4.4)</SelectItem>
              <SelectItem value="average">Average (3.5-3.9)</SelectItem>
              <SelectItem value="below_average">Below Average (&lt;3.5)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
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

      {/* Performance Reviews Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-semibold">Review ID</th>
                <th className="p-4 text-left font-semibold">Staff Member</th>
                <th className="p-4 text-left font-semibold">Department</th>
                <th className="p-4 text-left font-semibold">Review Period</th>
                <th className="p-4 text-left font-semibold">Rating</th>
                <th className="p-4 text-left font-semibold">Reviewer</th>
                <th className="p-4 text-left font-semibold">Review Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-medium text-sm">{review.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <span className="font-semibold text-primary text-xs">{review.initials}</span>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{review.staffName}</div>
                        <div className="text-muted-foreground text-xs">{review.staffId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{review.department}</td>
                  <td className="p-4 text-sm">{review.reviewPeriod}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex ${getRatingColor(review.rating)}`}>{getRatingStars(review.rating)}</div>
                      <span className={`font-semibold text-sm ${getRatingColor(review.rating)}`}>
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{review.reviewer}</td>
                  <td className="p-4 text-sm">{review.reviewDate}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(review.status)}>{getStatusLabel(review.status)}</Badge>
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
