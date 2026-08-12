import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import { CreateNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { toMonthDayYearHour } from "../../parsing/toMonthDayYearHour";

export function createScheduleNotification(
  event: EventSchemaType,
  updates: UpdateEventArgsSchemaType,
): CreateNotificationSchemaType {
  return {
    priority: "high",
    group_id: event.group_id,
    subject: "Event Status Update",
    message: getScheduleNotificationMessage(event, updates),
  };
}

function getScheduleNotificationMessage(
  event: EventSchemaType,
  updates: UpdateEventArgsSchemaType,
) {
  const date = toMonthDayYearHour(event.starts_at);

  switch (updates.status) {
    case "cancelled":
      return `The event: "${event.title}" has been cancelled`;

    case "scheduled":
      return `The event: "${event.title}" is back on, set for ${date}`;

    default: {
      return `there was an update to the scheduling of "${event.title}"`;
    }
  }
}
