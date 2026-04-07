import { Insertable, Kysely, Selectable } from "kysely";
import { DB, Events } from "../../types/db";
import {
  EventsArraySchemaType,
  EventSchemaType,
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eventValidator } from "@/src/shared/utils/validation/validateSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
dayjs.extend(utc);

export class EventsClient {
  constructor(private readonly db: Kysely<DB>) {
    this.db = db;
  }

  async getEvents(): Promise<EventsArraySchemaType> {
    const raw = await this.getRawEvents();

    console.log({
      EventSchema: this.formatRawEvents(raw),
    });

    return this.formatRawEvents(raw);
  }

  async getFlattenedEvents(): Promise<EventsArraySchemaType> {
    const raw = await this.db.selectFrom("events").selectAll().execute();
    return this.formatRawEvents(raw);
  }

  async searchEventByTitle(
    query: SearchSchemaType,
  ): Promise<EventsArraySchemaType> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("title", "ilike", `%${query}%`)
      .execute();

    return this.formatRawEvents(raw);
  }

  async getGroupEvents(
    group_id: Selectable<Events>["group_id"],
  ): Promise<EventSchemaType[]> {
    const raw = await this.getRawEventsFromGroup(group_id);
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return this.formatRawEvents(raw);
  }

  async getGroupEventsByGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<EventsArraySchemaType> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .execute();

    return this.formatRawEvents(raw);
  }

  async getEventsByGroupIds(
    groupIds: GroupSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    if (groupIds.length === 0) return [];

    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "in", groupIds)
      .where("status", "=", "scheduled")
      .execute();

    return this.formatRawEvents(raw);
  }

  async getFlattenedEventsByIds(
    ids: EventSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    const raw = await this.getRawEventsByIds(ids);
    return this.formatRawEvents(raw);
  }

  async getEvent(
    event_id: EventSchemaType["id"],
  ): Promise<EventSchemaType | null> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("id", "=", event_id)
      .limit(1)
      .executeTakeFirstOrThrow();

    return this.formatEvent(raw);
  }

  async getEventsByIds(
    ids: EventSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    const raw = await this.getRawEventsByIds(ids);
    return this.formatRawEvents(raw);
  }

  async updateEventStatus(
    eventUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }> {
    const update = await this.db
      .updateTable("events")
      .set({
        status: eventUpdate.status,
      })
      .where("id", "=", eventUpdate.event_id)
      .executeTakeFirstOrThrow();

    return { updateStatus: update ? "success" : "failure" };
  }

  async createNewEvent(
    newEvent: NewEventInputSchemaType,
  ): Promise<EventSchemaType> {
    const insertable = this.toInsertableEvent(newEvent);
    const inserted = await this.insertNewEvent(insertable);
    const event = this.formatEvent(inserted);
    return event;
  }

  private async getRawEvents(): Promise<Selectable<Events>[]> {
    return this.db
      .selectFrom("events")
      .selectAll()
      .where("status", "=", "scheduled")
      .orderBy("created_at", "desc")
      .execute();
  }

  private async getRawEventsByIds(ids: EventSchemaType["id"][]) {
    return await this.db
      .selectFrom("events")
      .selectAll()
      .where("id", "in", ids)
      .where("status", "=", "scheduled")
      .execute();
  }

  private async getRawEventsFromGroup(
    group_id: Selectable<Events>["group_id"],
  ): Promise<Selectable<Events>[] | undefined> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .orderBy("created_at")
      .execute();
    return raw;
  }

  private toInsertableEvent(
    newEvent: NewEventInputSchemaType,
  ): Insertable<Events> {
    const start_time = dayjs(newEvent.starts_at)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.sssZ");

    return {
      title: newEvent.title,
      description: newEvent.description,
      img: "https://picsum.photos/800/450?random=2",
      group_id: newEvent.group_id,
      starts_at: start_time,
      created_at: new Date(),
      tag: "placeholder tag",
      meeting_location: newEvent.meeting_location,
      status: "scheduled",
    };
  }

  private async insertNewEvent(
    newEvent: Insertable<Events>,
  ): Promise<Selectable<Events>> {
    return await this.db
      .insertInto("events")
      .values(newEvent)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  private formatRawEvents(rows: Selectable<Events>[]): EventSchemaType[] {
    return rows.map((row) => {
      const startsAtMs = row.starts_at.getTime();

      return eventValidator({
        id: String(row.id),
        img: row.img,
        tag: row.tag,
        title: row.title,
        description: row.description,
        starts_at_ms: startsAtMs,
        starts_at: row.starts_at.toISOString(),
        meeting_location: row.meeting_location,
        group_id: row.group_id,
        created_at: row.created_at.toISOString(),
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
        status: row.status,
      });
    });
  }

  private formatEvent(raw: Selectable<Events>): EventSchemaType {
    const startsAtMs = raw.starts_at.getTime();

    return eventValidator({
      id: raw.id,
      tag: raw.tag,
      title: raw.title,
      description: raw.description,
      updated_at: raw.updated_at.toISOString(),
      created_at: raw.created_at.toISOString(),
      group_id: raw.group_id,
      starts_at: raw.starts_at.toISOString(),
      starts_at_ms: startsAtMs,
      img: raw.img,
      meeting_location: raw.meeting_location,
      status: raw.status,
    });
  }
}
