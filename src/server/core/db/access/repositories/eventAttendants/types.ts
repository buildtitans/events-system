import { Selectable } from "kysely";
import { EventAttendants } from "@/src/server/core/db/types/db";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";

export interface IEventAttendantsReader {
  rsvps(user_id: AuthenticatedUserId): Promise<RawRsvp[]>;
  rawRsvp({
    user_id,
    event_id,
  }: {
    user_id: string;
    event_id: string;
  }): Promise<{ status: string } | undefined>;
  allRawRecords(): Promise<Selectable<EventAttendants>[]>;
}

export type RawRsvp = {
  rsvp: {
    group_id: string;
    event_id: string;
    attendance_status: string;
    event_title: string;
    location: string;
    starts_at: string;
    starts_at_ms: number;
    scheduled_status: string;
  };
  meta: {
    group_slug: string;
    group_name: string;
    category_name: string;
  };
};

export type ReadRsvp = {
  group_id: string;
  event_id: string;
  attendance_status: string;
  event_title: string;
  location: string;
  starts_at: Date;
  scheduled_status: string;
  group_slug: string;
  group_name: string;
  category_name: string;
};
