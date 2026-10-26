import type { Selectable } from "kysely";
import type { EventAttendants } from "@/src/server/core/db/types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ISO_FORMAT } from "../../../../../../lib/tokens/isoFormats";
import { ReadRsvp } from "../../types";
dayjs.extend(utc);

export type RsvpShape = {
  rsvp: {
    starts_at: string;
    starts_at_ms: number;
    group_id: string;
    event_id: string;
    attendance_status: string;
    event_title: string;
    location: string;
    scheduled_status: string;
  };
  meta: {
    group_slug: string;
    group_name: string;
    category_name: string;
  };
};

export type AttendantShape = {
  event_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

export interface IEventAttendantsParser {
  toRsvps(result: ReadRsvp[]): RsvpShape[];
  toRsvpStatus(raw: { status: string }): string;
  toAttendant(row: Selectable<EventAttendants>): AttendantShape;
}

export class EventAttendantsParser {
  toRsvpStatus(raw: { status: string }): string {
    return raw.status;
  }

  toRsvps(result: ReadRsvp[]): RsvpShape[] {
    return result.map((rsvp) => {
      const { starts_at, group_name, group_slug, category_name, ...rest } =
        rsvp;
      return {
        rsvp: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          group_slug,
          group_name,
          category_name: category_name,
        },
      };
    });
  }

  toAttendant(row: Selectable<EventAttendants>): AttendantShape {
    const created_at = dayjs(row.created_at).utc().format(ISO_FORMAT);

    const updated_at = row.updated_at
      ? dayjs(row.updated_at).utc().format(ISO_FORMAT)
      : null;

    return {
      event_id: row.event_id,
      user_id: row.user_id,
      status: row.status,
      created_at,
      updated_at,
    };
  }
}
