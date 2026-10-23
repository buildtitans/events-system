import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { RawUserNotifications } from "./types";

export interface INotificationsReader {
  notifications(userId: AuthenticatedUserId): Promise<RawUserNotifications>;
}

export class NotificationsReader implements INotificationsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async notifications(
    userId: AuthenticatedUserId,
  ): Promise<RawUserNotifications> {
    return await this.db
      .selectNoFrom((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("notifications as n")
            .innerJoin("groups as g", "g.id", "n.group_id")
            .selectAll("n")
            .select(["g.slug as group_slug", "g.name as group_name"])
            .where("n.user_id", "=", userId)
            .where("n.status", "=", "new")
            .orderBy((eb) =>
              eb
                .case("n.priority")
                .when("high")
                .then(1)
                .when("moderate")
                .then(2)
                .when("low")
                .then(3)
                .else(4)
                .end(),
            )
            .orderBy("n.created_at", "desc"),
        ).as("new"),

        jsonArrayFrom(
          eb
            .selectFrom("notifications as n")
            .innerJoin("groups as g", "g.id", "n.group_id")
            .selectAll("n")
            .select(["g.slug as group_slug", "g.name as group_name"])
            .where("n.user_id", "=", userId)
            .where("n.status", "=", "viewed")
            .orderBy("n.updated_at", "desc")
            .limit(15),
        ).as("seen"),
      ])
      .executeTakeFirstOrThrow();
  }
}
