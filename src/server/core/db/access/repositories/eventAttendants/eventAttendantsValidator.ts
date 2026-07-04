import type { Selectable } from "kysely";
import type { EventAttendants } from "@/src/server/core/db/types/db";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import {
  AttendanceStatusValidator,
  ValidateRawAttendants,
} from "../../../../lib/validation/schemaValidators";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ISO_FORMAT } from "../../../../lib/tokens/isoFormats";
dayjs.extend(utc);

export class EventAttendantsValidator {
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

  parseRsvpStatusResult(status: unknown): EventAttendantsSchemaType["status"] {
    return AttendanceStatusValidator(status);
  }
}
