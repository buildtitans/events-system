import { Kysely, Selectable } from "kysely";
import { DB, EventAttendants } from "@/src/server/core/db/types/db";
import { SelectedAttendant } from "../../types/types";

export class EventAttendantsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async rawRsvp(
    user_id: string,
    event_id: string,
  ): Promise<{ status: string } | undefined> {
    return await this.db
      .selectFrom("event_attendants")
      .select("status")
      .where("user_id", "=", user_id)
      .where("event_id", "=", event_id)
      .executeTakeFirst();
  }

  async allRawRecords(): Promise<Selectable<EventAttendants>[]> {
    return await this.db.selectFrom("event_attendants").selectAll().execute();
  }

  async userRecords(user_id: string) {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();
  }

  async rawAttendant(
    event_id: string,
    user_id: string,
  ): Promise<SelectedAttendant> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "=", event_id)
      .where("user_id", "=", user_id)
      .limit(1)
      .executeTakeFirstOrThrow();
  }

  async allRawAttendants(
    event_id: string,
  ): Promise<Selectable<EventAttendants>[]> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "=", event_id)
      .execute();
  }

  async rawPastRecords(ids: string[]): Promise<Selectable<EventAttendants>[]> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "in", ids)
      .where("status", "=", "going")
      .execute();
  }
}
