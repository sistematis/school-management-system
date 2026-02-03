// src/lib/types/students.ts

/**
 * Location information for student
 */
export interface StudentLocation {
  id: string;
  name: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  city?: string;
  postal?: string;
  countryId?: number;
  countryName?: string;
  fullAddress?: string;
}

/**
 * Contact information for student (from AD_User)
 */
export interface StudentContact {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  birthday?: string;
  title?: string;
  greeting?: string;
  comments?: string;
}

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

  // Basic Info from Step 1
  description?: string; // Description
  taxId?: string; // TaxID
  bpGroupId?: number; // C_BP_Group_ID
  bpGroupName?: string; // BP Group name

  // Account fields from Step 3
  phone?: string; // Phone from AD_User
  phone2?: string; // Phone2 from AD_User
  title?: string; // Title from AD_User
  greetingId?: number; // C_Greeting_ID
  greetingName?: string; // Greeting name
  username?: string; // Username (Value from AD_User)

  // Relations
  contacts?: StudentContact[];
  locations?: StudentLocation[];

  // Custom school fields
  parentContact?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalConditions?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}
