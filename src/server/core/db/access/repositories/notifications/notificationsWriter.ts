import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import type { UpdateResult } from "kysely";
import {
  CreateNotificationSchemaType,
  NotificationSchemaType,
  UserNotificationsSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { INotificationsParser } from "./notificationsParser";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";

export interface INotificationsWriter {
  markOpenedNotifications({
    ids,
    userId,
  }: {
    ids: NotificationSchemaType["id"][];
    userId: NotificationSchemaType["user_id"];
  }): Promise<UpdateResult>;
  newNotification(
    notification: CreateNotificationSchemaType,
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType["new"][number]>;
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

  public async newNotification(
    notification: CreateNotificationSchemaType,
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType["new"][number]> {
    return await this.createNotification(notification, userId);
  }

  private async createNotification(
    notification: CreateNotificationSchemaType,
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType["new"][number]> {
    const result = await this.db
      .with("inserted_notifications", (db) =>
        db
          .insertInto("notifications")
          .columns([
            "user_id",
            "group_id",
            "priority",
            "message",
            "subject",
            "status",
          ])
          .expression((eb) =>
            eb
              .selectFrom("group_members as gm")
              .select((eb) => [
                "gm.user_id",
                "gm.group_id",
                eb.val(notification.priority).as("priority"),
                eb.val(notification.message).as("message"),
                eb.val(notification.subject).as("subject"),
                eb.val("new").as("status"),
              ])
              .where("gm.group_id", "=", notification.group_id)
              .where("gm.role", "in", ["member", "organizer"]),
          )
          .returningAll(),
      )
      .selectFrom("inserted_notifications as n")
      .innerJoin("groups as g", "g.id", "n.group_id")
      .selectAll("n")
      .select(["g.slug as group_slug", "g.name as group_name"])
      .where("n.user_id", "=", userId)
      .executeTakeFirstOrThrow();

    const { created_at, updated_at, group_name, group_slug, ...rest } = result;

    const rawNotification = {
      created_at: created_at.toISOString(),
      updated_at: updated_at?.toISOString() ?? null,
      ...rest,
    };

    return this.parse.newNotification({
      kind: "new",
      data: rawNotification,
      meta: { group_name, group_slug },
    });
  }
}
