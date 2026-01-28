// src/lib/data-table/use-table-filters.test.ts

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FilterSchema } from "./filter.types";
import { useTableFilters } from "./use-table-filters";

// Mock Next.js hooks
let mockSearchParams: URLSearchParams;
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush }),
}));

describe("useTableFilters", () => {
  const mockSchema: FilterSchema = {
    metadata: {
      IsActive: {
        label: "Active",
        type: "boolean",
        operators: ["eq"],
      },
    },
    groups: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("should parse URL params to active filters", () => {
    mockSearchParams.set("f[IsActive]", "true");

    const { result } = renderHook(() => useTableFilters({ schema: mockSchema }));

    expect(result.current.activeFilters).toEqual([{ field: "IsActive", operator: "eq", value: "true" }]);
  });

  it("should parse search query from URL", () => {
    mockSearchParams.set("q", "John");

    const { result } = renderHook(() => useTableFilters({ schema: mockSchema }));

    expect(result.current.searchQuery).toBe("John");
  });

  it("should update URL when filters change", () => {
    const { result } = renderHook(() => useTableFilters({ schema: mockSchema }));

    result.current.setActiveFilters([{ field: "IsActive", operator: "eq", value: "true" }]);

    expect(mockPush).toHaveBeenCalledWith("?f%5BIsActive%5D=true", { scroll: false });
  });

  it("should clear all filters with resetAll", () => {
    const { result } = renderHook(() => useTableFilters({ schema: mockSchema }));

    result.current.resetAll();

    expect(mockPush).toHaveBeenCalledWith("?", { scroll: false });
  });

  it("should check if filter is active", () => {
    mockSearchParams.set("f[IsActive]", "true");

    const { result } = renderHook(() => useTableFilters({ schema: mockSchema }));

    expect(result.current.isFilterActive("IsActive", "true")).toBe(true);
    expect(result.current.isFilterActive("IsActive", "false")).toBe(false);
  });
});
