import { EventsValidator } from "./eventsValidator";
import { RawEventsReader } from "./rawEventsReader";
import { GroupSchemaType } from "../../../../../../schemas/groups/groupSchema";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "../../../../../../schemas/events/eventSchema";
import { SearchSchemaType } from "../../../../../../schemas/search/searchSchema";

export class EventsSelector {
  constructor(
    private readonly validate: EventsValidator,
    private readonly read: RawEventsReader,
  ) {}

  async search(query: SearchSchemaType): Promise<EventsArraySchemaType> {
    const raw = await this.read.rawByTitle(query);

    return this.validate.events(raw);
  }

  async allStatuses(): Promise<EventSchemaType[]> {
    const raw = await this.read.allRawEvents();
    return this.validate.events(raw);
  }

  async allScheduled() {
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
