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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Info Box */}
      {roles.length === 0 ? (
        <div className="md:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
          <p className="text-sm font-medium">Loading available roles...</p>
          <p className="text-muted-foreground text-sm">Please wait while we fetch the system roles from the server.</p>
        </div>
      ) : (
        <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <p className="text-sm font-medium">Final Step: Select System Role</p>
          <p className="text-muted-foreground text-sm">
            Choose a role for this student from the available options below, then click "Create Student" to complete the
            registration.
          </p>
        </div>
      )}

      {/* System Role */}
      <FormField
        control={form.control}
        name="step4.roleId"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>System Role *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={roles.length === 0 ? "Loading roles..." : "Select role"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.name}</span>
                      {role.description && <span className="text-muted-foreground text-xs">{role.description}</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {selectedRole ? (
                <>Selected: {selectedRole.name}</>
              ) : (
                <>Assign a system role to determine the student's access permissions</>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
