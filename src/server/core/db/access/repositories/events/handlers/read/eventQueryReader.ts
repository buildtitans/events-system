import { Kysely, sql } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import { IEventsParser } from "@/src/server/core/db/access/repositories/events/handlers/parse/eventsParser";
import { textSearchRelevance } from "@/src/server/core/lib/utils/queries/textSearchRelevance";
import { RawGroupEvent, RawNextEvent } from "../../types";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "../../../../../../../../schemas/groups/groupSchema";
import {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
  SearchSchemaType,
} from "@/src/schemas/search/searchSchema";

export interface IEventQueryReader {
  nextEvent(group_id: GroupSchemaType["id"]): Promise<RawNextEvent | undefined>;
  suggest(query: SearchSchemaType): Promise<EventSearchSuggestionSchemaType[]>;
  search(query: SearchSchemaType): Promise<EventSearchResultSchemaType[]>;
}

export class EventQueryReader implements IEventQueryReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IEventsParser,
  ) {}
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

  async search(query: SearchSchemaType) {
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
