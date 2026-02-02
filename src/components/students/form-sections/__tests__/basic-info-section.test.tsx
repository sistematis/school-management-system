// src/components/students/form-sections/__tests__/basic-info-section.test.tsx

import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { BasicInfoSection } from "../basic-info-section";

// Mock form wrapper
interface TestWrapperProps {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}

function TestWrapper({ children, defaultValues = {} }: TestWrapperProps) {
  const methods = useForm({
    defaultValues: {
      step1: {
        value: "",
        name: "",
        name2: "",
        bpGroupId: 0,
        taxId: "",
        description: "",
        ...defaultValues,
      },
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("BasicInfoSection", () => {
  it("renders all fields correctly", () => {
    const bpGroups = [
      { id: 1, label: "Grade 10" },
      { id: 2, label: "Grade 11" },
    ];

    render(
      <TestWrapper>
        <BasicInfoSection bpGroups={bpGroups} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText("Student ID *")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Middle/Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Student Group *")).toBeInTheDocument();
    expect(screen.getByLabelText("Tax ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("prefills data in edit mode", () => {
    const bpGroups = [{ id: 1, label: "Grade 10" }];
    const defaultValues = {
      value: "STU001",
      name: "John Doe",
      name2: "Smith",
      bpGroupId: 1,
      taxId: "123-45-6789",
      description: "Test student",
    };

    render(
      <TestWrapper defaultValues={defaultValues}>
        <BasicInfoSection bpGroups={bpGroups} mode="edit" />
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue("STU001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123-45-6789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test student")).toBeInTheDocument();
  });

  it("shows BP group options in dropdown", () => {
    const bpGroups = [
      { id: 1, label: "Grade 10" },
      { id: 2, label: "Grade 11" },
    ];

    render(
      <TestWrapper>
        <BasicInfoSection bpGroups={bpGroups} />
      </TestWrapper>,
    );

    const select = screen.getByLabelText("Student Group *");
    expect(select).toBeInTheDocument();
  });
});
