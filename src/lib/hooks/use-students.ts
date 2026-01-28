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
    phone: bpartner.Phone,
    phone2: bpartner.Phone2,
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
      if (queryParams?.$filter) params.$filter = queryParams.$filter;
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
    staleTime: 1000 * 60, // 1 minute
  });
}

export interface StudentStats {
  total: number;
  active: number;
  grade9: number;
  grade10: number;
  grade11: number;
  grade12: number;
  grades11_12: number;
}

/**
 * Fetch student stats with filter support
 * Returns counts for: Total, Active, by Grade
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

      // For each stat, query with appropriate filter
      const [totalResult, activeResult, grade9Result, grade10Result, grade11Result, grade12Result] = await Promise.all([
        // Total students
        client.query<ODataResponse<CBPartner>>(
          "/models/C_BPartner",
          filter ? { $filter: filter, $top: 0 } : { $top: 0 },
        ),
        // Active students
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and IsActive eq true` : "IsActive eq true",
          $top: 0,
        }),
        // Grade 9 (custom field - adjust field name as needed)
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and GradeLevel eq '9'` : "GradeLevel eq '9'",
          $top: 0,
        }),
        // Grade 10
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and GradeLevel eq '10'` : "GradeLevel eq '10'",
          $top: 0,
        }),
        // Grade 11
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and GradeLevel eq '11'` : "GradeLevel eq '11'",
          $top: 0,
        }),
        // Grade 12
        client.query<ODataResponse<CBPartner>>("/models/C_BPartner", {
          $filter: filter ? `${filter} and GradeLevel eq '12'` : "GradeLevel eq '12'",
          $top: 0,
        }),
      ]);

      return {
        total: totalResult["row-count"] ?? 0,
        active: activeResult["row-count"] ?? 0,
        grade9: grade9Result["row-count"] ?? 0,
        grade10: grade10Result["row-count"] ?? 0,
        grade11: grade11Result["row-count"] ?? 0,
        grade12: grade12Result["row-count"] ?? 0,
        grades11_12: (grade11Result["row-count"] ?? 0) + (grade12Result["row-count"] ?? 0),
      };
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });
}
