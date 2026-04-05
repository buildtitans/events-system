import type { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import type { NotificationCreationProcedure } from "@/src/server/core/db/clients/types/types";
import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

export type NewNotification = Pick<
  NotificationSchemaType,
  "group_id" | "priority" | "message" | "subject"
>;

export class NotificationService {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

  async getNewNotifications(
    user_id: string | null | undefined,
  ): Promise<NotificationSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return this.db.notifications.getUnseenNotifications(userId);
  }

  async createNotification(
    notification: NewNotification,
    user_id: string | undefined | null,
  ): Promise<NotificationCreationProcedure> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireCanManageGroup(userId, notification.group_id);

    const memberIds = await this.db.groupMembers.getMemberIds(
      notification.group_id,
    );

    return await this.db.notifications.addNewNotifications(
      notification,
      memberIds,
    );
  }

  async markSeen(
    user_id: string | null | undefined,
    seenNotifications: NotificationSchemaType[],
  ): Promise<{ ok: true; numUpdated: number } | { ok: false; error: string }> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.checkSeenNotifications(seenNotifications, userId);

    const ids = seenNotifications.map((notif) => notif.id);

    const result = await this.db.notifications.markOpenedNotifications({
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
