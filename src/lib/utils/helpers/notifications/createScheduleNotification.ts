import type { EventSchemaType, NewEventInputSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { CreateNotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { toMonthDayYearHour } from "../../parsing/toMonthDayYearHour";

export function createScheduleNotification(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType
): CreateNotificationSchemaType {

    return {
        priority: "high",
        group_id: event.group_id,
        subject: "Event Status Update",
        message: getScheduleNotificationMessage(event, updates)
    }
}

function getScheduleNotificationMessage(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType
) {
    const date = toMonthDayYearHour(event.starts_at);

    switch (updates.status) {
        case "cancelled":
            return `The event: ${event.title} has been cancelled`;

        case "scheduled":
            return `The event: ${event.title} is back on, set for ${date}`;

        default: {
            return `there was an update to the scheduling of ${event.title}`
        }
    }
};


export function createNewEventNotification(
    event: NewEventInputSchemaType,
    group: GroupSchemaType
): CreateNotificationSchemaType {

    const date = toMonthDayYearHour(event.starts_at);

    return {
        subject: `${group.name} scheduled a new event`,
        priority: "low",
        group_id: event.group_id,
        message: ` New event: ${event.title} scheduled for ${date}`
    };
};