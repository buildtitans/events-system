import {
  EventSchemaType,
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "../../../../schemas/events/eventSchema";
import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

export class EventLifecycleHandler {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

  async updateEventStatus(
    user_id: string | null | undefined,
    eventUpdate: UpdateEventArgsSchemaType,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, eventUpdate.group_id);

    return await this.db.events.updateEventStatus(eventUpdate);
  }

  async createEvent(
    newEvent: NewEventInputSchemaType,
    group_id: EventSchemaType["group_id"],
    user_id: string | undefined,
  ): Promise<EventSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireOrganizer(userId, group_id);

    return await this.db.events.createNewEvent(newEvent);
  }
}
