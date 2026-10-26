import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  NotificationSchema,
  NotificationSchemaType,
  UserNotificationsSchema,
  UserNotificationsSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { NotificationsShape } from "./types";

export interface INotificationValidator {
  notification(data: unknown): NotificationSchemaType;
  notifications(data: NotificationsShape): UserNotificationsSchemaType;
  newNotification(data: unknown): UserNotificationsSchemaType["new"][number];
}

export class NotificationValidator implements INotificationValidator {
  notifications(data: NotificationsShape): UserNotificationsSchemaType {
    return validateOrThrow(UserNotificationsSchema, data);
  }

  newNotification(data: unknown): UserNotificationsSchemaType["new"][number] {
    return validateOrThrow(UserNotificationsSchema.properties.new.items, data);
  }

  notification(data: unknown): NotificationSchemaType {
    return validateOrThrow(NotificationSchema, data);
  }
}
