import {
  EventSchemaType,
  HydratedEventSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  GroupSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { IEventQueryHandler, EventQueryDb } from "./types";
import { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";

export class EventQueryHandler implements IEventQueryHandler {
  constructor(private readonly db: EventQueryDb) {}

  async hydrate(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedEventSchemaType> {
    return await this.db.events.select.view.single(id, userId);
  }

  async nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<NextEventForGroupSummarySchemaType | undefined> {
    return await this.db.events.select.query.nextEventByGroupId(group_id);
  }
}
