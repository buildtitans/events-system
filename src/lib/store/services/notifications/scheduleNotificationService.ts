import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { TrpcClientType } from "@/src/trpc/trpcClient";
import {
  CreateNotificationSchemaType,
  NotificationSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";

interface IScheduleNotificationService {
  createNewEventNotification(
    event: EventSchemaType,
    group: GroupSchemaType,
  ): Promise<NotificationSchemaType | undefined>;
  createScheduleNotification(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType,
  ): Promise<NotificationSchemaType | undefined>;
}

export class ScheduleNotificationService implements IScheduleNotificationService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async createNewEventNotification(
    event: EventSchemaType,
    group: GroupSchemaType,
  ): Promise<NotificationSchemaType | undefined> {
    const date = toMonthDayYearHour(event.starts_at);

    const notification = {
      subject: `${group.name} scheduled a new event`,
      priority: "low",
      group_id: event.group_id,
      message: ` New event: ${event.title} scheduled for ${date}`,
    } satisfies CreateNotificationSchemaType;

    return await this.trpc.notifications.write.create.mutate(notification);
  }

  public async createScheduleNotification(
    event: EventSchemaType,
    updates: UpdateEventArgsSchemaType,
  ): Promise<NotificationSchemaType | undefined> {
    const notification = {
      priority: "high",
      group_id: event.group_id,
      subject: "Event Status Update",
      message: this.getScheduleNotificationMessage(event, updates),
    } satisfies CreateNotificationSchemaType;
    return await this.trpc.notifications.write.create.mutate(notification);
  }

  private getScheduleNotificationMessage(
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
}
