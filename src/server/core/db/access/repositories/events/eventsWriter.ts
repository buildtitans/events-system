import type { Insertable, Kysely } from "kysely";
import { EventsValidator } from "./eventsValidator";
import type {
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "../../../../../../schemas/events/eventSchema";
import type { EventSchemaType } from "../../../../../../schemas/events/eventSchema";
import type { Events, DB } from "../../../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class EventsWriter {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validate: EventsValidator,
  ) {}

  async update(
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

  async create(newEvent: NewEventInputSchemaType): Promise<EventSchemaType> {
    const insertable = this.toInsertableEvent(newEvent);
    const inserted = await this.insertNewEvent(insertable);
    return this.validate.event(inserted);
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

  private async insertNewEvent(newEvent: Insertable<Events>) {
    return await this.db
      .insertInto("events")
      .values(newEvent)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
