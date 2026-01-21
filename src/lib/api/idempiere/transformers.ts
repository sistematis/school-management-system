/**
 * iDempiere Data Transformers
 *
 * Functions to transform iDempiere entities to School Management System format
 */

import { IDEMPIERE_CONFIG } from "./config";
import type {
  Asset,
  BusinessPartner,
  Invoice,
  LibraryBook,
  Payment,
  Product,
  SchoolAsset,
  SchoolInvoice,
  SchoolPayment,
  Student,
} from "./types";

// =============================================================================
// Business Partner → Student Transformations
// =============================================================================

/**
 * Get initials from a name
 */
function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim()[0] ?? "";
  const last = lastName.trim()[0] ?? "";
  return (first + last).toUpperCase();
}

/**
 * Split full name into first and last name
 */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0] ?? "", lastName: "" };
  }

  if (parts.length === 2) {
    return { firstName: parts[0] ?? "", lastName: parts[1] ?? "" };
  }

  // For names with more than 2 parts, first word is first name, rest is last name
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Map grade from BP Group name to standard format
 */
function normalizeGrade(bpGroupName?: string): string {
  if (!bpGroupName) return "Unknown";

  // Common patterns for grade names in BP Groups
  const gradePatterns = [
    /^Grade\s*(\d+)(?:\s*[-–]\s*Section\s*([A-Z]))?$/i,
    /^(\d+)(?:th|rd|st|nd)\s*Grade(?:\s*[-–]\s*([A-Z]))?$/i,
    /^Class\s*(\d+)(?:\s*[-–]\s*([A-Z]))?$/i,
    /^(\d+)([A-Z])$/, // Pattern for "9A", "10B", etc.
  ];

  for (const pattern of gradePatterns) {
    const match = bpGroupName.match(pattern);
    if (match) {
      const grade = match[1];
      const section = match[2] ?? "A";
      return `Grade ${grade} - Section ${section}`;
    }
  }

  return bpGroupName;
}

/**
 * Transform iDempiere Business Partner to Student
 */
export function transformBPartnerToStudent(bPartner: BusinessPartner): Student {
  const { firstName, lastName } = splitName(bPartner.Name);
  const initials = getInitials(firstName, lastName);

  return {
    id: bPartner.Value,
    firstName,
    lastName,
    initials,
    email: bPartner.EMail,
    phone: bPartner.Phone,
    grade: normalizeGrade(bPartner.C_BP_Group?.Name ?? bPartner.C_BP_Group?.identifier),
    parentName: bPartner.AD_User?.[0]?.Name,
    dateOfBirth: bPartner.Birthday,
    status: bPartner.IsActive ? "active" : "inactive",
    C_BPartner_ID: bPartner.C_BPartner_ID ?? bPartner.id,
    emergencyContact: bPartner.parentContact,
    allergies: bPartner.allergies,
    medicalConditions: bPartner.medicalConditions,
  };
}

/**
 * Transform array of Business Partners to Students
 */
export function transformBPartnersToStudents(bPartners: BusinessPartner[]): Student[] {
  return bPartners.map(transformBPartnerToStudent);
}

/**
 * Transform Student to Business Partner (for create/update)
 */
export function transformStudentToBPartner(student: Partial<Student>): Partial<BusinessPartner> {
  const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ");

  const bPartner: Partial<BusinessPartner> = {
    Value: student.id ?? "",
    Name: fullName,
    EMail: student.email,
    Phone: student.phone,
    Birthday: student.dateOfBirth,
    IsActive: student.status !== "inactive",
    parentContact: student.emergencyContact,
    allergies: student.allergies,
    medicalConditions: student.medicalConditions,
  };

  return bPartner;
}

// =============================================================================
// Invoice Transformations
// =============================================================================

/**
 * Determine invoice status based on payment and due date
 */
function getInvoiceStatus(invoice: Invoice): SchoolInvoice["status"] {
  if (invoice.IsPaid) return "Paid";
  if (invoice.DocStatus === "VO") return "Cancelled";

  // If no DateInvoiced, default to Pending
  if (!invoice.DateInvoiced) return "Pending";

  const dueDate = new Date(invoice.DateInvoiced);
  const now = new Date();

  // Add 30 days to invoice date as due date (or use actual due date if available)
  dueDate.setDate(dueDate.getDate() + 30);

  if (now > dueDate) return "Overdue";
  return "Pending";
}

/**
 * Format date to ISO string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0] ?? dateString;
}

/**
 * Transform iDempiere Invoice to SchoolInvoice
 */
export function transformInvoiceToSchoolInvoice(invoice: Invoice): SchoolInvoice {
  return {
    id: invoice.DocumentNo ?? invoice.C_Invoice_ID?.toString() ?? "",
    invoiceNo: invoice.DocumentNo ?? invoice.C_Invoice_ID?.toString() ?? "",
    studentId: invoice.C_BPartner?.Value ?? invoice.C_BPartner_ID?.toString() ?? "",
    studentName: invoice.C_BPartner?.Name ?? "Unknown",
    amount: invoice.GrandTotal ?? 0,
    dueDate: invoice.DateInvoiced ? formatDate(invoice.DateInvoiced) : (new Date().toISOString().split("T")[0] ?? ""),
    status: getInvoiceStatus(invoice),
    items: [], // Invoice lines would need separate query
    C_Invoice_ID: invoice.C_Invoice_ID ?? invoice.id,
  };
}

/**
 * Transform array of Invoices to SchoolInvoices
 */
export function transformInvoicesToSchoolInvoices(invoices: Invoice[]): SchoolInvoice[] {
  return invoices.map(transformInvoiceToSchoolInvoice);
}

// =============================================================================
// Payment Transformations
// =============================================================================

/**
 * Map tender type to payment method
 */
function mapPaymentMethod(tenderType?: string): SchoolPayment["method"] {
  const typeMap: Record<string, SchoolPayment["method"]> = {
    K: "Credit Card", // Credit Card
    A: "E-Wallet", // Account (Bank transfer/E-wallet)
    C: "Cash", // Cash
    D: "Credit Card", // Direct Debit
    T: "E-Wallet", // Transfer
    M: "Credit Card", // Mobile Payment
  };

  return typeMap[tenderType ?? ""] ?? "Virtual Account";
}

/**
 * Get payment status from doc status
 */
function getPaymentStatus(isApproved: boolean, docStatus: string): SchoolPayment["status"] {
  if (docStatus === "VO") return "Failed";
  if (!isApproved) return "Pending";
  return "Completed";
}

/**
 * Generate transaction ID from payment ID
 */
function generateTransactionId(payment: Payment): string {
  const dateTrx = payment.DateTrx ?? new Date().toISOString();
  const paymentId = payment.C_Payment_ID ?? payment.id ?? 0;
  return `TXN-${dateTrx}-${paymentId}`;
}

/**
 * Transform iDempiere Payment to SchoolPayment
 */
export function transformPaymentToSchoolPayment(payment: Payment): SchoolPayment {
  return {
    id: generateTransactionId(payment),
    transactionId: payment.DocumentNo ?? payment.C_Payment_ID?.toString() ?? "",
    invoiceId: payment.C_Invoice?.DocumentNo ?? payment.C_Invoice?.id?.toString(),
    amount: payment.PayAmt ?? 0,
    method: mapPaymentMethod(payment.TenderType),
    status: getPaymentStatus(payment.IsApproved ?? false, payment.DocStatus ?? ""),
    timestamp: payment.DateTrx ?? new Date().toISOString(),
    studentId: payment.C_BPartner?.Value ?? payment.C_BPartner_ID?.toString(),
    studentName: payment.C_BPartner?.Name,
  };
}

/**
 * Transform array of Payments to SchoolPayments
 */
export function transformPaymentsToSchoolPayments(payments: Payment[]): SchoolPayment[] {
  return payments.map(transformPaymentToSchoolPayment);
}

// =============================================================================
// Asset Transformations
// =============================================================================

/**
 * Get asset category from product or asset group
 */
function getAssetCategory(_asset: Asset): string {
  const _categoryMap: Record<string, string> = {
    Electronics: "Electronics",
    Furniture: "Furniture",
    Equipment: "Equipment",
    Vehicle: "Vehicles",
    Software: "Electronics",
  };

  // This would need to be mapped from A_Asset_Group or M_Product_Category
  return "Equipment"; // Default, would need proper mapping
}

/**
 * Get asset condition from status
 */
function getAssetCondition(asset: Asset): SchoolAsset["condition"] {
  if (!asset.IsActive) return "Retired";
  if (asset.A_Asset_Status === "DE") return "Retired"; // Depreciated
  if (asset.A_Asset_Status === "AC") return "Excellent"; // Active new
  if (asset.A_Asset_Status === "DI") return "Poor"; // Disposed

  // Default based on age
  if (asset.AssetDepreciationDate) {
    const depreciationDate = new Date(asset.AssetDepreciationDate);
    const now = new Date();
    const ageInYears = (now.getTime() - depreciationDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (ageInYears < 1) return "Excellent";
    if (ageInYears < 3) return "Good";
    if (ageInYears < 5) return "Fair";
    return "Poor";
  }

  return "Good";
}

/**
 * Transform iDempiere Asset to SchoolAsset
 */
export function transformAssetToSchoolAsset(asset: Asset): SchoolAsset {
  return {
    id: asset.Value,
    name: asset.Name,
    category: getAssetCategory(asset),
    condition: getAssetCondition(asset),
    location: asset.LocationComment ?? "Unknown",
    purchaseDate: asset.AssetServiceDate
      ? formatDate(asset.AssetServiceDate)
      : (new Date().toISOString().split("T")[0] ?? ""),
    currentValue: 0, // Would need depreciation calculation
    warrantyExpiry: asset.AssetDepreciationDate ? formatDate(asset.AssetDepreciationDate) : undefined,
    A_Asset_ID: asset.A_Asset_ID,
  };
}

/**
 * Transform array of Assets to SchoolAssets
 */
export function transformAssetsToSchoolAssets(assets: Asset[]): SchoolAsset[] {
  return assets.map(transformAssetToSchoolAsset);
}

// =============================================================================
// Product (Library Book) Transformations
// =============================================================================

/**
 * Get book status from product or custom field
 * Since Product doesn't have status, this would need to be derived from other tables
 */
function getBookStatus(): LibraryBook["status"] {
  return "Available"; // Default, would need actual tracking from borrowing records
}

/**
 * Get book category from product category
 */
function getBookCategory(productCategory?: string): string {
  const categoryMap: Record<string, string> = {
    Fiction: "Fiction",
    "Non-Fiction": "Non-Fiction",
    Reference: "Reference",
    Textbook: "Textbook",
    Periodical: "Periodical",
    Educational: "Textbook",
  };

  if (!productCategory) return "Non-Fiction";

  return categoryMap[productCategory] ?? productCategory;
}

/**
 * Transform iDempiere Product to LibraryBook
 */
export function transformProductToLibraryBook(product: Product): LibraryBook {
  return {
    id: product.Value,
    title: product.Name,
    author: product.Description ?? "Unknown", // Description might contain author
    isbn: product.UPC || product.SKU,
    category: getBookCategory(product.M_Product_Category_ID?.toString()),
    status: getBookStatus(),
    location: "Library", // Would need actual location tracking
    pages: product.PageCount,
    language: product.Language,
    publisher: product.Help, // Help field might contain publisher info
    M_Product_ID: product.M_Product_ID,
  };
}

/**
 * Transform array of Products to LibraryBooks
 */
export function transformProductsToLibraryBooks(products: Product[]): LibraryBook[] {
  return products.map(transformProductToLibraryBook);
}

// =============================================================================
// Generic Utility Functions
// =============================================================================

/**
 * Transform paginated iDempiere response to standard paginated format
 */
export function transformPaginatedResponse<T, U>(
  response: {
    records?: T[];
    page?: number;
    pageSize?: number;
    totalPages?: number;
    totalRecords?: number;
  },
  transformer: (item: T) => U,
): {
  records: U[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
} {
  return {
    records: response.records?.map(transformer) ?? [],
    page: response.page ?? 1,
    pageSize: response.pageSize ?? IDEMPIERE_CONFIG.defaultPageSize,
    totalPages: response.totalPages ?? 1,
    totalRecords: response.totalRecords ?? 0,
  };
}

/**
 * Filter students by grade
 */
export function filterStudentsByGrade(students: Student[], grade: string): Student[] {
  if (grade === "all") return students;

  return students.filter((student) => {
    const normalizedGrade = student.grade.toLowerCase().replace(/\s+/g, "");
    const searchGrade = grade.toLowerCase().replace(/\s+/g, "");

    return normalizedGrade.includes(searchGrade) || searchGrade.includes(normalizedGrade);
  });
}

/**
 * Filter students by search term
 */
export function filterStudentsBySearch(students: Student[], searchTerm: string): Student[] {
  if (!searchTerm.trim()) return students;

  const term = searchTerm.trim().toLowerCase();

  return students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.id.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term),
  );
}
