import { type EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { RsvpSurfaceSchemaType } from "@/src/schemas/events/rsvpSchema";
import type { ParticipationsServiceDb } from "@/src/server/core/service/services/types";
import { IAuthorization } from "@/src/server/core/service/auth/authorization";
import { AuthenticatedUserId } from "../session/SessionHandler";

export interface IRsvpHandler {
  rsvps(user_id: AuthenticatedUserId): Promise<RsvpSurfaceSchemaType[]>;
  updateRsvpStatus(
    user_id: AuthenticatedUserId | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType>;
}

export class RsvpHandler implements IRsvpHandler {
  constructor(
    private readonly db: ParticipationsServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  public async rsvps(
    user_id: AuthenticatedUserId,
  ): Promise<RsvpSurfaceSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.eventAttendants.select.rsvps(userId);
  }

  public async updateRsvpStatus(
    user_id: AuthenticatedUserId | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);

    return await this.db.eventAttendants.write.updateAttendanceStatus(
      { event_id, user_id: userId },
      newStatus,
    );
  }

}
