import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { IEventsParser } from "@/src/server/core/db/access/repositories/events/handlers/parse/eventsParser";
import {
  RawDiscoverableEvent,
  RawGroupEvent,
  RawHydratedEventShape,
} from "../../types";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";

export interface IEventHydrationReader {
  single(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<RawHydratedEventShape>;
  readonly list: IEventListHydrationReader;
}

export class EventHydrationReader implements IEventHydrationReader {
  public readonly list: IEventListHydrationReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IEventsParser,
  ) {
    this.list = new EventListHydrationReader(this.db, this.parser);
  }

  async single(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<RawHydratedEventShape> {
    const result = await this.db
      .selectFrom("events")
      .innerJoin("groups", "groups.id", "events.group_id")
      .leftJoin("event_attendants", "event_attendants.event_id", "events.id")
      .selectAll("events")
      .select(["groups.name as group_name", "groups.slug as group_slug"])
      .select((eb) => [
        userId
          ? eb.fn
              .coalesce(
                eb
                  .selectFrom("group_members as viewer")
                  .select("viewer.role")
                  .whereRef("viewer.group_id", "=", "groups.id")
                  .where("viewer.user_id", "=", userId),
                eb.val("anonymous"),
              )
              .as("viewer_role")
          : eb.val("anonymous").as("viewer_role"),

        userId
          ? eb.fn
              .coalesce(
                eb
                  .selectFrom("event_attendants as ea")
                  .select("ea.status")

                  .whereRef("ea.event_id", "=", "events.id")
                  .where("ea.user_id", "=", userId),
                eb.val("not_going"),
              )
              .as("viewer_status")
          : eb.val("not_going").as("viewer_status"),

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

    return this.parser.toHydratedEvent(result);
  }
}

interface IEventListHydrationReader {
  forGroup(group_id: EventSchemaType["group_id"]): Promise<RawGroupEvent[]>;
  discovery(): Promise<RawDiscoverableEvent[]>;
  popular(): Promise<RawDiscoverableEvent[]>;
  upcoming(): Promise<RawDiscoverableEvent[]>;
}

export class EventListHydrationReader implements IEventListHydrationReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IEventsParser,
  ) {}

  async forGroup(group_id: EventSchemaType["group_id"]) {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", ">=", new Date())
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
      .orderBy("e.starts_at", "asc")
      .groupBy(["e.id", "g.id", "c.name"])
      .execute();

    return this.parser.toGroupEvents(result);
  }

  async discovery() {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", ">", new Date())
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
      .orderBy("e.starts_at", "asc")
      .orderBy("e.id", "asc")
      .execute();

    return this.parser.toDiscoverableEvents(result);
  }

  async popular(): Promise<RawDiscoverableEvent[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.starts_at", ">", new Date())
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
      .having(
        (eb) =>
          eb.fn
            .countAll()
            .filterWhere("ea.status", "in", ["going", "interested"]),
        ">=",
        3,
      )
      .orderBy("e.starts_at", "asc")
      .orderBy("e.id", "asc")
      .execute();

    return this.parser.toDiscoverableEvents(result);
  }

  async upcoming(): Promise<RawDiscoverableEvent[]> {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", ">=", now)
      .where("e.starts_at", "<=", windowEnd)
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
      .orderBy("e.starts_at", "asc")
      .orderBy("e.id", "asc")
      .execute();

    return this.parser.toDiscoverableEvents(result);
  }
}
