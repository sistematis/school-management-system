// src/lib/data-table/build-odata-filter.test.ts

import { describe, expect, it } from "vitest";

import { buildODataFilter } from "./build-odata-filter";

describe("buildODataFilter", () => {
  it("should build single boolean filter", () => {
    const metadata = {
      IsActive: {
        label: "Active",
        type: "boolean" as const,
        operators: ["eq"] as const,
      },
    };
    const filters = [{ field: "IsActive", operator: "eq" as const, value: "true" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("IsActive eq true");
  });

  it("should build string contains filter", () => {
    const metadata = {
      Name: {
        label: "Name",
        type: "string" as const,
        operators: ["contains"] as const,
      },
    };
    const filters = [{ field: "Name", operator: "contains" as const, value: "John" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("contains(Name,'John')");
  });

  it("should build multiple filters with AND", () => {
    const metadata = {
      IsActive: {
        label: "Active",
        type: "boolean" as const,
        operators: ["eq"] as const,
      },
      Name: {
        label: "Name",
        type: "string" as const,
        operators: ["contains"] as const,
      },
    };
    const filters = [
      { field: "IsActive", operator: "eq" as const, value: "true" },
      { field: "Name", operator: "contains" as const, value: "John" },
    ];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("IsActive eq true and contains(Name,'John')");
  });

  it("should build enum filter with quotes", () => {
    const metadata = {
      Ad_Language: {
        label: "Language",
        type: "enum" as const,
        operators: ["eq"] as const,
      },
    };
    const filters = [{ field: "Ad_Language", operator: "eq" as const, value: "en_US" }];
    const result = buildODataFilter(filters, metadata);
    expect(result).toBe("Ad_Language eq 'en_US'");
  });

  it("should return null for empty filters", () => {
    const result = buildODataFilter([], {});
    expect(result).toBeNull();
  });
});
