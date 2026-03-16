import {
  EventsArraySchemaType,
  EventSchemaType,
  NewEventInputSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { UpComingEventsLookup } from "../types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { EventHydrationHandler } from "../handlers/hydrationHandler";

export class EventsService {
  public readonly hydrate: EventHydrationHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.hydrate = new EventHydrationHandler(this.db);
  }

  async getAllEvents(): Promise<EventsArraySchemaType> {
    return await this.db.events.getEvents();
  }

  async searchEvents(query: SearchSchemaType) {
    return await this.db.events.searchEventByTitle(query);
  }

  async getEventById(event_id: string) {
    return await this.db.events.getEvent(event_id);
  }

  async selectEventsById(
    ids: EventSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    return await this.db.events.getEventsByIds(ids);
  }

  async getEventAttendants(event_id: string) {
    return await this.db.eventAttendants.getAttendants(event_id);
  }

  async updateEventStatus(
    user_id: string | null | undefined,
    eventUpdate: UpdateEventArgsSchemaType,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireCanManageGroup(userId, eventUpdate.group_id);

    return await this.db.events.updateEventStatus(eventUpdate);
  }

  async createEvent(
    newEvent: NewEventInputSchemaType,
    group_id: EventSchemaType["group_id"],
    user_id: string | undefined,
  ): Promise<EventSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanCreateEvent(userId, group_id);

    return await this.db.events.createNewEvent(newEvent);
  }

  async getGroupEvents(group_id: string) {
    return await this.db.events.getGroupEvents(group_id);
  }

  async getNextEventLookupMap(
    ids: GroupSchemaType["id"][],
  ): Promise<UpComingEventsLookup> {
    const hash: UpComingEventsLookup = {};

    for (const groupId of ids) {
      const events = await this.db.events.getGroupEventsByGroupId(groupId);

      if (!Array.isArray(events) || events.length === 0) continue;

      const soonest = this.getSoonestEvent(events);

      if (!soonest) continue;

      hash[groupId] = soonest.starts_at;
    }

    return hash;
  }

  private getSoonestEvent(
    events: EventsArraySchemaType,
  ): EventSchemaType | undefined {
    if (!Array.isArray(events) || events.length === 0) return undefined;

    let nearest = events[0];

    for (const event of events) {
      if (
        new Date(event.starts_at).getTime() <
        new Date(nearest.starts_at).getTime()
      ) {
        nearest = event;
      }
    }

    return nearest;
  }
}
