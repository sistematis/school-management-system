// src/components/students/student-detail-drawer.tsx

"use client";

import {
  AtSign,
  Banknote,
  Building2,
  Cake,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";

import {
  type DetailSectionConfig,
  EntityDetailDrawer,
  type EntityHeaderConfig,
  InfoRow,
  type InfoRowConfig,
} from "@/components/entity-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ADUser } from "@/lib/api/idempiere/models/ad-user/ad-user.types";
import type { BusinessPartner, CBPartnerLocation, CBPBankAccount } from "@/lib/api/idempiere/models/c-bpartner";

// =============================================================================
// Types
// =============================================================================

interface StudentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: BusinessPartner | null;
  isLoading?: boolean;
  onEdit?: () => void;
}

// =============================================================================
// Domain-Specific Helper Components
// =============================================================================

/**
 * Contact card component for ADUser
 */
function ContactCard({ contact }: { contact: ADUser }) {
  return (
    <Card className="border-muted/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
            {contact.Name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <CardTitle className="truncate text-sm">{contact.Name}</CardTitle>
            {contact.Value && <CardDescription className="truncate text-xs">@{contact.Value}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2">
        {contact.EMail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
            <a href={`mailto:${contact.EMail}`} className="truncate text-primary hover:underline">
              {contact.EMail}
            </a>
          </div>
        )}
        {contact.Phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
            <a href={`tel:${contact.Phone}`} className="truncate text-primary hover:underline">
              {contact.Phone}
            </a>
          </div>
        )}
        {contact.Birthday && (
          <div className="flex items-center gap-2 text-sm">
            <Cake className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{new Date(contact.Birthday).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Location card component for CBPartnerLocation
 */
function LocationCard({ location }: { location: CBPartnerLocation }) {
  const loc = location.C_Location_ID;

  const fullAddress = loc.identifier || "";
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
      <CardContent className="space-y-2 p-4 pt-2">
        <p className="whitespace-pre-line text-sm">{displayAddress}</p>

        {loc.C_Country_ID && !fullAddress && (
          <Badge variant="secondary" className="text-xs">
            {loc.C_Country_ID.identifier}
          </Badge>
        )}

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
 * Bank account card component for CBPBankAccount
 */
function BankAccountCard({ account }: { account: CBPBankAccount }) {
  const isCreditCard = !!account.CreditCardNumber && account.CreditCardNumber.length > 0;
  const maskedNumber = isCreditCard
    ? `**** **** **** ${account.CreditCardNumber?.slice(-4) || "****"}`
    : account.BankAccount || "-";

  const cardTypeDisplay = account.CreditCardType?.identifier || "N/A";
  const accountUsageDisplay = account.BPBankAcctUse?.identifier || "N/A";

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
          <div className="flex min-w-0 flex-1 flex-col">
            <CardTitle className="truncate text-sm">{account.A_Name || "Bank Account"}</CardTitle>
            {account.AD_User_ID && (
              <CardDescription className="truncate text-xs">For: {account.AD_User_ID.identifier}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">{isCreditCard ? "Card Number" : "Account Number"}</p>
          <p className="font-medium font-mono text-sm">{maskedNumber}</p>
        </div>

        {isCreditCard && account.CreditCardType && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Card Type</p>
            <Badge variant="outline" className="text-xs">
              {cardTypeDisplay}
            </Badge>
          </div>
        )}

        {expirationDisplay && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Expires</p>
            <p className="text-sm">{expirationDisplay}</p>
          </div>
        )}

        {account.BPBankAcctUse && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Usage</p>
            <Badge variant="secondary" className="text-xs">
              {accountUsageDisplay}
            </Badge>
          </div>
        )}

        {(account.A_Address || account.A_City) && (
          <div className="space-y-1 border-t pt-2">
            <p className="text-muted-foreground text-xs">Bank Address</p>
            <p className="text-sm">
              {[account.A_Address, account.A_City, account.A_Zip, account.A_Country].filter(Boolean).join(", ") || "-"}
            </p>
          </div>
        )}

        {account.A_Phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
            <a href={`tel:${account.A_Phone}`} className="truncate text-primary hover:underline">
              {account.A_Phone}
            </a>
          </div>
        )}

        {account.A_EMail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
            <a href={`mailto:${account.A_EMail}`} className="truncate text-primary hover:underline">
              {account.A_EMail}
            </a>
          </div>
        )}

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
 *
 * This component is a wrapper around the generic EntityDetailDrawer,
 * configured specifically for Student (Business Partner) entities.
 */
export function StudentDetailDrawer({
  open,
  onOpenChange,
  student,
  isLoading = false,
  onEdit,
}: StudentDetailDrawerProps) {
  const contacts = student?.ad_user ?? [];
  const locations = student?.c_bpartner_location ?? [];
  const bankAccounts = student?.c_bp_bankaccount ?? [];

  // Configure header
  const header: EntityHeaderConfig<BusinessPartner> = {
    title: student?.Name ?? "Student Details",
    subtitle: student?.Value ?? "ID: -",
    avatarLetter: student?.Name?.charAt(0).toUpperCase(),
    statusBadges: student
      ? [
          {
            label: student.IsActive ? "Active" : "Inactive",
            variant: student.IsActive ? "default" : "secondary",
            color: student.IsActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800",
            show: true,
          },
          {
            label: "Student",
            variant: "outline",
            color: "border-blue-200 text-blue-700",
            show: student.IsCustomer,
          },
          {
            label: "Employee",
            variant: "outline",
            color: "border-purple-200 text-purple-700",
            show: student.IsEmployee,
          },
          {
            label: "Vendor",
            variant: "outline",
            color: "border-orange-200 text-orange-700",
            show: student.IsVendor,
          },
        ]
      : [],
  };

  // Configure sections
  const sections: DetailSectionConfig[] = [
    {
      value: "item-business-partner",
      title: "Business Partner",
      icon: Building2,
      renderContent: () => {
        const infoRows: InfoRowConfig[] = [
          { icon: User, label: "Full Name", value: student?.Name },
          ...(student?.Name2 ? [{ icon: User, label: "Name 2", value: student.Name2 }] : []),
          { icon: AtSign, label: "Student ID", value: student?.Value },
          ...(student?.EMail
            ? [
                {
                  icon: Mail,
                  label: "Email",
                  value: (
                    <a href={`mailto:${student.EMail}`} className="text-primary hover:underline">
                      {student.EMail}
                    </a>
                  ),
                },
              ]
            : []),
          ...(student?.Birthday
            ? [
                {
                  icon: Cake,
                  label: "Birthday",
                  value: new Date(student.Birthday).toLocaleDateString(),
                },
              ]
            : []),
          { icon: Users, label: "BP Group", value: student?.C_BP_Group_ID?.identifier },
          {
            icon: Calendar,
            label: "Created",
            value: student?.Created ? new Date(student.Created).toLocaleDateString() : "",
          },
          {
            icon: Calendar,
            label: "Updated",
            value: student?.Updated ? new Date(student.Updated).toLocaleDateString() : "",
          },
        ];

        return (
          <div className="space-y-1">
            {infoRows.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
            {student?.Description && (
              <div className="mt-2 border-t pt-2">
                <p className="mb-1 text-muted-foreground text-xs">Description</p>
                <p className="text-sm">{student.Description}</p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      value: "item-contacts",
      title: "Contacts",
      icon: Phone,
      count: contacts.length,
      renderContent: () => {
        if (contacts.length === 0) {
          return <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm">No contacts found</div>;
        }
        return (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        );
      },
    },
    {
      value: "item-locations",
      title: "Locations",
      icon: MapPin,
      count: locations.length,
      renderContent: () => {
        if (locations.length === 0) {
          return <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm">No locations found</div>;
        }
        return (
          <div className="space-y-3">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        );
      },
    },
    {
      value: "item-bank-accounts",
      title: "Bank Accounts",
      icon: Banknote,
      count: bankAccounts.length,
      renderContent: () => {
        if (bankAccounts.length === 0) {
          return (
            <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm">No bank accounts found</div>
          );
        }
        return (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <BankAccountCard key={account.id} account={account} />
            ))}
          </div>
        );
      },
    },
  ];

  // Configure footer actions
  const footerActions = [
    {
      label: "Close",
      variant: "outline" as const,
      onClick: () => onOpenChange(false),
    },
    ...(onEdit
      ? [
          {
            label: "Edit Student",
            variant: "default" as const,
            onClick: onEdit,
          },
        ]
      : []),
  ];

  return (
    <EntityDetailDrawer<BusinessPartner>
      open={open}
      onOpenChange={onOpenChange}
      entity={student}
      isLoading={isLoading}
      header={header}
      sections={sections}
      footerActions={footerActions}
    />
  );
}
