import { Kysely, Selectable } from "kysely";
import { DB, EventAttendants } from "@/src/server/core/db/types/db";
import { SelectedAttendant } from "../../types/types";
import { EventAttendantsSchemaType } from "../../../../../../schemas/events/eventAttendantsSchema";
import type { EventHeadCountSchemaType } from "../../../../../../schemas/events/eventAttendantsSchema";

export interface IEventAttendantsReader {
  rawHeadCount(
    event_id: EventAttendantsSchemaType["event_id"],
  ): Promise<EventHeadCountSchemaType>;
  rawRsvp({
    user_id,
    event_id,
  }: {
    user_id: string;
    event_id: string;
  }): Promise<{ status: string } | undefined>;
  allRawRecords(): Promise<Selectable<EventAttendants>[]>;
  userRecords(user_id: string): Promise<Selectable<EventAttendants>[]>;
  rawAttendant({
    user_id,
    event_id,
  }: {
    user_id: string;
    event_id: string;
  }): Promise<SelectedAttendant>;
  allRawAttendants(event_id: string): Promise<Selectable<EventAttendants>[]>;
  rawPastRecords(ids: string[]): Promise<Selectable<EventAttendants>[]>;
}

export class EventAttendantsReader implements IEventAttendantsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async rawRsvp({
    user_id,
    event_id,
  }: {
    user_id: string;
    event_id: string;
  }): Promise<{ status: string } | undefined> {
    return await this.db
      .selectFrom("event_attendants")
      .select("status")
      .where("user_id", "=", user_id)
      .where("event_id", "=", event_id)
      .executeTakeFirst();
  }

  async rawHeadCount(event_id: EventAttendantsSchemaType["event_id"]) {
    const { going, interested } = await this.db
      .selectFrom("event_attendants")
      .select((eb) => [
        eb.fn.countAll().filterWhere("status", "=", "going").as("going"),

        eb.fn
          .countAll()
          .filterWhere("status", "=", "interested")
          .as("interested"),
      ])
      .where("event_id", "=", event_id)
      .executeTakeFirstOrThrow();

    return {
      going: Number(going),
      interested: Number(interested),
    };
  }

  async allRawRecords(): Promise<Selectable<EventAttendants>[]> {
    return await this.db.selectFrom("event_attendants").selectAll().execute();
  }

  async userRecords(user_id: string): Promise<Selectable<EventAttendants>[]> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();
  }

  async rawAttendant({
    user_id,
    event_id,
  }: {
    user_id: string;
    event_id: string;
  }): Promise<SelectedAttendant> {
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
