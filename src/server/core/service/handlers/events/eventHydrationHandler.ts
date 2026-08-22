import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpStatusSchemaValidator } from "@/src/server/core/lib/validation/schemaValidators";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { HydratedEvent } from "@/src/server/core/service/types";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { IEventHydrationHandler, EventHydrationDb } from "./types";

export class EventHydrationHandler implements IEventHydrationHandler {
  constructor(private readonly db: EventHydrationDb) {}

  async openedEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<HydratedEvent> {
    const event = await this.db.events.select.byId(event_id);
    const rsvpStatus = await this.getEventRsvp(user_id, event_id);
    const attendants = await this.getAttendingAndInterested(event_id);
    const role = await this.getUserRoleInGroup(user_id, event_id);
    const { name, slug } = await this.getEventMetaData(event);
    return {
      event,
      meta: {
        rsvpStatus,
        attendants,
        role,
        name,
        slug,
      },
    };
  }

  private async getUserRoleInGroup(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<GroupMemberSchemaType["role"]> {
    const event = await this.db.events.select.byId(event_id);

    if (user_id && event) {
      return await this.db.groupMembers.select.role(user_id, event.group_id);
    } else return "anonymous";
  }

  private async getEventMetaData(
    event: EventSchemaType,
  ): Promise<{ name: string; slug: string }> {
    const { group_id } = event;
    const res = await this.db.groups.select.byId(group_id);

    const { name, slug } = res;
    return {
      name,
      slug,
    };
  }

  private async getEventRsvp(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<EventAttendantStatusSchemaType> {
    if (user_id) {
      const status = await this.db.eventAttendants.select.rsvp(
        user_id,
        event_id,
      );

      return RsvpStatusSchemaValidator(status);
    } else {
      return "not_going";
    }
  }

  private async getAttendingAndInterested(event_id: string) {
    const attendance =
      await this.db.eventAttendants.select.attendants(event_id);

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
