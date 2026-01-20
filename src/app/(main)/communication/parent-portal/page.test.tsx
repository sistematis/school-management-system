import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ParentPortalPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-circle" />,
  BookOpen: ({ className }: { className?: string }) => <svg className={className} data-testid="book-open" />,
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  CheckCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="check-circle" />,
  Clock: ({ className }: { className?: string }) => <svg className={className} data-testid="clock" />,
  DollarSign: ({ className }: { className?: string }) => <svg className={className} data-testid="dollar-sign" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  Mail: ({ className }: { className?: string }) => <svg className={className} data-testid="mail" />,
  MessageSquare: ({ className }: { className?: string }) => <svg className={className} data-testid="message-square" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  TrendingUp: ({ className }: { className?: string }) => <svg className={className} data-testid="trending-up" />,
  User: ({ className }: { className?: string }) => <svg className={className} data-testid="user" />,
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

describe("ParentPortalPage", () => {
  it("renders the page header with title and description", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Parent Portal")).toBeInTheDocument();
    expect(screen.getByText("Monitor your child's academic progress and communication.")).toBeInTheDocument();
  });

  it("renders the New Message button", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("New Message")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<ParentPortalPage />);
    expect(screen.getAllByText("Total Students").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Unread Messages").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Upcoming Meetings").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Outstanding Fees").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<ParentPortalPage />);
    expect(screen.getByPlaceholderText("Search students, messages, or announcements...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<ParentPortalPage />);
    expect(screen.getAllByText("Filters").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Export").length).toBeGreaterThan(0);
  });

  it("renders My Children section", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("My Children")).toBeInTheDocument();
  });

  it("renders student names", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Emma Johnson")).toBeInTheDocument();
    expect(screen.getByText("Liam Johnson")).toBeInTheDocument();
  });

  it("renders student IDs", () => {
    render(<ParentPortalPage />);
    // Student IDs are rendered inline with the name: "STU-001 • Grade 10-A"
    expect(screen.getAllByText(/STU/).length).toBeGreaterThan(0);
  });

  it("renders attendance percentages", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("95% Present")).toBeInTheDocument();
    expect(screen.getByText("89% Present")).toBeInTheDocument();
  });

  it("renders average grades", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("A-")).toBeInTheDocument();
    expect(screen.getByText("B+")).toBeInTheDocument();
  });

  it("renders behavior statuses", () => {
    render(<ParentPortalPage />);
    expect(screen.getAllByText("Excellent").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Good").length).toBeGreaterThan(0);
  });

  it("renders outstanding fees", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("$2,100")).toBeInTheDocument();
    expect(screen.getAllByText(/1250/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/850/).length).toBeGreaterThan(0);
  });

  it("renders Messages from Teachers section", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Messages from Teachers")).toBeInTheDocument();
  });

  it("renders teacher names", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Ms. Sarah Williams")).toBeInTheDocument();
    expect(screen.getByText("Mr. James Rodriguez")).toBeInTheDocument();
    expect(screen.getByText("Mrs. Emily Chen")).toBeInTheDocument();
  });

  it("renders message subjects", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("renders School Announcements section", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("School Announcements")).toBeInTheDocument();
  });

  it("renders announcement titles", () => {
    render(<ParentPortalPage />);
    expect(screen.getByText("Winter Break Schedule")).toBeInTheDocument();
    expect(screen.getByText("Parent-Teacher Conference")).toBeInTheDocument();
    expect(screen.getByText("Fee Payment Reminder")).toBeInTheDocument();
  });

  it("renders View Details buttons", () => {
    render(<ParentPortalPage />);
    expect(screen.getAllByText("View Details").length).toBeGreaterThan(0);
  });

  it("renders Reply buttons", () => {
    render(<ParentPortalPage />);
    expect(screen.getAllByText("Reply").length).toBeGreaterThan(0);
  });

  it("renders action buttons for each section", () => {
    render(<ParentPortalPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(10);
  });
});
