import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";

export function sortByDate(
  events: GroupEventSummarySchemaType[],
): GroupEventSummarySchemaType[] {
  return events.sort((a, b) => b.event.starts_at_ms - a.event.starts_at_ms);
}
