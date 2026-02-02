// src/components/students/form-sections/basic-info-section.tsx

"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BPGroupOption } from "@/lib/api/idempiere/models";

// =============================================================================
// Types
// =============================================================================

export interface BasicInfoSectionProps {
  /** Available BP Groups for dropdown */
  bpGroups?: BPGroupOption[];
  /** Whether the form is in edit mode (affects field descriptions) */
  mode?: "create" | "edit";
  /** Whether fields should be disabled */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Basic Information Form Section
 * Step 1 fields: Student ID, Full Name, Name2, BP Group, Tax ID, Description
 *
 * Uses useFormContext to access the parent form state.
 * Expects form to have these fields: step1.value, step1.name, step1.name2, step1.bpGroupId, step1.taxId, step1.description
 */
export function BasicInfoSection({ bpGroups = [], mode = "create", disabled = false }: BasicInfoSectionProps) {
  const form = useFormContext();

  // Watch bpGroupId for display purposes
  const selectedBPGroup = bpGroups.find((g) => g.id === form.watch("step1.bpGroupId"));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Student ID / Value */}
      <FormField
        control={form.control}
        name="step1.value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student ID *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 317201251162" {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>
              {mode === "edit" ? "Editable student identification code" : "Unique student identification code"}
            </FormDescription>
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
              <Input placeholder="e.g., John Doe" {...field} disabled={disabled} />
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
              <Input placeholder="e.g., Smith" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Student Group / BP Group */}
      <FormField
        control={form.control}
        name="step1.bpGroupId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student Group *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={bpGroups.length === 0 ? "Loading groups..." : "Select student group"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bpGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {selectedBPGroup ? <>Selected: {selectedBPGroup.name}</> : <>Select a student group for classification</>}
            </FormDescription>
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
              <Input placeholder="e.g., NIK/NISN" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description - spans full width */}
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
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
