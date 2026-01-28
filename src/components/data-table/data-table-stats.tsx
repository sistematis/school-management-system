// src/components/data-table/data-table-stats.tsx

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export interface StatCard {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  change?: number; // Optional: +5, -3, etc.
  changeType?: "increase" | "decrease" | "neutral";
}

export interface DataTableStatsProps {
  stats: StatCard[];
  isLoading?: boolean;
}

export function DataTableStats({ stats, isLoading }: DataTableStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <p
                  className={`text-xs ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : stat.changeType === "decrease"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
