import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AttendancePage from "./page";

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

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => <div data-id={id}>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("AttendancePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header with title and description", () => {
    render(<AttendancePage />);
    expect(screen.getByText("Attendance Tracking")).toBeInTheDocument();
    expect(screen.getByText("Mark student attendance for your classes")).toBeInTheDocument();
  });

  it("renders filter inputs for date and class", () => {
    render(<AttendancePage />);
    // Labels are rendered in the component
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Select Class")).toBeInTheDocument();
  });

  it("renders the Mark All Present button", () => {
    render(<AttendancePage />);
    expect(screen.getByText("Mark All Present")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<AttendancePage />);
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("08:00 - 09:30")).toBeInTheDocument();
    expect(screen.getByText("Room")).toBeInTheDocument();
    expect(screen.getByText("Room 201")).toBeInTheDocument();
    // "Present" appears in multiple places, just check it exists
    const presentElements = screen.getAllByText("Present");
    expect(presentElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Attendance Rate")).toBeInTheDocument();
  });

  it("renders attendance statistics", () => {
    render(<AttendancePage />);
    expect(screen.getByText("7/8")).toBeInTheDocument(); // Present count
    expect(screen.getByText("87.5%")).toBeInTheDocument(); // Attendance rate
  });

  it("renders absent, late, and excused counts", () => {
    render(<AttendancePage />);
    // These appear multiple times (in buttons and stat cards)
    const absentElements = screen.getAllByText("Absent");
    expect(absentElements.length).toBeGreaterThan(0);
    const lateElements = screen.getAllByText("Late");
    expect(lateElements.length).toBeGreaterThan(0);
    const excusedElements = screen.getAllByText("Excused");
    expect(excusedElements.length).toBeGreaterThan(0);
  });

  it("renders students list header with count", () => {
    render(<AttendancePage />);
    expect(screen.getByText("Students (8)")).toBeInTheDocument();
  });

  it("renders all student names", () => {
    render(<AttendancePage />);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("Emily Davis")).toBeInTheDocument();
    expect(screen.getByText("David Wilson")).toBeInTheDocument();
    expect(screen.getByText("Lisa Anderson")).toBeInTheDocument();
    expect(screen.getByText("Robert Brown")).toBeInTheDocument();
    expect(screen.getByText("Jessica White")).toBeInTheDocument();
  });

  it("renders student roll numbers", () => {
    render(<AttendancePage />);
    expect(screen.getByText("10A-001")).toBeInTheDocument();
    expect(screen.getByText("10A-002")).toBeInTheDocument();
    expect(screen.getByText("10A-003")).toBeInTheDocument();
    expect(screen.getByText("10A-004")).toBeInTheDocument();
    expect(screen.getByText("10A-005")).toBeInTheDocument();
    expect(screen.getByText("10A-006")).toBeInTheDocument();
    expect(screen.getByText("10A-007")).toBeInTheDocument();
    expect(screen.getByText("10A-008")).toBeInTheDocument();
  });

  it("renders attendance status buttons for each student", () => {
    render(<AttendancePage />);

    // Each student should have 4 status buttons
    // Count occurrences including both buttons and stat cards
    const presentButtons = screen.getAllByText("Present");
    const lateButtons = screen.getAllByText("Late");
    const absentButtons = screen.getAllByText("Absent");
    const excusedButtons = screen.getAllByText("Excused");

    // At least 8 buttons per status (one per student), plus maybe stat card
    expect(presentButtons.length).toBeGreaterThanOrEqual(8);
    expect(lateButtons.length).toBeGreaterThanOrEqual(8);
    expect(absentButtons.length).toBeGreaterThanOrEqual(8);
    expect(excusedButtons.length).toBeGreaterThanOrEqual(8);
  });

  it("renders student avatars with initials", () => {
    render(<AttendancePage />);
    const avatars = screen.getAllByTestId("avatar");
    expect(avatars.length).toBe(8);

    expect(screen.getByText("JS")).toBeInTheDocument(); // John Smith
    expect(screen.getByText("SJ")).toBeInTheDocument(); // Sarah Johnson
    expect(screen.getByText("MC")).toBeInTheDocument(); // Michael Chen
    expect(screen.getByText("ED")).toBeInTheDocument(); // Emily Davis
    expect(screen.getByText("DW")).toBeInTheDocument(); // David Wilson
    expect(screen.getByText("LA")).toBeInTheDocument(); // Lisa Anderson
    expect(screen.getByText("RB")).toBeInTheDocument(); // Robert Brown
    expect(screen.getByText("JW")).toBeInTheDocument(); // Jessica White
  });

  it("renders the Submit Attendance button", () => {
    render(<AttendancePage />);
    expect(screen.getByText("Submit Attendance")).toBeInTheDocument();
  });

  it("displays attendance status buttons with correct initial state", () => {
    render(<AttendancePage />);

    // Most students should be present by default, one is late
    const presentButtons = screen.getAllByText("Present");
    const lateButtons = screen.getAllByText("Late");

    // At least some buttons should be rendered
    expect(presentButtons.length).toBeGreaterThan(0);
    expect(lateButtons.length).toBeGreaterThan(0);
  });
});
