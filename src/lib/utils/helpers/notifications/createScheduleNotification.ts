import type { EventSchemaType, NewEventInputSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
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

function getScheduleNotificationMessage(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType
) {

    switch (updates.status) {
        case "cancelled":
            return `The event: ${event.title} has been cancelled`;

        case "scheduled":
            return `The event: ${event.title} is back on, set for ${event.starts_at}`;

        default: {
            const exhaustive: never = updates.status;
            return `there was an update to the scheduling of ${event.title}`
        }
    }
};


export function createNewEventNotification(
    event: NewEventInputSchemaType,
    group: GroupSchemaType
): CreateNotificationSchemaType {


    return {
        priority: "low",
        group_id: event.group_id,
        message: ` New event: ${event.title} for group: ${group.name} was scheduled for ${event.starts_at}, `
    };
};