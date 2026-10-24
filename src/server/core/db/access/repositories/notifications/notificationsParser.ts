import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  NotificationSchema,
  NotificationSchemaArray,
  NotificationSchemaType,
  UserNotificationsSchema,
  UserNotificationsSchemaType,
  type CreateNotificationSchemaType,
  type NotificationSchemaArrayType,
} from "@/src/schemas/notifications/notificationsSchema";
import type { Notifications } from "@/src/server/core/db/types/db";
import type { Insertable, Selectable } from "kysely";
import { RawUserNotifications } from "./types";

export interface INotificationsParser {
  toInsertableNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
  ): Insertable<Notifications>[];
  parseRawNotifications(
    rows: Selectable<Notifications>[],
  ): NotificationSchemaArrayType;
  notification(data: unknown): NotificationSchemaType;
  notifications(data: RawUserNotifications): UserNotificationsSchemaType;
  newNotification(data: unknown): UserNotificationsSchemaType["new"][number];
}

export class NotificationsParser implements INotificationsParser {
  notifications(data: RawUserNotifications): UserNotificationsSchemaType {
    return validateOrThrow(UserNotificationsSchema, {
      new: data.new.map(({ group_name, group_slug, ...notification }) => ({
        kind: "new",
        data: notification,
        meta: { group_name, group_slug },
      })),
      seen: data.seen.map(({ group_name, group_slug, ...notification }) => ({
        kind: "seen",
        data: notification,
        meta: { group_name, group_slug },
      })),
    });
  }

  newNotification(data: unknown): UserNotificationsSchemaType["new"][number] {
    return validateOrThrow(UserNotificationsSchema.properties.new.items, data);
  }

  notification(data: unknown): NotificationSchemaType {
    return validateOrThrow(NotificationSchema, data);
  }

  toInsertableNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
  ): Insertable<Notifications>[] {
    const insertableRows: Insertable<Notifications>[] = [];

    memberIds.forEach((id: string) => {
      insertableRows.push({
        user_id: id,
        group_id: notification.group_id,
        priority: notification.priority,
        message: notification.message,
        subject: notification.subject,
      });
    });
    return insertableRows;
  }

  parseRawNotifications(
    rows: Selectable<Notifications>[],
  ): NotificationSchemaArrayType {
    const parsed = this.toNotificationsDto(rows);

    return validateOrThrow(NotificationSchemaArray, parsed);
  }

  private toNotificationsDto(rows: Selectable<Notifications>[]) {
    return rows.map((row) => {
      return {
        user_id: row.user_id,
        group_id: row.group_id,
        message: row.message,
        subject: row.subject,
        created_at: row.created_at.toISOString(),
        updated_at: row.updated_at?.toISOString() ?? null,
        status: row.status,
        priority: row.priority,
        id: row.id,
      };
    });
  }
}
