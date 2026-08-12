import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { INotificationsReader } from "./notificationsReader";
import { INotificationsParser } from "./notificationsParser";

export interface INotificationsSelector {
  getUnseenNotifications(user_id: string): Promise<NotificationSchemaArrayType>;
}

export class NotificationsSelector implements INotificationsSelector {
  constructor(
    private readonly read: INotificationsReader,
    private readonly parse: INotificationsParser,
  ) {}

  async getUnseenNotifications(
    user_id: string,
  ): Promise<NotificationSchemaArrayType> {
    const rows = await this.read.getRawNotifications(user_id);

    return this.parse.parseRawNotifications(rows);
  }
}
