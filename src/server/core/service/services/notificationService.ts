import type { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { IAuthorization } from "../auth/authorization";
import {
  INotificationService,
  NotificationServiceDB,
  NewNotification,
} from "./types";

export class NotificationService implements INotificationService {
  constructor(
    private readonly db: NotificationServiceDB,
    private readonly policy: IAuthorization,
  ) {}

  async getNotifications(user_id: string | null | undefined): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.getNewAndSeenNotifications(userId);
  }

  async getNewNotifications(
    user_id: string | null | undefined,
  ): Promise<NotificationSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return this.db.notifications.select.getUnseenNotifications(userId);
  }

  async createNotification(
    notification: NewNotification,
    user_id: string | undefined | null,
  ): Promise<NotificationSchemaType | undefined> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, notification.group_id);
    return await this.executeCreateNotifications(notification, userId);
  }

  async markSeen(
    user_id: string | null | undefined,
    ids: NotificationSchemaType["id"][],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.executeMarkSeenNotifications(ids, userId);
  }

  private async executeMarkSeenNotifications(
    ids: NotificationSchemaType["id"][],
    userId: string,
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
    userId: string,
  ): Promise<NotificationSchemaType | undefined> {
    const memberIds = await this.db.groupMembers.select.memberIds(
      notification.group_id,
    );

    return await this.db.notifications.write.addNewNotifications(
      notification,
      memberIds,
      userId,
    );
  }

  private async getNewAndSeenNotifications(userId: string): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }> {
    return {
      new: await this.db.notifications.select.getUnseenNotifications(userId),
      seen: await this.db.notifications.select.getOpenedNotifications(userId),
    };
  }
}
