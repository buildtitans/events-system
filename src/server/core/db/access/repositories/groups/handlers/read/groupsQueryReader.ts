import { Kysely, sql } from "kysely";
import { GroupSchemaType } from "../../../../../../../../schemas/groups/groupSchema";
import {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
} from "../../../../../../../../schemas/search/searchSchema";
import { DB } from "../../../../../types/db";
import { RawGroupEvent } from "../../../events/types";
import { RawArchives, RawtimelineItem } from "../../types";
import { IGroupsParser } from "../parse/groupsParser";
import { textSearchRelevance } from "../../../../../../lib/utils/queries/textSearchRelevance";

export interface IGroupsQueryReader {
  timeline(id: GroupSchemaType["id"]): Promise<RawtimelineItem[]>;
  history(group_id: GroupSchemaType["id"]): Promise<RawGroupEvent[]>;
  archives(id: GroupSchemaType["id"]): Promise<RawArchives>;
  search(query: string): Promise<GroupSearchResultSchemaType[]>;
  suggest(query: string): Promise<GroupSearchSuggestionSchemaType[]>;
}

export class GroupsQueryReader implements IGroupsQueryReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IGroupsParser,
  ) {}

  async search(query: string): Promise<GroupSearchResultSchemaType[]> {
    const results = await this.searchGroups(query, 25);
    return this.parser.toSearchResults(results);
  }

  async suggest(query: string): Promise<GroupSearchSuggestionSchemaType[]> {
    const suggestions = await this.searchGroups(query, 5);
    return this.parser.toSuggestions(suggestions);
  }

  async history(group_id: GroupSchemaType["id"]): Promise<RawGroupEvent[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "g.id", "e.group_id")
      .leftJoin("categories as c", "c.id", "g.category_id")
      .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
      .where("e.status", "=", "scheduled")
      .where("e.starts_at", "<", new Date())
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
      .orderBy("e.starts_at", "desc")
      .orderBy("e.id", "desc")
      .execute();

    return this.parser.toGroupEvents(result);
  }

  async timeline(id: GroupSchemaType["id"]): Promise<RawtimelineItem[]> {
    const result = await this.db
      .selectFrom("events as e")
      .innerJoin("groups as g", "e.group_id", "g.id")
      .leftJoin("event_attendants as ea", "e.id", "ea.event_id")
      .where("g.id", "=", id)
      .where("e.status", "=", "scheduled")
      .select((eb) => [
        "e.starts_at",
        "e.id",
        "e.group_id",
        "e.created_at",
        "e.img as image",
        eb.fn
          .countAll<number>()
          .filterWhere("ea.status", "=", "going")
          .as("number_attended"),

        eb
          .case()
          .when(
            eb.cast<string>("e.starts_at", "date"),
            "<",
            sql<string>`current_date`,
          )
          .then("past" as const)
          .when(
            eb.cast<string>("e.starts_at", "date"),
            "=",
            sql<string>`current_date`,
          )
          .then("today" as const)
          .else("upcoming" as const)
          .end()
          .as("timeline_status"),
      ])
      .groupBy("e.id")
      .execute();

    return this.parser.toTimeline(result);
  }

  async archives(id: GroupSchemaType["id"]): Promise<RawArchives> {
    const rows = await this.db
      .selectFrom("events")
      .leftJoin("event_attendants", "event_attendants.event_id", "events.id")
      .selectAll("events")
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
      .where("events.group_id", "=", id)
      .where("events.status", "=", "cancelled")
      .groupBy("events.id")
      .orderBy("events.starts_at", "desc")
      .execute();

    return this.parser.toArchives(rows);
  }

  private searchGroups(query: string, limit: number) {
    return this.db
      .selectFrom("groups as g")
      .innerJoin("categories as c", "c.id", "g.category_id")
      .select([
        "g.id",
        "g.name",
        "g.slug",
        "g.description",
        "g.location",
        "c.name as category_name",
      ])
      .select((eb) => [
        eb
          .selectFrom("group_members as gm")
          .select((eb) => eb.fn.countAll().as("count"))
          .whereRef("gm.group_id", "=", "g.id")
          .where("gm.role", "in", ["member", "organizer"])
          .as("member_count"),
        eb
          .selectFrom("events as e")
          .select((eb) => eb.fn.min("e.starts_at").as("next"))
          .whereRef("e.group_id", "=", "g.id")
          .where("e.status", "=", "scheduled")
          .where("e.starts_at", ">=", new Date())
          .as("next_event_scheduled"),
      ])
      .where("g.name", "ilike", `%${query}%`)
      .orderBy(textSearchRelevance(sql.ref("g.name"), query), "asc")
      .orderBy("g.name", "asc")
      .orderBy("g.id", "asc")
      .limit(limit)
      .execute();
  }
}
