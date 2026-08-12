import type { Notifications } from "@/src/server/core/db/types/db";
import type { Insertable, Selectable } from "kysely";
import type {
  CreateNotificationSchemaType,
  NotificationSchemaArrayType,
} from "@/src/schemas/notifications/notificationsSchema";
import { NotificationSchemaArrayValidator } from "@/src/server/core/lib/validation/schemaValidators";

export interface INotificationsParser {
  toInsertableNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
  ): Insertable<Notifications>[];
  parseRawNotifications(
    rows: Selectable<Notifications>[],
  ): NotificationSchemaArrayType;
}

export class NotificationsParser implements INotificationsParser {
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

    return NotificationSchemaArrayValidator(parsed);
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
