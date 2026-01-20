"use client";

import { useState } from "react";

import {
  AlertCircle,
  Archive,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Delete,
  Download,
  Filter,
  MoreVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock notifications
const mockNotifications = [
  {
    id: "NOTIF-001",
    title: "School Closure Due to Weather",
    message: "School will be closed tomorrow due to severe weather conditions. Classes will resume on Wednesday.",
    type: "emergency" as const,
    priority: "urgent" as const,
    isRead: false,
    isArchived: false,
    timestamp: "2024-01-15T18:30:00",
    actionUrl: "/emergency-contacts",
    actionLabel: "View Emergency Contacts",
    sender: "School Administration",
  },
  {
    id: "NOTIF-002",
    title: "Parent-Teacher Conference Reminder",
    message: "Your parent-teacher conference is scheduled for January 25th at 3:00 PM. Please arrive 10 minutes early.",
    type: "event" as const,
    priority: "high" as const,
    isRead: false,
    isArchived: false,
    timestamp: "2024-01-15T14:20:00",
    actionUrl: "/calendar",
    actionLabel: "Add to Calendar",
    sender: "School Office",
  },
  {
    id: "NOTIF-003",
    title: "Grade Posted: Mathematics Midterm",
    message: "Your midterm grade has been posted. You scored 92%. Great job!",
    type: "academic" as const,
    priority: "normal" as const,
    isRead: true,
    isArchived: false,
    timestamp: "2024-01-15T10:15:00",
    actionUrl: "/grades",
    actionLabel: "View Details",
    sender: "Ms. Sarah Williams",
  },
  {
    id: "NOTIF-004",
    title: "Fee Payment Due",
    message: "Second semester fees of $1,250 are due by January 31st. Please make payment to avoid late fees.",
    type: "fee" as const,
    priority: "high" as const,
    isRead: false,
    isArchived: false,
    timestamp: "2024-01-14T16:45:00",
    actionUrl: "/payments",
    actionLabel: "Pay Now",
    sender: "Finance Office",
  },
  {
    id: "NOTIF-005",
    title: "New Assignment: Science Lab Report",
    message: "A new lab report assignment has been posted. Due date: January 25th.",
    type: "academic" as const,
    priority: "normal" as const,
    isRead: true,
    isArchived: false,
    timestamp: "2024-01-14T09:30:00",
    actionUrl: "/assignments",
    actionLabel: "View Assignment",
    sender: "Mr. James Rodriguez",
  },
  {
    id: "NOTIF-006",
    title: "Sports Tryouts Announcement",
    message: "Basketball team tryouts will be held on January 20th at 3:30 PM in the gymnasium.",
    type: "event" as const,
    priority: "normal" as const,
    isRead: true,
    isArchived: false,
    timestamp: "2024-01-13T12:00:00",
    actionUrl: "/events",
    actionLabel: "RSVP",
    sender: "Athletics Department",
  },
  {
    id: "NOTIF-007",
    title: "Library Book Due Soon",
    message: "The book 'To Kill a Mockingbird' is due on January 18th. Please renew or return to avoid fines.",
    type: "system" as const,
    priority: "low" as const,
    isRead: true,
    isArchived: false,
    timestamp: "2024-01-13T08:00:00",
    actionUrl: "/library",
    actionLabel: "Renew Book",
    sender: "Library System",
  },
  {
    id: "NOTIF-008",
    title: "Attendance Warning",
    message: "Your attendance has dropped below 90%. Please ensure regular attendance to maintain academic standing.",
    type: "behavior" as const,
    priority: "high" as const,
    isRead: false,
    isArchived: false,
    timestamp: "2024-01-12T15:30:00",
    actionUrl: "/attendance",
    actionLabel: "View Attendance",
    sender: "Attendance Office",
  },
  {
    id: "NOTIF-009",
    title: "School Picture Day",
    message: "School picture day is scheduled for February 5th. Order forms will be sent home next week.",
    type: "event" as const,
    priority: "normal" as const,
    isRead: true,
    isArchived: true,
    timestamp: "2024-01-10T11:00:00",
    sender: "School Office",
  },
];

type NotificationType = "system" | "academic" | "behavior" | "event" | "fee" | "emergency";
type NotificationPriority = "low" | "normal" | "high" | "urgent";

const getNotificationTypeColor = (type: NotificationType) => {
  switch (type) {
    case "system":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "academic":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "behavior":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "event":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "fee":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "emergency":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

const getNotificationPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case "low":
      return "text-gray-600";
    case "normal":
      return "text-blue-600";
    case "high":
      return "text-orange-600";
    case "urgent":
      return "text-red-600";
  }
};

const getNotificationPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case "low":
      return Clock;
    case "normal":
      return Bell;
    case "high":
      return AlertCircle;
    case "urgent":
      return AlertCircle;
  }
};

const getRelativeTime = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  // Use consistent date format instead of locale-dependent formatting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const stats = [
  { label: "Unread", value: "5", icon: Bell, color: "text-blue-600" },
  { label: "High Priority", value: "3", icon: AlertCircle, color: "text-orange-600" },
  { label: "Archived", value: "1", icon: Archive, color: "text-gray-600" },
  { label: "Total", value: "9", icon: CheckCircle, color: "text-green-600" },
];

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" ||
      (priorityFilter === "urgent" && (notification.priority === "urgent" || notification.priority === "high")) ||
      notification.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead) ||
      (statusFilter === "archived" && notification.isArchived);
    return matchesSearch && matchesType && matchesPriority && matchesStatus && !notification.isArchived;
  });

  const unreadCount = mockNotifications.filter((n) => !n.isRead && !n.isArchived).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl">Notifications</h1>
          <p className="mt-2 text-muted-foreground">Stay updated with important announcements and alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" className="gap-2">
            <Archive className="h-4 w-4" />
            Archive All
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
            <p className="font-bold text-3xl">{stat.label === "Unread" ? unreadCount : stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notifications by title, message, or sender..."
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
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="behavior">Behavior</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="fee">Fee</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Bell className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="font-semibold text-lg">No notifications found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => {
              const PriorityIcon = getNotificationPriorityIcon(notification.priority);
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 hover:bg-muted/30 ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <Avatar className={`h-10 w-10 ${notification.type === "emergency" ? "bg-red-100" : "bg-primary/10"}`}>
                    <PriorityIcon
                      className={`h-5 w-5 ${notification.type === "emergency" ? "text-red-600" : "text-primary"}`}
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!notification.isRead && <span className="bg-blue-500 rounded-full p-1" />}
                          <h4
                            className={`font-semibold ${!notification.isRead ? "text-blue-900 dark:text-blue-100" : ""}`}
                          >
                            {notification.title}
                          </h4>
                          <Badge className={getNotificationTypeColor(notification.type)}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </Badge>
                          {notification.priority === "urgent" && (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertCircle className="h-3 w-3" />
                              <span className="font-semibold">Urgent</span>
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">{notification.message}</p>
                        <div className="mt-2 flex items-center gap-3 text-muted-foreground text-xs">
                          <span>{notification.sender}</span>
                          <span>•</span>
                          <span>{getRelativeTime(notification.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.actionLabel && (
                          <Button variant="outline" size="sm">
                            {notification.actionLabel}
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-muted-foreground text-sm">Manage your notifications efficiently</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Check className="h-4 w-4" />
              Mark Read
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <h2 className="font-semibold text-xl">Notification Preferences</h2>
        </div>
        <div className="divide-y">
          {[
            {
              type: "Emergency Notifications",
              description: "Critical alerts requiring immediate attention",
              enabled: true,
            },
            { type: "Academic Updates", description: "Grades, assignments, and academic announcements", enabled: true },
            { type: "Fee Reminders", description: "Payment due dates and financial notifications", enabled: true },
            { type: "Event Notifications", description: "School events, holidays, and activities", enabled: false },
            { type: "Behavior Alerts", description: "Attendance warnings and behavior reports", enabled: true },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30">
              <div>
                <h4 className="font-semibold">{setting.type}</h4>
                <p className="text-muted-foreground text-sm">{setting.description}</p>
              </div>
              <Button variant={setting.enabled ? "default" : "outline"} size="sm" className="gap-2">
                {setting.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {setting.enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
