// src/app/(main)/academic/students/[id]/edit/page.tsx

import { StudentEditPage } from "./student-edit-page";

/**
 * Student Edit Page - Server Component Wrapper
 *
 * This server component awaits the params promise (Next.js 15 pattern)
 * and passes the resolved ID to the client component.
 * This fixes the race condition where params weren't resolving
 * before client-side navigation.
 */
export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to resolve the ID before rendering the client component
  const { id } = await params;

  return <StudentEditPage studentId={id} />;
}
