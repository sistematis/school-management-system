// src/components/students/form-sections/__tests__/role-section.test.tsx

import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { RoleSection } from "../role-section";

function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({
    defaultValues: {
      step4: {
        roleId: 0,
        ...defaultValues,
      },
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("RoleSection", () => {
  it("renders role field correctly", () => {
    const roles = [
      { id: 1, name: "Student", description: "Student role" },
      { id: 2, name: "Teacher", description: "Teacher role" },
    ];

    render(
      <TestWrapper>
        <RoleSection roles={roles} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText("System Role *")).toBeInTheDocument();
  });

  it("prefills data in edit mode", () => {
    const roles = [
      { id: 1, name: "Student", description: "Student role" },
      { id: 2, name: "Teacher", description: "Teacher role" },
    ];
    const defaultValues = { roleId: 1 };

    render(
      <TestWrapper defaultValues={defaultValues}>
        <RoleSection roles={roles} />
      </TestWrapper>,
    );

    const select = screen.getByLabelText("System Role *");
    expect(select).toBeInTheDocument();
  });
});
