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
  ): Promise<NotificationCreationProcedure> {
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
    ids: string[],
  ): Promise<void> {
    this.policy.requireAuthenticated(user_id);
    return this.db.notifications.markOpenedNotifications(ids);
  }
}
