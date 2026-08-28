import { EventAttendantsSchemaType } from "../../../../schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "../../../../schemas/events/eventSchema";

export function filterActiveRecords(
  events: EventSchemaType[],
  records: EventAttendantsSchemaType[],
): EventAttendantsSchemaType[] {
  const activeEvents: EventSchemaType[] = [];
  const activeRecords: EventAttendantsSchemaType[] = [];

  for (const event of events) {
    const startsAt = new Date(event.starts_at).getTime();
    const now = Date.now();

    if (startsAt > now) {
      activeEvents.push(event);
    }
  }

  for (const record of records) {
    const activeId: EventSchemaType | undefined = activeEvents.find(
      (event) => event.id === record.event_id,
    );

    if (activeId) {
      activeRecords.push(record);
    }
  }

  return activeRecords;
}
