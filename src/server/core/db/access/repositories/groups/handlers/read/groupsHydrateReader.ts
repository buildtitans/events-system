import { sql, type Kysely } from "kysely";
import type {
  GroupDiscoverySummarySchemaType,
  GroupHydratedSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { CategorySchemaType } from "../../../../../../../../schemas/groups/categoriesSchema";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { HydratedGroupRead, ParsedRefreshGroupRead } from "../../types";
import { AuthenticatedUserId } from "../../../../../../service/handlers/session/SessionHandler";
import { IGroupsParser } from "../parse/groupsParser";
import { DB } from "../../../../../types/db";

export interface IGroupsHydrateReader {
  readonly list: IGroupsListHydrateReader;
  single(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedGroupRead>;
  refreshGroup(id: GroupSchemaType["id"]): Promise<ParsedRefreshGroupRead>;
}

export class GroupsHydrateReader implements IGroupsHydrateReader {
  public readonly list: IGroupsListHydrateReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IGroupsParser,
  ) {
    this.list = new GroupsListHydrateReader(this.db, this.parser);
  }

  async single(slug: GroupSchemaType["slug"], userId?: AuthenticatedUserId) {
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
            .leftJoin(
              "event_attendants as timeline_attendant",
              "timeline_event.id",
              "timeline_attendant.event_id",
            )
            .whereRef("timeline_event.group_id", "=", "g.id")
            .where("timeline_event.status", "=", "scheduled")
            .select((eb) => [
              "timeline_event.starts_at",
              "timeline_event.id",
              "timeline_event.group_id",
              "timeline_event.created_at",
              "timeline_event.img as image",
              eb.fn
                .countAll()
                .filterWhere("timeline_attendant.status", "=", "going")
                .as("number_attended"),
              eb
                .case()
                .when(
                  eb.cast<string>("timeline_event.starts_at", "date"),
                  "<",
                  sql<string>`current_date`,
                )
                .then("past" as const)
                .when(
                  eb.cast<string>("timeline_event.starts_at", "date"),
                  "=",
                  sql<string>`current_date`,
                )
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

  async refreshGroup(
    id: GroupSchemaType["id"],
  ): Promise<ParsedRefreshGroupRead> {
    const result = await this.db
      .selectFrom("groups as g")
      .innerJoin("group_members as gm", "gm.group_id", "g.id")
      .innerJoin("categories as c", "g.category_id", "c.id")
      .innerJoin("users as u", "g.organizer_id", "u.id")
      .where("g.id", "=", id)
      .select((eb) => [
        "c.name as category_name",
        "g.name as group_name",

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
            .leftJoin(
              "event_attendants as timeline_attendant",
              "timeline_event.id",
              "timeline_attendant.event_id",
            )
            .whereRef("timeline_event.group_id", "=", "g.id")
            .where("timeline_event.status", "=", "scheduled")
            .select((eb) => [
              "timeline_event.starts_at",
              "timeline_event.id",
              "timeline_event.group_id",
              "timeline_event.created_at",
              "timeline_event.img as image",
              eb.fn
                .countAll()
                .filterWhere("timeline_attendant.status", "=", "going")
                .as("number_attended"),
              eb
                .case()
                .when(
                  eb.cast<string>("timeline_event.starts_at", "date"),
                  "<",
                  sql<string>`current_date`,
                )
                .then("past" as const)
                .when(
                  eb.cast<string>("timeline_event.starts_at", "date"),
                  "=",
                  sql<string>`current_date`,
                )
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

    return this.parser.toGroupRefresh(result);
  }
}

interface IGroupsListHydrateReader {
  byCategoryId(
    id: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  popular(): Promise<GroupDiscoverySummarySchemaType[]>;
  all(): Promise<GroupDiscoverySummarySchemaType[]>;
}

export class GroupsListHydrateReader implements IGroupsListHydrateReader {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IGroupsParser,
  ) {}

  async all() {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups().execute(),
    );
  }

  async popular() {
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

  async byCategoryId(id: CategorySchemaType["id"]) {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups().where("g.category_id", "=", id).execute(),
    );
  }

  async byOrganizerId(organizer_id: GroupSchemaType["organizer_id"]) {
    return this.parser.toDiscoveryGroups(
      await this.discoveryGroups()
        .where("g.organizer_id", "=", organizer_id)
        .execute(),
    );
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
}
