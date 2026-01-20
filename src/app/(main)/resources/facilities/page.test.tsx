import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FacilitiesPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertTriangle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-triangle" />,
  BookOpen: ({ className }: { className?: string }) => <svg className={className} data-testid="book-open" />,
  Building: ({ className }: { className?: string }) => <svg className={className} data-testid="building" />,
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  CheckCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="check-circle" />,
  DoorOpen: ({ className }: { className?: string }) => <svg className={className} data-testid="door-open" />,
  Dumbbell: ({ className }: { className?: string }) => <svg className={className} data-testid="dumbbell" />,
  Film: ({ className }: { className?: string }) => <svg className={className} data-testid="film" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  MapPin: ({ className }: { className?: string }) => <svg className={className} data-testid="map-pin" />,
  MonitorSpeaker: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="monitor-speaker" />
  ),
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Settings: ({ className }: { className?: string }) => <svg className={className} data-testid="settings" />,
  Users: ({ className }: { className?: string }) => <svg className={className} data-testid="users" />,
  Utensils: ({ className }: { className?: string }) => <svg className={className} data-testid="utensils" />,
  Wrench: ({ className }: { className?: string }) => <svg className={className} data-testid="wrench" />,
  XCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="x-circle" />,
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

describe("FacilitiesPage", () => {
  it("renders the page header with title and description", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Facilities Management")).toBeInTheDocument();
    expect(screen.getByText("Room booking, equipment tracking, and maintenance scheduling")).toBeInTheDocument();
  });

  it("renders the New Booking button", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("New Booking").length).toBeGreaterThan(0);
  });

  it("renders all stat cards", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("Total Rooms").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("In Use").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maintenance").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<FacilitiesPage />);
    expect(screen.getByPlaceholderText("Search by room name, ID, or location...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("Filters").length).toBeGreaterThan(0);
  });

  it("renders room names", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Classroom 10-A")).toBeInTheDocument();
    expect(screen.getAllByText("Computer Lab A").length).toBeGreaterThan(0);
    expect(screen.getByText("Science Laboratory")).toBeInTheDocument();
    expect(screen.getAllByText("School Library").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Main Auditorium").length).toBeGreaterThan(0);
  });

  it("renders room IDs", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText(/RM-001/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/RM-002/).length).toBeGreaterThan(0);
  });

  it("renders room statuses", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Occupied").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maintenance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Booked").length).toBeGreaterThan(0);
  });

  it("renders room capacities", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText(/Capacity:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/30 people/).length).toBeGreaterThan(0);
  });

  it("renders room locations", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Building 1, Floor 2")).toBeInTheDocument();
    expect(screen.getByText("Building 2, Floor 1")).toBeInTheDocument();
  });

  it("renders Recent Bookings section", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Recent Bookings")).toBeInTheDocument();
  });

  it("renders booking purposes", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Computer Science Class")).toBeInTheDocument();
    expect(screen.getByText("School Assembly")).toBeInTheDocument();
    expect(screen.getByText("Reading Session")).toBeInTheDocument();
  });

  it("renders booking statuses", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
  });

  it("renders booking requesters", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Ms. Sarah Williams")).toBeInTheDocument();
    expect(screen.getByText("Principal Office")).toBeInTheDocument();
    expect(screen.getByText("Mrs. Emily Chen")).toBeInTheDocument();
  });

  it("renders approve and reject buttons for pending bookings", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("Approve").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reject").length).toBeGreaterThan(0);
  });

  it("renders Quick Actions section", () => {
    render(<FacilitiesPage />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });

  it("renders quick action buttons", () => {
    render(<FacilitiesPage />);
    expect(screen.getAllByText("View Schedule").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maintenance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Report Issue").length).toBeGreaterThan(0);
  });
});
