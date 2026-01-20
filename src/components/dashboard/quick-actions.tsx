import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-4", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.id}
            href={action.href}
            className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 text-center transition-colors hover:bg-accent"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-sm">{action.label}</span>
          </a>
        );
      })}
    </div>
  );
}
