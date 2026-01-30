// src/config/actions/student-actions.ts

import type { Student } from "@/lib/types/students";
import type { MasterDataActionConfig } from "@/types/entity-actions";

/**
 * Student action configuration
 * Uses master data config since students don't have document workflow
 */
export const studentActionConfig: MasterDataActionConfig<Student> = {
  entityName: "student",

  enableView: true,
  enableEdit: true,
  enableDelete: true,

  // Default handlers - akan di-override di page level
  onView: (student) => {
    console.log("View student:", student.id);
    // Implementation: open drawer or navigate
  },

  onEdit: (student) => {
    console.log("Edit student:", student.id);
    // Implementation: navigate to edit page
    window.location.href = `/academic/students/${student.id}/edit`;
  },

  onDelete: async (student) => {
    console.log("Delete student:", student.id);
    // Implementation: call delete API
    // This will be overridden by the page's actual handler
  },

  copyId: {
    getId: (s) => s.id,
    label: "Copy Student ID",
  },
};
