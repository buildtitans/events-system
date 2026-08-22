import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events//eventAttendantsSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { ValidateSearchQuery } from "@/src/server/core/lib/validation/schemaValidators";
import type { IEventQueryHandler, EventQueryDb } from "./types";

export class EventQueryHandler implements IEventQueryHandler {
  constructor(private readonly db: EventQueryDb) {}

  async getAllEvents(): Promise<EventSchemaType[]> {
    return await this.db.events.select.allStatuses();
  }

  async allActive(): Promise<EventSchemaType[]> {
    return await this.db.events.select.allScheduled();
  }

  async searchEvents(query: SearchSchemaType): Promise<EventSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = ValidateSearchQuery(trimmed);
    return await this.db.events.select.search(validatedQuery);
  }

  async suggestEvents(query: SearchSchemaType): Promise<EventSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = ValidateSearchQuery(trimmed);
    return await this.db.events.select.suggest(validatedQuery);
  }

  async getEventById(event_id: string): Promise<EventSchemaType> {
    return await this.db.events.select.byId(event_id);
  }

  async nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<EventSchemaType | undefined> {
    return await this.db.events.select.nextEventByGroupId(group_id);
  }

  async getEventAttendants(
    event_id: string,
  ): Promise<EventAttendantsSchemaType[]> {
    return await this.db.eventAttendants.select.attendants(event_id);
  }

  async getGroupEvents(group_id: string): Promise<EventSchemaType[]> {
    return await this.db.events.select.byGroupId(group_id);
  }
}
