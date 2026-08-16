import { Kysely, Selectable } from "kysely";
import { DB, Events } from "../../../types/db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export class RawEventsReader {
  constructor(private readonly db: Kysely<DB>) {}

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

  async rawByTitle(query: SearchSchemaType): Promise<Selectable<Events>[]> {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("title", "ilike", `%${query}%`)
      .where("status", "=", "scheduled")
      .execute();
  }
}
