import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import StudentsPage from "./page";

// Mock the next/image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock the UI components
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ className, children }: { className: string; children: React.ReactNode }) => (
    <div className={className} data-testid="avatar">
      {children}
    </div>
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

describe("StudentsPage", () => {
  it("renders the page header with title and description", () => {
    render(<StudentsPage />);
    expect(screen.getByText("Student Information System")).toBeInTheDocument();
    expect(screen.getByText("Manage student profiles and enrollment")).toBeInTheDocument();
  });

  it("renders the Add Student button", () => {
    render(<StudentsPage />);
    expect(screen.getByText("Add Student")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<StudentsPage />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    // "5" appears multiple times, use getAllByText
    const fives = screen.getAllByText("5");
    expect(fives.length).toBeGreaterThanOrEqual(1);
    // "Active" appears in stat card
    const activeElements = screen.getAllByText("Active");
    expect(activeElements.length).toBeGreaterThanOrEqual(1);
    // "Grade 9" appears in stat card and dropdown
    const grade9Elements = screen.getAllByText("Grade 9");
    expect(grade9Elements.length).toBeGreaterThanOrEqual(1);
    // "Grade 10" appears in stat card and dropdown
    const grade10Elements = screen.getAllByText("Grade 10");
    expect(grade10Elements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Grade 11-12")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<StudentsPage />);
    expect(screen.getByPlaceholderText("Search by name, roll number, or email...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<StudentsPage />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders all student cards", () => {
    render(<StudentsPage />);

    // Check for student names
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("Emily Davis")).toBeInTheDocument();
    expect(screen.getByText("David Wilson")).toBeInTheDocument();

    // Check for student IDs
    expect(screen.getByText("10A-001")).toBeInTheDocument();
    expect(screen.getByText("09A-015")).toBeInTheDocument();
    expect(screen.getByText("11B-023")).toBeInTheDocument();
    expect(screen.getByText("10A-004")).toBeInTheDocument();
    expect(screen.getByText("12A-005")).toBeInTheDocument();
  });

  it("renders student card with avatar initials", () => {
    render(<StudentsPage />);
    const avatars = screen.getAllByTestId("avatar");
    expect(avatars.length).toBe(5);
    expect(screen.getByText("JS")).toBeInTheDocument(); // John Smith initials
    expect(screen.getByText("SJ")).toBeInTheDocument(); // Sarah Johnson initials
  });

  it("renders student details including email and phone", () => {
    render(<StudentsPage />);
    expect(screen.getByText("john.smith@student.edu")).toBeInTheDocument();
    expect(screen.getByText("+62 812 3456 7890")).toBeInTheDocument();
  });

  it("renders Edit and Delete buttons for each student", () => {
    render(<StudentsPage />);
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");

    expect(editButtons.length).toBe(5);
    expect(deleteButtons.length).toBe(5);
  });

  it("displays grade information for students", () => {
    render(<StudentsPage />);
    // These grade values appear in stat cards and student details
    const grade10SectionA = screen.getAllByText("Grade 10 - Section A");
    expect(grade10SectionA.length).toBeGreaterThan(0);
    expect(screen.getByText("Grade 9 - Section A")).toBeInTheDocument();
    expect(screen.getByText("Grade 11 - Section B")).toBeInTheDocument();
    expect(screen.getByText("Grade 12 - Section A")).toBeInTheDocument();
  });

  it("displays parent information", () => {
    render(<StudentsPage />);
    expect(screen.getByText("Robert Smith")).toBeInTheDocument();
    expect(screen.getByText("Michael Johnson")).toBeInTheDocument();
    expect(screen.getByText("David Chen")).toBeInTheDocument();
  });

  it("displays date of birth", () => {
    render(<StudentsPage />);
    expect(screen.getByText("DOB: 2010-05-15")).toBeInTheDocument();
    expect(screen.getByText("DOB: 2011-08-22")).toBeInTheDocument();
  });
});
