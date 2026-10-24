import { Kysely, Selectable } from "kysely";
import { DB, EventAttendants } from "@/src/server/core/db/types/db";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { IEventAttendantsReader, RawRsvp, ReadRsvp } from "./types";

export class EventAttendantsReader implements IEventAttendantsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async rsvps(user_id: AuthenticatedUserId): Promise<RawRsvp[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "e.group_id", "g.id")
      .innerJoin("event_attendants as a", "a.event_id", "e.id")
      .innerJoin("categories as c", "g.category_id", "c.id")
      .where("a.user_id", "=", user_id)
      .where("a.status", "in", ["going", "interested"])
      .select([
        "a.status as attendance_status",
        "e.group_id",
        "a.event_id",
        "e.title as event_title",
        "e.meeting_location as location",
        "e.starts_at as starts_at",
        "e.status as scheduled_status",
        "g.slug as group_slug",
        "g.name as group_name",
        "c.name as category_name",
      ])
      .execute();

    return this.toRsvps(result);
  }

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

  async allRawRecords(): Promise<Selectable<EventAttendants>[]> {
    return await this.db.selectFrom("event_attendants").selectAll().execute();
  }

  private toRsvps(result: ReadRsvp[]) {
    return result.map((rsvp) => {
      const { starts_at, group_name, group_slug, category_name, ...rest } =
        rsvp;
      return {
        rsvp: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          group_slug,
          group_name,
          category_name: category_name,
        },
      };
    });
  }
}
