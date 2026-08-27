import {
  EventsByGroupIdSchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import { isPastEvent } from "@/src/server/core/lib/utils/isPastEvent";
import {
  EventsByGroupId,
  UpComingEventsLookup,
  PastEventAttendanceLookup,
} from "@/src/server/core/service/types";
import { EventsByGroupIdSchemaValidator } from "@/src/server/core/lib/validation/schemaValidators";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

export class EventTimelineMapper {
  mapPastEventHeadCounts(
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

  filterPastEvents(events: EventSchemaType[]): EventSchemaType[] {
    const history: EventSchemaType[] = [];

    for (const event of events) {
      const scheduledDate = new Date(event.starts_at_ms);
      if (isPastEvent(scheduledDate)) {
        history.push(event);
      }
    }

    return history;
  }

  mapSoonestEvents(eventsByGroup: EventsByGroupId): UpComingEventsLookup {
    const nextEventLookup: UpComingEventsLookup = {};

    const values = Object.values(eventsByGroup);

    for (const arr of values) {
      const soonest = this.getNextOrMostRecentGroupEvent(arr);
      nextEventLookup[soonest.group_id] = soonest.starts_at;
    }

    return nextEventLookup;
  }

  hashEventsByGroup(events: EventSchemaType[]): EventsByGroupIdSchemaType {
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
