import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import {
  INotificationsReader,
  NotificationsReader,
} from "./notificationsReader";
import {
  INotificationValidator,
  NotificationValidator,
} from "./notificationValidator";
import {
  INotificationsWriter,
  NotificationsWriter,
} from "./notificationsWriter";
import {
  INotificationsSelector,
  NotificationsSelector,
} from "./notificationsSelector";
import { INotificationParser, NotificationParser } from "./notificationParser";

export interface INotificationsRepository {
  readonly write: INotificationsWriter;
  readonly select: INotificationsSelector;
}

export class NotificationsRepository implements INotificationsRepository {
  private readonly read: INotificationsReader;
  private readonly parse: INotificationParser;
  private readonly validate: INotificationValidator;
  public readonly write: INotificationsWriter;
  public readonly select: INotificationsSelector;

  constructor(private readonly db: Kysely<DB>) {
    this.validate = new NotificationValidator();
    this.parse = new NotificationParser();
    this.read = new NotificationsReader(this.db, this.parse);
    this.write = new NotificationsWriter(this.db, this.validate, this.parse);
    this.select = new NotificationsSelector(this.read, this.validate);
  }
}
