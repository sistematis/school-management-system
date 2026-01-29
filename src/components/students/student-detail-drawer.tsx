// src/components/students/student-detail-drawer.tsx

"use client";

import type * as React from "react";

import {
  AtSign,
  Ban,
  Banknote,
  Building2,
  Cake,
  Calendar,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ADUser } from "@/lib/api/idempiere/models/ad-user/ad-user.types";
import type { BusinessPartner, CBPartnerLocation, CBPBankAccount } from "@/lib/api/idempiere/models/c-bpartner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

interface StudentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: BusinessPartner | null;
  isLoading?: boolean;
}

// =============================================================================
// Helper Components
// =============================================================================

/**
 * Info row component for displaying key-value pairs
 */
function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 py-1.5", className)}>
      <Icon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium truncate">{value || "-"}</span>
      </div>
    </div>
  );
}

/**
 * Section header component
 */
function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <span className="font-semibold">{title}</span>
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      )}
    </div>
  );
}

/**
 * Contact card component
 */
function ContactCard({ contact }: { contact: ADUser }) {
  return (
    <Card className="border-muted/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {contact.Name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <CardTitle className="text-sm truncate">{contact.Name}</CardTitle>
            {contact.Value && <CardDescription className="text-xs truncate">@{contact.Value}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {contact.EMail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 text-muted-foreground shrink-0" />
            <a href={`mailto:${contact.EMail}`} className="text-primary hover:underline truncate">
              {contact.EMail}
            </a>
          </div>
        )}
        {contact.Phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-3.5 text-muted-foreground shrink-0" />
            <a href={`tel:${contact.Phone}`} className="text-primary hover:underline truncate">
              {contact.Phone}
            </a>
          </div>
        )}
        {contact.Birthday && (
          <div className="flex items-center gap-2 text-sm">
            <Cake className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{new Date(contact.Birthday).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Location card component
 */
function LocationCard({ location }: { location: CBPartnerLocation }) {
  const loc = location.C_Location_ID;

  // Use identifier from API response which contains formatted full address
  // Format: "Address 1, Address 2, Address 3, Address 4, City, Postal"
  const fullAddress = loc.identifier || "";

  // Fallback: build address from individual fields if identifier is empty
  const fallbackAddress = [
    loc.Address1,
    loc.Address2,
    loc.Address3,
    loc.Address4,
    loc.City,
    loc.Postal,
    loc.C_Country_ID?.identifier,
  ]
    .filter(Boolean)
    .join(", ");

  const displayAddress = fullAddress || fallbackAddress || "No address information";

  return (
    <Card className="border-muted/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm">{location.Name || "Address"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {/* Full address from identifier (pre-formatted by iDempiere) */}
        <p className="text-sm whitespace-pre-line">{displayAddress}</p>

        {/* Show country as badge if available */}
        {loc.C_Country_ID && !fullAddress && (
          <Badge variant="secondary" className="text-xs">
            {loc.C_Country_ID.identifier}
          </Badge>
        )}

        {/* Additional location info if available */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {location.IsBillTo && (
            <Badge variant="outline" className="text-xs">
              Bill To
            </Badge>
          )}
          {location.IsShipTo && (
            <Badge variant="outline" className="text-xs">
              Ship To
            </Badge>
          )}
          {location.IsPayFrom && (
            <Badge variant="outline" className="text-xs">
              Pay From
            </Badge>
          )}
          {location.IsRemitTo && (
            <Badge variant="outline" className="text-xs">
              Remit To
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Bank account card component
 */
function BankAccountCard({ account }: { account: CBPBankAccount }) {
  // Determine account type: Credit Card or Bank Account
  const isCreditCard = !!account.CreditCardNumber && account.CreditCardNumber.length > 0;

  // Mask credit card number or show bank account
  const maskedNumber = isCreditCard
    ? `**** **** **** ${account.CreditCardNumber?.slice(-4) || "****"}`
    : account.BankAccount || "-";

  // Get card type display
  const cardTypeDisplay = account.CreditCardType?.identifier || "N/A";

  // Get account usage display
  const accountUsageDisplay = account.BPBankAcctUse?.identifier || "N/A";

  // Format expiration date
  const hasExpiration = account.CreditCardExpMM > 0 || account.CreditCardExpYY > 0;
  const expirationDisplay =
    account.CreditCardExpMM > 0 && account.CreditCardExpYY > 0
      ? `${String(account.CreditCardExpMM).padStart(2, "0")}/${account.CreditCardExpYY}`
      : hasExpiration
        ? "Incomplete"
        : null;

  return (
    <Card className="border-muted/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <div className="flex flex-col min-w-0 flex-1">
            <CardTitle className="text-sm truncate">{account.A_Name || "Bank Account"}</CardTitle>
            {account.AD_User_ID && (
              <CardDescription className="text-xs truncate">For: {account.AD_User_ID.identifier}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {/* Account / Card Number */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{isCreditCard ? "Card Number" : "Account Number"}</p>
          <p className="text-sm font-mono font-medium">{maskedNumber}</p>
        </div>

        {/* Card Type (for credit cards) */}
        {isCreditCard && account.CreditCardType && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Card Type</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {cardTypeDisplay}
              </Badge>
            </div>
          </div>
        )}

        {/* Expiration Date (for credit cards) */}
        {expirationDisplay && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Expires</p>
            <p className="text-sm">{expirationDisplay}</p>
          </div>
        )}

        {/* Account Usage */}
        {account.BPBankAcctUse && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Usage</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {accountUsageDisplay}
              </Badge>
            </div>
          </div>
        )}

        {/* Bank Address (if available) */}
        {(account.A_Address || account.A_City) && (
          <div className="space-y-1 pt-2 border-t">
            <p className="text-xs text-muted-foreground">Bank Address</p>
            <p className="text-sm">
              {[account.A_Address, account.A_City, account.A_Zip, account.A_Country].filter(Boolean).join(", ") || "-"}
            </p>
          </div>
        )}

        {/* Bank Contact (if available) */}
        {account.A_Phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-3.5 text-muted-foreground shrink-0" />
            <a href={`tel:${account.A_Phone}`} className="text-primary hover:underline truncate">
              {account.A_Phone}
            </a>
          </div>
        )}

        {account.A_EMail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 text-muted-foreground shrink-0" />
            <a href={`mailto:${account.A_EMail}`} className="text-primary hover:underline truncate">
              {account.A_EMail}
            </a>
          </div>
        )}

        {/* ACH Payment indicator */}
        {account.IsACH && (
          <Badge variant="outline" className="text-xs">
            ACH Enabled
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Student Detail Drawer Component
 * Displays student information with expanded relations in a drawer
 */
export function StudentDetailDrawer({ open, onOpenChange, student, isLoading = false }: StudentDetailDrawerProps) {
  const contacts = student?.ad_user ?? [];
  const locations = student?.c_bpartner_location ?? [];
  const bankAccounts = student?.c_bp_bankaccount ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-md sm:border-l">
        {/* Header */}
        <SheetHeader className="flex-shrink-0 px-6 py-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-lg">
                {student?.Name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <SheetTitle className="text-lg truncate">{student?.Name ?? "Student Details"}</SheetTitle>
                <SheetDescription className="truncate">{student?.Value ?? "ID: -"}</SheetDescription>
              </div>
            </div>
          </div>

          {/* Status badges */}
          {student && (
            <div className="flex flex-wrap gap-2 mt-4">
              {student.IsActive ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Inactive
                </Badge>
              )}
              {student.IsCustomer && (
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  Student
                </Badge>
              )}
              {student.IsEmployee && (
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  Employee
                </Badge>
              )}
              {student.IsVendor && (
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  Vendor
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : !student ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <User className="size-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No student data available</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={["item-business-partner"]} className="space-y-4">
              {/* Business Partner (Level 0) */}
              <AccordionItem
                value="item-business-partner"
                className="border rounded-lg px-4 data-[state=closed]:border-muted/50"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={Building2} title="Business Partner" />
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-1">
                  <InfoRow icon={User} label="Full Name" value={student.Name} />
                  {student.Name2 && <InfoRow icon={User} label="Name 2" value={student.Name2} />}
                  <InfoRow icon={AtSign} label="Student ID" value={student.Value} />
                  {student.EMail && (
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={
                        <a href={`mailto:${student.EMail}`} className="text-primary hover:underline">
                          {student.EMail}
                        </a>
                      }
                    />
                  )}
                  {student.Birthday && (
                    <InfoRow icon={Cake} label="Birthday" value={new Date(student.Birthday).toLocaleDateString()} />
                  )}
                  <InfoRow icon={Users} label="BP Group" value={student.C_BP_Group_ID?.identifier} />
                  <InfoRow icon={Calendar} label="Created" value={new Date(student.Created).toLocaleDateString()} />
                  <InfoRow icon={Calendar} label="Updated" value={new Date(student.Updated).toLocaleDateString()} />
                  {student.Description && (
                    <div className="pt-2 mt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{student.Description}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Contacts (Level 1) */}
              <AccordionItem
                value="item-contacts"
                className="border rounded-lg px-4 data-[state=closed]:border-muted/50"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={Phone} title="Contacts" count={contacts.length} />
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  {contacts.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Ban className="size-4" />
                      <span>No contacts found</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Locations (Level 1) */}
              <AccordionItem
                value="item-locations"
                className="border rounded-lg px-4 data-[state=closed]:border-muted/50"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={MapPin} title="Locations" count={locations.length} />
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  {locations.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Ban className="size-4" />
                      <span>No locations found</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {locations.map((location) => (
                        <LocationCard key={location.id} location={location} />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Bank Accounts (Level 1) */}
              <AccordionItem
                value="item-bank-accounts"
                className="border rounded-lg px-4 data-[state=closed]:border-muted/50"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <SectionHeader icon={Banknote} title="Bank Accounts" count={bankAccounts.length} />
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  {bankAccounts.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Ban className="size-4" />
                      <span>No bank accounts found</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bankAccounts.map((account) => (
                        <BankAccountCard key={account.id} account={account} />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t px-6 py-4 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button size="sm" className="gap-2">
            Edit Student
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
