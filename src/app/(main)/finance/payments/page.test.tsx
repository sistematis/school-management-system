import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PaymentsPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  CreditCard: ({ className }: { className?: string }) => <svg className={className} data-testid="credit-card" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  IndianRupee: ({ className }: { className?: string }) => <svg className={className} data-testid="indian-rupee-sign" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Wallet: ({ className }: { className?: string }) => <svg className={className} data-testid="wallet" />,
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

describe("PaymentsPage", () => {
  it("renders the page header with title and description", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("Payment Tracking")).toBeInTheDocument();
    expect(screen.getByText("Monitor all payment transactions and methods")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("Total Transactions")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
  });

  it("renders payment method stats", () => {
    render(<PaymentsPage />);
    // Payment methods appear in both stats and select dropdown
    expect(screen.getAllByText("Virtual Account").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Credit Card").length).toBeGreaterThan(0);
    expect(screen.getAllByText("E-Wallet").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cash").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<PaymentsPage />);
    expect(screen.getByPlaceholderText("Search by transaction, student, or invoice...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders payment table with headers", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("Transaction")).toBeInTheDocument();
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Method")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders transaction IDs", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("TXN-2025-001234")).toBeInTheDocument();
    expect(screen.getByText("TXN-2025-001235")).toBeInTheDocument();
  });

  it("renders student names", () => {
    render(<PaymentsPage />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
  });

  it("renders payment statuses", () => {
    render(<PaymentsPage />);
    // Statuses appear in both stats and table
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Failed").length).toBeGreaterThan(0);
  });

  it("renders formatted currency amounts", () => {
    render(<PaymentsPage />);
    expect(screen.getAllByText(/Rp/).length).toBeGreaterThan(0);
  });
});
