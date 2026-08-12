import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import {
  INotificationsReader,
  NotificationsReader,
} from "./notificationsReader";
import {
  INotificationsParser,
  NotificationsParser,
} from "./notificationsParser";
import {
  INotificationsWriter,
  NotificationsWriter,
} from "./notificationsWriter";
import {
  INotificationsSelector,
  NotificationsSelector,
} from "./notificationsSelector";

export interface INotificationsRepository {
  readonly write: INotificationsWriter;
  readonly select: INotificationsSelector;
}

export class NotificationsRepository implements INotificationsRepository {
  private readonly read: INotificationsReader;
  private readonly parse: INotificationsParser;
  public readonly write: INotificationsWriter;
  public readonly select: INotificationsSelector;
  constructor(private readonly db: Kysely<DB>) {
    this.read = new NotificationsReader(this.db);
    this.parse = new NotificationsParser();
    this.write = new NotificationsWriter(this.db, this.parse);
    this.select = new NotificationsSelector(this.read, this.parse);
  }
}
