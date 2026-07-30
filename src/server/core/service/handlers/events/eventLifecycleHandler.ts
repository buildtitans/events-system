import {
  EventSchemaType,
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { IEventLifecycleHandler } from "./types";

export class EventLifecycleHandler implements IEventLifecycleHandler {
  constructor(
    private readonly db: Pick<IDBClient, "events">,
    private readonly policy: Authorization,
  ) {}

  async updateEventStatus(
    user_id: string | null | undefined,
    statusUpdate: UpdateEventArgsSchemaType,
  ): Promise<{ updateStatus: "success" | "failure" }> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, statusUpdate.group_id);

    return await this.db.events.write.update(statusUpdate);
  }

  async createEvent(
    newEvent: NewEventInputSchemaType,
    group_id: EventSchemaType["group_id"],
    user_id: string | undefined,
  ): Promise<
    { ok: true; data: EventSchemaType } | { ok: false; error: string }
  > {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireOrganizer(userId, group_id);

    try {
      const result = await this.db.events.write.create(newEvent);

      return {
        ok: true,
        data: result,
      };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        error: `Failed to create new event. Error: ${err}`,
      };
    }
  }
}
