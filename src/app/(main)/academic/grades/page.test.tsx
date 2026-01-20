import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GradesPage from "./page";

// Mock the UI components
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
  SelectTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => <div data-id={id}>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("GradesPage", () => {
  it("renders the page header with title and description", () => {
    render(<GradesPage />);
    expect(screen.getByText("Gradebook Management")).toBeInTheDocument();
    expect(screen.getByText("Enter and manage student grades and assessments")).toBeInTheDocument();
  });

  it("renders the Edit Mode button", () => {
    render(<GradesPage />);
    expect(screen.getByText("Edit Mode")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<GradesPage />);
    expect(screen.getByText("Students")).toBeInTheDocument();
    // "6" appears multiple times
    const sixes = screen.getAllByText("6");
    expect(sixes.length).toBeGreaterThan(0);
    expect(screen.getByText("Class Average")).toBeInTheDocument();
    expect(screen.getByText("72.0")).toBeInTheDocument();
    expect(screen.getByText("Grade A")).toBeInTheDocument();
    // "3" appears multiple times
    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThan(0);
    expect(screen.getByText("Grade B")).toBeInTheDocument();
    // "2" appears multiple times
    const twos = screen.getAllByText("2");
    expect(twos.length).toBeGreaterThan(0);
    expect(screen.getByText("Grade C")).toBeInTheDocument();
    // "0" appears multiple times
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThan(0);
  });

  it("renders filter inputs for class and semester", () => {
    render(<GradesPage />);
    // Labels are rendered in the component
    expect(screen.getByText("Select Class")).toBeInTheDocument();
    expect(screen.getByText("Semester")).toBeInTheDocument();
  });

  it("renders grading weights section", () => {
    render(<GradesPage />);
    expect(screen.getByText("Grading Weights")).toBeInTheDocument();
    expect(screen.getByText(/Assignments:/)).toBeInTheDocument();
    // "30%" appears multiple times in the page
    const thirtyPercents = screen.getAllByText(/30%/);
    expect(thirtyPercents.length).toBeGreaterThan(0);
    expect(screen.getByText(/Midterm Exam:/)).toBeInTheDocument();
    expect(screen.getByText(/Final Exam:/)).toBeInTheDocument();
    expect(screen.getByText(/Participation:/)).toBeInTheDocument();
    // "10%" appears
    const tenPercents = screen.getAllByText(/10%/);
    expect(tenPercents.length).toBeGreaterThan(0);
  });

  it("renders grades table with headers", () => {
    render(<GradesPage />);
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Assignments")).toBeInTheDocument();
    expect(screen.getByText("Midterm")).toBeInTheDocument();
    expect(screen.getByText("Final")).toBeInTheDocument();
    expect(screen.getByText("Participation")).toBeInTheDocument();
    expect(screen.getByText("Total Score")).toBeInTheDocument();
    expect(screen.getByText("Grade")).toBeInTheDocument();
  });

  it("renders all student names in the table", () => {
    render(<GradesPage />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("Emily Davis")).toBeInTheDocument();
    expect(screen.getByText("David Wilson")).toBeInTheDocument();
    expect(screen.getByText("Lisa Anderson")).toBeInTheDocument();
  });

  it("renders student IDs in the table", () => {
    render(<GradesPage />);
    expect(screen.getByText("10A-001")).toBeInTheDocument();
    expect(screen.getByText("10A-002")).toBeInTheDocument();
    expect(screen.getByText("10A-003")).toBeInTheDocument();
    expect(screen.getByText("10A-004")).toBeInTheDocument();
    expect(screen.getByText("10A-005")).toBeInTheDocument();
    expect(screen.getByText("10A-006")).toBeInTheDocument();
  });

  it("renders letter grades with proper styling", () => {
    render(<GradesPage />);
    // "A" appears multiple times in grades
    const aGrades = screen.getAllByText("A");
    expect(aGrades.length).toBeGreaterThan(0);
    // "B+" appears
    const bPlusGrades = screen.getAllByText("B+");
    expect(bPlusGrades.length).toBeGreaterThan(0);
  });

  it("renders total scores for students", () => {
    render(<GradesPage />);
    // These scores might appear multiple times
    const eightyNines = screen.getAllByText("89");
    expect(eightyNines.length).toBeGreaterThan(0);
    const ninetyFours = screen.getAllByText("94");
    expect(ninetyFours.length).toBeGreaterThan(0);
    const eightyOnes = screen.getAllByText("81");
    expect(eightyOnes.length).toBeGreaterThan(0);
  });

  it("displays dash for students with no grades", () => {
    render(<GradesPage />);
    // Lisa Anderson has null grades
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders percentage weights in table headers", () => {
    render(<GradesPage />);
    // "(30%)" appears multiple times (for assignments, midterm, final)
    const thirtyPercents = screen.getAllByText("(30%)");
    expect(thirtyPercents.length).toBeGreaterThan(0);
    expect(screen.getByText("(10%)")).toBeInTheDocument();
  });
});
