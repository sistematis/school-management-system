import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import InvoicesPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  Check: ({ className }: { className?: string }) => <svg className={className} data-testid="check" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Eye: ({ className }: { className?: string }) => <svg className={className} data-testid="eye" />,
  FileText: ({ className }: { className?: string }) => <svg className={className} data-testid="file-text" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
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

describe("InvoicesPage", () => {
  it("renders the page header with title and description", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("Invoice Management")).toBeInTheDocument();
    expect(screen.getByText("Create and manage school invoices")).toBeInTheDocument();
  });

  it("renders the Create Invoice button", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("Create Invoice")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("Total Invoices")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
    // "Paid", "Pending", "Overdue" appear multiple times (in stats and table)
    expect(screen.getAllByText("Paid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overdue").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<InvoicesPage />);
    expect(screen.getByPlaceholderText("Search by invoice, student name, or ID...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders invoice table with headers", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Due Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders all invoice IDs", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("INV-2025-001")).toBeInTheDocument();
    expect(screen.getByText("INV-2025-002")).toBeInTheDocument();
    expect(screen.getByText("INV-2025-003")).toBeInTheDocument();
  });

  it("renders student names", () => {
    render(<InvoicesPage />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
  });

  it("renders invoice statuses", () => {
    render(<InvoicesPage />);
    expect(screen.getAllByText("Paid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overdue").length).toBeGreaterThan(0);
  });

  it("renders formatted currency amounts", () => {
    render(<InvoicesPage />);
    // Rp appears many times, check it exists
    expect(screen.getAllByText(/Rp/).length).toBeGreaterThan(0);
  });

  it("renders action buttons for each invoice", () => {
    render(<InvoicesPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(10);
  });
});
