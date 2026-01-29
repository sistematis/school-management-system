// src/lib/types/students.ts

/**
 * Student entity for frontend use
 * Transformed from C_BPartner
 */
export interface Student {
  id: string; // C_BPartner_ID
  uid: string; // UUID
  value: string; // Value field (student code)
  name: string; // Name
  name2?: string; // Name2
  email?: string; // EMail
  isActive: boolean; // IsActive
  isCustomer: boolean; // IsCustomer
  adLanguage?: string; // Ad_Language
  birthday?: string; // Birthday (ISO date)

  // Custom school fields
  parentContact?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
