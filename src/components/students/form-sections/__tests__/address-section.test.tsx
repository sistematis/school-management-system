// src/components/students/form-sections/__tests__/address-section.test.tsx

import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { AddressSection } from "../address-section";

function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({
    defaultValues: {
      step2: {
        locationName: "",
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        city: "",
        postal: "",
        countryId: 0,
        ...defaultValues,
      },
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("AddressSection", () => {
  it("renders all fields correctly", () => {
    const countries = [
      { id: 1, label: "United States" },
      { id: 2, label: "Canada" },
    ];

    render(
      <TestWrapper>
        <AddressSection countries={countries} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText("Location Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Country *")).toBeInTheDocument();
    expect(screen.getByLabelText("Address Line 1 *")).toBeInTheDocument();
    expect(screen.getByLabelText("Address Line 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Address Line 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Address Line 4")).toBeInTheDocument();
    expect(screen.getByLabelText("City *")).toBeInTheDocument();
    expect(screen.getByLabelText("Postal Code")).toBeInTheDocument();
  });

  it("prefills data in edit mode", () => {
    const countries = [{ id: 1, label: "United States" }];
    const defaultValues = {
      locationName: "Home",
      address1: "123 Main St",
      address2: "Apt 4B",
      city: "New York",
      postal: "10001",
      countryId: 1,
    };

    render(
      <TestWrapper defaultValues={defaultValues}>
        <AddressSection countries={countries} />
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue("Home")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Apt 4B")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10001")).toBeInTheDocument();
  });
});
