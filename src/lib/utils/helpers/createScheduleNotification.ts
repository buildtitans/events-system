import type { EventSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { CreateNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";

export function createScheduleNotificatoin(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType
): CreateNotificationSchemaType {

    return {
        priority: "high",
        group_id: event.group_id,
        message: getScheduleNotificationMessage(event, updates)
    }
}

function getScheduleNotificationMessage(event: EventSchemaType, updates: UpdateEventArgsSchemaType) {

    switch (updates.status) {
        case "cancelled":
            return `${event.title} has been cancelled`;

        case "scheduled":
            return `${event.title} is back on, set for ${event.starts_at}`;

        default: {
            const exhaustive: never = updates.status;
            return `there was an update to the scheduling of ${event.title}`
        }
    }
}