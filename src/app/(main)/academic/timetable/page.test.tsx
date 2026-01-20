import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TimetablePage from "./page";

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

describe("TimetablePage", () => {
  it("renders the page header with title and description", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Class Timetable")).toBeInTheDocument();
    expect(screen.getByText("Manage class schedules and weekly timetables")).toBeInTheDocument();
  });

  it("renders the Add Schedule button", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Add Schedule")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Total Classes")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Hours/Week")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByText("Teachers")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Rooms")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders week navigation", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Week 24")).toBeInTheDocument();
    expect(screen.getByText("June 10 - June 14, 2025")).toBeInTheDocument();
  });

  it("renders navigation buttons (Today, This Week, This Month)", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
  });

  it("renders timetable table with all day columns", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
  });

  it("renders all time slots", () => {
    render(<TimetablePage />);
    expect(screen.getByText("08:00 - 09:30")).toBeInTheDocument();
    expect(screen.getByText("09:45 - 11:15")).toBeInTheDocument();
    expect(screen.getByText("11:30 - 13:00")).toBeInTheDocument();
    expect(screen.getByText("13:30 - 15:00")).toBeInTheDocument();
    expect(screen.getByText("15:15 - 16:45")).toBeInTheDocument();
  });

  it("renders scheduled classes with subject names", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
    expect(screen.getByText("English Literature")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Chemistry")).toBeInTheDocument();
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });

  it("renders teacher names", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Dr. Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Prof. Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("Ms. Emily Davis")).toBeInTheDocument();
    expect(screen.getByText("Mr. David Wilson")).toBeInTheDocument();
    expect(screen.getByText("Dr. Lisa Anderson")).toBeInTheDocument();
    expect(screen.getByText("Prof. Robert Brown")).toBeInTheDocument();
  });

  it("renders room information", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Room 201")).toBeInTheDocument();
    expect(screen.getByText("Lab 102")).toBeInTheDocument();
    expect(screen.getByText("Room 305")).toBeInTheDocument();
    expect(screen.getByText("Computer Lab 1")).toBeInTheDocument();
    expect(screen.getByText("Lab 103")).toBeInTheDocument();
    expect(screen.getByText("Lab 101")).toBeInTheDocument();
  });

  it("renders grade badges", () => {
    render(<TimetablePage />);
    // "Grade 10A" appears multiple times in the timetable
    const grade10ABadges = screen.getAllByText("Grade 10A");
    expect(grade10ABadges.length).toBeGreaterThan(0);
  });

  it("renders Free Period slots", () => {
    render(<TimetablePage />);
    const freePeriods = screen.getAllByText("Free Period");
    expect(freePeriods.length).toBeGreaterThan(0);
  });

  it("renders class types legend", () => {
    render(<TimetablePage />);
    expect(screen.getByText("Class Types")).toBeInTheDocument();
    expect(screen.getByText("Core Subjects")).toBeInTheDocument();
    expect(screen.getByText("Lab Sessions")).toBeInTheDocument();
    expect(screen.getByText("Electives")).toBeInTheDocument();
  });
});
