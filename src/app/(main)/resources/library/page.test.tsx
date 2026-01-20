import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LibraryPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertTriangle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-triangle" />,
  Book: ({ className }: { className?: string }) => <svg className={className} data-testid="book" />,
  BookOpen: ({ className }: { className?: string }) => <svg className={className} data-testid="book-open" />,
  Clock: ({ className }: { className?: string }) => <svg className={className} data-testid="clock" />,
  Database: ({ className }: { className?: string }) => <svg className={className} data-testid="database" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  Globe: ({ className }: { className?: string }) => <svg className={className} data-testid="globe" />,
  Headphones: ({ className }: { className?: string }) => <svg className={className} data-testid="headphones" />,
  Newspaper: ({ className }: { className?: string }) => <svg className={className} data-testid="newspaper" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  RefreshCw: ({ className }: { className?: string }) => <svg className={className} data-testid="refresh-cw" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Users: ({ className }: { className?: string }) => <svg className={className} data-testid="users" />,
  Video: ({ className }: { className?: string }) => <svg className={className} data-testid="video" />,
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

describe("LibraryPage", () => {
  it("renders the page header with title and description", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Library Management")).toBeInTheDocument();
    expect(screen.getByText("Manage books, digital resources, and borrowing records")).toBeInTheDocument();
  });

  it("renders the Add Book and New Borrow Record buttons", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Add Book").length).toBeGreaterThan(0);
    expect(screen.getAllByText("New Borrow Record").length).toBeGreaterThan(0);
  });

  it("renders all stat cards", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Total Books").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Borrowed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overdue").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<LibraryPage />);
    expect(screen.getByPlaceholderText("Search by title, author, or ISBN...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Filters").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Export").length).toBeGreaterThan(0);
  });

  it("renders book titles", () => {
    render(<LibraryPage />);
    expect(screen.getByText("To Kill a Mockingbird")).toBeInTheDocument();
    expect(screen.getAllByText("Introduction to Algorithms").length).toBeGreaterThan(0);
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("Physics for Scientists and Engineers")).toBeInTheDocument();
  });

  it("renders book authors", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Harper Lee")).toBeInTheDocument();
    expect(screen.getByText("Thomas H. Cormen")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
  });

  it("renders book categories", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Fiction").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Textbook").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reference").length).toBeGreaterThan(0);
  });

  it("renders book statuses", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Borrowed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overdue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reserved").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lost").length).toBeGreaterThan(0);
  });

  it("renders borrow and reserve buttons", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Borrow").length).toBeGreaterThan(0);
  });

  it("renders Active Borrow Records section", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Active Borrow Records")).toBeInTheDocument();
  });

  it("renders borrow record book titles", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Introduction to Algorithms").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1984").length).toBeGreaterThan(0);
    expect(screen.getAllByText("World History: Patterns of Civilization").length).toBeGreaterThan(0);
  });

  it("renders student names", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText(/Borrowed by: Emma Johnson/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Borrowed by: Liam Johnson/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Borrowed by: Noah Williams/).length).toBeGreaterThan(0);
  });

  it("renders renew and return buttons", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Renew").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Return").length).toBeGreaterThan(0);
  });

  it("renders Digital Resources section", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Digital Resources")).toBeInTheDocument();
  });

  it("renders digital resource titles", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Digital Library Platform")).toBeInTheDocument();
    expect(screen.getByText("Educational Video Collection")).toBeInTheDocument();
    expect(screen.getByText("Audiobook Collection")).toBeInTheDocument();
  });

  it("renders resource types", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("database").length).toBeGreaterThan(0);
    expect(screen.getAllByText("video").length).toBeGreaterThan(0);
    expect(screen.getAllByText("audiobook").length).toBeGreaterThan(0);
  });

  it("renders access types", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("subscription").length).toBeGreaterThan(0);
    expect(screen.getAllByText("free").length).toBeGreaterThan(0);
  });

  it("renders Quick Actions section", () => {
    render(<LibraryPage />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });

  it("renders quick action buttons", () => {
    render(<LibraryPage />);
    expect(screen.getAllByText("Process Returns").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Manage Reservations").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overdue Alerts").length).toBeGreaterThan(0);
  });
});
