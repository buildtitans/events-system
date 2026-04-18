import { Kysely, Selectable } from "kysely";
import { DB, EventAttendants } from "@/src/server/core/db/types/db";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { ValidateRawAttendants } from "../../../lib/validation/schemaValidators";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { retryLink } from "@trpc/client";
dayjs.extend(utc);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";

type SelectedAttendant = Selectable<EventAttendants>;

type PrivateUserAttendanceUpdate = Pick<
  EventAttendantsSchemaType,
  "event_id" | "user_id"
>;

export class EventAttendantsClient {
  constructor(private readonly db: Kysely<DB>) {}

  async getUserRsvpStatusToEvent(user_id: string, event_id: string) {
    const result = await this.db
      .selectFrom("event_attendants")
      .select("status")
      .where("user_id", "=", user_id)
      .where("event_id", "=", event_id)
      .executeTakeFirst();

    return result?.status ?? "not_going";
  }

  async getAllAttendanceRecords() {
    const raw = await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .execute();

    return this.parseRawAttendants(raw);
  }

  async getAttendants(event_id: string): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.getRawAttendants(event_id);
    return this.parseRawAttendants(raw);
  }

  async getPastEventRecords(
    ids: string[],
  ): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "in", ids)
      .where("status", "=", "going")
      .execute();

    return this.parseRawAttendants(raw);
  }

  async updateAttendanceStatus(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType> {
    const updatedRaw = await this.upsertStatus(attendant, newStatus);

    return this.parseRawAttendant(updatedRaw);
  }

  async getUserAttendanceRecords(
    user_id: DbUserSchemaType["id"],
  ): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();

    return this.parseRawAttendants(raw);
  }

  async getRawAttendants(
    event_id: string,
  ): Promise<Selectable<EventAttendants>[]> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "=", event_id)
      .execute();
  }

  async getRawAttendant(
    attendant: EventAttendantsSchemaType,
  ): Promise<SelectedAttendant> {
    return await this.db
      .selectFrom("event_attendants")
      .selectAll()
      .where("event_id", "=", attendant.event_id)
      .where("user_id", "=", attendant.user_id)
      .limit(1)
      .executeTakeFirstOrThrow();
  }

  async upsertStatus(
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

  parseRawAttendants(
    raw: Selectable<EventAttendants>[],
  ): EventAttendantsSchemaType[] {
    return raw.map((row) => {
      const created_at = dayjs(row.created_at).utc().format(ISO_FORMAT);

      const updated_at = row.updated_at
        ? dayjs(row.updated_at).utc().format(ISO_FORMAT)
        : null;

      return ValidateRawAttendants({
        event_id: row.event_id,
        user_id: row.user_id,
        status: row.status,
        created_at,
        updated_at,
      });
    });
  }

  parseRawAttendant(
    row: Selectable<EventAttendants>,
  ): EventAttendantsSchemaType {
    const created_at = dayjs(row.created_at).utc().format(ISO_FORMAT);

    const updated_at = row.updated_at
      ? dayjs(row.updated_at).utc().format(ISO_FORMAT)
      : null;

    return ValidateRawAttendants({
      event_id: row.event_id,
      user_id: row.user_id,
      status: row.status,
      created_at,
      updated_at,
    });
  }
}
