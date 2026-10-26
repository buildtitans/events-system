import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { PrivateUserAttendanceUpdate } from "../../types/types";
import { EventAttendantsValidator } from "./eventAttendantsValidator";
import { RsvpUpdateResponseSchemaType } from "../../../../../../schemas/events/rsvpSchema";

export interface IEventAttendantsWriter {
  rsvp(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<RsvpUpdateResponseSchemaType>;
}

export class EventAttendantsWriter implements IEventAttendantsWriter {
  constructor(
    private readonly validator: EventAttendantsValidator,
    private readonly db: Kysely<DB>,
  ) {}

  async rsvp(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<RsvpUpdateResponseSchemaType> {
    const rsvpUpdate = await this.updateRsvp(attendant, newStatus);

    return this.validator.rsvp(rsvpUpdate);
  }

  private async updateRsvp(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ) {
    const now = new Date();

    const updated = await this.db
      .insertInto("event_attendants")
      .values({
        event_id: attendant.event_id,
        user_id: attendant.user_id,
        status: newStatus,
        created_at: now,
        updated_at: now,
      })
      .onConflict((oc) =>
        oc.columns(["event_id", "user_id"]).doUpdateSet({
          status: newStatus,
          updated_at: now,
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    const attendance = await this.db
      .selectFrom("event_attendants")
      .where("event_id", "=", attendant.event_id)
      .select((eb) => [
        eb.fn
          .countAll<number>()
          .filterWhere("status", "=", "going")
          .as("going"),

        eb.fn
          .countAll<number>()
          .filterWhere("status", "=", "interested")
          .as("interested"),
      ])
      .executeTakeFirstOrThrow();

    return {
      updated: this.validator.parseRawAttendant(updated),
      headCount: {
        going: Number(attendance.going),
        interested: Number(attendance.interested),
      },
    };
  }
}
