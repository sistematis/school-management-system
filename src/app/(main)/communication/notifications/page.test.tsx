import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NotificationsPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-circle" />,
  Archive: ({ className }: { className?: string }) => <svg className={className} data-testid="archive" />,
  Bell: ({ className }: { className?: string }) => <svg className={className} data-testid="bell" />,
  Check: ({ className }: { className?: string }) => <svg className={className} data-testid="check" />,
  CheckCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="check-circle" />,
  Clock: ({ className }: { className?: string }) => <svg className={className} data-testid="clock" />,
  Delete: ({ className }: { className?: string }) => <svg className={className} data-testid="delete" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Trash2: ({ className }: { className?: string }) => <svg className={className} data-testid="trash-2" />,
  X: ({ className }: { className?: string }) => <svg className={className} data-testid="x" />,
}));

// Mock the UI components
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ className, children }: { className: string; children: React.ReactNode }) => (
    <div className={className} data-testid="avatar">
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ className, children }: { className: string; children: React.ReactNode }) => (
    <span className={className}>{children}</span>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ className, children, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ className, children }: { className: string; children: React.ReactNode }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("NotificationsPage", () => {
  it("renders the page header with title and description", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Stay updated with important announcements and alerts.")).toBeInTheDocument();
  });

  it("renders Mark All Read and Archive All buttons", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("Mark All Read").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Archive All").length).toBeGreaterThan(0);
  });

  it("renders all stat cards", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("Unread").length).toBeGreaterThan(0);
    expect(screen.getAllByText("High Priority").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Archived").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Total").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<NotificationsPage />);
    expect(screen.getByPlaceholderText("Search notifications by title, message, or sender...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("More Filters").length).toBeGreaterThan(0);
  });

  it("renders notification titles", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("School Closure Due to Weather")).toBeInTheDocument();
    expect(screen.getByText("Parent-Teacher Conference Reminder")).toBeInTheDocument();
    expect(screen.getByText("Grade Posted: Mathematics Midterm")).toBeInTheDocument();
    expect(screen.getByText("Fee Payment Due")).toBeInTheDocument();
  });

  it("renders notification types", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("Emergency").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Event").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Academic").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fee").length).toBeGreaterThan(0);
  });

  it("renders notification senders", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("School Administration")).toBeInTheDocument();
    expect(screen.getByText("School Office")).toBeInTheDocument();
    expect(screen.getByText("Ms. Sarah Williams")).toBeInTheDocument();
    expect(screen.getByText("Finance Office")).toBeInTheDocument();
  });

  it("renders action buttons in notifications", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("View Emergency Contacts").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Add to Calendar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View Details").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pay Now").length).toBeGreaterThan(0);
  });

  it("renders Quick Actions section", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Manage your notifications efficiently")).toBeInTheDocument();
  });

  it("renders quick action buttons", () => {
    render(<NotificationsPage />);
    expect(screen.getAllByText("Mark Read").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Archive").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Delete").length).toBeGreaterThan(0);
  });

  it("renders Notification Preferences section", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Notification Preferences")).toBeInTheDocument();
  });

  it("renders notification preference types", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Emergency Notifications")).toBeInTheDocument();
    expect(screen.getByText("Academic Updates")).toBeInTheDocument();
    expect(screen.getByText("Fee Reminders")).toBeInTheDocument();
    expect(screen.getByText("Event Notifications")).toBeInTheDocument();
    expect(screen.getByText("Behavior Alerts")).toBeInTheDocument();
  });

  it("renders enabled and disabled buttons for preferences", () => {
    render(<NotificationsPage />);
    const enabledButtons = screen.getAllByText("Enabled");
    const disabledButtons = screen.getAllByText("Disabled");
    expect(enabledButtons.length).toBeGreaterThan(0);
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it("renders action buttons for notifications", () => {
    render(<NotificationsPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(15);
  });
});
