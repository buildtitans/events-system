import {
  EventsArraySchemaType,
  EventSchemaType,
  NewEventInputSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { UpComingEventsLookup } from "../types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../db";
import { AuthorizationService } from "../services/authorizationService";

export class EventsService {
  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
  ) {}

  async getAllEvents(): Promise<EventsArraySchemaType> {
    return await this.db.events.getEvents();
  }

  async selectEventsById(
    ids: EventSchemaType["id"][],
  ): Promise<EventsArraySchemaType> {
    return await this.db.events.getEventsByIds(ids);
  }

  async getEventAttendants(event_id: string) {
    return await this.db.eventAttendants.getAttendants(event_id);
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
