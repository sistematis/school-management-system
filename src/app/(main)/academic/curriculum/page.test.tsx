import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CurriculumPage from "./page";

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

describe("CurriculumPage", () => {
  it("renders the page header with title and description", () => {
    render(<CurriculumPage />);
    expect(screen.getByText("Curriculum Management")).toBeInTheDocument();
    expect(screen.getByText("Define courses, syllabus, and credit hours")).toBeInTheDocument();
  });

  it("renders the Add Subject button", () => {
    render(<CurriculumPage />);
    expect(screen.getByText("Add Subject")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<CurriculumPage />);
    expect(screen.getByText("Total Subjects")).toBeInTheDocument();
    // "6" appears multiple times, check it exists
    const sixes = screen.getAllByText("6");
    expect(sixes.length).toBeGreaterThan(0);
    expect(screen.getByText("Total Credits")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument(); // Total credits
    expect(screen.getByText("Core Subjects")).toBeInTheDocument();
    // "4" appears multiple times, check it exists
    const fours = screen.getAllByText("4");
    expect(fours.length).toBeGreaterThan(0);
    expect(screen.getByText("Electives")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Electives
  });

  it("renders search input with placeholder", () => {
    render(<CurriculumPage />);
    expect(screen.getByPlaceholderText("Search subjects by name or code...")).toBeInTheDocument();
  });

  it("renders all subject cards", () => {
    render(<CurriculumPage />);

    // Check for subject names
    expect(screen.getByText("Advanced Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
    expect(screen.getByText("English Literature")).toBeInTheDocument();
    expect(screen.getByText("Chemistry")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });

  it("renders subject codes", () => {
    render(<CurriculumPage />);
    expect(screen.getByText("MATH-401")).toBeInTheDocument();
    expect(screen.getByText("PHY-401")).toBeInTheDocument();
    expect(screen.getByText("ENG-401")).toBeInTheDocument();
    expect(screen.getByText("CHEM-401")).toBeInTheDocument();
    expect(screen.getByText("CS-401")).toBeInTheDocument();
    expect(screen.getByText("BIO-401")).toBeInTheDocument();
  });

  it("renders subject type badges", () => {
    render(<CurriculumPage />);
    const coreBadges = screen.getAllByText("Core");
    const languageBadges = screen.getAllByText("Language");
    const electiveBadges = screen.getAllByText("Elective");

    expect(coreBadges.length).toBeGreaterThan(0);
    expect(languageBadges.length).toBeGreaterThan(0);
    expect(electiveBadges.length).toBeGreaterThan(0);
  });

  it("renders subject descriptions", () => {
    render(<CurriculumPage />);
    expect(screen.getByText(/Comprehensive mathematics covering algebra, geomet/)).toBeInTheDocument();
    expect(screen.getByText(/Introduction to classical mechanics, thermodynamic/)).toBeInTheDocument();
  });

  it("renders subject details including credits and hours", () => {
    render(<CurriculumPage />);

    // Check for "Credits" and "Hours/Week" labels
    const creditsLabels = screen.getAllByText("Credits");
    const hoursLabels = screen.getAllByText("Hours/Week");

    expect(creditsLabels.length).toBeGreaterThan(0);
    expect(hoursLabels.length).toBeGreaterThan(0);
  });

  it("renders Edit and Delete buttons for each subject", () => {
    render(<CurriculumPage />);
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");

    expect(editButtons.length).toBe(6); // 6 subjects
    expect(deleteButtons.length).toBe(6); // 6 subjects
  });

  it("displays grade information for subjects", () => {
    render(<CurriculumPage />);
    // "Grade 10" appears in the dropdown and subject cards
    const grade10Elements = screen.getAllByText("Grade 10");
    expect(grade10Elements.length).toBeGreaterThan(0);
  });
});
