import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PerformancePage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-circle" />,
  Award: ({ className }: { className?: string }) => <svg className={className} data-testid="award" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  FileText: ({ className }: { className?: string }) => <svg className={className} data-testid="file-text" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Star: ({ className }: { className?: string }) => <svg className={className} data-testid="star" />,
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

describe("PerformancePage", () => {
  it("renders the page header with title and description", () => {
    render(<PerformancePage />);
    expect(screen.getByText("Performance Management")).toBeInTheDocument();
    expect(screen.getByText("Track and evaluate staff performance.")).toBeInTheDocument();
  });

  it("renders the New Review button", () => {
    render(<PerformancePage />);
    expect(screen.getByText("New Review")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<PerformancePage />);
    expect(screen.getByText("Reviews This Quarter")).toBeInTheDocument();
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
    expect(screen.getByText("Top Performers")).toBeInTheDocument();
    expect(screen.getByText("Improvement Needed")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<PerformancePage />);
    expect(screen.getByPlaceholderText("Search by staff name or review ID...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<PerformancePage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders performance review table with headers", () => {
    render(<PerformancePage />);
    expect(screen.getByText("Review ID")).toBeInTheDocument();
    expect(screen.getByText("Staff Member")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Review Period")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Reviewer")).toBeInTheDocument();
    expect(screen.getByText("Review Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders review IDs", () => {
    render(<PerformancePage />);
    expect(screen.getByText("PR-2024-Q1-001")).toBeInTheDocument();
    expect(screen.getByText("PR-2024-Q1-002")).toBeInTheDocument();
    expect(screen.getByText("PR-2024-Q1-003")).toBeInTheDocument();
  });

  it("renders staff names", () => {
    render(<PerformancePage />);
    expect(screen.getByText("Dr. Sarah Mitchell")).toBeInTheDocument();
    expect(screen.getByText("Prof. James Wilson")).toBeInTheDocument();
    expect(screen.getByText("Ms. Emily Chen")).toBeInTheDocument();
  });

  it("renders review statuses", () => {
    render(<PerformancePage />);
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("In Progress").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
  });

  it("renders rating values", () => {
    render(<PerformancePage />);
    expect(screen.getAllByText("4.5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("4.8").length).toBeGreaterThan(0);
    expect(screen.getAllByText("4.2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3.8").length).toBeGreaterThan(0);
    expect(screen.getAllByText("4.0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3.5").length).toBeGreaterThan(0);
  });

  it("renders action buttons for each review", () => {
    render(<PerformancePage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(5);
  });
});
