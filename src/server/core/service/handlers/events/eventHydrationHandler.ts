import {
  EventAttendantsSchemaType,
  EventAttendantStatusSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpStatusSchemaValidator } from "@/src/server/core/lib/validation/schemaValidators";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { HydratedEvent } from "@/src/server/core/service/types";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type {
  IEventHydrationHandler,
  EventHydrationDb,
  AttendanceAndRole,
} from "./types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { assertNever } from "@/src/server/core/lib/asserts/assertNever";

export class EventHydrationHandler implements IEventHydrationHandler {
  constructor(private readonly db: EventHydrationDb) {}

  async openedEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<HydratedEvent> {
    return await this.hydrateSelectedEvent(user_id, event_id);
  }

  private async hydrateSelectedEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<HydratedEvent> {
    const event = await this.db.events.select.byId(event_id);
    const [attendanceAndRole, nameAndSlug] = await Promise.all([
      this.getAttendanceAndRole(user_id, event),
      this.getNameAndSlug(event),
    ]);
    return this.toHydratedEventDto({ event, attendanceAndRole, nameAndSlug });
  }

  private async getAttendanceAndRole(
    user_id: string | undefined | null,
    event: EventSchemaType,
  ): Promise<AttendanceAndRole> {
    const [rsvpStatus, attendants, role] = await Promise.all([
      this.getEventRsvp(user_id, event.id),
      this.getAttendingAndInterested(event.id),
      this.getUserRoleInGroup(user_id, event.group_id),
    ]);

    return {
      rsvpStatus,
      attendants,
      role,
    };
  }

  private async getUserRoleInGroup(
    user_id: string | undefined | null,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupMemberSchemaType["role"]> {
    if (user_id && group_id) {
      return await this.db.groupMembers.select.role(user_id, group_id);
    } else return "anonymous";
  }

  private async getNameAndSlug(
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

  private toHydratedEventDto(params: {
    event: EventSchemaType;
    attendanceAndRole: AttendanceAndRole;
    nameAndSlug: { name: string; slug: string };
  }): HydratedEvent {
    const { role, rsvpStatus, attendants } = params.attendanceAndRole;
    const { name, slug } = params.nameAndSlug;

    return {
      event: params.event,
      meta: {
        rsvpStatus,
        attendants,
        role,
        name,
        slug,
      },
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

  private async getAttendingAndInterested(event_id: string): Promise<{
    going: number;
    interested: number;
  }> {
    const attendance =
      await this.db.eventAttendants.select.attendants(event_id);
    return this.countGoingAndInterested(attendance);
  }

  private countGoingAndInterested(attendance: EventAttendantsSchemaType[]): {
    going: number;
    interested: number;
  } {
    let goingCount: number = 0;
    let interestedCount: number = 0;

    for (const attendant of attendance) {
      switch (attendant.status) {
        case "going": {
          goingCount++;
          break;
        }
        case "interested": {
          interestedCount++;
          break;
        }

        case "not_going": {
          break;
        }

        default: {
          assertNever(attendant.status);
        }
      }
    }

    return {
      going: goingCount,
      interested: interestedCount,
    };
  }
}
