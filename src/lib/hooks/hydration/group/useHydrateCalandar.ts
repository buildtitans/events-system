"use client";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  GroupEventSummarySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";

export type CalendarLookup = Map<string, Set<EventSchemaType["status"]>>;

export function useHydrateCalendar(
  events: GroupEventSummarySchemaType[],
): CalendarLookup {
  return useMemo(() => {
    const lookup: CalendarLookup = new Map();

    for (const el of events) {
      const dayKey = dayjs(el.event.starts_at_ms).format("YYYY-MM-DD");
      const statusesForDay = lookup.get(dayKey);

      if (statusesForDay) {
        statusesForDay.add(el.event.status);
      } else {
        lookup.set(dayKey, new Set([el.event.status]));
      }
    }

    return lookup;
  }, [events]);
}
