// src/components/students/student-create-form.tsx

"use client";

import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type {
  StudentBPCreateResponse,
  StudentBPLocationCreateResponse,
  StudentCreateFormData,
  StudentCreationContext,
  StudentUserCreateResponse,
  StudentUserRoleCreateResponse,
} from "@/lib/api/idempiere/models";
import { STUDENT_CREATION_STEPS, TOTAL_STUDENT_CREATION_STEPS } from "@/lib/api/idempiere/models";

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
  greetingId: z.number().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  birthday: z.string().optional(),
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
// Step Components
// =============================================================================

interface StepFormProps {
  form: ReturnType<typeof useForm<StudentCreateFormValues>>;
  isLoading?: boolean;
}

/**
 * Step 1: Basic Information Form
 */
function Step1Form({ form, isLoading }: StepFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Student ID / Code */}
      <FormField
        control={form.control}
        name="step1.value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student ID *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 317201251162" {...field} disabled={isLoading} />
            </FormControl>
            <FormDescription>Unique student identification code</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Full Name */}
      <FormField
        control={form.control}
        name="step1.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., John Doe" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Middle/Last Name */}
      <FormField
        control={form.control}
        name="step1.name2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle/Last Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Smith" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Student Group */}
      <FormField
        control={form.control}
        name="step1.bpGroupId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student Group *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select student group" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1000003">Sekolah Menengah Kejuruan (SMK)</SelectItem>
                <SelectItem value="1000002">Sekolah Menengah Atas (SMA)</SelectItem>
                <SelectItem value="1000001">Sekolah Menengah Pertama (SMP)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tax ID */}
      <FormField
        control={form.control}
        name="step1.taxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax ID / National ID</FormLabel>
            <FormControl>
              <Input placeholder="e.g., NIK/NISN" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="step1.description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes about the student..."
                className="resize-none"
                rows={2}
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

/**
 * Step 2: Location Form
 */
function Step2Form({ form, isLoading }: StepFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Location Name */}
      <FormField
        control={form.control}
        name="step2.locationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Home Address" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 1 */}
      <FormField
        control={form.control}
        name="step2.address1"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address Line 1 *</FormLabel>
            <FormControl>
              <Input placeholder="Street address, line 1" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 2 */}
      <FormField
        control={form.control}
        name="step2.address2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2</FormLabel>
            <FormControl>
              <Input placeholder="Street address, line 2" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 3 */}
      <FormField
        control={form.control}
        name="step2.address3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 3</FormLabel>
            <FormControl>
              <Input placeholder="Street address, line 3" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 4 */}
      <FormField
        control={form.control}
        name="step2.address4"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 4</FormLabel>
            <FormControl>
              <Input placeholder="Street address, line 4" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="step2.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Jakarta" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={form.control}
        name="step2.postal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 11553" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={form.control}
        name="step2.countryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="209">Indonesia</SelectItem>
                <SelectItem value="100">United States</SelectItem>
                <SelectItem value="122">Malaysia</SelectItem>
                <SelectItem value="180">Singapore</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

/**
 * Step 3: Account Setup Form
 */
function Step3Form({ form, isLoading }: StepFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Username */}
      <FormField
        control={form.control}
        name="step3.username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username *</FormLabel>
            <FormControl>
              <Input placeholder="Login username" {...field} disabled={isLoading} />
            </FormControl>
            <FormDescription>Used for system login</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="step3.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password *</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Login password" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* User PIN */}
      <FormField
        control={form.control}
        name="step3.userPin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User PIN</FormLabel>
            <FormControl>
              <Input placeholder="Optional PIN code" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="step3.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="student@example.com" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={form.control}
        name="step3.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Phone</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 08123456789" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone 2 */}
      <FormField
        control={form.control}
        name="step3.phone2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary Phone</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 08198765432" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Title */}
      <FormField
        control={form.control}
        name="step3.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mr., Ms., Dr." {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Greeting */}
      <FormField
        control={form.control}
        name="step3.greetingId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Greeting</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select greeting" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1000000">Dear</SelectItem>
                <SelectItem value="1000001">Mr.</SelectItem>
                <SelectItem value="1000002">Ms.</SelectItem>
                <SelectItem value="1000003">Mrs.</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Birthday */}
      <FormField
        control={form.control}
        name="step3.birthday"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birthday</FormLabel>
            <FormControl>
              <Input type="date" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Comments */}
      <FormField
        control={form.control}
        name="step3.comments"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Comments</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes..."
                className="resize-none"
                rows={2}
                {...field}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

/**
 * Step 4: Role Assignment Form
 */
function Step4Form({ form, isLoading }: StepFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Role */}
      <FormField
        control={form.control}
        name="step4.roleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>System Role *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1000001">SISTEMATIS User</SelectItem>
                <SelectItem value="1000002">SISTEMATIS Admin</SelectItem>
                <SelectItem value="1000000">System Administrator</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Assign a system role to determine the student's access permissions</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
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
  const [_creationContext, setCreationContext] = useState<StudentCreationContext>({});

  // Form setup
  const form = useForm<StudentCreateFormValues>({
    resolver: zodResolver(studentCreateFormSchema),
    defaultValues: {
      step1: {
        value: "",
        name: "",
        name2: "",
        bpGroupId: 1000003, // Default: SMK
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
        greetingId: undefined,
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
        roleId: 1000001, // Default: SISTEMATIS User
      },
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const formValues = form.watch();

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
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateCurrentStep]);

  // Handle Previous Step
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // API calls for each step
  const client = getIdempiereClient();

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
        return <Step1Form form={form} isLoading={isLoading} />;
      case 2:
        return <Step2Form form={form} isLoading={isLoading} />;
      case 3:
        return <Step3Form form={form} isLoading={isLoading} />;
      case 4:
        return <Step4Form form={form} isLoading={isLoading} />;
      default:
        return null;
    }
  }, [currentStep, form, isLoading]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return ((currentStep - 1) / (TOTAL_STUDENT_CREATION_STEPS - 1)) * 100;
  }, [currentStep]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (onCancel ? onCancel() : router.back())}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-bold text-2xl">Add New Student</h1>
            <p className="text-muted-foreground">Follow the steps to create a new student record</p>
          </div>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Step Form */}
          <div className="rounded-lg border bg-card p-6">{renderStepForm()}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < TOTAL_STUDENT_CREATION_STEPS ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Student...
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
        </form>
      </Form>
    </div>
  );
}
