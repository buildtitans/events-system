import { Kysely } from "kysely";
import { DB, Notifications } from "@/src/server/core/db/types/db";
import type { Insertable, UpdateResult } from "kysely";
import {
  CreateNotificationSchemaType,
  NotificationSchemaArrayType,
  NotificationSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { INotificationsParser } from "./notificationsParser";

export interface INotificationsWriter {
  markOpenedNotifications({
    ids,
    userId,
  }: {
    ids: NotificationSchemaType["id"][];
    userId: NotificationSchemaType["user_id"];
  }): Promise<UpdateResult>;
  addNewNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
    user_id: string,
  ): Promise<NotificationSchemaType | undefined>;
}

export class NotificationsWriter implements INotificationsWriter {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parse: INotificationsParser,
  ) {}

  async markOpenedNotifications({
    ids,
    userId,
  }: {
    ids: NotificationSchemaType["id"][];
    userId: NotificationSchemaType["user_id"];
  }): Promise<UpdateResult> {
    return await this.db
      .updateTable("notifications")
      .set({
        status: "viewed",
        updated_at: new Date(),
      })
      .where("id", "in", ids)
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();
  }

  async addNewNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
    userId: string,
  ): Promise<NotificationSchemaType | undefined> {
    const rows = this.parse.toInsertableNotifications(notification, memberIds);

    const createdNotifications = await this.insertNotifications(rows);

    return this.findByUserId(userId, createdNotifications);
  }

  private async insertNotifications(
    rows: Insertable<Notifications>[],
  ): Promise<NotificationSchemaArrayType> {
    const notifications = await this.db
      .insertInto("notifications")
      .values(rows)
      .returningAll()
      .execute();

    return this.parse.parseRawNotifications(notifications);
  }

  private findByUserId(
    userId: string,
    inserted: NotificationSchemaType[],
  ): NotificationSchemaType | undefined {
    for (const notification of inserted) {
      if (notification.user_id === userId) return notification;
    }
    return undefined;
  }
}
