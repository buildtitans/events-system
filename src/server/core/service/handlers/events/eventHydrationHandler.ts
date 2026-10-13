import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import {
  EventReadModelSchemaType,
  HydratedEventSchema,
  HydratedEventSchemaType,
  UserSpecificEventMetaDataSchema,
  UserSpecificEventMetaDataSchemaType,
} from "@/src/schemas/events/eventSchema";
import { GroupRoleSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { IEventHydrationHandler, EventHydrationDb } from "./types";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";

export class EventHydrationHandler implements IEventHydrationHandler {
  constructor(private readonly db: EventHydrationDb) {}

  async event(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<HydratedEventSchemaType> {
    return await this.hydrate(user_id, event_id);
  }

  private async hydrate(user_id: string | undefined | null, event_id: string) {
    const event = await this.db.events.select.hydrate(event_id);
    const userMeta = await this.getRoleAndStatus(
      user_id,
      event_id,
      event.event.group_id,
    );
    return this.toHydratedEvent(event, userMeta);
  }

  private async getRoleAndStatus(
    user_id: string | undefined | null,
    event_id: string,
    group_id: string,
  ) {
    let userMeta: UserSpecificEventMetaDataSchemaType;

    if (user_id) {
      const [status, role] = await Promise.all([
        this.db.eventAttendants.select.rsvp(user_id, event_id),
        this.db.groupMembers.select.role(user_id, group_id),
      ]);

      userMeta = { status, role };
    } else {
      userMeta = { status: "not_going", role: "anonymous" };
    }

    return validateOrThrow(UserSpecificEventMetaDataSchema, userMeta);
  }

  private toHydratedEvent(
    eventHydrated: EventReadModelSchemaType,
    userMeta: {
      status: EventAttendantStatusSchemaType;
      role: GroupRoleSchemaType;
    },
  ): HydratedEventSchemaType {
    const { event, meta: eventMeta } = eventHydrated;
    const { status, role } = userMeta;

    const dto = {
      event: event,
      meta: {
        event: eventMeta,
        user: { status, role },
      },
    };

    return validateOrThrow(HydratedEventSchema, dto);
  }
}
