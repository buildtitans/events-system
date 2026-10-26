import { NextEventForGroupSummarySchemaType } from "../../../../../../../../schemas/groups/groupSchema";
import {
  EventSearchResultSchema,
  EventSearchResultSchemaType,
  EventSearchSuggestionSchema,
  EventSearchSuggestionSchemaType,
  SearchSchemaType,
} from "@/src/schemas/search/searchSchema";
import { validateOrThrow } from "../../../../../../../../schemas/validateOrThrow";
import type { IEventsReader } from "@/src/server/core/db/access/repositories/events/handlers/read/eventsReader";
import type { IEventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";

export interface IEventQuerySelector {
  search(query: SearchSchemaType): Promise<EventSearchResultSchemaType[]>;
  suggest(query: SearchSchemaType): Promise<EventSearchSuggestionSchemaType[]>;
  nextEventByGroupId(
    group_id: string,
  ): Promise<NextEventForGroupSummarySchemaType | undefined>;
}

export class EventQuerySelector implements IEventQuerySelector {
  constructor(
    private readonly read: IEventsReader["query"],
    private readonly validate: IEventsValidator,
  ) {}

  async search(query: SearchSchemaType) {
    const raw = await this.read.search(query);
    return raw.map((row) => validateOrThrow(EventSearchResultSchema, row));
  }

  async suggest(query: SearchSchemaType) {
    const raw = await this.read.suggest(query);
    return raw.map((row) => validateOrThrow(EventSearchSuggestionSchema, row));
  }

  async nextEventByGroupId(group_id: string) {
    const nextEvent = await this.read.nextEvent(group_id);

    if (!nextEvent) return undefined;

    return this.validate.nextEvent(nextEvent);
  }
}
