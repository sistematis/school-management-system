// src/lib/schemas/__tests__/student-update.schema.test.ts

import { describe, expect, it } from "vitest";

import { step1UpdateSchema, studentUpdateSchema } from "../student-update.schema";

describe("studentUpdateSchema", () => {
  it("passes valid update data", () => {
    const validData = {
      step1: {
        value: "STU001",
        name: "John Doe",
        name2: "Smith",
        bpGroupId: 1,
        description: "Test",
        taxId: "123-45-6789",
      },
      step2: {
        locationName: "Home",
        address1: "123 Main St",
        city: "New York",
        postal: "10001",
        countryId: 1,
      },
      step3: {
        email: "john@example.com",
        phone: "555-1234",
        birthday: "2010-01-15",
        username: "john.doe",
      },
      step4: {
        roleId: 1,
      },
    };

    const result = studentUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const invalidData = {
      step1: { value: "STU001", name: "John", bpGroupId: 1 },
      step2: {},
      step3: { email: "not-an-email" },
      step4: {},
    };

    const result = studentUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails with invalid birthday format", () => {
    const invalidData = {
      step1: { value: "STU001", name: "John", bpGroupId: 1 },
      step2: {},
      step3: { birthday: "01/15/2010" }, // Wrong format
      step4: {},
    };

    const result = studentUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("allows empty optional fields", () => {
    const minimalData = {
      step1: { value: "STU001", name: "John", bpGroupId: 1 },
      step2: {},
      step3: {},
      step4: {},
    };

    const result = studentUpdateSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});
