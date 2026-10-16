import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  UpComingEventsLookup,
  PastEventsResults,
  PastEventAttendanceLookup,
} from "@/src/server/core/service/types";
import type { IAuthorization } from "@/src/server/core/service/auth/authorization";
import type { EventTimelineDb, IEventTimelineHandler } from "./types";
import { EventTimelineMapper } from "./eventTimelineMapper";
import { AuthenticatedUserId } from "../session/SessionHandler";

export class EventTimelineHandler implements IEventTimelineHandler {
  private readonly mapper: EventTimelineMapper;
  constructor(
    private readonly db: EventTimelineDb,
    private readonly policy: IAuthorization,
  ) {
    this.mapper = new EventTimelineMapper();
  }

  async getPastEventsForGroup(group_id: string): Promise<PastEventsResults> {
    return await this.pastEventsForGroup(group_id);
  }

  async getNextEventMap(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UpComingEventsLookup> {
    const actor = this.policy.requireAuthenticated(user_id);
    return await this.getNextEventsForMemberships(actor);
  }

  async getAttendantsOfPastEvents(
    ids: string[],
  ): Promise<PastEventAttendanceLookup> {
    if (ids.length === 0) return {};

    const attendees = await this.db.eventAttendants.select.pastRecords(ids);
    return this.mapper.mapPastEventHeadCounts(ids, attendees);
  }

  private async pastEventsForGroup(
    group_id: string,
  ): Promise<PastEventsResults> {
    const groupEvents = await this.db.events.select.byGroupId(group_id);
    const ids = groupEvents.map((ev) => ev.id);
    let pastEventsRecords: PastEventAttendanceLookup;
    let history: EventSchemaType[];

    if (ids.length === 0) {
      history = [];
      pastEventsRecords = {};
      return { history, pastEventsRecords };
    }

    pastEventsRecords = await this.getAttendantsOfPastEvents(ids);
    history = this.mapper.filterPastEvents(groupEvents);

    return { history, pastEventsRecords };
  }

  private async getNextEventsForMemberships(userId: AuthenticatedUserId) {
    const memberships = await this.db.groupMembers.select.byUserId(userId);
    const groupIds = memberships.map((membership) => membership.group_id);
    const events = await this.db.events.select.byGroupIds(groupIds);

    const eventsByGroup = this.mapper.hashEventsByGroup(events);

    return this.mapper.mapSoonestEvents(eventsByGroup);
  }
}
