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
    const newNotifications =
      await this.db.notifications.select.getUnseenNotifications(userId);
    const readNotifications =
      await this.db.notifications.select.getOpenedNotifications(userId);

    return {
      new: newNotifications,
      seen: readNotifications,
    };
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

    const memberIds = await this.db.groupMembers.select.memberIds(
      notification.group_id,
    );

    const notifications = await this.db.notifications.write.addNewNotifications(
      notification,
      memberIds,
    );

    const { items } = notifications;

    const notificationForUser = items.find((item) => item.user_id === userId);

    return notificationForUser ?? undefined;
  }

  async markSeen(
    user_id: string | null | undefined,
    seenNotifications: NotificationSchemaType[],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.checkSeenNotifications(seenNotifications, userId);

    const ids = seenNotifications.map((notif) => notif.id);

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

  private async checkSeenNotifications(
    seenNotifications: NotificationSchemaType[],
    userId: string,
  ): Promise<void> {
    const uniqueGroupIds = new Set(
      seenNotifications.map((notif) => notif.group_id),
    );

    for (const groupId of uniqueGroupIds) {
      await this.policy.requireIsGroupMember(userId, groupId);
    }
  }
}
