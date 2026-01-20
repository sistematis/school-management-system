"use client";

import { useState } from "react";

import {
  AlertTriangle,
  BookOpen,
  Building,
  Calendar,
  CheckCircle,
  DoorOpen,
  Dumbbell,
  Film,
  Filter,
  MapPin,
  MonitorSpeaker,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Users,
  Utensils,
  Wrench,
  XCircle,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock rooms data
const mockRooms = [
  {
    id: "RM-001",
    name: "Classroom 10-A",
    type: "classroom" as const,
    capacity: 30,
    location: "Building 1, Floor 2",
    equipment: ["Projector", "Whiteboard", "Computer"],
    status: "available" as const,
    features: ["Air Conditioning", "Smart Board", "WiFi"],
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-07-10",
  },
  {
    id: "RM-002",
    name: "Computer Lab A",
    type: "laboratory" as const,
    capacity: 25,
    location: "Building 2, Floor 1",
    equipment: ["25 Desktop Computers", "Printer", "Server"],
    status: "occupied" as const,
    features: ["High-Speed Internet", "Projector", "Air Conditioning"],
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
  },
  {
    id: "RM-003",
    name: "Science Laboratory",
    type: "laboratory" as const,
    capacity: 20,
    location: "Building 3, Floor 1",
    equipment: ["Lab Tables", "Chemical Storage", "Safety Equipment"],
    status: "maintenance" as const,
    features: ["Fume Hood", "Safety Shower", "Chemical Storage"],
    lastMaintenance: "2023-12-01",
    nextMaintenance: "2024-02-01",
  },
  {
    id: "RM-004",
    name: "School Library",
    type: "library" as const,
    capacity: 100,
    location: "Building 1, Floor 3",
    equipment: ["Bookshelves", "Computers", "Study Rooms"],
    status: "available" as const,
    features: ["Quiet Zone", "Group Study Area", "Digital Resources"],
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-07-05",
  },
  {
    id: "RM-005",
    name: "Main Auditorium",
    type: "auditorium" as const,
    capacity: 500,
    location: "Main Building",
    equipment: ["Sound System", "Projector", "Stage Lighting"],
    status: "booked" as const,
    features: ["Stage", "VIP Seating", "Climate Control"],
    lastMaintenance: "2024-01-12",
    nextMaintenance: "2024-06-12",
  },
  {
    id: "RM-006",
    name: "Sports Gymnasium",
    type: "gymnasium" as const,
    capacity: 200,
    location: "Sports Complex",
    equipment: ["Basketball Hoops", "Volleyball Net", "Exercise Equipment"],
    status: "available" as const,
    features: ["Wooden Floor", "Changing Rooms", "Equipment Storage"],
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-04-08",
  },
  {
    id: "RM-007",
    name: "School Cafeteria",
    type: "cafeteria" as const,
    capacity: 150,
    location: "Building 1, Floor 1",
    equipment: ["Tables", "Chairs", "Serving Area"],
    status: "available" as const,
    features: ["Kitchen", "Vending Machines", "Outdoor Seating"],
    lastMaintenance: "2024-01-14",
    nextMaintenance: "2024-03-14",
  },
  {
    id: "RM-008",
    name: "Staff Office",
    type: "office" as const,
    capacity: 10,
    location: "Administration Building",
    equipment: ["Desks", "Computers", "Printers"],
    status: "available" as const,
    features: ["Meeting Room", "Private Offices", "Reception Area"],
    lastMaintenance: "2024-01-11",
    nextMaintenance: "2024-07-11",
  },
];

// Mock bookings data
const mockBookings = [
  {
    id: "BK-001",
    roomId: "RM-002",
    roomName: "Computer Lab A",
    purpose: "Computer Science Class",
    requesterId: "TCH-001",
    requesterName: "Ms. Sarah Williams",
    startTime: "2024-01-16T09:00:00",
    endTime: "2024-01-16T11:00:00",
    attendees: 25,
    status: "approved" as const,
  },
  {
    id: "BK-002",
    roomId: "RM-005",
    roomName: "Main Auditorium",
    purpose: "School Assembly",
    requesterId: "ADM-001",
    requesterName: "Principal Office",
    startTime: "2024-01-17T08:00:00",
    endTime: "2024-01-17T10:00:00",
    attendees: 450,
    status: "approved" as const,
  },
  {
    id: "BK-003",
    roomId: "RM-004",
    roomName: "School Library",
    purpose: "Reading Session",
    requesterId: "TCH-003",
    requesterName: "Mrs. Emily Chen",
    startTime: "2024-01-18T14:00:00",
    endTime: "2024-01-18T15:30:00",
    attendees: 30,
    status: "pending" as const,
  },
];

type RoomStatus = "available" | "occupied" | "maintenance" | "closed" | "booked";
type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

const getRoomStatusColor = (status: RoomStatus) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "occupied":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "closed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "booked":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  }
};

const getRoomStatusIcon = (status: RoomStatus) => {
  switch (status) {
    case "available":
      return CheckCircle;
    case "occupied":
      return Users;
    case "maintenance":
      return Wrench;
    case "closed":
      return XCircle;
    case "booked":
      return Calendar;
  }
};

const getBookingStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getRoomTypeIcon = (type: string) => {
  switch (type) {
    case "classroom":
      return DoorOpen;
    case "laboratory":
      return Settings;
    case "library":
      return BookOpen;
    case "auditorium":
      return Film;
    case "gymnasium":
      return Dumbbell;
    case "cafeteria":
      return Utensils;
    case "office":
      return Building;
    default:
      return Building;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const stats = [
  { label: "Total Rooms", value: "8", icon: Building, color: "text-blue-600" },
  { label: "Available", value: "5", icon: CheckCircle, color: "text-green-600" },
  { label: "In Use", value: "1", icon: Users, color: "text-purple-600" },
  { label: "Maintenance", value: "1", icon: Wrench, color: "text-orange-600" },
];

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Facilities Management</h1>
          <p className="mt-2 text-muted-foreground">Room booking, equipment tracking, and maintenance scheduling</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          New Booking
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
              placeholder="Search by room name, ID, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="auditorium">Auditorium</SelectItem>
              <SelectItem value="gymnasium">Gymnasium</SelectItem>
              <SelectItem value="cafeteria">Cafeteria</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredRooms.length === 0 ? (
          <Card className="col-span-3 p-12">
            <div className="flex flex-col items-center justify-center">
              <Building className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="font-semibold text-lg">No facilities found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
            </div>
          </Card>
        ) : (
          filteredRooms.map((room) => {
            const StatusIcon = getRoomStatusIcon(room.status);
            const TypeIcon = getRoomTypeIcon(room.type);
            return (
              <Card key={room.id} className="p-4 transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/10">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </Avatar>
                    <div>
                      <p className="text-muted-foreground text-xs">{room.id}</p>
                      <h4 className="font-semibold">{room.name}</h4>
                    </div>
                  </div>
                  <Badge className={getRoomStatusColor(room.status)} variant="secondary">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {room.capacity} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MonitorSpeaker className="h-4 w-4" />
                    <span className="truncate">{room.equipment.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <span>Last Maintenance</span>
                    <span>{formatDate(room.lastMaintenance)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <span>Next Due</span>
                    <span>{formatDate(room.nextMaintenance)}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Calendar className="h-3 w-3" />
                    Book
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Bookings */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <h2 className="font-semibold text-xl">Recent Bookings</h2>
        </div>
        <div className="divide-y">
          {mockBookings.map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{booking.roomName}</h4>
                    <Badge className={getBookingStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{booking.purpose}</p>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
                    <span>{booking.requesterName}</span>
                    <span>•</span>
                    <span>
                      {formatDate(booking.startTime)} {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                    <span>•</span>
                    <span>{booking.attendees} attendees</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button variant="outline" size="sm" className="gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-red-600">
                        <XCircle className="h-3 w-3" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-muted-foreground text-sm">Common facility management operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              View Schedule
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
