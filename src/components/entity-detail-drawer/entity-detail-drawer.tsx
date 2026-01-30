// src/components/entity-detail-drawer/entity-detail-drawer.tsx

"use client";

import type * as React from "react";

import { Ban, type LucideIcon } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

/**
 * Status badge configuration
 */
export interface StatusBadge {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
  color?: string;
  show: boolean;
}

/**
 * Info row configuration
 */
export interface InfoRowConfig {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * Section configuration for the accordion
 */
export interface DetailSectionConfig {
  value: string;
  title: string;
  icon: LucideIcon;
  count?: number;
  renderContent: () => React.ReactNode;
}

/**
 * Header configuration
 */
export interface EntityHeaderConfig<T> {
  title: string;
  subtitle?: string;
  avatarLetter?: string;
  statusBadges?: StatusBadge[];
  renderContent?: (entity: T) => React.ReactNode;
}

/**
 * Footer action button configuration
 */
export interface FooterAction {
  label: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Props for the generic EntityDetailDrawer
 */
export interface EntityDetailDrawerProps<T = unknown> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: T | null;
  isLoading?: boolean;
  header: EntityHeaderConfig<T>;
  sections: DetailSectionConfig[];
  footerActions?: FooterAction[];
  className?: string;
}

// =============================================================================
// Helper Components
// =============================================================================

/**
 * Info row component for displaying key-value pairs
 */
export function InfoRow({ icon: Icon, label, value, className }: InfoRowConfig) {
  return (
    <div className={cn("flex items-start gap-3 py-1.5", className)}>
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="truncate font-medium text-sm">{value || "-"}</span>
      </div>
    </div>
  );
}

/**
 * Section header component
 */
export function SectionHeader({ icon: Icon, title, count }: { icon: LucideIcon; title: string; count?: number }) {
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
 * Default empty state component
 */
function _DefaultEmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm">
      <Ban className="size-4" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Generic card component for displaying items
 */
export function DetailCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-muted/50", className)}>
      <CardHeader className="p-4 pb-2">
        {Icon && (
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
        )}
        {!Icon && typeof title === "string" && <CardTitle className="text-sm">{title}</CardTitle>}
        {!Icon && typeof title !== "string" && title}
        {description && <CardDescription className="truncate text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2">{children}</CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Generic Entity Detail Drawer Component
 * Displays any entity information with configurable sections in a drawer
 */
export function EntityDetailDrawer<T = unknown>({
  open,
  onOpenChange,
  entity,
  isLoading = false,
  header,
  sections,
  footerActions,
  className,
}: EntityDetailDrawerProps<T>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("flex w-full flex-col gap-0 overflow-hidden sm:max-w-md sm:border-l", className)}
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 border-b px-6 py-4">
          {header.renderContent && entity ? (
            header.renderContent(entity)
          ) : (
            <DefaultHeader
              title={header.title}
              subtitle={header.subtitle}
              avatarLetter={header.avatarLetter}
              statusBadges={header.statusBadges}
            />
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="text-muted-foreground text-sm">Loading...</div>
            </div>
          ) : !entity ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <Ban className="mb-2 size-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No data available</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {sections.map((section) => (
                <AccordionItem
                  key={section.value}
                  value={section.value}
                  className="rounded-lg border px-4 data-[state=closed]:border-muted/50"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <SectionHeader icon={section.icon} title={section.title} count={section.count} />
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">{section.renderContent()}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Footer */}
        {footerActions && footerActions.length > 0 && (
          <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
            {footerActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.onClick}
                className={action.icon ? "gap-2" : undefined}
              >
                {action.icon && <action.icon className="size-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/**
 * Default header component
 */
function DefaultHeader({
  title,
  subtitle,
  avatarLetter,
  statusBadges = [],
}: {
  title: string;
  subtitle?: string;
  avatarLetter?: string;
  statusBadges?: StatusBadge[];
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-lg text-primary">
            {avatarLetter ?? "?"}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <SheetTitle className="truncate text-lg">{title}</SheetTitle>
            {subtitle && <SheetDescription className="truncate">{subtitle}</SheetDescription>}
          </div>
        </div>
      </div>

      {/* Status badges */}
      {statusBadges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {statusBadges.map(
            (badge) =>
              badge.show && (
                <Badge key={badge.label} variant={badge.variant || "secondary"} className={badge.color}>
                  {badge.label}
                </Badge>
              ),
          )}
        </div>
      )}
    </>
  );
}
