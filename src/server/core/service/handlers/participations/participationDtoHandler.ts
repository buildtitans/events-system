import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupNameLookupMap } from "../../types";
import { StatusLookupType } from "@/src/server/core/lib/utils/filterRsvps";

export class ParticipationDtoHandler {
  constructor() {}

  public toRsvpShape(
    events: EventSchemaType[],
    groupNameHash: GroupNameLookupMap,
    statusLookup: StatusLookupType,
  ): RsvpSchemaType[] {
    const results = events.map((event) => ({
      event_id: event.id,
      group_id: event.group_id,
      group_name: groupNameHash[event.group_id].name,
      starts_at: event.starts_at,
      starts_at_ms: event.starts_at_ms,
      scheduled_status: event.status,
      location: event.meeting_location,
      attendance_status: statusLookup[event.id],
      event_title: event.title,
      group_slug: groupNameHash[event.group_id].slug,
    }));
    return results;
  }
}
