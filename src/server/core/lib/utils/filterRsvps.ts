import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type StatusLookupType = Record<
  EventSchemaType["id"],
  EventAttendantsSchemaType["status"]
>;

export function filterUserRsvps(
  records: EventAttendantsSchemaType[],
): StatusLookupType {
  const test: Record<
    EventSchemaType["id"],
    EventAttendantsSchemaType["status"]
  > = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const status = records[i].status;

    if (status === "going" || status === "interested")
      test[record.event_id] = record.status;
  }

  return test;
}
