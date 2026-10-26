import type { IEventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";
import type { IEventsReader } from "@/src/server/core/db/access/repositories/events/handlers/read/eventsReader";
import type {
  EventDiscoverySummarySchemaType,
  EventSchemaType,
  GroupEventSummarySchemaType,
  HydratedEventSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { GroupSchemaType } from "../../../../../../../../schemas/groups/groupSchema";

export interface IEventViewSelector {
  single(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedEventSchemaType>;
  readonly list: IEventListViewSelector;
}

export class EventViewSelector implements IEventViewSelector {
  public readonly list: IEventListViewSelector;
  constructor(
    private readonly validate: IEventsValidator,
    private readonly read: IEventsReader["hydrate"],
  ) {
    this.list = new EventListViewSelector(this.validate, this.read.list);
  }

  async single(
    id: EventSchemaType["id"],
    userId?: AuthenticatedUserId,
  ): Promise<HydratedEventSchemaType> {
    const raw = await this.read.single(id, userId);
    return this.validate.hydratedEvent(raw);
  }
}

interface IEventListViewSelector {
  discovery(): Promise<EventDiscoverySummarySchemaType[]>;
  popular(): Promise<EventDiscoverySummarySchemaType[]>;
  upcoming(): Promise<EventDiscoverySummarySchemaType[]>;
  forGroup(id: GroupSchemaType["id"]): Promise<GroupEventSummarySchemaType[]>;
}

class EventListViewSelector implements IEventListViewSelector {
  constructor(
    private readonly validate: IEventsValidator,
    private readonly read: IEventsReader["hydrate"]["list"],
  ) {}

  async forGroup(
    id: GroupSchemaType["id"],
  ): Promise<GroupEventSummarySchemaType[]> {
    const events = await this.read.forGroup(id);
    return this.validate.eventsForGroup(events);
  }

  async discovery(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.discovery();
    return this.validate.eventsForDiscovery(raw);
  }

  async popular(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.popular();
    return this.validate.eventsForDiscovery(raw);
  }

  async upcoming(): Promise<EventDiscoverySummarySchemaType[]> {
    const raw = await this.read.upcoming();
    return this.validate.eventsForDiscovery(raw);
  }
}
