// src/lib/data-table/generate-filter-schema.ts

import type { FilterSchema, ModelFilterMetadata } from "./filter.types";

/**
 * Automatically generate filter schema from model metadata
 * Groups fields by type and usage patterns
 */
export function generateFilterSchema(
  modelName: string,
  metadata: ModelFilterMetadata,
  variant?: "student" | "vendor" | "employee" | "all",
): FilterSchema {
  const fieldNames = Object.keys(metadata);

  // Auto-generate groups based on field types
  const groups = autoGenerateGroups(fieldNames, metadata, variant);

  return {
    metadata,
    groups,
  };
}

function autoGenerateGroups(fields: string[], metadata: ModelFilterMetadata, variant?: string): FilterSchema["groups"] {
  const groups: FilterSchema["groups"] = [];

  // Group 1: Status flags (boolean fields)
  const booleanFields = fields.filter((f) => metadata[f].type === "boolean");
  if (booleanFields.length > 0) {
    groups.push({
      id: "status",
      title: "Status",
      fields: booleanFields,
    });
  }

  // Group 2: Classification (enum, reference fields)
  const classificationFields = fields.filter((f) => metadata[f].type === "enum" || metadata[f].type === "reference");
  if (classificationFields.length > 0) {
    groups.push({
      id: "classification",
      title: "Classification",
      fields: classificationFields,
    });
  }

  // Group 3: Personal Info (string fields with icons)
  const personalFields = fields.filter((f) => metadata[f].type === "string" && metadata[f].icon);
  if (personalFields.length > 0) {
    groups.push({
      id: "personal",
      title: "Personal Information",
      fields: personalFields,
    });
  }

  // Group 4: Dates
  const dateFields = fields.filter((f) => metadata[f].type === "date");
  if (dateFields.length > 0) {
    groups.push({
      id: "dates",
      title: "Dates",
      fields: dateFields,
    });
  }

  return groups;
}
