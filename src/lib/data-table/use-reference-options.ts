// src/lib/data-table/use-reference-options.ts

import { useEffect, useState } from "react";

import { getIdempiereClient } from "@/lib/api/idempiere/client";
import type { ODataResponse } from "@/lib/api/idempiere/common.types";
import { useIdempiereAuth } from "@/lib/stores/idempiere-auth.store";

import type { ReferenceFieldConfig } from "./filter.types";

export interface ReferenceOption {
  label: string;
  value: string;
}

/**
 * Hook to fetch reference options dynamically for filter fields
 */
export function useReferenceOptions(reference: ReferenceFieldConfig | undefined) {
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useIdempiereAuth((state) => state.isAuthenticated);

  useEffect(() => {
    if (!reference || !isAuthenticated) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = getIdempiereClient();

        // Build query params
        const params: Record<string, string> = {};
        if (reference.filter) {
          params.$filter = reference.filter;
        }
        if (reference.sort) {
          params.$orderby = reference.sort;
        }
        // Limit to 100 options
        params.$top = "100";

        const response = await client.query<ODataResponse<Record<string, unknown>>>(reference.endpoint, params);

        const records = response.records ?? [];

        // Transform records to options
        const fetchedOptions: ReferenceOption[] = records
          .map((record) => {
            const label = String(record[reference.labelField] ?? "");
            const value = String(record[reference.valueField] ?? "");
            if (!label || !value) return null;
            return { label, value };
          })
          .filter((option): option is ReferenceOption => option !== null);

        setOptions(fetchedOptions);
      } catch (err) {
        console.error(`Failed to fetch reference options from ${reference.endpoint}:`, err);
        setError("Failed to load options");
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [reference, isAuthenticated]);

  return { options, isLoading, error };
}
