import {
  EventsArraySchemaType,
  EventsByGroupIdSchemaType,
  EventSchemaType,
  NewEventInputSchemaType,
} from "@/src/schemas/events/eventSchema";
import { EventsByGroupIdSchemaValidator } from "../../lib/validation/schemaValidators";
import type { EventsByGroupId, UpComingEventsLookup } from "../types";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { EventHydrationHandler } from "../handlers/hydrationHandler";
import { isPastEvent } from "../../lib/utils/isPastEvent";
import { EventLayoutComposer } from "../handlers/eventLayoutComposer";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";

export class EventService {
  public readonly hydrate: EventHydrationHandler;
  private readonly layout: EventLayoutComposer;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.hydrate = new EventHydrationHandler(this.db);
    this.layout = new EventLayoutComposer();
  }

  async getAllEventsLayout(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.getAllEvents();
    return this.layout.compileLayout(events);
  }

  async getAllActiveEventsLayout() {
    const events = await this.getAllEvents();
    const activeEvents = this.filterActiveEvents(events);
    return this.layout.compileLayout(activeEvents);
  }

  async getAllEvents(): Promise<EventsArraySchemaType> {
    return await this.db.events.getEvents();
  }

  async searchEvents(query: SearchSchemaType) {
    return await this.db.events.searchEventByTitle(query);
  }

  async getGroupHistoryAttendance(ids: string[]) {
    return await this.hydrate.getAttendantsOfPastEvents(ids);
  }

  async getEventById(event_id: string) {
    return await this.db.events.getEvent(event_id);
  }

  async selectEventsById(
    ids: EventSchemaType["id"][],
  ): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.getEventsByIds(ids);
    return this.layout.compileLayout(events);
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

  async getGroupEventsLayout(group_id: string) {
    const groupEvents = await this.db.events.getGroupEvents(group_id);
    return this.layout.compileLayout(groupEvents);
  }

  async getGroupEvents(group_id: string) {
    return await this.db.events.getGroupEvents(group_id);
  }

  async getPastEvents(group_id: string) {
    const groupEvents = await this.db.events.getGroupEvents(group_id);

    const ids = groupEvents.map((ev) => ev.id);

    const pastEventsRecords = await this.hydrate.getAttendantsOfPastEvents(ids);

    const history = this.filterCurrentAndFutureEvents(groupEvents);

    return { history, pastEventsRecords };
  }

  async getNextEventLookupMap(
    ids: GroupSchemaType["id"][],
  ): Promise<UpComingEventsLookup> {
    const events = await this.db.events.getEventsByGroupIds(ids);

    const eventsByGroup = this.hashEventsByGroup(events);

    return this.mapSoonestEvents(eventsByGroup);
  }

  private filterActiveEvents(events: EventSchemaType[]) {
    const activeEvents: EventSchemaType[] = [];

    for (const event of events) {
      const startsAt = new Date(event.starts_at).getTime();
      const now = Date.now();

      if (startsAt > now) {
        activeEvents.push(event);
      }
    }
    return activeEvents;
  }

  private filterCurrentAndFutureEvents(
    events: EventSchemaType[],
  ): EventSchemaType[] {
    const history: EventSchemaType[] = [];

    for (const event of events) {
      const scheduledDate = new Date(event.starts_at_ms);
      if (isPastEvent(scheduledDate)) {
        history.push(event);
      }
    }

    return history;
  }

  private mapSoonestEvents(
    eventsByGroup: EventsByGroupId,
  ): UpComingEventsLookup {
    const nextEventLookup: UpComingEventsLookup = {};

    const values = Object.values(eventsByGroup);

    for (const arr of values) {
      const soonest = this.getNextOrMostRecentGroupEvent(arr);
      nextEventLookup[soonest.group_id] = soonest.starts_at;
    }

    return nextEventLookup;
  }

  private hashEventsByGroup(
    events: EventsArraySchemaType,
  ): EventsByGroupIdSchemaType {
    const results: EventsByGroupIdSchemaType = {};

    for (const event of events) {
      const groupId = event.group_id;

      if (!results[groupId]) {
        results[groupId] = [];
      }

      results[groupId].push(event);
    }

    return EventsByGroupIdSchemaValidator(results);
  }

  private getNextOrMostRecentGroupEvent(
    groupEvents: EventsArraySchemaType,
  ): EventSchemaType {
    const now = Date.now();

    let nearestFuture: EventSchemaType | null = null;
    let nearestPast: EventSchemaType | null = null;

    for (const event of groupEvents) {
      const startsAt = new Date(event.starts_at).getTime();

      if (startsAt >= now) {
        if (
          !nearestFuture ||
          startsAt < new Date(nearestFuture.starts_at).getTime()
        ) {
          nearestFuture = event;
        }
      } else {
        if (
          !nearestPast ||
          startsAt > new Date(nearestPast.starts_at).getTime()
        ) {
          nearestPast = event;
        }
      }
    }

    if (nearestFuture) {
      return nearestFuture;
    }

    if (nearestPast) {
      return nearestPast;
    }

    throw new Error("Expected at least one event in groupEvents");
  }
}
