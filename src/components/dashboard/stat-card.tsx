import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp = true, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium text-muted-foreground text-sm">{title}</p>
          <h3 className="font-bold text-3xl tracking-tight">{value}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Icon className={cn("h-4 w-4", trendUp ? "text-green-600" : "text-red-600")} />
            <p className={cn(trendUp ? "text-green-600" : "text-red-600", "font-medium")}>{trend}</p>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
