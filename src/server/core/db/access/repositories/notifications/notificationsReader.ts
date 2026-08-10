import { Kysely } from "kysely";
import { DB, Notifications } from "@/src/server/core/db/types/db";
import type { Selectable } from "kysely";

export interface INotificationsReader {
  getRawNotifications(user_id: string): Promise<Selectable<Notifications>[]>;
}

export class NotificationsReader implements INotificationsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async getRawNotifications(
    user_id: string,
  ): Promise<Selectable<Notifications>[]> {
    return await this.db
      .selectFrom("notifications")
      .selectAll()
      .where("status", "=", "new")
      .where("user_id", "=", user_id)
      .orderBy((eb) =>
        eb
          .case("priority")
          .when("high")
          .then(1)
          .when("moderate")
          .then(2)
          .when("low")
          .then(3)
          .else(4)
          .end(),
      )
      .orderBy("created_at", "desc")
      .execute();
  }
}
