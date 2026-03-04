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
import { formatRawEvents } from "../../../layout/utils";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { eventValidator } from "@/src/lib/utils/validation/validateSchema";
import { compileEventsLayout } from "@/src/server/src/layout/compileEventsLayout";
import { EventSearchSchemaType } from "@/src/schemas/events/eventsSearchSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
dayjs.extend(utc);

export class EventsClient {
  constructor(private readonly db: Kysely<DB>) {
    this.db = db;
  }

  async getEvents() {
    const raw = await this.getRawEvents();
    return compileEventsLayout(raw);
  }

  async getFlattenedEvents(): Promise<EventsArraySchemaType> {
    const raw = await this.db.selectFrom("events").selectAll().execute();
    return formatRawEvents(raw);
  }

  async searchEventByTitle(
    query: EventSearchSchemaType,
  ): Promise<EventsArraySchemaType> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("title", "ilike", `%${query}%`)
      .execute();

    return formatRawEvents(raw);
  }

  async getGroupEvents(
    group_id: Selectable<Events>["group_id"],
  ): Promise<PaginatedLayoutSchemaType> {
    const raw = await this.getRawEventsFromGroup(group_id);
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return compileEventsLayout(raw);
  }

  async getGroupEventsByGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<EventsArraySchemaType> {
    const raw = await this.db
      .selectFrom("events")
      .selectAll()
      .where("group_id", "=", group_id)
      .execute();

    return formatRawEvents(raw);
  }

  async getEventsByIds(
    ids: EventSchemaType["id"][],
  ): Promise<PaginatedLayoutSchemaType> {
    const raw = await this.getRawEventsByIds(ids);
    return compileEventsLayout(raw);
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
  ): Promise<EventSchemaType | null> {
    const insertable = this.toInsertableEvent(newEvent);
    const inserted = await this.insertNewEvent(insertable);
    const event = inserted ? this.formatEvent(inserted) : inserted;
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
    const stringified_authors = JSON.stringify(newEvent.authors);

    return {
      title: newEvent.title,
      description: newEvent.description,
      img: "https://picsum.photos/800/450?random=2",
      group_id: newEvent.group_id,
      authors: stringified_authors,
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

  private formatEvent(raw: Selectable<Events>): EventSchemaType {
    const parsed_authors =
      typeof raw.authors === "string" ? JSON.parse(raw.authors) : raw.authors;

    return eventValidator({
      id: raw.id,
      tag: raw.tag,
      title: raw.title,
      description: raw.description,
      updated_at: raw.updated_at.toISOString(),
      created_at: raw.created_at.toISOString(),
      group_id: raw.group_id,
      authors: parsed_authors,
      starts_at: raw.starts_at.toISOString(),
      img: raw.img,
      meeting_location: raw.meeting_location,
      status: raw.status,
    });
  }
}
