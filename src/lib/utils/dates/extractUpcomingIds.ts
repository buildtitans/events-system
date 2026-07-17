import { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type UpcomingEventIds = EventSchemaType["id"][];

const WINDOW = 30 * 24 * 60 * 60 * 1000;

export function extractUpcomingIds(events: EventSchemaType[]) {
  const nowMs = Date.now();
  return extractUpcoming(events, nowMs);
}

function extractUpcoming(events: EventSchemaType[], nowMs: number) {
  const results: EventSchemaType["id"][] = [];

  for (const event of events) {
    const upcomingEvent = isUpcoming(event, nowMs);
    if (upcomingEvent) {
      results.push(event.id);
    }
  }
  return results;
}

function isUpcoming(event: EventSchemaType, nowMs: number): boolean {
  const windowEndMs = nowMs + WINDOW;
  const starts_at_ms = event.starts_at_ms;
  return starts_at_ms >= nowMs && starts_at_ms <= windowEndMs;
}
