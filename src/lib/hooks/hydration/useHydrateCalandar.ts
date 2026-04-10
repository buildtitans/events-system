"use client";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";

export type CalendarLookup = Map<string, Set<EventSchemaType["status"]>>;

export function useHydrateCalendar(
  events: EventsArraySchemaType,
): CalendarLookup {
  return useMemo(() => {
    const lookup: CalendarLookup = new Map();

    for (const event of events) {
      const dayKey = dayjs(event.starts_at_ms).format("YYYY-MM-DD");
      const statusesForDay = lookup.get(dayKey);

      if (statusesForDay) {
        statusesForDay.add(event.status);
      } else {
        lookup.set(dayKey, new Set([event.status]));
      }
    }

    return lookup;
  }, [events]);
}
