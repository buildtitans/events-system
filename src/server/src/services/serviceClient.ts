import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { DBClient } from "../db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type {
  EventAttendantsSchemaType,
  EventIdSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { AttendantCountType, GroupNameLookupMap } from "./types";
import {
  RsvpSchemaArrayValidator,
  RsvpSchemaType,
} from "@/src/schemas/events/rsvpSchema";

export class ServiceClient {
  constructor(private readonly api: DBClient) {}

  async getRsvpdEvents(
    user_id: DbUserSchemaType["id"],
  ): Promise<RsvpSchemaType[]> {
    const userRecords =
      await this.api.eventAttendants.getUserAttendanceRecords(user_id);
    const ids = this.filterUserRsvps(userRecords);
    const events = await this.api.events.getFlattenedEventsByIds(ids);
    const hash = await this.getGroupNameLookupMap();
    const rsvps = await this.toRsvpShape(events, hash);
    return RsvpSchemaArrayValidator(rsvps);
  }

  async getGroupsCreated(
    user_id: DbUserSchemaType["id"],
  ): Promise<GroupSchemaType[]> {
    return await this.api.groups.getGroupsByOrganizerId(user_id);
  }

  async getEmailById(
    user_id: DbUserSchemaType["id"],
  ): Promise<DbUserSchemaType["email"]> {
    const { email } = await this.api.auth.getEmailByUserId(user_id);

    return email;
  }

  async getNumberOfAttendantsForEvent(
    event_id: EventSchemaType["id"],
  ): Promise<AttendantCountType> {
    const attendants = await this.api.eventAttendants.getAttendants(event_id);

    return this.countEventAttendants(attendants);
  }

  private async getGroupNameLookupMap(): Promise<GroupNameLookupMap> {
    const groups = await this.api.groups.getGroups();
    return this.buildGroupNameLookup(groups);
  }

  private filterUserRsvps(
    records: EventAttendantsSchemaType[],
  ): EventIdSchemaType[] {
    const rsvps: string[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const status = records[i].status;

      if (status === "going" || status === "interested")
        rsvps.push(record.event_id);
    }

    return rsvps;
  }

  private buildGroupNameLookup(groups: GroupSchemaType[]): GroupNameLookupMap {
    const lookup: Record<GroupSchemaType["id"], GroupSchemaType["name"]> = {};

    for (const group of groups) {
      lookup[group.id] = group.name;
    }

    return lookup;
  }

  private toRsvpShape(
    events: EventSchemaType[],
    groupNameHash: GroupNameLookupMap,
  ): RsvpSchemaType[] {
    const results: RsvpSchemaType[] = [];

    for (const event of events) {
      const rsvp: RsvpSchemaType = {
        event_id: event.id,
        group_id: event.group_id,
        group_name: groupNameHash[event.group_id],
        starts_at: event.starts_at,
        starts_at_ms: event.starts_at_ms,
        scheduled_status: event.status,
        location: event.meeting_location,
        event_title: event.title,
      };

      results.push(rsvp);
    }

    return results;
  }

  private countEventAttendants(
    attendants: EventAttendantsSchemaType[],
  ): AttendantCountType {
    const filteredGoing = attendants.filter(
      (attendant) => attendant.status === "going",
    );

    const filteredInterested = attendants.filter(
      (attendant) => attendant.status === "interested",
    );

    return {
      numGoing: filteredGoing.length,
      numInterested: filteredInterested.length,
    };
  }
}
