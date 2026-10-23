import {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
  EventSearchResultSchema,
  EventSearchSuggestionSchema,
} from "@/src/schemas/search/searchSchema";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { IEventsValidator } from "./eventsValidator";
import { IEventsReader } from "./eventsReader";
import {
  GroupSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  EventDiscoverySummarySchemaType,
  EventReadModelSchemaType,
  EventSchemaType,
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";

export interface IEventsSelector {
  discovery(): Promise<EventDiscoverySummarySchemaType[]>;
  upcoming(): Promise<EventDiscoverySummarySchemaType[]>;
  popular(): Promise<EventDiscoverySummarySchemaType[]>;
  hydrate(id: EventSchemaType["id"]): Promise<EventReadModelSchemaType>;
  search(query: SearchSchemaType): Promise<EventSearchResultSchemaType[]>;
  suggest(query: SearchSchemaType): Promise<EventSearchSuggestionSchemaType[]>;
  nextEventByGroupId(
    group_id: string,
  ): Promise<NextEventForGroupSummarySchemaType | undefined>;
  allScheduled(): Promise<EventSchemaType[]>;
  byIds(
    ids: EventSchemaType["id"][],
  ): Promise<EventDiscoverySummarySchemaType[]>;
  byGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<GroupEventSummarySchemaType[]>;
}

export class EventsSelector implements IEventsSelector {
  constructor(
    private readonly validate: IEventsValidator,
    private readonly read: IEventsReader,
  ) {}

  async hydrate(id: EventSchemaType["id"]): Promise<EventReadModelSchemaType> {
    const raw = await this.read.hydrateEvent(id);
    return this.validate.eventWithGroupDetails(raw);
  }

  async discovery(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.discovery();
    return this.validate.eventsForDiscovery(raw);
  }

  async popular(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.popular();
    return this.validate.eventsForDiscovery(raw);
  }

  async search(
    query: SearchSchemaType,
  ): Promise<EventSearchResultSchemaType[]> {
    const raw = await this.read.search(query);
    return raw.map((row) => validateOrThrow(EventSearchResultSchema, row));
  }

  async suggest(
    query: SearchSchemaType,
  ): Promise<EventSearchSuggestionSchemaType[]> {
    const raw = await this.read.suggest(query);
    return raw.map((row) => validateOrThrow(EventSearchSuggestionSchema, row));
  }

  async nextEventByGroupId(
    group_id: string,
  ): Promise<NextEventForGroupSummarySchemaType | undefined> {
    const nextEvent = await this.read.nextEvent(group_id);

    if (!nextEvent) return undefined;

    return this.validate.nextEvent(nextEvent);
  }

  async allScheduled(): Promise<EventSchemaType[]> {
    const raw = await this.read.scheduled();
    return this.validate.events(raw);
  }

  async upcoming(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.upcoming();
    return this.validate.eventsForDiscovery(raw);
  }

  async byIds(ids: EventSchemaType["id"][]) {
    const raw = await this.read.byIds(ids);
    return this.validate.eventsForDiscovery(raw);
  }

  async byGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<GroupEventSummarySchemaType[]> {
    const raw = await this.read.byGroupId(group_id);

    return this.validate.eventsForGroup(raw);
  }
}
