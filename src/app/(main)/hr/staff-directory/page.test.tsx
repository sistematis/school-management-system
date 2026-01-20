import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StaffDirectoryPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Briefcase: ({ className }: { className?: string }) => <svg className={className} data-testid="briefcase" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  GraduationCap: ({ className }: { className?: string }) => <svg className={className} data-testid="graduation-cap" />,
  Mail: ({ className }: { className?: string }) => <svg className={className} data-testid="mail" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Phone: ({ className }: { className?: string }) => <svg className={className} data-testid="phone" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  UserCheck: ({ className }: { className?: string }) => <svg className={className} data-testid="user-check" />,
  UserX: ({ className }: { className?: string }) => <svg className={className} data-testid="user-x" />,
  Users: ({ className }: { className?: string }) => <svg className={className} data-testid="users" />,
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

describe("StaffDirectoryPage", () => {
  it("renders the page header with title and description", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Staff Directory")).toBeInTheDocument();
    expect(screen.getByText("View and manage staff information.")).toBeInTheDocument();
  });

  it("renders the Add Staff button", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Add Staff")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Total Staff")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("On Leave").length).toBeGreaterThan(0);
    expect(screen.getByText("Teaching Staff")).toBeInTheDocument();
    expect(screen.getByText("Non-Teaching")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByPlaceholderText("Search by name, ID, department, or email...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders staff table with headers", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Staff Member")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Join Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders staff IDs", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("STF-001")).toBeInTheDocument();
    expect(screen.getByText("STF-002")).toBeInTheDocument();
    expect(screen.getByText("STF-003")).toBeInTheDocument();
  });

  it("renders staff names", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
    expect(screen.getByText("Prof. James Wilson")).toBeInTheDocument();
    expect(screen.getByText("Ms. Emily Chen")).toBeInTheDocument();
  });

  it("renders staff statuses", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("On Leave").length).toBeGreaterThan(0);
  });

  it("renders departments", () => {
    render(<StaffDirectoryPage />);
    expect(screen.getAllByText("Teaching").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Administration").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Support Staff").length).toBeGreaterThan(0);
  });

  it("renders action buttons for each staff member", () => {
    render(<StaffDirectoryPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(5);
  });
});
