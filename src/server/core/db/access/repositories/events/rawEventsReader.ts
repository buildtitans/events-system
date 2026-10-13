import { Kysely, Selectable, sql } from "kysely";
import { DB, Events } from "../../../types/db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { textSearchRelevance } from "../../../../lib/utils/queries/textSearchRelevance";

export class RawEventsReader {
  constructor(private readonly db: Kysely<DB>) {}

  async rawHydratedWithGroupDetails(id: EventSchemaType["id"]) {
    const { group_name, group_slug, going, interested, ...event } =
      await this.db
        .selectFrom("events")
        .innerJoin("groups", "groups.id", "events.group_id")
        .leftJoin("event_attendants", "event_attendants.event_id", "events.id")
        .selectAll("events")
        .select(["groups.name as group_name", "groups.slug as group_slug"])
        .select((eb) => [
          eb.fn
            .countAll()
            .filterWhere("event_attendants.status", "=", "going")
            .as("going"),
          eb.fn
            .countAll()
            .filterWhere("event_attendants.status", "=", "interested")
            .as("interested"),
        ])
        .where("events.id", "=", id)
        .groupBy(["events.id", "groups.id"])
        .executeTakeFirstOrThrow();

    return {
      event: {
        ...event,
        starts_at: event.starts_at.toISOString(),
        starts_at_ms: event.starts_at.getTime(),
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at?.toISOString() ?? null,
      },
      meta: {
        group_name,
        group_slug,
        attendants: {
          going: Number(going),
          interested: Number(interested),
        },
      },
    };
  }

  async allRawEvents() {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .orderBy("starts_at", "asc")
      .execute();
  }

  async allRawScheduledEvents(): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("status", "=", "scheduled")
      .orderBy("starts_at", "asc")
      .execute();
  }

  async rawNextEventByGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<Selectable<Events> | undefined> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .where("status", "=", "scheduled")
      .where("starts_at", ">=", new Date())
      .orderBy("starts_at", "asc")
      .executeTakeFirst();
  }

  async rawById(id: EventSchemaType["id"]): Promise<Selectable<Events>> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("id", "=", id)
      .limit(1)
      .executeTakeFirstOrThrow();
  }

  async rawByIds(ids: EventSchemaType["id"][]) {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("id", "in", ids)
      .where("status", "=", "scheduled")
      .orderBy("starts_at", "desc")
      .execute();
  }

  async rawByGroupId(
    group_id: Selectable<Events>["group_id"],
  ): Promise<Selectable<Events>[]> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .where("status", "=", "scheduled")
      .orderBy("starts_at", "asc")
      .execute();
  }

  async rawByGroupIds(
    groupIds: GroupSchemaType["id"][],
  ): Promise<Selectable<Events>[]> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "in", groupIds)
      .where("status", "=", "scheduled")
      .execute();
  }

  async rawCancelledByGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<Selectable<Events>[]> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .where("status", "=", "cancelled")
      .orderBy("starts_at", "asc")
      .execute();
  }

  async rawSuggestByTitle(
    query: SearchSchemaType,
  ): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("title", "ilike", `%${query}%`)
      .where("status", "=", "scheduled")
      .where("starts_at", ">=", new Date())
      .orderBy(textSearchRelevance(sql.ref("events.title"), query), "asc")
      .orderBy("starts_at", "asc")
      .orderBy("title", "asc")
      .orderBy("id", "asc")
      .limit(5)
      .execute();
  }

  async rawSearchByTitle(
    query: SearchSchemaType,
  ): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("title", "ilike", `%${query}%`)
      .where("status", "=", "scheduled")
      .orderBy(textSearchRelevance(sql.ref("events.title"), query), "asc")
      .orderBy("starts_at", "asc")
      .orderBy("title", "asc")
      .orderBy("id", "asc")
      .limit(25)
      .execute();
  }
}
