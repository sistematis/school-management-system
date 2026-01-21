/**
 * React Query Hooks for iDempiere API
 *
 * Custom hooks for fetching data from iDempiere REST API
 */

import { useEffect } from "react";

import { type UseQueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getBusinessPartnerService } from "../api/idempiere/services/business-partner.service";
import type { PaginatedResponse, PaginationParams, Student } from "../api/idempiere/types";
import { useIdempiereAuth } from "../stores/idempiere-auth.store";

// =============================================================================
// Query Keys
// =============================================================================

/**
 * Query keys factory for iDempiere data
 */
export const idempiereQueryKeys = {
  // Auth
  auth: ["idempiere", "auth"] as const,

  // Students
  students: (params?: PaginationParams) => ["idempiere", "students", params] as const,
  student: (id: number | string) => ["idempiere", "student", id] as const,
  studentByValue: (value: string) => ["idempiere", "student", "value", value] as const,
  studentStats: ["idempiere", "students", "stats"] as const,

  // Invoices
  invoices: (params?: PaginationParams) => ["idempiere", "invoices", params] as const,
  invoice: (id: number) => ["idempiere", "invoice", id] as const,

  // Payments
  payments: (params?: PaginationParams) => ["idempiere", "payments", params] as const,
  payment: (id: number) => ["idempiere", "payment", id] as const,

  // Assets
  assets: (params?: PaginationParams) => ["idempiere", "assets", params] as const,
  asset: (id: number) => ["idempiere", "asset", id] as const,

  // Products (Library)
  products: (params?: PaginationParams) => ["idempiere", "products", params] as const,
  product: (id: number) => ["idempiere", "product", id] as const,
} as const;

// =============================================================================
// Student Hooks
// =============================================================================

/**
 * Hook to fetch paginated students
 * @param pagination - Page and page size
 * @param options - React Query options
 */
export function useStudents(
  pagination: PaginationParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Student>>, "queryKey" | "queryFn">,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: idempiereQueryKeys.students(pagination),
    queryFn: async () => {
      const service = getBusinessPartnerService();
      return service.getStudents(pagination);
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

/**
 * Hook to fetch a single student by ID
 * @param bpartnerId - Business Partner ID
 * @param options - React Query options
 */
export function useStudent(
  bpartnerId: number | null,
  options?: Omit<UseQueryOptions<Student | null>, "queryKey" | "queryFn">,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: idempiereQueryKeys.student(bpartnerId ?? 0),
    queryFn: async () => {
      if (!bpartnerId) return null;
      const service = getBusinessPartnerService();
      return service.getStudentById(bpartnerId);
    },
    enabled: isAuthenticated && !!bpartnerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook to fetch a student by Value (search key)
 * @param value - Student Value (e.g., "10A-001")
 * @param options - React Query options
 */
export function useStudentByValue(
  value: string | null,
  options?: Omit<UseQueryOptions<Student | null>, "queryKey" | "queryFn">,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: idempiereQueryKeys.studentByValue(value ?? ""),
    queryFn: async () => {
      if (!value) return null;
      const service = getBusinessPartnerService();
      return service.getStudentByValue(value);
    },
    enabled: isAuthenticated && !!value,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to search students by name or ID
 * @param searchTerm - Search term
 * @param pagination - Page and page size
 * @param options - React Query options
 */
export function useSearchStudents(
  searchTerm: string,
  pagination: PaginationParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Student>>, "queryKey" | "queryFn">,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["idempiere", "students", "search", searchTerm, pagination] as const,
    queryFn: async () => {
      if (!searchTerm.trim()) {
        const service = getBusinessPartnerService();
        return service.getStudents(pagination);
      }
      const service = getBusinessPartnerService();
      return service.searchStudents(searchTerm, pagination);
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes for searches
    ...options,
  });
}

/**
 * Hook to fetch students by grade
 * @param grade - Grade name or ID
 * @param pagination - Page and page size
 * @param options - React Query options
 */
export function useStudentsByGrade(
  grade: string | null,
  pagination: PaginationParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Student>>, "queryKey" | "queryFn">,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["idempiere", "students", "grade", grade, pagination] as const,
    queryFn: async () => {
      if (!grade) {
        const service = getBusinessPartnerService();
        return service.getStudents(pagination);
      }
      const service = getBusinessPartnerService();
      return service.getStudentsByGrade(grade, pagination);
    },
    enabled: isAuthenticated && grade !== null,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch student statistics
 * @param options - React Query options
 */
export function useStudentStats(
  options?: Omit<
    UseQueryOptions<{
      total: number;
      active: number;
      inactive: number;
      byGrade: Record<string, number>;
    }>,
    "queryKey" | "queryFn"
  >,
) {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  return useQuery({
    queryKey: idempiereQueryKeys.studentStats,
    queryFn: async () => {
      const service = getBusinessPartnerService();
      return service.getStudentStats();
    },
    enabled: isAuthenticated,
    staleTime: 15 * 60 * 1000, // 15 minutes for stats
    ...options,
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: Partial<Student>) => {
      const service = getBusinessPartnerService();
      return service.createStudent(student);
    },
    onSuccess: () => {
      // Invalidate students queries to refetch
      queryClient.invalidateQueries({ queryKey: ["idempiere", "students"] });
    },
  });
}

/**
 * Hook to update an existing student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bpartnerId, student }: { bpartnerId: number; student: Partial<Student> }) => {
      const service = getBusinessPartnerService();
      return service.updateStudent(bpartnerId, student);
    },
    onSuccess: (_, variables) => {
      // Invalidate specific student and students list
      queryClient.invalidateQueries({ queryKey: ["idempiere", "student", variables.bpartnerId] });
      queryClient.invalidateQueries({ queryKey: ["idempiere", "students"] });
    },
  });
}

/**
 * Hook to delete (deactivate) a student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bpartnerId: number) => {
      const service = getBusinessPartnerService();
      return service.deleteStudent(bpartnerId);
    },
    onSuccess: () => {
      // Invalidate students queries
      queryClient.invalidateQueries({ queryKey: ["idempiere", "students"] });
    },
  });
}

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to check if user is authenticated with iDempiere
 */
export function useIdempiereAuthenticated() {
  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);
  const checkAuth = useIdempiereAuth((state) => state.checkAuth);

  // Check auth status on mount (using useEffect to avoid setState during render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isAuthenticated;
}

/**
 * Hook to get current iDempiere user info
 */
export function useIdempiereUser() {
  const user = useIdempiereAuth((state) => state.user);
  const isLoading = useIdempiereAuth((state) => state.isLoading);

  return { user, isLoading };
}

/**
 * Hook for login/logout actions
 */
export function useIdempiereAuthActions() {
  const login = useIdempiereAuth((state) => state.login);
  const logout = useIdempiereAuth((state) => state.logout);
  const isLoading = useIdempiereAuth((state) => state.isLoading);
  const error = useIdempiereAuth((state) => state.error);
  const clearError = useIdempiereAuth((state) => state.clearError);

  return {
    login,
    logout,
    isLoading,
    error,
    clearError,
  };
}
