import { EventsValidator } from "./eventsValidator";
import { RawEventsReader } from "./rawEventsReader";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";

export interface IEventsSelector {
  search(query: SearchSchemaType): Promise<EventsArraySchemaType>;
  nextEventByGroupId(group_id: string): Promise<EventSchemaType | undefined>;
  allStatuses(): Promise<EventSchemaType[]>;
  allScheduled(): Promise<EventSchemaType[]>;
  cancelledByGroupId(group_id: string): Promise<EventSchemaType[]>;
  byId(event_id: EventSchemaType["id"]): Promise<EventSchemaType>;
  byIds(ids: EventSchemaType["id"][]): Promise<EventsArraySchemaType>;
  byGroupId(group_id: GroupSchemaType["id"]): Promise<EventsArraySchemaType>;
  byGroupIds(groupIds: GroupSchemaType["id"][]): Promise<EventsArraySchemaType>;
}

export class EventsSelector implements IEventsSelector {
  constructor(
    private readonly validate: EventsValidator,
    private readonly read: RawEventsReader,
  ) {}

  async search(query: SearchSchemaType): Promise<EventsArraySchemaType> {
    const raw = await this.read.rawByTitle(query);

    return this.validate.events(raw);
  }

  async nextEventByGroupId(
    group_id: string,
  ): Promise<EventSchemaType | undefined> {
    const raw = await this.read.rawNextEventByGroupId(group_id);
    return raw ? this.validate.event(raw) : undefined;
  }

  async allStatuses(): Promise<EventSchemaType[]> {
    const raw = await this.read.allRawEvents();
    return this.validate.events(raw);
  }

  async allScheduled(): Promise<EventSchemaType[]> {
    const raw = await this.read.allRawScheduledEvents();
    return this.validate.events(raw);
  }

  async cancelledByGroupId(group_id: string): Promise<EventSchemaType[]> {
    const raw = await this.read.rawCancelledByGroupId(group_id);
    return this.validate.events(raw);
  }

  async byId(event_id: EventSchemaType["id"]): Promise<EventSchemaType> {
    const raw = await this.read.rawById(event_id);

    return this.validate.event(raw);
  }

  async byIds(ids: EventSchemaType["id"][]): Promise<EventsArraySchemaType> {
    const raw = await this.read.rawByIds(ids);
    return this.validate.events(raw);
  }

  async byGroupId(
    group_id: GroupSchemaType["id"],
  ): Promise<EventsArraySchemaType> {
    const raw = await this.read.rawByGroupId(group_id);

    return this.validate.events(raw);
  }

  async byGroupIds(
    groupIds: GroupSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    if (groupIds.length === 0) return [];

    const raw = await this.read.rawByGroupIds(groupIds);

    return this.validate.events(raw);
  }
}
