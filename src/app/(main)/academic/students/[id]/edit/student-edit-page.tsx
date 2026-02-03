// src/app/(main)/academic/students/[id]/edit/student-edit-page.tsx

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronLeft, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AccountSection, AddressSection, BasicInfoSection } from "@/components/students/form-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type {
  BPGroupOption,
  CBPartner,
  CBPGroupResponse,
  CountryOption,
  GreetingOption,
} from "@/lib/api/idempiere/models";
import { getBusinessPartnerService } from "@/lib/api/idempiere/services/business-partner.service";
import { type StudentUpdateFormValues, studentUpdateSchema } from "@/lib/schemas/student-update.schema";

// =============================================================================
// Types
// =============================================================================

interface StudentEditPageProps {
  /** Student ID from route params (resolved by server component) */
  studentId: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Transform API response to form values for all 3 steps
 */
function transformApiToFormValues(businessPartner: CBPartner): StudentUpdateFormValues {
  // Step 1: Basic Information
  const step1 = {
    value: businessPartner.Value || "",
    name: businessPartner.Name || "",
    name2: businessPartner.Name2 || "",
    // C_BP_Group_ID is an object with id property
    bpGroupId: businessPartner.C_BP_Group_ID?.id || 0,
    description: businessPartner.Description || "",
    taxId: "", // TaxID field not available in CBPartner type
  };

  // Step 2: Location - Get first location from C_BPartner_Location array
  const firstLocation = businessPartner.c_bpartner_location?.[0];
  const location = firstLocation?.C_Location_ID;

  const step2 = {
    locationName: firstLocation?.Name || "",
    address1: location?.Address1 || "",
    address2: location?.Address2 || "",
    address3: location?.Address3 || "",
    address4: location?.Address4 || "",
    city: location?.City || "",
    postal: location?.Postal || "",
    // C_Country_ID is an object with id property
    countryId: location?.C_Country_ID?.id || 209, // Default Indonesia
  };

  // Step 3: Account - Get first user from ad_user array
  const firstUser = businessPartner.ad_user?.[0];

  const step3 = {
    email: firstUser?.EMail || "",
    greetingId: firstUser?.C_Greeting_ID?.id || 0,
    title: firstUser?.Title || "",
    phone: firstUser?.Phone || "",
    phone2: firstUser?.Phone2 || "",
    birthday: firstUser?.Birthday || "",
    comments: firstUser?.Comments || "",
    username: firstUser?.Value || "",
  };

  return {
    step1,
    step2,
    step3,
  };
}

// =============================================================================
// Main Component
// =============================================================================

export function StudentEditPage({ studentId }: StudentEditPageProps) {
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentData, setStudentData] = useState<CBPartner | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Ref to track the latest request ID (for handling React StrictMode double effects)
  const requestIdRef = useRef(0);

  // Reference data state
  const [bpGroups, setBpGroups] = useState<BPGroupOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [greetings, setGreetings] = useState<GreetingOption[]>([]);

  // Current tab state
  const [currentTab, setCurrentTab] = useState("basic");

  // Form setup
  const form = useForm<StudentUpdateFormValues>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      step1: {
        value: "",
        name: "",
        name2: "",
        bpGroupId: 0,
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
        greetingId: 0,
        title: "",
        phone: "",
        phone2: "",
        birthday: "",
        comments: "",
        username: "",
      },
    },
    mode: "onChange",
  });

  // API client - memoized to prevent useEffect from running multiple times
  const client = useMemo(() => getIdempiereClient(), []);
  const businessPartnerService = useMemo(() => getBusinessPartnerService(), []);

  // Fetch reference data on mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Fetch BP Groups
        const bpGroupsResponse = await client.get<CBPGroupResponse>("/models/c_bp_group", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        setBpGroups(
          bpGroupsResponse.records.map((g) => ({
            id: g.id,
            name: g.Name,
            value: g.Value,
            isDefault: g.IsDefault,
          })),
        );

        // Fetch Countries - use pagination to get all countries
        // The API limits to 100 records per request, so we need to fetch in batches
        const allCountries: { id: number; name: string; code: string }[] = [];
        const pageSize = 100;
        let hasMore = true;
        let skip = 0;

        while (hasMore) {
          const response = await client.get<{ records: { id: number; Name: string }[]; "row-count": number }>(
            "/models/c_country",
            {
              $filter: "IsActive eq true",
              $orderby: "Name asc",
              $top: pageSize,
              $skip: skip,
            },
          );
          allCountries.push(
            ...response.records.map((c) => ({
              id: c.id,
              name: c.Name,
              code: c.Name,
            })),
          );

          // Check if we need to fetch more
          const totalCount = response["row-count"] || 0;
          hasMore = allCountries.length < totalCount;
          skip += pageSize;

          // Safety break - don't fetch more than 500 countries
          if (allCountries.length >= 500) break;
        }

        setCountries(allCountries);

        // Fetch Greetings
        const greetingsResponse = await client.get<{ records: { id: number; Name: string }[] }>("/models/c_greeting", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        setGreetings(
          greetingsResponse.records.map((g) => ({
            id: g.id,
            name: g.Name,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch reference data:", error);
        toast.error("Error", {
          description: "Failed to load reference data. Please refresh the page.",
        });
      }
    };

    fetchReferenceData();
  }, [client]);

  // Fetch student data on mount (studentId is now guaranteed to be resolved)
  useEffect(() => {
    // Increment request ID for this effect invocation
    const currentRequestId = ++requestIdRef.current;

    const fetchStudentData = async () => {
      // Reset states before fetching
      setIsLoading(true);
      setNotFound(false);

      try {
        const bpId = Number.parseInt(studentId, 10);
        if (Number.isNaN(bpId)) {
          console.error("[Edit Page] Invalid studentId:", studentId);
          if (currentRequestId === requestIdRef.current) {
            setNotFound(true);
          }
          return;
        }

        console.log("[Edit Page] Fetching student data for ID:", bpId, "requestId:", currentRequestId);
        const data = await businessPartnerService.getStudentByIdWithExpand(bpId);

        // Only update state if this is still the latest request
        if (currentRequestId !== requestIdRef.current) {
          console.log("[Edit Page] Ignoring stale response, current requestId:", requestIdRef.current);
          return;
        }

        if (!data) {
          console.error("[Edit Page] No data returned for student ID:", bpId);
          setNotFound(true);
          return;
        }

        console.log("[Edit Page] Successfully fetched student:", data.Name);
        setStudentData(data);

        // Transform and set form values
        const formValues = transformApiToFormValues(data);
        form.reset(formValues);
      } catch (error) {
        console.error("[Edit Page] Failed to fetch student:", error);
        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setNotFound(true);
          toast.error("Error", {
            description: "Failed to load student data. The student may not exist.",
          });
        }
      } finally {
        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchStudentData();

    // Cleanup function - no longer needed with requestIdRef approach
    return () => {
      // Request ID tracking handles stale responses automatically
    };
  }, [studentId, businessPartnerService, form]);

  // Handle form submit
  const onSubmit = useCallback(
    async (values: StudentUpdateFormValues) => {
      if (!studentData || !studentId) return;

      setIsSaving(true);

      try {
        const bpId = Number.parseInt(studentId, 10);

        // Step 1: Update C_BPartner (Basic Information)
        await client.put(`/models/C_BPartner/${bpId}`, {
          Value: values.step1.value,
          Name: values.step1.name,
          Name2: values.step1.name2 || "",
          C_BP_Group_ID: values.step1.bpGroupId,
          Description: values.step1.description || "",
          TaxID: values.step1.taxId || "",
        });

        // Step 2: Update C_BPartner_Location (Address)
        const firstLocation = studentData.c_bpartner_location?.[0];
        if (firstLocation) {
          await client.put(`/models/C_BPartner_Location/${firstLocation.id}`, {
            Name: values.step2.locationName,
            C_Location_ID: {
              Address1: values.step2.address1,
              Address2: values.step2.address2 || "",
              Address3: values.step2.address3 || "",
              Address4: values.step2.address4 || "",
              City: values.step2.city,
              Postal: values.step2.postal || "",
              C_Country_ID: values.step2.countryId,
            },
          });
        }

        // Step 3: Update ad_user (Account)
        const firstUser = studentData.ad_user?.[0];
        if (firstUser) {
          await client.put(`/models/ad_user/${firstUser.id}`, {
            Name: values.step1.name,
            EMail: values.step3.email || "",
            C_Greeting_ID: values.step3.greetingId || 0,
            Title: values.step3.title || "",
            Phone: values.step3.phone || "",
            Phone2: values.step3.phone2 || "",
            Birthday: values.step3.birthday || "",
            Comments: values.step3.comments || "",
            Value: values.step3.username,
          });
        }

        // Success - stay on page
        toast.success("Student updated successfully", {
          description: `${values.step1.name}'s information has been saved.`,
        });

        // Optionally refetch data to show latest state
        const updatedData = await businessPartnerService.getStudentByIdWithExpand(bpId);
        if (updatedData) {
          setStudentData(updatedData);
        }
      } catch (error) {
        console.error("Failed to update student:", error);
        toast.error("Error", {
          description: error instanceof Error ? error.message : "Failed to update student",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [studentData, studentId, client, businessPartnerService],
  );

  // Tabs configuration
  const tabs = useMemo(
    () => [
      { id: "basic", label: "Basic Information", value: "step1" },
      { id: "address", label: "Address & Location", value: "step2" },
      { id: "account", label: "Account Setup", value: "step3" },
    ],
    [],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground text-sm">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Not found state - only show after loading is complete
  if (!isLoading && notFound) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Student Not Found</CardTitle>
            </div>
            <CardDescription>
              The student you are looking for does not exist or you do not have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-bold text-2xl">Edit Student</h1>
            <p className="text-muted-foreground">
              Editing: {studentData?.Name || "Loading..."} ({studentData?.Value || ""})
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab 1: Basic Information */}
            <TabsContent value="basic" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update the student's basic personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <BasicInfoSection bpGroups={bpGroups} mode="edit" disabled={isSaving} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Address & Location */}
            <TabsContent value="address" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address & Location</CardTitle>
                  <CardDescription>Update the student's address and location details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressSection countries={countries} disabled={isSaving} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Account Setup */}
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Setup</CardTitle>
                  <CardDescription>Update the student's user account information and contact details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSection greetings={greetings} showPasswordFields={false} disabled={isSaving} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
