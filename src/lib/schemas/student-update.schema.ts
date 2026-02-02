// src/lib/schemas/student-update.schema.ts

import { z } from "zod";

/**
 * Student Update Validation Schema
 *
 * Validates form data for editing students.
 * Similar to create schema but all fields are optional (partial updates).
 */

/**
 * Step 1: Basic Information Schema
 */
const step1Schema = z.object({
  value: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  name2: z.string().optional(),
  bpGroupId: z.number().min(1, "Student group is required"),
  description: z.string().optional(),
  taxId: z.string().optional(),
});

/**
 * Step 2: Location Schema
 */
const step2Schema = z.object({
  locationName: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  address4: z.string().optional(),
  city: z.string().optional(),
  postal: z.string().optional(),
  countryId: z.number().optional(),
});

/**
 * Step 3: Account Schema (no password in edit mode)
 */
const step3Schema = z.object({
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  greetingId: z.number().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  birthday: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format (YYYY-MM-DD)"),
  comments: z.string().optional(),
  username: z.string().optional(),
});

/**
 * Step 4: Role Schema
 */
const step4Schema = z.object({
  roleId: z.number().optional(),
});

/**
 * Complete student update schema
 */
export const studentUpdateSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
});

/**
 * Type for form values
 */
export type StudentUpdateFormValues = z.infer<typeof studentUpdateSchema>;

/**
 * Separate schemas for per-step validation (used in tab-based form)
 */
export const step1UpdateSchema = step1Schema;
export const step2UpdateSchema = step2Schema;
export const step3UpdateSchema = step3Schema;
export const step4UpdateSchema = step4Schema;
