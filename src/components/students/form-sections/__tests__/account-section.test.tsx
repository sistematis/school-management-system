// src/components/students/form-sections/__tests__/account-section.test.tsx

import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { AccountSection } from "../account-section";

function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({
    defaultValues: {
      step3: {
        email: "",
        greetingId: 0,
        title: "",
        phone: "",
        phone2: "",
        birthday: "",
        comments: "",
        username: "",
        password: "",
        userPin: "",
        ...defaultValues,
      },
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("AccountSection", () => {
  const greetings = [
    { id: 1, name: "Mr." },
    { id: 2, name: "Ms." },
  ];

  it("renders all fields in create mode", () => {
    render(
      <TestWrapper>
        <AccountSection greetings={greetings} showPasswordFields />
      </TestWrapper>,
    );

    expect(screen.getByLabelText("Username *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password *")).toBeInTheDocument();
    expect(screen.getByLabelText("User PIN")).toBeInTheDocument();
    expect(screen.getByLabelText("Greeting *")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Primary Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Secondary Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Birthday *")).toBeInTheDocument();
    expect(screen.getByLabelText("Comments")).toBeInTheDocument();
  });

  it("hides password fields in edit mode", () => {
    render(
      <TestWrapper>
        <AccountSection greetings={greetings} showPasswordFields={false} />
      </TestWrapper>,
    );

    expect(screen.queryByLabelText("Password *")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("User PIN")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Username *")).toBeInTheDocument();
  });

  it("prefills data in edit mode", () => {
    const defaultValues = {
      username: "john.doe",
      email: "john@example.com",
      phone: "555-1234",
      birthday: "2010-01-15",
    };

    render(
      <TestWrapper defaultValues={defaultValues}>
        <AccountSection greetings={greetings} showPasswordFields={false} />
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue("john.doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("555-1234")).toBeInTheDocument();
  });
});
