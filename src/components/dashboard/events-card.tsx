import { Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface EventsCardProps {
  events: Event[];
  className?: string;
}

export function EventsCard({ events, className }: EventsCardProps) {
  return (
    <div className={className}>
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="space-y-2">
            <h4 className="font-semibold leading-none">{event.title}</h4>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <p className="text-muted-foreground text-sm">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
