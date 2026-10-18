import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpSurfaceSchemaType } from "@/src/schemas/events/rsvpSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export interface ICensusHandler {
  getPopularGroups(): Promise<GroupSchemaType[]>;
}

export interface IRsvpHandler {
  rsvps(
    user_id: AuthenticatedUserId | undefined,
  ): Promise<RsvpSurfaceSchemaType[]>;
  updateRsvpStatus(
    user_id: AuthenticatedUserId | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType>;
}
