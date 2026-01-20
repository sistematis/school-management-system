import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FinanceReportsPage from "./page";

// Mock the UI components
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

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  ArrowDownRight: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="arrow-down-right" />
  ),
  ArrowUpRight: ({ className }: { className?: string }) => <svg className={className} data-testid="arrow-up-right" />,
  BarChart3: ({ className }: { className?: string }) => <svg className={className} data-testid="bar-chart-3" />,
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  FileText: ({ className }: { className?: string }) => <svg className={className} data-testid="file-text" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  IndianRupee: ({ className }: { className?: string }) => <svg className={className} data-testid="indian-rupee-sign" />,
  PieChart: ({ className }: { className?: string }) => <svg className={className} data-testid="pie-chart" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  TrendingUp: ({ className }: { className?: string }) => <svg className={className} data-testid="trending-up" />,
}));

describe("FinanceReportsPage", () => {
  it("renders the page header with title and description", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("Financial Reports")).toBeInTheDocument();
    expect(screen.getByText("View financial reports and analytics")).toBeInTheDocument();
  });

  it("renders the Generate Report button", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("Generate Report")).toBeInTheDocument();
  });

  it("renders all summary stats", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
    expect(screen.getByText("Net Income")).toBeInTheDocument();
    expect(screen.getByText("Pending Amount")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByPlaceholderText("Search by report name or ID...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.getByText("Date Range")).toBeInTheDocument();
  });

  it("renders report type badges", () => {
    render(<FinanceReportsPage />);
    // Report types appear as badges on report cards
    expect(screen.getAllByText("Revenue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expense").length).toBeGreaterThan(0);
    // "Invoices", "Payroll", "Payments" appear in multiple places
    expect(screen.getAllByText("Invoices").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payroll").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payments").length).toBeGreaterThan(0);
  });

  it("renders report cards", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("Monthly Revenue Report")).toBeInTheDocument();
    expect(screen.getByText("Expense Summary")).toBeInTheDocument();
    expect(screen.getByText("Outstanding Invoices")).toBeInTheDocument();
    expect(screen.getByText("Payroll Summary")).toBeInTheDocument();
    expect(screen.getByText("Payment Method Analysis")).toBeInTheDocument();
  });

  it("renders report IDs", () => {
    render(<FinanceReportsPage />);
    expect(screen.getByText("RPT-2025-001")).toBeInTheDocument();
    expect(screen.getByText("RPT-2025-002")).toBeInTheDocument();
    expect(screen.getByText("RPT-2025-003")).toBeInTheDocument();
  });

  it("renders report statuses", () => {
    render(<FinanceReportsPage />);
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
  });

  it("renders formatted currency amounts", () => {
    render(<FinanceReportsPage />);
    // Rp appears many times in the report, check it exists
    expect(screen.getAllByText(/Rp/).length).toBeGreaterThan(0);
  });

  it("renders percentage changes", () => {
    render(<FinanceReportsPage />);
    // Percentage appears multiple times in trend indicators
    expect(screen.getAllByText(/%/).length).toBeGreaterThan(0);
  });

  it("renders report details", () => {
    render(<FinanceReportsPage />);
    // These labels appear multiple times in report cards
    expect(screen.getAllByText("Period").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Generated By").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Generated At").length).toBeGreaterThan(0);
  });
});
