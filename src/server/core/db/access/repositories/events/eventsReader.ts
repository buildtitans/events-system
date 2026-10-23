import {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import { Kysely, Selectable, sql } from "kysely";
import { DB, Events } from "../../../types/db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { textSearchRelevance } from "../../../../lib/utils/queries/textSearchRelevance";
import {
  EventById,
  RawDiscoverableEvent,
  RawGroupEvent,
  RawHydratedEvent,
  RawNextEvent,
} from "./types";
import { IEventsParser } from "./eventsParser";

export interface IEventsReader {
  hydrateEvent(id: EventSchemaType["id"]): Promise<RawHydratedEvent>;
  discovery(): Promise<RawDiscoverableEvent[]>;
  popular(): Promise<RawDiscoverableEvent[]>;
  byGroupId(group_id: EventSchemaType["group_id"]): Promise<RawGroupEvent[]>;
  scheduled(): Promise<Selectable<Events>[]>;
  nextEvent(group_id: GroupSchemaType["id"]): Promise<RawNextEvent | undefined>;
  byIds(ids: EventSchemaType["id"][]): Promise<EventById[]>;
  suggest(query: SearchSchemaType): Promise<EventSearchSuggestionSchemaType[]>;
  search(query: SearchSchemaType): Promise<EventSearchResultSchemaType[]>;
  upcoming(): Promise<RawDiscoverableEvent[]>;
}

export class EventsReader implements IEventsReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IEventsParser,
  ) {}

  async hydrateEvent(id: EventSchemaType["id"]) {
    const result = await this.db
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

    return this.parser.toHydratedEvent(result);
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

    return this.parser.toGroupEvents(result);
  }

  async scheduled(): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("status", "=", "scheduled")
      .orderBy("starts_at", "asc")
      .execute();
  }

  async nextEvent(
    group_id: GroupSchemaType["id"],
  ): Promise<RawNextEvent | undefined> {
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

    return this.parser.toNextEvent(result);
  }

  async byIds(ids: EventSchemaType["id"][]): Promise<EventById[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .innerJoin("categories as c", "g.category_id", "c.id")
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

    return this.parser.toEventsByIds(result);
  }

  async suggest(
    query: SearchSchemaType,
  ): Promise<EventSearchSuggestionSchemaType[]> {
    const rows = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "e.group_id", "g.id")
      .select([
        "e.id",
        "e.group_id",
        "e.title",
        "e.starts_at",
        "g.name as group_name",
        "g.location as group_location",
        "g.slug as group_slug",
      ])
      .where("e.title", "ilike", `%${query}%`)
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", ">=", new Date())
      .orderBy(textSearchRelevance(sql.ref("e.title"), query), "asc")
      .orderBy("e.starts_at", "asc")
      .orderBy("e.title", "asc")
      .orderBy("e.id", "asc")
      .limit(5)
      .execute();
    return this.parser.toSuggestions(rows);
  }

  async search(
    query: SearchSchemaType,
  ): Promise<EventSearchResultSchemaType[]> {
    const rows = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "e.group_id", "g.id")
      .leftJoin("event_attendants as ea", "e.id", "ea.event_id")
      .select([
        "e.id",
        "e.title",
        "e.description",
        "e.tag",
        "e.starts_at",
        "e.img",
        "e.group_id",
        "g.name as group_name",
        "g.location as group_location",
        "g.slug as group_slug",
      ])
      .select((eb) => [
        eb.fn.countAll().filterWhere("ea.status", "=", "going").as("going"),
        eb.fn
          .countAll()
          .filterWhere("ea.status", "=", "interested")
          .as("interested"),
        sql<
          "past" | "today" | "upcoming"
        >`case when e.starts_at::date = current_date then 'today' when e.starts_at::date < current_date then 'past' else 'upcoming' end`.as(
          "timeline_status",
        ),
        sql<
          "ended" | "ongoing" | "not_yet_held"
        >`case when current_timestamp < e.starts_at then 'not_yet_held' when current_timestamp < e.starts_at + interval '2 hours' then 'ongoing' else 'ended' end`.as(
          "event_phase",
        ),
      ])
      .where("e.title", "ilike", `%${query}%`)
      .where("e.status", "=", "scheduled")
      .groupBy(["e.id", "g.id"])
      .orderBy(textSearchRelevance(sql.ref("e.title"), query), "asc")
      .orderBy("e.starts_at", "asc")
      .orderBy("e.title", "asc")
      .orderBy("e.id", "asc")
      .limit(25)
      .execute();
    return this.parser.toSearchResults(rows);
  }
}
