import { UserNotificationsSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { INotificationsReader } from "./notificationsReader";
import { INotificationValidator } from "./notificationValidator";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";

export interface INotificationsSelector {
  getNotifications(
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType>;
}

export class NotificationsSelector implements INotificationsSelector {
  constructor(
    private readonly read: INotificationsReader,
    private readonly validate: INotificationValidator,
  ) {}

  async getNotifications(
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType> {
    const notifications = await this.read.notifications(userId);
    return this.validate.notifications(notifications);
  }
}
