import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";

export function sortByDate(
  events: EventsArraySchemaType,
): EventsArraySchemaType {
  const sorted = events.sort((a, b) => {
    const curr = new Date(a.starts_at);

    const next = new Date(b.starts_at);

    return next.getTime() - curr.getTime();
  });

  return sorted;
}
