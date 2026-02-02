// src/components/students/form-sections/role-section.tsx

"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RoleOption } from "@/lib/api/idempiere/models";

// =============================================================================
// Types
// =============================================================================

export interface RoleSectionProps {
  /** Available roles for dropdown */
  roles?: RoleOption[];
  /** Whether fields should be disabled */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Role Assignment Form Section
 * Step 4 field: System Role
 *
 * Uses useFormContext to access the parent form state.
 * Expects form to have this field: step4.roleId
 */
export function RoleSection({ roles = [], disabled = false }: RoleSectionProps) {
  const form = useFormContext();

  // Watch roleId for display purposes
  const selectedRole = roles.find((r) => r.id === form.watch("step4.roleId"));

  return (
    <div className="grid grid-cols-1 gap-4 max-w-md">
      {/* System Role */}
      <FormField
        control={form.control}
        name="step4.roleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>System Role *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role">{selectedRole?.label || "Select a role"}</SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Assign a system role to determine the student's permissions</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
