import { DBClient } from "../../db";
import {
  EventAttendantStatusSchemaType,
  RsvpStatusSchemaValidator,
} from "@/src/schemas/events/eventAttendantsSchema";

export class EventHydrationHandler {
  constructor(private readonly db: DBClient) {}

  async openedEvent(user_id: string | undefined | null, event_id: string) {
    const rsvpStatus = await this.getEventRsvp(user_id, event_id);
    const attendants = await this.getAttendingAndInterested(event_id);
    const role = await this.getUserRoleInGroup(user_id, event_id);

    return {
      rsvpStatus,
      attendants,
      role,
    };
  }

  async getUserRoleInGroup(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<"member" | "organizer" | "anonymous"> {
    const event = await this.db.events.getEvent(event_id);

    if (user_id && event) {
      return await this.db.groupMembers.getMembershipRole(
        user_id,
        event.group_id,
      );
    } else return "anonymous";
  }

  private async getEventRsvp(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<EventAttendantStatusSchemaType> {
    if (user_id) {
      const status = await this.db.eventAttendants.getUserRsvpStatusToEvent(
        user_id,
        event_id,
      );

      return RsvpStatusSchemaValidator(status);
    } else {
      return "not_going";
    }
  }

  private async getAttendingAndInterested(event_id: string) {
    const attendance = await this.db.eventAttendants.getAttendants(event_id);

    let goingCount: number = 0;
    let interestedCount: number = 0;

    attendance.forEach((att) => {
      if (att.status === "going") {
        goingCount++;
      }
    });

    attendance.forEach((att) => {
      if (att.status === "interested") {
        interestedCount++;
      }
    });

    return {
      going: goingCount,
      interested: interestedCount,
    };
  }
}
