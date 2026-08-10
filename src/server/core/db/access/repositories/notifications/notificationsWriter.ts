import { Kysely } from "kysely";
import { DB, Notifications } from "@/src/server/core/db/types/db";
import type { Insertable, UpdateResult } from "kysely";
import {
  CreateNotificationSchemaType,
  NotificationSchemaArrayType,
  NotificationSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { NotificationCreationProcedure } from "../../types/types";
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
  ): Promise<NotificationCreationProcedure>;
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
      .set({ status: "viewed" })
      .where("id", "in", ids)
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();
  }

  async addNewNotifications(
    notification: CreateNotificationSchemaType,
    memberIds: string[],
  ): Promise<NotificationCreationProcedure> {
    const rows = this.parse.toInsertableNotifications(notification, memberIds);

    const createdNotifications = await this.insertNotifications(rows);

    return {
      ok: createdNotifications.length > 0,
      items: createdNotifications,
    };
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
}
