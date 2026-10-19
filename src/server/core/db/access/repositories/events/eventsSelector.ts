import { IEventsValidator } from "./eventsValidator";
import { EventsReader, IEventsReader } from "./rawEventsReader";
import {
  GroupSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  EventDiscoverySummarySchemaType,
  EventReadModelSchemaType,
  EventsArraySchemaType,
  EventSchemaType,
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";

export interface IEventsSelector {
  discovery(): Promise<EventDiscoverySummarySchemaType[]>;
  hydrate(id: EventSchemaType["id"]): Promise<EventReadModelSchemaType>;
  search(query: SearchSchemaType): Promise<EventsArraySchemaType>;
  suggest(query: SearchSchemaType): Promise<EventSchemaType[]>;
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

  async search(query: SearchSchemaType): Promise<EventsArraySchemaType> {
    const raw = await this.read.search(query);

    return this.validate.events(raw);
  }

  async suggest(query: SearchSchemaType): Promise<EventSchemaType[]> {
    const raw = await this.read.suggest(query);
    return this.validate.events(raw);
  }

  async nextEventByGroupId(
    group_id: string,
  ): Promise<NextEventForGroupSummarySchemaType | undefined> {
    const nextEvent = await this.read.nextEvent(group_id);

    if (!nextEvent) return undefined;

    return this.validate.nextEvent(nextEvent);
  }

  async allScheduled(): Promise<EventSchemaType[]> {
    const raw = await this.read.allRawScheduledEvents();
    return this.validate.events(raw);
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
