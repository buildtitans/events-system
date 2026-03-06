import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type AttendanceDictionaryType = Record<
  EventAttendantsSchemaType["event_id"],
  EventAttendantsSchemaType["status"]
>;

export function mapAttendanceDictionary(
  ids: EventSchemaType["id"][],
  userAttendance: EventAttendantsSchemaType[],
): AttendanceDictionaryType {
  const dictionary: AttendanceDictionaryType = {};

  if (userAttendance.length === 0) {
    ids.forEach((id) => {
      dictionary[`${id}`] = "not_going";
    });
  }

  for (const id of ids) {
    const rec = userAttendance.find((record) => record.event_id === id);
    const status = rec?.status;
    if (status) {
      dictionary[`${id}`] = status;
    } else {
      dictionary[`${id}`] = "not_going";
    }
  }

  console.log({ "Attendance Dictionary": dictionary });

  return dictionary;
}
