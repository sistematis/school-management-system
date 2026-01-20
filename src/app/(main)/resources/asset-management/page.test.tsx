import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AssetManagementPage from "./page";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  AlertCircle: ({ className }: { className?: string }) => <svg className={className} data-testid="alert-circle" />,
  Calendar: ({ className }: { className?: string }) => <svg className={className} data-testid="calendar" />,
  DollarSign: ({ className }: { className?: string }) => <svg className={className} data-testid="dollar-sign" />,
  Download: ({ className }: { className?: string }) => <svg className={className} data-testid="download" />,
  Filter: ({ className }: { className?: string }) => <svg className={className} data-testid="filter" />,
  MapPin: ({ className }: { className?: string }) => <svg className={className} data-testid="map-pin" />,
  MoreVertical: ({ className }: { className?: string }) => <svg className={className} data-testid="more-vertical" />,
  Package: ({ className }: { className?: string }) => <svg className={className} data-testid="package" />,
  Plus: ({ className }: { className?: string }) => <svg className={className} data-testid="plus" />,
  Search: ({ className }: { className?: string }) => <svg className={className} data-testid="search" />,
  Settings: ({ className }: { className?: string }) => <svg className={className} data-testid="settings" />,
  User: ({ className }: { className?: string }) => <svg className={className} data-testid="user" />,
  Wrench: ({ className }: { className?: string }) => <svg className={className} data-testid="wrench" />,
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

describe("AssetManagementPage", () => {
  it("renders the page header with title and description", () => {
    render(<AssetManagementPage />);
    expect(screen.getByText("Asset Management")).toBeInTheDocument();
    expect(screen.getByText("Inventory of school property and equipment")).toBeInTheDocument();
  });

  it("renders the Add Asset button", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Add Asset").length).toBeGreaterThan(0);
  });

  it("renders all stat cards", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Total Assets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Electronics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Needs Repair").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Total Value").length).toBeGreaterThan(0);
  });

  it("renders search input with placeholder", () => {
    render(<AssetManagementPage />);
    expect(screen.getByPlaceholderText("Search by asset name, ID, or location...")).toBeInTheDocument();
  });

  it("renders filter buttons", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Filters").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Export").length).toBeGreaterThan(0);
  });

  it("renders asset names", () => {
    render(<AssetManagementPage />);
    expect(screen.getByText("Dell OptiPlex Desktop Computer")).toBeInTheDocument();
    expect(screen.getByText("HP LaserJet Pro Printer")).toBeInTheDocument();
    expect(screen.getByText("Student Desk & Chair Set")).toBeInTheDocument();
    expect(screen.getByText("Epson Projector EB-2250U")).toBeInTheDocument();
  });

  it("renders asset IDs", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText(/AST-2024-001/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AST-2024-015/).length).toBeGreaterThan(0);
  });

  it("renders asset locations", () => {
    render(<AssetManagementPage />);
    expect(screen.getByText("Computer Lab A")).toBeInTheDocument();
    expect(screen.getByText("Admin Office")).toBeInTheDocument();
    expect(screen.getByText("Classroom 10-A")).toBeInTheDocument();
  });

  it("renders asset conditions", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Excellent").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Good").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fair").length).toBeGreaterThan(0);
  });

  it("renders asset categories", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Electronics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Furniture").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Equipment").length).toBeGreaterThan(0);
  });

  it("renders warranty information", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText(/Warranty:/).length).toBeGreaterThan(0);
  });

  it("renders Quick Actions section", () => {
    render(<AssetManagementPage />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Common asset management operations")).toBeInTheDocument();
  });

  it("renders quick action buttons", () => {
    render(<AssetManagementPage />);
    expect(screen.getAllByText("Audit Assets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Schedule Maintenance").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Report Issue").length).toBeGreaterThan(0);
  });
});
