import { Bell } from "lucide-react";

interface ActivityItem {
  id: string;
  message: string;
  time: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm leading-none">{activity.message}</p>
              <p className="text-muted-foreground text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
