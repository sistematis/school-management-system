"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Book,
  BookOpen,
  Clock,
  Database,
  Download,
  Filter,
  Globe,
  Headphones,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Users,
  Video,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock books data
const mockBooks = [
  {
    id: "BK-001",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction" as const,
    publisher: "Harper Perennial",
    publishYear: 2006,
    totalCopies: 5,
    availableCopies: 3,
    location: "Section A, Shelf 12",
    status: "available" as const,
    coverUrl: "",
    description: "A classic of modern American literature",
    pageCount: 336,
    language: "English",
  },
  {
    id: "BK-002",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0-262-03384-8",
    category: "Textbook" as const,
    publisher: "MIT Press",
    publishYear: 2009,
    totalCopies: 10,
    availableCopies: 0,
    location: "Section B, Shelf 5",
    status: "borrowed" as const,
    coverUrl: "",
    description: "Comprehensive textbook on computer algorithms",
    pageCount: 1312,
    language: "English",
  },
  {
    id: "BK-003",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction" as const,
    publisher: "Scribner",
    publishYear: 2004,
    totalCopies: 8,
    availableCopies: 6,
    location: "Section A, Shelf 15",
    status: "available" as const,
    coverUrl: "",
    description: "A masterpiece of American fiction",
    pageCount: 180,
    language: "English",
  },
  {
    id: "BK-004",
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    isbn: "978-1-1339-5415-7",
    category: "Textbook" as const,
    publisher: "Cengage Learning",
    publishYear: 2013,
    totalCopies: 15,
    availableCopies: 12,
    location: "Section B, Shelf 8",
    status: "available" as const,
    coverUrl: "",
    description: "Comprehensive physics textbook",
    pageCount: 1344,
    language: "English",
  },
  {
    id: "BK-005",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    category: "Fiction" as const,
    publisher: "Signet Classic",
    publishYear: 1950,
    totalCopies: 6,
    availableCopies: 0,
    location: "Section A, Shelf 18",
    status: "overdue" as const,
    coverUrl: "",
    description: "Dystopian social science fiction novel",
    pageCount: 328,
    language: "English",
  },
  {
    id: "BK-006",
    title: "World History: Patterns of Civilization",
    author: "Beck, Black, Krieger",
    isbn: "978-0-13-050886-1",
    category: "Reference" as const,
    publisher: "Pearson",
    publishYear: 2003,
    totalCopies: 4,
    availableCopies: 2,
    location: "Section C, Shelf 3",
    status: "reserved" as const,
    coverUrl: "",
    description: "Comprehensive world history textbook",
    pageCount: 850,
    language: "English",
  },
  {
    id: "BK-007",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    category: "Fiction" as const,
    publisher: "Little, Brown and Company",
    publishYear: 1951,
    totalCopies: 5,
    availableCopies: 0,
    location: "Section A, Shelf 20",
    status: "lost" as const,
    coverUrl: "",
    description: "A controversial novel of teenage angst",
    pageCount: 277,
    language: "English",
  },
  {
    id: "BK-008",
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0-321-80322-9",
    category: "Textbook" as const,
    publisher: "Pearson",
    publishYear: 2016,
    totalCopies: 8,
    availableCopies: 5,
    location: "Section B, Shelf 12",
    status: "available" as const,
    coverUrl: "",
    description: "Comprehensive organic chemistry textbook",
    pageCount: 1440,
    language: "English",
  },
];

// Mock borrow records
const mockBorrowRecords = [
  {
    id: "BR-001",
    bookId: "BK-002",
    bookTitle: "Introduction to Algorithms",
    studentId: "STU-001",
    studentName: "Emma Johnson",
    borrowDate: "2024-01-05",
    dueDate: "2024-01-19",
    returnDate: "",
    status: "borrowed" as const,
    fine: 0,
    finePaid: false,
  },
  {
    id: "BR-002",
    bookId: "BK-005",
    bookTitle: "1984",
    studentId: "STU-002",
    studentName: "Liam Johnson",
    borrowDate: "2023-12-20",
    dueDate: "2024-01-03",
    returnDate: "",
    status: "overdue" as const,
    fine: 15000,
    finePaid: false,
  },
  {
    id: "BR-003",
    bookId: "BK-006",
    bookTitle: "World History: Patterns of Civilization",
    studentId: "STU-003",
    studentName: "Noah Williams",
    borrowDate: "2024-01-10",
    dueDate: "2024-01-24",
    returnDate: "",
    status: "borrowed" as const,
    fine: 0,
    finePaid: false,
  },
  {
    id: "BR-004",
    bookId: "BK-007",
    bookTitle: "The Catcher in the Rye",
    studentId: "STU-004",
    studentName: "Olivia Brown",
    borrowDate: "2023-11-15",
    dueDate: "2023-11-29",
    returnDate: "",
    status: "lost" as const,
    fine: 150000,
    finePaid: true,
  },
];

// Mock digital resources
const mockDigitalResources = [
  {
    id: "DR-001",
    title: "Digital Library Platform",
    type: "database" as const,
    description: "Access to thousands of e-books and academic journals",
    url: "/library/digital",
    accessType: "subscription" as const,
    provider: "EduTech Solutions",
    availableUntil: "2025-12-31",
  },
  {
    id: "DR-002",
    title: "Educational Video Collection",
    type: "video" as const,
    description: "Documentaries and educational videos on various subjects",
    url: "/library/videos",
    accessType: "free" as const,
    provider: "School Library",
  },
  {
    id: "DR-003",
    title: "Audiobook Collection",
    type: "audiobook" as const,
    description: "Popular titles in audio format for accessibility",
    url: "/library/audiobooks",
    accessType: "free" as const,
    provider: "School Library",
  },
];

type BookStatus = "available" | "borrowed" | "overdue" | "reserved" | "lost" | "damaged";
type BookCategory = "Fiction" | "Non-Fiction" | "Reference" | "Textbook" | "Periodical";
type ResourceType = "ebook" | "audiobook" | "video" | "database" | "article";
type AccessType = "free" | "subscription" | "paid";

const getBookStatusColor = (status: BookStatus) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "borrowed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "reserved":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "lost":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "damaged":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getCategoryColor = (category: BookCategory) => {
  switch (category) {
    case "Fiction":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    case "Non-Fiction":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    case "Reference":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
    case "Textbook":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "Periodical":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
  }
};

const getResourceTypeIcon = (type: ResourceType) => {
  switch (type) {
    case "ebook":
      return BookOpen;
    case "audiobook":
      return Headphones;
    case "video":
      return Video;
    case "database":
      return Database;
    case "article":
      return Newspaper;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

const stats = [
  { label: "Total Books", value: "51", icon: Book, color: "text-blue-600" },
  { label: "Available", value: "26", icon: BookOpen, color: "text-green-600" },
  { label: "Borrowed", value: "18", icon: Users, color: "text-purple-600" },
  { label: "Overdue", value: "2", icon: Clock, color: "text-red-600" },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Library Management</h1>
          <p className="mt-2 text-muted-foreground">Manage books, digital resources, and borrowing records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Book
          </Button>
          <Button className="gap-2">
            <Plus className="h-5 w-5" />
            New Borrow Record
          </Button>
        </div>
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
              placeholder="Search by title, author, or ISBN..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Reference">Reference</SelectItem>
              <SelectItem value="Textbook">Textbook</SelectItem>
              <SelectItem value="Periodical">Periodical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
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

      {/* Books Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredBooks.length === 0 ? (
          <Card className="col-span-4 p-12">
            <div className="flex flex-col items-center justify-center">
              <Book className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="font-semibold text-lg">No books found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
            </div>
          </Card>
        ) : (
          filteredBooks.map((book) => (
            <Card key={book.id} className="p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex gap-3">
                <Avatar className="h-16 w-16 flex-shrink-0 bg-primary/10">
                  <Book className="h-8 w-8 text-primary" />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold">{book.title}</h4>
                  <p className="text-muted-foreground text-sm">{book.author}</p>
                  <p className="text-muted-foreground text-xs">{book.isbn}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium">
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="ml-2 truncate font-medium text-xs">{book.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge className={getCategoryColor(book.category)} variant="secondary">
                    {book.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={getBookStatusColor(book.status)} variant="secondary">
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <BookOpen className="h-3 w-3" />
                  {book.status === "available" ? "Borrow" : "Reserve"}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Active Borrow Records */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <h2 className="font-semibold text-xl">Active Borrow Records</h2>
        </div>
        <div className="divide-y">
          {mockBorrowRecords.map((record) => (
            <div key={record.id} className="p-4 hover:bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{record.bookTitle}</h4>
                    <Badge className={getBookStatusColor(record.status)} variant="secondary">
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">Borrowed by: {record.studentName}</p>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
                    <span>Borrowed: {formatDate(record.borrowDate)}</span>
                    <span>•</span>
                    <span>Due: {formatDate(record.dueDate)}</span>
                    {record.fine > 0 && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-red-600">Fine: {formatCurrency(record.fine)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Renew
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Book className="h-3 w-3" />
                    Return
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Digital Resources */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Digital Resources</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                Browse All
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          {mockDigitalResources.map((resource) => {
            const Icon = getResourceTypeIcon(resource.type);
            return (
              <Card key={resource.id} className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-muted-foreground text-sm">{resource.provider}</p>
                    <p className="mt-1 text-muted-foreground text-xs">{resource.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{resource.type}</Badge>
                      <Badge
                        className={
                          resource.accessType === "free"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        }
                        variant="secondary"
                      >
                        {resource.accessType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-muted-foreground text-sm">Common library management operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Process Returns
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Manage Reservations
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              Overdue Alerts
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
