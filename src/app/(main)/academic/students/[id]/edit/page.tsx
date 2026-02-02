// src/app/(main)/academic/students/[id]/edit/page.tsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronLeft, Loader2, Save, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AccountSection, AddressSection, BasicInfoSection, RoleSection } from "@/components/students/form-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type {
  ADRoleResponse,
  BPGroupOption,
  CBPartnerLocation,
  CBPGroupResponse,
  CountryOption,
  GreetingOption,
  RoleOption,
} from "@/lib/api/idempiere/models";
import { getBusinessPartnerService } from "@/lib/api/idempiere/services/business-partner.service";
import type { BusinessPartner } from "@/lib/api/idempiere/types";
import { type StudentUpdateFormValues, studentUpdateSchema } from "@/lib/schemas/student-update.schema";

// =============================================================================
// Types
// =============================================================================

interface StudentEditPageProps {
  params: Promise<{ id: string }>;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Transform API response to form values for all 4 steps
 */
function transformApiToFormValues(businessPartner: BusinessPartner): StudentUpdateFormValues {
  // Step 1: Basic Information
  const step1 = {
    value: businessPartner.Value || "",
    name: businessPartner.Name || "",
    name2: businessPartner.Name2 || "",
    bpGroupId: businessPartner.C_BP_Group_ID?.id || 0,
    description: businessPartner.Description || "",
    taxId: businessPartner.TaxID || "",
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
    countryId: location?.C_Country_ID?.id || 209, // Default Indonesia
  };

  // Step 3: Account - Get first user from AD_User array
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

  // Step 4: Role - We'll need to fetch user roles separately
  // For now, set default
  const step4 = {
    roleId: 0,
  };

  return {
    step1,
    step2,
    step3,
    step4,
  };
}

// =============================================================================
// Main Component
// =============================================================================

export default function StudentEditPage({ params }: StudentEditPageProps) {
  const router = useRouter();

  // State
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentData, setStudentData] = useState<BusinessPartner | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Reference data state
  const [bpGroups, setBpGroups] = useState<BPGroupOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [greetings, setGreetings] = useState<GreetingOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);

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
      step4: {
        roleId: 0,
      },
    },
    mode: "onChange",
  });

  // API client
  const client = getIdempiereClient();
  const businessPartnerService = getBusinessPartnerService();

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

        // Fetch Countries
        const countriesResponse = await client.get<{ records: { id: number; Name: string }[] }>("/models/c_country", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        setCountries(
          countriesResponse.records.map((c) => ({
            id: c.id,
            name: c.Name,
            code: c.Name,
          })),
        );

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

        // Fetch Roles
        const rolesResponse = await client.get<ADRoleResponse>("/models/ad_role", {
          $filter: "IsActive eq true",
          $orderby: "Name asc",
        });
        setRoles(
          rolesResponse.records.map((r) => ({
            id: r.id,
            name: r.Name,
            description: r.Description,
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

  // Fetch student data when params resolve
  useEffect(() => {
    let cancelled = false;

    const fetchStudentData = async (studentId: string) => {
      setIsLoading(true);
      try {
        const bpId = Number.parseInt(studentId, 10);
        if (Number.isNaN(bpId)) {
          setNotFound(true);
          return;
        }

        const data = await businessPartnerService.getStudentByIdWithExpand(bpId);

        if (!data || cancelled) {
          setNotFound(true);
          return;
        }

        setStudentData(data);

        // Transform and set form values
        const formValues = transformApiToFormValues(data);
        form.reset(formValues);

        // Fetch user role if user exists
        if (data.ad_user && data.ad_user.length > 0) {
          const userId = data.ad_user[0].id;
          try {
            const userRolesResponse = await client.get<{ records: { AD_Role_ID: { id: number } }[] }>(
              "/models/ad_user_roles",
              {
                $filter: `AD_User_ID eq ${userId} AND IsActive eq true`,
              },
            );

            if (userRolesResponse.records && userRolesResponse.records.length > 0) {
              const roleId = userRolesResponse.records[0].AD_Role_ID.id;
              form.setValue("step4.roleId", roleId);
            }
          } catch (roleError) {
            console.error("Failed to fetch user role:", roleError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setNotFound(true);
        toast.error("Error", {
          description: "Failed to load student data. The student may not exist.",
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    // Resolve params (Next.js 15 pattern)
    params.then((p) => {
      setResolvedId(p.id);
      fetchStudentData(p.id);
    });

    return () => {
      cancelled = true;
    };
  }, [params, businessPartnerService, client, form]);

  // Handle form submit
  const onSubmit = useCallback(
    async (values: StudentUpdateFormValues) => {
      if (!studentData || !resolvedId) return;

      setIsSaving(true);

      try {
        const bpId = Number.parseInt(resolvedId, 10);

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

        // Step 3: Update AD_User (Account)
        const firstUser = studentData.ad_user?.[0];
        if (firstUser) {
          await client.put(`/models/AD_User/${firstUser.id}`, {
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

        // Step 4: Update AD_User_Roles (Role Assignment)
        if (firstUser && values.step4.roleId > 0) {
          // Check if user has existing role
          const userRolesResponse = await client.get<{ records: { id: number; AD_Role_ID: { id: number } }[] }>(
            "/models/ad_user_roles",
            {
              $filter: `AD_User_ID eq ${firstUser.id} AND IsActive eq true`,
            },
          );

          const existingRole = userRolesResponse.records?.[0];

          if (existingRole) {
            // Update existing role if changed
            if (existingRole.AD_Role_ID.id !== values.step4.roleId) {
              await client.put(`/models/AD_User_Roles/${existingRole.id}`, {
                AD_User_ID: { id: firstUser.id },
                AD_Role_ID: values.step4.roleId,
              });
            }
          } else {
            // Create new role assignment
            await client.post("/models/AD_User_Roles", {
              AD_User_ID: { id: firstUser.id },
              AD_Role_ID: values.step4.roleId,
            });
          }
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
    [studentData, resolvedId, client, businessPartnerService],
  );

  // Tabs configuration
  const tabs = useMemo(
    () => [
      { id: "basic", label: "Basic Information", value: "step1" },
      { id: "address", label: "Address & Location", value: "step2" },
      { id: "account", label: "Account Setup", value: "step3" },
      { id: "role", label: "Role Assignment", value: "step4" },
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

  // Not found state
  if (notFound || !studentData) {
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
              Editing: {studentData.Name} ({studentData.Value})
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
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

            {/* Tab 4: Role Assignment */}
            <TabsContent value="role" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Role Assignment</CardTitle>
                  <CardDescription>Update the student's system role and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleSection roles={roles} disabled={isSaving} />
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
