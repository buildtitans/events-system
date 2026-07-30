import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type {
  SelectedAttendant,
  PrivateUserAttendanceUpdate,
} from "../../types/types";
import { EventAttendantsValidator } from "./eventAttendantsValidator";

export interface IEventAttendantsWriter {
  updateAttendanceStatus(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType>;
}

export class EventAttendantsWriter implements IEventAttendantsWriter {
  constructor(
    private readonly validator: EventAttendantsValidator,
    private readonly db: Kysely<DB>,
  ) {}

  async updateAttendanceStatus(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType> {
    const updatedRaw = await this.upsertStatus(attendant, newStatus);

    return this.validator.parseRawAttendant(updatedRaw);
  }

  private async upsertStatus(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<SelectedAttendant> {
    const now = new Date();

    return await this.db
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
  }
}
