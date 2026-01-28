// src/lib/api/idempiere/models/c-bpartner/c-bpartner.schema.ts

import { generateFilterSchema } from "@/lib/data-table/generate-filter-schema";

import { CBPartnerFilterableFields } from "./c-bpartner.types";

/**
 * Filter schema for Student entity (C_BPartner with IsCustomer=true)
 * Auto-generated from CBPartnerFilterableFields
 */
export const studentFilterSchema = generateFilterSchema("C_BPartner", CBPartnerFilterableFields, "student");

/**
 * Filter schema for all Business Partners
 */
export const businessPartnerFilterSchema = generateFilterSchema("C_BPartner", CBPartnerFilterableFields);
