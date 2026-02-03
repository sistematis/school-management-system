// src/lib/hooks/use-students.ts

import { useQuery } from "@tanstack/react-query";

import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type { ODataResponse } from "@/lib/api/idempiere/common.types";
import type { CBPartner } from "@/lib/api/idempiere/models/c-bpartner";
import type { ODataQueryParams } from "@/lib/data-table/use-odata-query";
import { useIdempiereAuth } from "@/lib/stores/idempiere-auth.store";
import type { Student } from "@/lib/types/students";

export interface UseStudentsOptions {
  /** OData query params from useODataQuery hook */
  queryParams?: ODataQueryParams;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Client-side filters for navigation properties (e.g., ad_user/Phone) */
  clientSideFilters?: import("@/lib/data-table/filter.types").ActiveFilter[];
}

/**
 * Transform C_BPartner to Student
 * Maps fields from API response to Student type
 */
function toStudent(bpartner: CBPartner): Student {
  // Get first AD_User contact if available
  const primaryContact = bpartner.ad_user?.[0];

  return {
    id: bpartner.id.toString(),
    uid: bpartner.uid,
    value: bpartner.Value,
    name: bpartner.Name,
    name2: bpartner.Name2,
    email: bpartner.EMail,
    isActive: bpartner.IsActive,
    isCustomer: bpartner.IsCustomer,
    adLanguage: (bpartner as any).AD_Language_ID?.identifier || (bpartner as any).Ad_Language,
    // Birthday is stored in AD_User (Step 3: Account Setup), fallback to CBPartner
    birthday: primaryContact?.Birthday || bpartner.Birthday,

    // Basic Info from Step 1
    description: bpartner.Description,
    taxId: (bpartner as any).TaxID,
    bpGroupId: bpartner.C_BP_Group_ID?.id,
    bpGroupName: bpartner.C_BP_Group_ID?.identifier,

    // Account fields from Step 3 (from AD_User)
    phone: primaryContact?.Phone,
    phone2: primaryContact?.Phone2,
    title: primaryContact?.Title,
    greetingId: primaryContact?.C_Greeting_ID?.id,
    greetingName: primaryContact?.C_Greeting_ID?.identifier,
    username: primaryContact?.Value,

    // Relations
    contacts: bpartner.ad_user?.map((user) => ({
      id: user.id.toString(),
      name: user.Name,
      username: user.Value,
      email: user.EMail,
      phone: user.Phone,
      phone2: user.Phone2,
      birthday: user.Birthday,
      title: user.Title,
      greeting: user.C_Greeting_ID?.identifier,
      comments: user.Comments,
    })),
    locations: bpartner.c_bpartner_location?.map((loc) => ({
      id: loc.id.toString(),
      name: loc.Name,
      address1: loc.C_Location_ID.Address1,
      address2: loc.C_Location_ID.Address2,
      address3: loc.C_Location_ID.Address3,
      address4: loc.C_Location_ID.Address4,
      city: loc.C_Location_ID.City,
      postal: loc.C_Location_ID.Postal,
      countryId: loc.C_Location_ID.C_Country_ID?.id,
      countryName: loc.C_Location_ID.C_Country_ID?.identifier,
      fullAddress: loc.C_Location_ID.identifier,
    })),

    // Custom fields
    parentContact: (bpartner as any).parentContact,
    emergencyContact: (bpartner as any).emergencyContact,
    allergies: (bpartner as any).allergies,
    medicalConditions: (bpartner as any).medicalConditions,

    createdAt: bpartner.Created,
    updatedAt: bpartner.Updated,
  };
}

/**
 * Fetch students with OData filter support
 * Integrates with the dynamic filter system
 */
export function useStudents({ queryParams, clientSideFilters, enabled = true }: UseStudentsOptions = {}) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);
  const token = useIdempiereAuth((state) => state.token);

  // Create a stable key for client-side filters to trigger re-query when they change
  const clientSideFiltersKey = JSON.stringify(clientSideFilters || []);

  return useQuery({
    queryKey: ["students", "odata", queryParams, clientSideFiltersKey],
    queryFn: async () => {
      if (!token) {
        throw new Error("No access token");
      }

      const client = getIdempiereClient();

      // Build raw OData params
      const params: Record<string, string | number> = {};
      // IMPORTANT: iDempiere API defaults to IsActive=true only.
      // We must explicitly request both active and inactive records.
      const showAllFilter = "IsActive eq true OR IsActive eq false";
      if (queryParams?.$filter) {
        params.$filter = `(${showAllFilter}) and (${queryParams.$filter})`;
      } else {
        params.$filter = showAllFilter;
      }
      if (queryParams?.$orderby) params.$orderby = queryParams.$orderby;
      if (queryParams?.$top) params.$top = queryParams.$top;
      if (queryParams?.$skip) params.$skip = queryParams.$skip;

      // Expand related entities to get AD_User (for phone, username, etc.) and C_BPartner_Location
      params.$expand = "ad_user,C_BPartner_Location";

      // Use raw client query with OData params
      const response = await client.query<ODataResponse<CBPartner>>("/models/C_BPartner", params);

      let records = response.records ?? [];

      // Apply client-side filters for navigation properties (not supported by iDempiere OData)
      if (clientSideFilters && clientSideFilters.length > 0) {
        records = records.filter((bpartner) => {
          return clientSideFilters.every((filter) => {
            // Handle navigation property filters (e.g., ad_user/Phone)
            if (filter.field.includes("/")) {
              const [entity, field] = filter.field.split("/");
              // Get the expanded entity data
              const entityData = (bpartner as any)[entity];
              if (!entityData || !Array.isArray(entityData) || entityData.length === 0) {
                return false;
              }
              // Check if ANY of the related records matches the filter
              return entityData.some((record: any) => {
                const value = record[field];
                if (value === null || value === undefined) return false;

                switch (filter.operator) {
                  case "contains":
                    return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                  case "eq":
                    return String(value) === String(filter.value);
                  case "gt":
                    return new Date(value) > new Date(filter.value as string);
                  case "ge":
                    return new Date(value) >= new Date(filter.value as string);
                  case "lt":
                    return new Date(value) < new Date(filter.value as string);
                  case "le":
                    return new Date(value) <= new Date(filter.value as string);
                  default:
                    return false;
                }
              });
            }
            return true; // Non-navigation filters are handled server-side
          });
        });
      }

      // Transform C_BPartner to Student
      return {
        records: records.map(toStudent),
        page: 1,
        pageSize: queryParams?.$top ?? 10,
        totalPages: response["page-count"] ?? 1,
        totalRecords: response["row-count"] ?? 0,
      };
    },
    enabled: isAuthenticated && enabled,
    staleTime: 1000 * 5, // 5 seconds - consider data fresh for 5 seconds
    gcTime: 1000 * 60, // 1 minute - keep data in cache for 1 minute
  });
}

export interface StudentStats {
  total: number;
  active: number;
}

/**
 * Fetch student stats with filter support
 * Returns counts for: Total, Active
 */
export function useStudentStats(filter?: string) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);
  const token = useIdempiereAuth((state) => state.token);

  return useQuery<StudentStats>({
    queryKey: ["student-stats", "odata", filter],
    queryFn: async () => {
      if (!token) {
        throw new Error("No access token");
      }

      const client = getIdempiereClient();

      // Query total and active stats in parallel
      // IMPORTANT: iDempiere API defaults to IsActive=true only.
      // We must explicitly request both active and inactive records for total count.
      const showAllFilter = "IsActive eq true OR IsActive eq false";

      const [totalResult, activeResult] = await Promise.all([
        // Total students (including inactive)
        // If there's a user filter, combine it with showAllFilter
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and ${showAllFilter}` : showAllFilter,
          $top: 0,
        }),
        // Active students only
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and IsActive eq true` : "IsActive eq true",
          $top: 0,
        }),
      ]);

      return {
        total: totalResult["row-count"] ?? 0,
        active: activeResult["row-count"] ?? 0,
      };
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });
}
