import type { Insertable, Kysely, UpdateResult } from "kysely";
import { EventsValidator } from "./eventsValidator";
import type {
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { Events, DB } from "@/src/server/core/db/types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ISO_FORMAT } from "@/src/server/core/lib/tokens/isoFormats";
dayjs.extend(utc);

export interface IEventsWriter {
  update(
    eventUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }>;
  create(newEvent: NewEventInputSchemaType): Promise<EventSchemaType>;
}

export class EventsWriter implements IEventsWriter {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validate: EventsValidator,
  ) {}

  async update(
    eventUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }> {
    const update: UpdateResult = await this.db
      .updateTable("events")
      .set({
        status: eventUpdate.status,
      })
      .where("id", "=", eventUpdate.event_id)
      .where("group_id", "=", eventUpdate.group_id)

      .executeTakeFirstOrThrow();

    return { updateStatus: update.numUpdatedRows > 0 ? "success" : "failure" };
  }

  async create(newEvent: NewEventInputSchemaType): Promise<EventSchemaType> {
    const insertable = this.toInsertableEvent(newEvent);
    const inserted = await this.insertNewEvent(insertable);
    return this.validate.event(inserted);
  }

  private toInsertableEvent(
    newEvent: NewEventInputSchemaType,
  ): Insertable<Events> {
    const start_time = dayjs(newEvent.starts_at).utc().format(ISO_FORMAT);

    return {
      title: newEvent.title,
      description: newEvent.description,
      img: newEvent.img ?? "https://picsum.photos/800/450?random=2",
      group_id: newEvent.group_id,
      starts_at: start_time,
      created_at: new Date(),
      tag: newEvent.tag ?? null,
      meeting_location: newEvent.meeting_location,
      status: "scheduled",
    };
  }

  private async insertNewEvent(newEvent: Insertable<Events>) {
    return await this.db
      .insertInto("events")
      .values(newEvent)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
