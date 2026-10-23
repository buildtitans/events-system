import {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import { Kysely, sql } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import {
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { textSearchRelevance } from "@/src/server/core/lib/utils/queries/textSearchRelevance";
import { jsonObjectFrom, jsonArrayFrom } from "kysely/helpers/postgres";
import { HydratedGroupRead, RawArchives, RawtimelineItem } from "./types";
import { IGroupsParser } from "./groupsParser";
import { RawGroupEvent } from "../events/types";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";

export interface IGroupsReader {
  timeline(id: GroupSchemaType["id"]): Promise<RawtimelineItem[]>;
  history(group_id: GroupSchemaType["id"]): Promise<RawGroupEvent[]>;
  allGroups(): Promise<GroupDiscoverySummarySchemaType[]>;
  hydrateGroup(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedGroupRead>;
  popularGroups(): Promise<GroupDiscoverySummarySchemaType[]>;
  archivedEventsWithAttendance(id: GroupSchemaType["id"]): Promise<RawArchives>;
  search(query: string): Promise<GroupSearchResultSchemaType[]>;
  suggestions(query: string): Promise<GroupSearchSuggestionSchemaType[]>;
  byCategoryId(
    id: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
}

export class RawGroupsReader implements IGroupsReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IGroupsParser,
  ) {}

  async hydrateGroup(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedGroupRead> {
    const result = await this.db
      .selectFrom("groups as g")
      .innerJoin("group_members as gm", "gm.group_id", "g.id")
      .innerJoin("categories as c", "g.category_id", "c.id")
      .innerJoin("users as u", "g.organizer_id", "u.id")
      .where("g.slug", "=", slug)
      .select((eb) => [
        "c.name as category_name",
        "g.id",
        "g.organizer_id",
        "g.updated_at",
        "g.created_at",
        "g.name",
        "g.category_id",
        "g.location",
        "g.slug",
        "g.description",
        "u.email as organizer_email",

        userId
          ? eb.fn
              .coalesce(
                eb
                  .selectFrom("group_members as viewer")
                  .select("viewer.role")
                  .whereRef("viewer.group_id", "=", "g.id")
                  .where("viewer.user_id", "=", userId),
                eb.val("anonymous"),
              )
              .as("viewer_role")
          : eb.val("anonymous").as("viewer_role"),

        eb.fn
          .countAll<number>()
          .filterWhere("role", "in", ["member", "organizer"])
          .as("member_count"),

        jsonObjectFrom(
          eb
            .selectFrom("events as next")
            .leftJoin("event_attendants as a", "a.event_id", "next.id")
            .select((eb) => [
              "next.id",
              "next.group_id",
              "next.status",
              "next.starts_at",
              "next.img",
              "next.description",
              "next.tag",
              "next.title",
              "next.meeting_location",
              eb.fn
                .countAll()
                .filterWhere("a.status", "=", "going")
                .as("going_count"),
              eb.fn
                .countAll()
                .filterWhere("a.status", "=", "interested")
                .as("interested_count"),
            ])
            .whereRef("next.group_id", "=", "g.id")
            .where("next.status", "=", "scheduled")
            .where("next.starts_at", ">=", new Date())
            .groupBy("next.id")
            .orderBy("next.starts_at", "asc")
            .orderBy("next.id", "asc")
            .limit(1),
        ).as("next_event"),

        jsonArrayFrom(
          eb
            .selectFrom("events as e")
            .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
            .where("e.status", "=", "scheduled")
            .where("e.starts_at", ">=", new Date())
            .whereRef("e.group_id", "=", "g.id")
            .select((eb) => [
              "e.id",
              "e.group_id",
              "e.status",
              "e.starts_at",
              "e.meeting_location",
              "e.img",
              "e.tag",
              "e.title",

              eb.fn
                .countAll()
                .filterWhere("ea.status", "=", "going")
                .as("going_count"),

              eb.fn
                .countAll()
                .filterWhere("ea.status", "=", "interested")
                .as("interested_count"),
            ])
            .groupBy("e.id")
            .orderBy("e.starts_at", "asc")
            .orderBy("e.id", "asc"),
        ).as("group_events"),
        jsonArrayFrom(
          eb
            .selectFrom("events as timeline_event")
            .leftJoin("event_attendants as timeline_attendant", "timeline_event.id", "timeline_attendant.event_id")
            .whereRef("timeline_event.group_id", "=", "g.id")
            .where("timeline_event.status", "=", "scheduled")
            .select((eb) => [
              "timeline_event.starts_at",
              "timeline_event.id",
              "timeline_event.group_id",
              "timeline_event.created_at",
              "timeline_event.img as image",
              eb.fn.countAll().filterWhere("timeline_attendant.status", "=", "going").as("number_attended"),
              eb.case()
                .when(eb.cast<string>("timeline_event.starts_at", "date"), "<", sql<string>`current_date`)
                .then("past" as const)
                .when(eb.cast<string>("timeline_event.starts_at", "date"), "=", sql<string>`current_date`)
                .then("today" as const)
                .else("upcoming" as const)
                .end()
                .as("timeline_status"),
            ])
            .groupBy("timeline_event.id")
            .orderBy("timeline_event.starts_at", "asc")
            .orderBy("timeline_event.id", "asc"),
        ).as("calandar"),
      ])
      .groupBy(["g.id", "c.name", "u.email"])
      .executeTakeFirstOrThrow();

    return this.parser.toHydratedGroup(result);
  }

  async search(query: string): Promise<GroupSearchResultSchemaType[]> {
    const results = await this.searchGroups(query, 25);
    return this.parser.toSearchResults(results);
  }

  async suggestions(query: string): Promise<GroupSearchSuggestionSchemaType[]> {
    const suggestions = await this.searchGroups(query, 5);
    return this.parser.toSuggestions(suggestions);
  }

  async byCategoryId(
    id: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups().where("g.category_id", "=", id).execute(),
    );
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

  async popularGroups(): Promise<GroupDiscoverySummarySchemaType[]> {
    const rows = await this.discoveryGroups()
      .where(
        (eb) =>
          eb
            .selectFrom("group_members as gm")
            .select((eb) => eb.fn.countAll().as("count"))
            .whereRef("gm.group_id", "=", "g.id")
            .where("gm.role", "in", ["member", "organizer"]),
        ">=",
        4,
      )
      .execute();
    return this.parser.toDiscoveryGroups(rows);
  }

  async archivedEventsWithAttendance(
    id: GroupSchemaType["id"],
  ): Promise<RawArchives> {
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
      .orderBy("e.starts_at", "asc")
      .orderBy("e.id", "asc")
      .execute();

    return this.parser.toGroupEvents(result);
  }

  private discoveryGroups() {
    return this.db
      .selectFrom("groups as g")
      .innerJoin("categories as c", "g.category_id", "c.id")
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
        jsonObjectFrom(
          eb
            .selectFrom("events as e")
            .leftJoin("event_attendants as ea", "ea.event_id", "e.id")
            .select(["e.id", "e.title", "e.description", "e.starts_at"])
            .select((eb) => [
              eb.fn
                .countAll()
                .filterWhere("ea.status", "=", "going")
                .as("going"),
              eb.fn
                .countAll()
                .filterWhere("ea.status", "=", "interested")
                .as("interested"),
            ])
            .whereRef("e.group_id", "=", "g.id")
            .where("e.status", "=", "scheduled")
            .where("e.starts_at", ">=", new Date())
            .groupBy("e.id")
            .orderBy("e.starts_at", "asc")
            .orderBy("e.id", "asc")
            .limit(1),
        ).as("next_event"),
      ])
      .orderBy("g.created_at", "desc")
      .orderBy("g.id", "asc");
  }

  async allGroups(): Promise<GroupDiscoverySummarySchemaType[]> {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups().execute(),
    );
  }

  async byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups()
        .where("g.organizer_id", "=", organizer_id)
        .execute(),
    );
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
