import { Insertable, Selectable } from "kysely";
import { CreateNotificationSchemaType } from "../../../../../../schemas/notifications/notificationsSchema";
import { Notifications } from "../../../types/db";
import {
  NewNotificationShape,
  NotificationsShape,
  ReadNotifications,
  WrittenNotification,
} from "./types";

export interface INotificationParser {
  toNotifications(data: ReadNotifications): NotificationsShape;
  toInsertableNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
  ): Insertable<Notifications>[];
  toNewNotification(result: WrittenNotification): NewNotificationShape;
}

export class NotificationParser implements INotificationParser {
  public toNewNotification(result: WrittenNotification): NewNotificationShape {
    const { created_at, updated_at, group_name, group_slug, ...rest } = result;

    const rawNotification = {
      created_at: created_at.toISOString(),
      updated_at: updated_at?.toISOString() ?? null,
      ...rest,
    };

    return {
      kind: "new",
      data: rawNotification,
      meta: { group_name, group_slug },
    };
  }

  public toNotificationsDto(rows: Selectable<Notifications>[]) {
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

  public toNotifications(data: ReadNotifications): NotificationsShape {
    return {
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
    };
  }

  public toInsertableNotifications(
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
}
