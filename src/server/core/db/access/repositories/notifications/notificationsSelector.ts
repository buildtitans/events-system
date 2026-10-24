import { UserNotificationsSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { INotificationsReader } from "./notificationsReader";
import { INotificationsParser } from "./notificationsParser";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";

export interface INotificationsSelector {
  getNotifications(
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType>;
}

export class NotificationsSelector implements INotificationsSelector {
  constructor(
    private readonly read: INotificationsReader,
    private readonly parse: INotificationsParser,
  ) {}

  async getNotifications(
    userId: AuthenticatedUserId,
  ): Promise<UserNotificationsSchemaType> {
    const notifications = await this.read.notifications(userId);
    return this.parse.notifications(notifications);
  }
}
