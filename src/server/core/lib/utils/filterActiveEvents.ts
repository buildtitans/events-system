import { EventSchemaType } from "../../../../schemas/events/eventSchema";

export function filterActiveEvents(events: EventSchemaType[]) {
  const activeEvents: EventSchemaType[] = [];

  for (const event of events) {
    const startsAt = new Date(event.starts_at).getTime();
    const now = Date.now();

    if (startsAt > now && event.status === "scheduled") {
      activeEvents.push(event);
    }
  }
  return activeEvents;
}
