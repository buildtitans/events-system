import { Kysely, Selectable, sql } from "kysely";
import { DB, Events, Groups } from "@/src/server/core/db/types/db";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { textSearchRelevance } from "@/src/server/core/lib/utils/queries/textSearchRelevance";

export type RawArchives = {
  event: Selectable<Events>;
  attendance: {
    going: number;
    interested: number;
  };
}[];

export class RawGroupsReader {
  constructor(private readonly db: Kysely<DB>) {}

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

    return rows.map(({ going, interested, ...event }) => ({
      event,
      attendance: {
        going: Number(going),
        interested: Number(interested),
      },
    }));
  }

  async allRawGroups(): Promise<Selectable<Groups>[]> {
    return this.db
      .selectFrom("groups")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }

  async rawById(id: GroupSchemaType["id"]): Promise<Selectable<Groups>> {
    return await this.db
      .selectFrom("groups")
      .where("id", "=", id)
      .selectAll()
      .limit(1)
      .executeTakeFirstOrThrow();
  }

  async rawByIds(ids: GroupSchemaType["id"][]): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .where("id", "in", ids)
      .selectAll()
      .execute();
  }

  async rawBySlug(slug: GroupSchemaType["slug"]): Promise<Selectable<Groups>> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("slug", "=", slug)
      .executeTakeFirstOrThrow();
  }

  async rawByOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("organizer_id", "=", organizer_id)
      .execute();
  }

  async rawSearchByName(query: string): Promise<Selectable<Groups>[]> {
    return this.db
      .selectFrom("groups")
      .selectAll()
      .where("name", "ilike", `%${query}%`)
      .orderBy(textSearchRelevance(sql.ref("groups.name"), query), "asc")
      .orderBy("name", "asc")
      .orderBy("id", "asc")
      .limit(25)
      .execute();
  }

  async rawSuggestByName(query: string): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("name", "ilike", `%${query}%`)
      .orderBy(textSearchRelevance(sql.ref("groups.name"), query), "asc")
      .orderBy("name", "asc")
      .orderBy("id", "asc")
      .limit(5)
      .execute();
  }

  async rawByCategoryId(
    id: CategorySchemaType["id"],
  ): Promise<Selectable<Groups>[]> {
    return await this.db
      .selectFrom("groups")
      .selectAll()
      .where("category_id", "=", id)
      .execute();
  }
}
