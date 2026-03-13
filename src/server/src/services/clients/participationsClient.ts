import { DBClient } from "../../db";
import type { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpSchemaArrayValidator } from "@/src/schemas/events/rsvpSchema";
import type {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { GroupNameLookupMap, UpComingEventsLookup } from "../types";
import type {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  UserMembershipSchemaArrayValidator,
  UserMembershipSchemaType,
} from "@/src/schemas/groups/userMembershipSchema";
import { GroupMembersArraySchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { UpcomingEventIds } from "@/src/lib/utils/dates/curateUpcomingEventIds";

type StatusLookupType = Record<
  EventSchemaType["id"],
  EventAttendantsSchemaType["status"]
>;

type NameSlugDescriptionLookup = Record<
  GroupSchemaType["id"],
  {
    name: GroupSchemaType["name"];
    slug: GroupSchemaType["slug"];
    group_description: GroupSchemaType["description"];
  }
>;

export class ParticipationsClient {
  constructor(private readonly api: DBClient) {}

  async getMemberships(
    user_id: DbUserSchemaType["id"],
  ): Promise<UserMembershipSchemaType[]> {
    const rawGroups = await this.api.groups.getGroups();
    const rawMemberships =
      await this.api.groupMembers.getViewerMemberships(user_id);

    const nameSlugDescriptionLookup = this.buildGroupNameLookup(rawGroups);

    const parsed = await this.toUserMembershipShape(
      rawMemberships,
      rawGroups,
      nameSlugDescriptionLookup,
    );

    return UserMembershipSchemaArrayValidator(parsed);
  }

  async getRsvpdEvents(
    user_id: DbUserSchemaType["id"],
  ): Promise<RsvpSchemaType[]> {
    const userRecords =
      await this.api.eventAttendants.getUserAttendanceRecords(user_id);
    const filtered = this.filterUserRsvps(userRecords);
    const events = await this.api.events.getFlattenedEventsByIds(
      Object.keys(filtered),
    );
    const hash = await this.getGroupNameLookupMap();
    const rsvps = this.toRsvpShape(events, hash, filtered);
    return RsvpSchemaArrayValidator(rsvps);
  }

  async getNextEventLookupMap(
    ids: GroupSchemaType["id"][],
  ): Promise<UpComingEventsLookup> {
    const hash: UpComingEventsLookup = {};

    for (const groupId of ids) {
      const events = await this.api.events.getGroupEventsByGroupId(groupId);

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

  private filterUserRsvps(
    records: EventAttendantsSchemaType[],
  ): StatusLookupType {
    const test: Record<
      EventSchemaType["id"],
      EventAttendantsSchemaType["status"]
    > = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const status = records[i].status;

      if (status === "going" || status === "interested")
        test[record.event_id] = record.status;
    }

    return test;
  }

  private async getGroupNameLookupMap(): Promise<GroupNameLookupMap> {
    const groups = await this.api.groups.getGroups();
    return this.buildGroupNameLookup(groups);
  }

  private buildGroupNameLookup(
    groups: GroupSchemaType[],
  ): NameSlugDescriptionLookup {
    const lookup: NameSlugDescriptionLookup = {};

    for (const group of groups) {
      lookup[group.id] = {
        name: group.name,
        slug: group.slug,
        group_description: group.description,
      };
    }

    return lookup;
  }

  private toRsvpShape(
    events: EventSchemaType[],
    groupNameHash: GroupNameLookupMap,
    statusLookup: StatusLookupType,
  ): RsvpSchemaType[] {
    const results: RsvpSchemaType[] = [];

    for (const event of events) {
      const rsvp: RsvpSchemaType = {
        event_id: event.id,
        group_id: event.group_id,
        group_name: groupNameHash[event.group_id].name,
        starts_at: event.starts_at,
        starts_at_ms: event.starts_at_ms,
        scheduled_status: event.status,
        location: event.meeting_location,
        attendance_status: statusLookup[event.id],
        event_title: event.title,
        group_slug: groupNameHash[event.group_id].slug,
      };

      results.push(rsvp);
    }

    return results;
  }

  private async toUserMembershipShape(
    rawMemberships: GroupMembersArraySchemaType,
    rawGroups: GroupsSchemaType,
    lookupMap: NameSlugDescriptionLookup,
  ): Promise<UserMembershipSchemaType[]> {
    const results: UserMembershipSchemaType[] = [];

    for (const membership of rawMemberships) {
      const group = rawGroups.find((grp) => grp.id === membership.group_id);

      results.push({
        group_id: membership.group_id,
        group_name: group?.name ?? "",
        location: group?.location ?? "",
        roleInGroup: membership.role,
        group_slug: group?.slug ?? "",
        member_count: await this.getGroupHeadCount(membership.group_id),
        group_description:
          lookupMap[membership.group_id].group_description ?? "",
      });
    }

    return UserMembershipSchemaArrayValidator(results);
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.api.groupMembers.getGroupMembers(group_id);

    return members.length;
  }
}
