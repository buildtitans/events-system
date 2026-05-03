import { DBClient } from "../../db";
import type {
  EventsByGroupIdSchemaType,
  EventSchemaType,
} from "../../../../schemas/events/eventSchema";
import { isPastEvent } from "../../lib/utils/isPastEvent";
import {
  EventsByGroupId,
  UpComingEventsLookup,
  PastEventsResults,
  PastEventAttendanceLookup,
} from "../types";
import { EventsByGroupIdSchemaValidator } from "../../lib/validation/schemaValidators";
import { GroupSchemaType } from "../../../../schemas/groups/groupSchema";
import { EventAttendantsSchemaType } from "../../../../schemas/events/eventAttendantsSchema";

export class EventTimelineHandler {
  constructor(private readonly db: DBClient) {}

  async getPastEventsForGroup(group_id: string): Promise<PastEventsResults> {
    const groupEvents = await this.db.events.getGroupEvents(group_id);
    const ids = groupEvents.map((ev) => ev.id);
    let pastEventsRecords: PastEventAttendanceLookup;
    let history: EventSchemaType[];

    if (ids.length === 0) {
      history = [];
      pastEventsRecords = {};
      return { history, pastEventsRecords };
    }

    pastEventsRecords = await this.getAttendantsOfPastEvents(ids);
    history = this.filterPastEvents(groupEvents);

    return { history, pastEventsRecords };
  }

  async getAttendantsOfPastEvents(
    ids: string[],
  ): Promise<PastEventAttendanceLookup> {
    if (ids.length === 0) return {};

    const attendees = await this.db.eventAttendants.getPastEventRecords(ids);
    return this.mapPastEventHeadCounts(ids, attendees);
  }

  private mapPastEventHeadCounts(
    ids: string[],
    attendees: EventAttendantsSchemaType[],
  ): PastEventAttendanceLookup {
    const lookup = Object.fromEntries(
      ids.map((id) => [id, 0]),
    ) satisfies PastEventAttendanceLookup;

    for (const attendant of attendees) {
      if (attendant.status === "going") {
        lookup[attendant.event_id] += 1;
      }
    }
    return lookup;
  }

  async getNextEventMap(
    ids: GroupSchemaType["id"][],
  ): Promise<UpComingEventsLookup> {
    const events = await this.db.events.getEventsByGroupIds(ids);

    const eventsByGroup = this.hashEventsByGroup(events);

    return this.mapSoonestEvents(eventsByGroup);
  }

  private filterPastEvents(events: EventSchemaType[]): EventSchemaType[] {
    const history: EventSchemaType[] = [];

    for (const event of events) {
      const scheduledDate = new Date(event.starts_at_ms);
      if (isPastEvent(scheduledDate)) {
        history.push(event);
      }
    }

    return history;
  }

  public filterActiveEvents(events: EventSchemaType[]) {
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
    events: EventSchemaType[],
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
    groupEvents: EventSchemaType[],
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
