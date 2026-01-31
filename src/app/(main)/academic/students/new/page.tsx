// src/app/(main)/academic/students/new/page.tsx

"use client";

import { StudentCreateForm } from "@/components/students";

/**
 * New Student Page
 * Multi-step form for creating a new student
 */
export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <StudentCreateForm
        onSuccess={(_studentId) => {
          // Redirect to student detail or list after successful creation
          window.location.href = `/academic/students`;
        }}
        onCancel={() => {
          // Go back to student list
          window.history.back();
        }}
      />
    </div>
  );
}
