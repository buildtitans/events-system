import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

type NewNotification = {
  group_id: string;
  priority: string;
  message: string;
  subject: string;
};

export class NotificatonService {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

  async getNewNotifications(user_id: string | null | undefined) {
    const userId = this.policy.requireAuthenticated(user_id);
    return this.db.notifications.getUnseenNotifications(userId);
  }

  async createNotification(notification: NewNotification) {
    const memberIds = await this.db.groupMembers.getMemberIds(
      notification.group_id,
    );

    return await this.db.notifications.addNewNotifications(
      notification,
      memberIds,
    );
  }

  async markSeen(user_id: string | null | undefined, ids: string[]) {
    this.policy.requireAuthenticated(user_id);

    return this.db.notifications.markOpenedNotifications(ids);
  }
}
