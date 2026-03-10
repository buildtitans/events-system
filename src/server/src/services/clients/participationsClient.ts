import { DBClient } from "../../db";
import type { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventIdSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpSchemaArrayValidator } from "@/src/schemas/events/rsvpSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupNameLookupMap } from "../types";
import type {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  UserMembershipSchemaArrayValidator,
  UserMembershipSchemaType,
} from "@/src/schemas/groups/userMembershipSchema";
import { GroupMembersArraySchemaType } from "@/src/schemas/groups/groupMembersSchema";

export class ParticipationsClient {
  constructor(private readonly api: DBClient) {}

  async getMemberships(
    user_id: DbUserSchemaType["id"],
  ): Promise<UserMembershipSchemaType[]> {
    const rawGroups = await this.api.groups.getGroups();
    const rawMemberships =
      await this.api.groupMembers.getViewerMemberships(user_id);

    const parsed = await this.toUserMembershipShape(rawMemberships, rawGroups);

    return UserMembershipSchemaArrayValidator(parsed);
  }

  async getRsvpdEvents(
    user_id: DbUserSchemaType["id"],
  ): Promise<RsvpSchemaType[]> {
    const userRecords =
      await this.api.eventAttendants.getUserAttendanceRecords(user_id);
    const ids = this.filterUserRsvps(userRecords);
    const events = await this.api.events.getFlattenedEventsByIds(ids);
    const hash = await this.getGroupNameLookupMap();
    const rsvps = this.toRsvpShape(events, hash);
    return RsvpSchemaArrayValidator(rsvps);
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

  private async getGroupNameLookupMap(): Promise<GroupNameLookupMap> {
    const groups = await this.api.groups.getGroups();
    return this.buildGroupNameLookup(groups);
  }

  private buildGroupNameLookup(groups: GroupSchemaType[]): GroupNameLookupMap {
    const lookup: Record<
      GroupSchemaType["id"],
      { name: GroupSchemaType["name"]; slug: GroupSchemaType["slug"] }
    > = {};

    for (const group of groups) {
      lookup[group.id] = { name: group.name, slug: group.slug };
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
        group_name: groupNameHash[event.group_id].name,
        starts_at: event.starts_at,
        starts_at_ms: event.starts_at_ms,
        scheduled_status: event.status,
        location: event.meeting_location,
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
      });
    }

    return UserMembershipSchemaArrayValidator(results);
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.api.groupMembers.getGroupMembers(group_id);

    return members.length;
  }
}
