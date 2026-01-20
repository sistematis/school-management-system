import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StudentPortalPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Award: ({ className }: { className?: string }) => <svg className={className} data-testid="award" />,
  BookOpen: ({ className }: { className?: string }) => <svg className={className} data-testid="book-open" />,
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  CheckCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="check-circle" />,
  Clock: ({ className }: { className?: string }) => <svg className={className} data-testid="clock" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  GraduationCap: ({ className }: { className?: string }) => <svg className={className} data-testid="graduation-cap" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  TrendingUp: ({ className }: { className?: string }) => <svg className={className} data-testid="trending-up" />,
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

describe("StudentPortalPage", () => {
  it("renders the page header with title and description", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("Student Portal")).toBeInTheDocument();
    expect(screen.getByText("Welcome back! Here's your academic overview.")).toBeInTheDocument();
  });

  it("renders the New Assignment button", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("New Assignment")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("GPA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3.7").length).toBeGreaterThan(0);
    expect(screen.getAllByText("95%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("12").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<StudentPortalPage />);
    expect(screen.getByPlaceholderText("Search classes, assignments, or achievements...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Filters").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Export").length).toBeGreaterThan(0);
  });

  it("renders Today's Schedule section", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();
  });

  it("renders class subjects", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Mathematics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Science").length).toBeGreaterThan(0);
    expect(screen.getAllByText("History").length).toBeGreaterThan(0);
    expect(screen.getByText("Physical Education")).toBeInTheDocument();
  });

  it("renders Assignments section", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Assignments").length).toBeGreaterThan(0);
  });

  it("renders assignment titles", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("Algebra Problem Set")).toBeInTheDocument();
    expect(screen.getByText("Essay: Shakespeare's Sonnets")).toBeInTheDocument();
    expect(screen.getByText("Science Lab Report")).toBeInTheDocument();
    expect(screen.getByText("History Research Project")).toBeInTheDocument();
  });

  it("renders assignment statuses", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Graded").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Not Submitted").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Late").length).toBeGreaterThan(0);
  });

  it("renders Academic Performance section", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("Academic Performance")).toBeInTheDocument();
  });

  it("renders subject grades", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Mathematics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Science").length).toBeGreaterThan(0);
    expect(screen.getAllByText("History").length).toBeGreaterThan(0);
  });

  it("renders letter grades", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("A-").length).toBeGreaterThan(0);
    expect(screen.getAllByText("B+").length).toBeGreaterThan(0);
    expect(screen.getAllByText("B").length).toBeGreaterThan(0);
  });

  it("renders Achievements section", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Achievements").length).toBeGreaterThan(0);
  });

  it("renders achievement titles", () => {
    render(<StudentPortalPage />);
    expect(screen.getByText("Math Wizard")).toBeInTheDocument();
    expect(screen.getByText("Perfect Attendance")).toBeInTheDocument();
    expect(screen.getByText("Sports Champion")).toBeInTheDocument();
    expect(screen.getByText("Art Excellence")).toBeInTheDocument();
    expect(screen.getByText("Class President")).toBeInTheDocument();
  });

  it("renders achievement categories", () => {
    render(<StudentPortalPage />);
    expect(screen.getAllByText("Academic").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Behavior").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sports").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Arts").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Leadership").length).toBeGreaterThan(0);
  });

  it("renders action buttons", () => {
    render(<StudentPortalPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(10);
  });
});
