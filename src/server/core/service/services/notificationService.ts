import type {
  NotificationSchemaType,
  UserNotificationsSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { IAuthorization } from "../auth/authorization";
import {
  INotificationService,
  NotificationServiceDB,
  NewNotification,
} from "./types";
import { AuthenticatedUserId } from "../handlers/session/SessionHandler";

export class NotificationService implements INotificationService {
  constructor(
    private readonly db: NotificationServiceDB,
    private readonly policy: IAuthorization,
  ) {}

  async getNotifications(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserNotificationsSchemaType> {
    return await this.executeGetNotifications(user_id);
  }

  async createNotification(
    notification: NewNotification,
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserNotificationsSchemaType["new"][number] | undefined> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, notification.group_id);
    return await this.executeCreateNotifications(notification, userId);
  }

  async markSeen(
    user_id: AuthenticatedUserId | undefined | null,
    ids: NotificationSchemaType["id"][],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.executeMarkSeenNotifications(ids, userId);
  }

  private async executeMarkSeenNotifications(
    ids: NotificationSchemaType["id"][],
    userId: AuthenticatedUserId,
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }> {
    const result = await this.db.notifications.write.markOpenedNotifications({
      ids: ids,
      userId,
    });

    const updates = Number(result.numUpdatedRows);

    if (updates > 0) {
      return {
        ok: true,
        numUpdated: updates,
      };
    } else {
      return {
        ok: false,
        error: "Failed to update status on read notifications",
      };
    }
  }

  private async executeCreateNotifications(
    notification: NewNotification,
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType["new"][number]> {
    return await this.db.notifications.write.newNotification(
      notification,
      userId,
    );
  }

  private async executeGetNotifications(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserNotificationsSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);
    return this.db.notifications.select.getNotifications(userId);
  }
}
