import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LeaveManagementPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  CheckCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="check-circle" />,
  Clock: ({ className }: { className?: string }) => <svg className={className} data-testid="clock" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  TrendingUp: ({ className }: { className?: string }) => <svg className={className} data-testid="trending-up" />,
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

describe("LeaveManagementPage", () => {
  it("renders the page header with title and description", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("Leave Management")).toBeInTheDocument();
    expect(screen.getByText("Manage staff leave requests and balances.")).toBeInTheDocument();
  });

  it("renders the Apply for Leave button", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("Apply for Leave")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    expect(screen.getByText("Approved This Month")).toBeInTheDocument();
    expect(screen.getByText("On Leave Today")).toBeInTheDocument();
    expect(screen.getByText("Total Leave Days")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByPlaceholderText("Search by staff name or request ID...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders leave request table with headers", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("Request ID")).toBeInTheDocument();
    expect(screen.getByText("Staff Member")).toBeInTheDocument();
    expect(screen.getByText("Leave Type")).toBeInTheDocument();
    expect(screen.getByText("From Date")).toBeInTheDocument();
    expect(screen.getByText("To Date")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Reason")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Applied On")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders leave request IDs", () => {
    render(<LeaveManagementPage />);
    expect(screen.getByText("LV-2024-001")).toBeInTheDocument();
    expect(screen.getByText("LV-2024-002")).toBeInTheDocument();
    expect(screen.getByText("LV-2024-003")).toBeInTheDocument();
  });

  it("renders leave types", () => {
    render(<LeaveManagementPage />);
    expect(screen.getAllByText("Sick Leave").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Leave").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Personal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Emergency").length).toBeGreaterThan(0);
  });

  it("renders leave statuses", () => {
    render(<LeaveManagementPage />);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rejected").length).toBeGreaterThan(0);
  });

  it("renders approve/reject buttons for pending requests", () => {
    render(<LeaveManagementPage />);
    expect(screen.getAllByText("Approve").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reject").length).toBeGreaterThan(0);
  });

  it("renders action buttons for each request", () => {
    render(<LeaveManagementPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(10);
  });
});
