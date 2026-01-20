import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className={cn("flex h-screen overflow-hidden", className)}>{children}</div>;
}

interface DashboardContentProps {
  children: ReactNode;
  className?: string;
}

export function DashboardContent({ children, className }: DashboardContentProps) {
  return <main className={cn("flex-1 overflow-y-auto bg-background p-6", className)}>{children}</main>;
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function DashboardHeader({ title, description, className }: DashboardHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-1", className)}>
      <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
