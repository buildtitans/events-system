"use client";
import { useMemo } from "react";
import dayjs from "dayjs";
import { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";

export type CalendarLookup = Map<string, TimelineElementSchemaType>;

export function useHydrateCalendar(
  events: TimelineElementSchemaType[],
): CalendarLookup {
  return useMemo(() => {
    const lookup: CalendarLookup = new Map();

    for (const el of events) {
      const dayKey = dayjs(el.event.starts_at_ms).format("YYYY-MM-DD");
      lookup.set(dayKey, el);
    }

    return lookup;
  }, [events]);
}
