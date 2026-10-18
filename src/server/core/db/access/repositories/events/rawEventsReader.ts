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

  async discovery() {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .select((eb) => [
        "e.id",
        "e.group_id",
        "e.status",
        "e.starts_at",
        "e.img",
        "e.tag",
        "e.title",
        "g.name as group_name",
        "g.location as group_location",
        "c.name as category_name",

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("going_count"),

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "interested")
          .as("interested_count"),
      ])
      .groupBy(["e.id", "g.id", "c.name"])
      .execute();

    return result.map((event) => {
      const {
        going_count,
        interested_count,
        group_name,
        group_location,
        starts_at,
        category_name,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          category_name: category_name ?? undefined,
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
          group_name,
          group_location: group_location ?? "Online",
        },
      };
    });
  }

  async byGroupId(group_id: EventSchemaType["group_id"]) {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.group_id", "=", group_id)
      .select((eb) => [
        "e.id",
        "e.group_id",
        "e.status",
        "e.starts_at",
        "e.meeting_location",
        "e.img",
        "e.tag",
        "e.title",
        "c.name as category_name",

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("going_count"),

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "interested")
          .as("interested_count"),
      ])
      .groupBy(["e.id", "g.id", "c.name"])
      .execute();

    return result.map((event) => {
      const {
        going_count,
        interested_count,
        starts_at,
        category_name,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          category_name: category_name ?? undefined,
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
        },
      };
    });
  }

  async allRawScheduledEvents(): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("status", "=", "scheduled")
      .orderBy("starts_at", "asc")
      .execute();
  }

  async rawNextEventByGroupId(group_id: GroupSchemaType["id"]) {
    const result = await this.db
      .selectFrom("events as e")
      .leftJoin("event_attendants as ea", "e.id", "ea.event_id")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .innerJoin("categories as c", "g.category_id", "c.id")
      .select((eb) => [
        "c.name as category_name",
        "e.id",
        "e.starts_at",
        "e.meeting_location",
        "e.title",
        "e.group_id",
        "e.status",
        "e.img",
        "e.tag",
        "e.description",

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("going"),

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "interested")
          .as("interested"),
      ])
      .groupBy(["e.id", "c.name"])
      .where("e.group_id", "=", group_id)
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", ">=", new Date())
      .orderBy("e.starts_at", "asc")
      .orderBy("e.id", "asc")
      .limit(1)
      .executeTakeFirst();

    if (result) {
      const { category_name, going, interested, starts_at, ...rest } = result;

      return {
        event: {
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
          ...rest,
        },
        meta: {
          attendance: {
            going: Number(going),
            interested: Number(interested),
          },
          category_name,
        },
      };
    }
  }

  async rawByIds(ids: EventSchemaType["id"][]) {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.id", "in", ids)
      .select((eb) => [
        "e.id",
        "e.meeting_location",
        "e.group_id",
        "e.status",
        "e.starts_at",
        "e.img",
        "e.tag",
        "e.title",
        "g.name as group_name",
        "g.location as group_location",

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("going_count"),

        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "interested")
          .as("interested_count"),
      ])
      .groupBy(["e.id", "g.id"])
      .execute();

    return result.map((event) => {
      const {
        going_count,
        interested_count,
        group_name,
        group_location,
        starts_at,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
          group_name,
          group_location: group_location ?? "Online",
        },
      };
    });
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
