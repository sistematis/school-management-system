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
}

/**
 * Transform C_BPartner to Student
 */
function toStudent(bpartner: CBPartner): Student {
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
    birthday: bpartner.Birthday,

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
export function useStudents({ queryParams, enabled = true }: UseStudentsOptions = {}) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);
  const token = useIdempiereAuth((state) => state.token);

  return useQuery({
    queryKey: ["students", "odata", queryParams],
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

      // Use raw client query with OData params
      const response = await client.query<ODataResponse<CBPartner>>("/models/C_BPartner", params);

      const records = response.records ?? [];
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
    staleTime: 0, // Always refetch when queryKey changes
    gcTime: 0, // Don't cache data - immediately garbage collect
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
      const totalFilter = filter ? `(${showAllFilter}) and (${filter})` : showAllFilter;

      const [totalResult, activeResult] = await Promise.all([
        // Total students (including inactive)
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", { $filter: totalFilter, $top: 0 }),
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
