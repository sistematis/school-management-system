// src/components/students/student-create-form.tsx

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import { type Path, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type {
  ADRoleResponse,
  BPGroupOption,
  CBPGroupResponse,
  CountryOption,
  GreetingOption,
  RoleOption,
  StudentBPCreateResponse,
  StudentBPLocationCreateResponse,
  StudentCreateFormData,
  StudentCreationContext,
  StudentUserCreateResponse,
  StudentUserRoleCreateResponse,
} from "@/lib/api/idempiere/models";
import { STUDENT_CREATION_STEPS, TOTAL_STUDENT_CREATION_STEPS } from "@/lib/api/idempiere/models";

// Shared form section components
import { AccountSection } from "./form-sections/account-section";
import { AddressSection } from "./form-sections/address-section";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { RoleSection } from "./form-sections/role-section";

// =============================================================================
// Validation Schemas
// =============================================================================

import { z } from "zod";

/**
 * Step 1: Basic Information Schema
 */
const step1Schema = z.object({
  value: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  name2: z.string().optional(),
  bpGroupId: z.number().min(1, "Student group is required"),
  description: z.string().optional(),
  taxId: z.string().optional(),
});

/**
 * Step 2: Location Schema
 */
const step2Schema = z.object({
  locationName: z.string().min(1, "Location name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  address3: z.string().optional(),
  address4: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal: z.string().optional(),
  countryId: z.number().min(1, "Country is required"),
});

/**
 * Step 3: Account Schema
 */
const step3Schema = z.object({
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  greetingId: z
    .number({
      required_error: "Greeting is required",
      invalid_type_error: "Greeting is required",
    })
    .min(1, "Greeting is required"),
  title: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  birthday: z
    .string()
    .min(1, "Birthday is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  comments: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  userPin: z.string().optional(),
});

/**
 * Step 4: Role Schema
 */
const step4Schema = z.object({
  roleId: z.number().min(1, "Role is required"),
});

// =============================================================================
// Form Props
// =============================================================================

interface StudentCreateFormProps {
  /** Callback when student is successfully created */
  onSuccess?: (studentId: number) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
}

// =============================================================================
// Stepper Component
// =============================================================================

interface StepperProps {
  currentStep: number;
  steps: typeof STUDENT_CREATION_STEPS;
}

function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            {/* Step Indicator */}
            <div className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                }
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span>{stepNumber}</span>}
              </div>
              <div
                className={`mt-2 text-center font-medium text-sm ${isCurrent ? "text-primary" : "text-muted-foreground"}
                `}
              >
                {step.title}
              </div>
              <div className="max-w-[120px] text-center text-muted-foreground text-xs">{step.description}</div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-all ${isCompleted ? "bg-primary" : "bg-muted-foreground/30"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Main Form Component
// =============================================================================

/**
 * Combined schema validation
 */
const studentCreateFormSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
});

type StudentCreateFormValues = z.infer<typeof studentCreateFormSchema>;

export function StudentCreateForm({ onSuccess, onCancel }: StudentCreateFormProps) {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isBPGroupsLoading, setIsBPGroupsLoading] = useState(true);
  const [bpGroups, setBpGroups] = useState<BPGroupOption[]>([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isGreetingsLoading, setIsGreetingsLoading] = useState(false);
  const [greetings, setGreetings] = useState<GreetingOption[]>([]);
  const [_creationContext, setCreationContext] = useState<StudentCreationContext>({});

  // Track step transitions to prevent form submission during transition
  const isTransitioningRef = useRef(false);

  // Initialize static data for countries and greetings
  useEffect(() => {
    // Static countries data (can be replaced with API call later)
    setCountries([
      { id: 209, name: "Indonesia" },
      { id: 100, name: "United States" },
      { id: 122, name: "Malaysia" },
      { id: 180, name: "Singapore" },
    ]);

    // Static greetings data (can be replaced with API call later)
    setGreetings([
      { id: 1000000, name: "Dear" },
      { id: 1000001, name: "Mr." },
      { id: 1000002, name: "Ms." },
      { id: 1000003, name: "Mrs." },
    ]);
  }, []);

  // Form setup
  const form = useForm<StudentCreateFormValues>({
    resolver: zodResolver(studentCreateFormSchema),
    defaultValues: {
      step1: {
        value: "",
        name: "",
        name2: "",
        bpGroupId: 0, // Will be set after fetching BP groups
        description: "",
        taxId: "",
      },
      step2: {
        locationName: "",
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        city: "",
        postal: "",
        countryId: 209, // Default: Indonesia
      },
      step3: {
        email: "",
        greetingId: 1000000, // Default: Dear
        title: "",
        phone: "",
        phone2: "",
        birthday: "",
        comments: "",
        username: "",
        password: "",
        userPin: "",
      },
      step4: {
        roleId: 1000001, // Default, will be updated by API if not valid
      },
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const formValues = form.watch();

  // Default values reference for dirty check
  const defaultValues = useMemo(
    () => ({
      step1: {
        value: "",
        name: "",
        name2: "",
        bpGroupId: 0, // Will be set after fetching BP groups
        description: "",
        taxId: "",
      },
      step2: {
        locationName: "",
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        city: "",
        postal: "",
        countryId: 209,
      },
      step3: {
        email: "",
        greetingId: 1000000,
        title: "",
        phone: "",
        phone2: "",
        birthday: "",
        comments: "",
        username: "",
        password: "",
        userPin: "",
      },
      step4: {
        roleId: 1000001,
      },
    }),
    [],
  );

  // API client
  const client = getIdempiereClient();

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsRolesLoading(true);
      try {
        const response = await client.get<ADRoleResponse>("/models/ad_role", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        // Transform to RoleOption format
        const roleOptions: RoleOption[] = response.records.map((role) => ({
          id: role.id,
          name: role.Name,
          description: role.Description,
        }));
        setRoles(roleOptions);

        // Set default role to first role if current value is not in the list
        const currentRoleId = form.getValues("step4.roleId");
        const validRoleIds = roleOptions.map((r) => r.id);
        if (!validRoleIds.includes(currentRoleId)) {
          form.setValue("step4.roleId", roleOptions[0]?.id || 0);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Error", {
          description: "Failed to load available roles. Please refresh the page.",
        });
      } finally {
        setIsRolesLoading(false);
      }
    };

    fetchRoles();
  }, [client, form]);

  // Fetch BP Groups from API
  useEffect(() => {
    const fetchBPGroups = async () => {
      setIsBPGroupsLoading(true);
      try {
        const response = await client.get<CBPGroupResponse>("/models/c_bp_group", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        // Transform to BPGroupOption format
        const bpGroupOptions: BPGroupOption[] = response.records.map((group) => ({
          id: group.id,
          name: group.Name,
          value: group.Value,
          isDefault: group.IsDefault,
        }));
        setBpGroups(bpGroupOptions);

        // Set default BP group to default or first group
        const currentBPGroupId = form.getValues("step1.bpGroupId");
        const validBPGroupIds = bpGroupOptions.map((g) => g.id);
        if (!validBPGroupIds.includes(currentBPGroupId)) {
          const defaultGroup = bpGroupOptions.find((g) => g.isDefault) || bpGroupOptions[0];
          form.setValue("step1.bpGroupId", defaultGroup?.id || 0);
        }
      } catch (error) {
        console.error("Failed to fetch BP groups:", error);
        toast.error("Error", {
          description: "Failed to load available student groups. Please refresh the page.",
        });
      } finally {
        setIsBPGroupsLoading(false);
      }
    };

    fetchBPGroups();
  }, [client, form]);

  // Get current step schema for validation
  const getCurrentStepSchema = useCallback(() => {
    switch (currentStep) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return step4Schema;
      default:
        return step1Schema;
    }
  }, [currentStep]);

  // Validate current step
  const validateCurrentStep = useCallback(async () => {
    const stepSchema = getCurrentStepSchema();
    const stepData = (formValues as StudentCreateFormValues)[`step${currentStep}` as keyof StudentCreateFormValues];

    try {
      await stepSchema.parseAsync(stepData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set errors for the current step
        error.errors.forEach((err) => {
          const fieldPath = `step${currentStep}.${err.path.join(".")}` as Path<StudentCreateFormValues>;
          form.setError(fieldPath, {
            type: "manual",
            message: err.message,
          });
        });
      }
      return false;
    }
  }, [currentStep, formValues, form, getCurrentStepSchema]);

  // Handle Next Step
  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (currentStep < TOTAL_STUDENT_CREATION_STEPS) {
      // Set transitioning flag to prevent form submission during step change
      isTransitioningRef.current = true;
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        // Clear the transitioning flag after state update completes
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 0);
        return nextStep;
      });
    }
  }, [currentStep, validateCurrentStep]);

  // Handle Previous Step
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // API calls for each step
  const createBusinessPartner = useCallback(
    async (data: StudentCreateFormData["step1"]) => {
      const payload = {
        Value: data.value,
        Name: data.name,
        Name2: data.name2 || "",
        C_BP_Group_ID: data.bpGroupId,
        IsCustomer: true,
        Description: data.description || "",
        TaxID: data.taxId || "",
      };

      // iDempiere POST /models/{entity} returns the created entity directly
      const result = await client.post<StudentBPCreateResponse>("/models/C_BPartner", payload);
      return result;
    },
    [client.post],
  );

  const createLocation = useCallback(
    async (data: StudentCreateFormData["step2"], bpId: number) => {
      const payload = {
        C_BPartner_ID: { id: bpId },
        Name: data.locationName,
        C_Location_ID: {
          Address1: data.address1,
          Address2: data.address2 || "",
          Address3: data.address3 || "",
          Address4: data.address4 || "",
          City: data.city,
          Postal: data.postal || "",
          C_Country_ID: data.countryId,
        },
      };

      const result = await client.post<StudentBPLocationCreateResponse>("/models/C_BPartner_Location", payload);
      return result;
    },
    [client.post],
  );

  const createUser = useCallback(
    async (data: StudentCreateFormData["step3"], bpId: number, bpLocationId: number) => {
      const payload = {
        Name: formValues.step1.name, // Use BP name
        EMail: data.email || "",
        C_Greeting_ID: data.greetingId,
        Title: data.title || "",
        Phone: data.phone || "",
        Phone2: data.phone2 || "",
        Birthday: data.birthday || "",
        Comments: data.comments || "",
        C_BPartner_ID: { id: bpId },
        C_BPartner_Location_ID: { id: bpLocationId },
        Value: data.username,
        Password: data.password,
        UserPIN: data.userPin || "",
      };

      const result = await client.post<StudentUserCreateResponse>("/models/AD_User", payload);
      return result;
    },
    [formValues.step1.name, client.post],
  );

  const assignRole = useCallback(
    async (userId: number, roleId: number) => {
      const payload = {
        AD_User_ID: { id: userId },
        AD_Role_ID: roleId,
      };

      const result = await client.post<StudentUserRoleCreateResponse>("/models/AD_User_Roles", payload);
      return result;
    },
    [client.post],
  );

  // Handle Form Submit
  const onSubmit = useCallback(async () => {
    // Prevent form submission during step transitions
    // This fixes the bug where clicking "Next" from Step 3 would submit the form
    // instead of navigating to Step 4 (Role Assignment)
    if (isTransitioningRef.current) {
      return;
    }
    setIsLoading(true);

    try {
      // Step 1: Create Business Partner
      const bpResult = await createBusinessPartner(formValues.step1);
      setCreationContext((prev) => ({ ...prev, bpId: bpResult.id }));

      // Step 2: Create Location
      const locationResult = await createLocation(formValues.step2, bpResult.id);
      setCreationContext((prev) => ({ ...prev, bpLocationId: locationResult.id }));

      // Step 3: Create User
      const userResult = await createUser(formValues.step3, bpResult.id, locationResult.id);
      setCreationContext((prev) => ({ ...prev, userId: userResult.id }));

      // Step 4: Assign Role
      await assignRole(userResult.id, formValues.step4.roleId);

      // Success
      toast.success("Student created successfully", {
        description: `${formValues.step1.name} has been added to the system.`,
      });

      // Redirect or callback
      if (onSuccess) {
        onSuccess(bpResult.id);
      } else {
        router.push("/academic/students");
      }
    } catch (error) {
      console.error("Failed to create student:", error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to create student",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formValues, createBusinessPartner, createLocation, createUser, assignRole, onSuccess, router]);

  // Get current step component
  const renderStepForm = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <BasicInfoSection bpGroups={bpGroups} mode="create" disabled={isLoading || isBPGroupsLoading} />;
      case 2:
        return <AddressSection countries={countries} disabled={isLoading} />;
      case 3:
        return <AccountSection greetings={greetings} showPasswordFields={true} disabled={isLoading} />;
      case 4:
        return <RoleSection roles={roles} disabled={isLoading || isRolesLoading} />;
      default:
        return null;
    }
  }, [currentStep, bpGroups, isBPGroupsLoading, countries, greetings, roles, isRolesLoading, isLoading]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return ((currentStep - 1) / (TOTAL_STUDENT_CREATION_STEPS - 1)) * 100;
  }, [currentStep]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="font-bold text-2xl">Add New Student</h1>
          <p className="text-muted-foreground">Follow the steps to create a new student record</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-muted-foreground text-sm">
          <span>
            Step {currentStep} of {TOTAL_STUDENT_CREATION_STEPS}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>

      {/* Stepper */}
      <Stepper currentStep={currentStep} steps={STUDENT_CREATION_STEPS} />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          onKeyDown={(e) => {
            // Prevent Enter key from submitting the form (except in textarea)
            if (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.type !== "textarea") {
              e.preventDefault();
            }
          }}
        >
          {/* Current Step Form */}
          <div className="rounded-lg border bg-card p-6">{renderStepForm()}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Check if form has any changes by comparing against default values
                  const hasChanges = Object.keys(defaultValues).some((stepKey) => {
                    const stepDefault = defaultValues[stepKey as keyof StudentCreateFormValues] as Record<
                      string,
                      unknown
                    >;
                    const stepCurrent = formValues[stepKey as keyof StudentCreateFormValues] as Record<string, unknown>;

                    return Object.keys(stepDefault).some((fieldKey) => {
                      return stepCurrent[fieldKey] !== stepDefault[fieldKey];
                    });
                  });

                  if (hasChanges) {
                    if (confirm("Are you sure? Any unsaved changes will be lost.")) {
                      onCancel ? onCancel() : router.back();
                    }
                  } else {
                    onCancel ? onCancel() : router.back();
                  }
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>

              {currentStep < TOTAL_STUDENT_CREATION_STEPS ? (
                <Button type="button" onClick={handleNext} disabled={isLoading}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || isRolesLoading || roles.length === 0}>
                  {isLoading || isRolesLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isRolesLoading ? "Loading Roles..." : "Creating Student..."}
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Create Student
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
