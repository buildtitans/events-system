import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

export function filterRsvps(records: EventAttendantsSchemaType[]): string[] {
  const rsvps: string[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const status = records[i].status;

    if (status === "going" || status === "interested")
      rsvps.push(record.event_id);
  }

  return rsvps;
}
