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
import { EventHydrationHandler } from "../handlers/eventHydrationHandler";
import { EventLayoutComposer } from "../handlers/eventLayoutComposer";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { EventTimelineHandler } from "../handlers/eventTimelineHandler";

export class EventService {
  public readonly hydrate: EventHydrationHandler;
  private readonly layout: EventLayoutComposer;
  private readonly timeline: EventTimelineHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.hydrate = new EventHydrationHandler(this.db);
    this.layout = new EventLayoutComposer();
    this.timeline = new EventTimelineHandler(this.db);
  }

  async getAllEventsLayout(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.getAllEvents();
    return this.layout.compileLayout(events);
  }

  async getAllActiveEventsLayout() {
    const events = await this.getAllEvents();
    const activeEvents = this.timeline.filterActiveEvents(events);
    return this.layout.compileLayout(activeEvents);
  }

  async getAllEvents(): Promise<EventsArraySchemaType> {
    return await this.db.events.getEvents();
  }

  async searchEvents(query: SearchSchemaType) {
    return await this.db.events.searchEventByTitle(query);
  }

  async getGroupHistoryAttendance(ids: string[]) {
    return await this.timeline.getAttendantsOfPastEvents(ids);
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
    return await this.timeline.getPastEventsForGroup(group_id);
  }

  async getNextEventLookupMap(
    ids: GroupSchemaType["id"][],
  ): Promise<UpComingEventsLookup> {
    return await this.timeline.getNextEventMap(ids);
  }
}
