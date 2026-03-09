"use client";
import { useMemo } from "react";
import dayjs from "dayjs";
import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";

export function useHydrateCalendar(events: EventsArraySchemaType): Set<string> {
  return useMemo(() => {
    return new Set(
      events.map((event) => dayjs(event.starts_at_ms).format("YYYY-MM-DD")),
    );
  }, [events]);
}
