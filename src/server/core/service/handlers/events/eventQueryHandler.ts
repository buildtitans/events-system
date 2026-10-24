import type {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  SearchSchema,
  SearchSchemaType,
} from "@/src/schemas/search/searchSchema";
import {
  EventSchemaType,
  GroupEventSummarySchemaType,
  HydratedEventSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  GroupSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { IEventQueryHandler, EventQueryDb } from "./types";
import { AuthenticatedUserId } from "../session/SessionHandler";

export class EventQueryHandler implements IEventQueryHandler {
  constructor(private readonly db: EventQueryDb) {}

  async hydrate(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedEventSchemaType> {
    return await this.db.events.select.hydrate(id, userId);
  }

  async searchEvents(
    query: SearchSchemaType,
  ): Promise<EventSearchResultSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = validateOrThrow(SearchSchema, trimmed);
    return await this.db.events.select.search(validatedQuery);
  }

  async suggestEvents(
    query: SearchSchemaType,
  ): Promise<EventSearchSuggestionSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = validateOrThrow(SearchSchema, trimmed);
    return await this.db.events.select.suggest(validatedQuery);
  }

  async nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<NextEventForGroupSummarySchemaType | undefined> {
    return await this.db.events.select.nextEventByGroupId(group_id);
  }

  async getGroupEvents(
    group_id: string,
  ): Promise<GroupEventSummarySchemaType[]> {
    return await this.db.events.select.byGroupId(group_id);
  }
}
