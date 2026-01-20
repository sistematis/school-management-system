import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PayrollPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  Check: ({ className }: { className?: string }) => <svg className={className} data-testid="check" />,
  DollarSign: ({ className }: { className?: string }) => <svg className={className} data-testid="dollar-sign" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  Play: ({ className }: { className?: string }) => <svg className={className} data-testid="play" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
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

describe("PayrollPage", () => {
  it("renders the page header with title and description", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Payroll Management")).toBeInTheDocument();
    expect(screen.getByText("Manage staff salaries and compensation")).toBeInTheDocument();
  });

  it("renders the Process Payroll button", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Process Payroll")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Total Payroll")).toBeInTheDocument();
    expect(screen.getByText("Paid Amount")).toBeInTheDocument();
    expect(screen.getByText("Pending Amount")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<PayrollPage />);
    expect(screen.getByPlaceholderText("Search by name, ID, or position...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders payroll table with headers", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Base Salary")).toBeInTheDocument();
    expect(screen.getByText("Allowances")).toBeInTheDocument();
    expect(screen.getByText("Incentives")).toBeInTheDocument();
    expect(screen.getByText("Deductions")).toBeInTheDocument();
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("Net Salary")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders employee names", () => {
    render(<PayrollPage />);
    expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Prof. Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("Ms. Emily Davis")).toBeInTheDocument();
  });

  it("renders employee positions", () => {
    render(<PayrollPage />);
    // Positions appear multiple times in the table
    expect(screen.getAllByText("Principal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Senior Teacher").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Teacher").length).toBeGreaterThan(0);
  });

  it("renders payroll statuses", () => {
    render(<PayrollPage />);
    expect(screen.getAllByText("Paid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
  });

  it("renders formatted currency amounts", () => {
    render(<PayrollPage />);
    expect(screen.getAllByText(/Rp/).length).toBeGreaterThan(0);
  });

  it("renders attendance days", () => {
    render(<PayrollPage />);
    expect(screen.getAllByText(/days/).length).toBeGreaterThan(0);
  });
});
