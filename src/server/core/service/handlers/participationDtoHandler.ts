import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupNameLookupMap } from "../types";
import type { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  UserMembershipSchemaArrayValidator,
  UserMembershipSchemaType,
} from "@/src/schemas/groups/userMembershipSchema";
import { GroupMembersArraySchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { StatusLookupType } from "@/src/server/core/lib/utils/filterRsvps";
import { type NameSlugDescriptionLookup } from "@/src/server/core/lib/utils/buildGroupNameLookup";
import { DBClient } from "../../db";

export class ParticipationDtoHandler {
  constructor(private readonly db: DBClient) {}

  public toRsvpShape(
    events: EventSchemaType[],
    groupNameHash: GroupNameLookupMap,
    statusLookup: StatusLookupType,
  ): RsvpSchemaType[] {
    const results = events.map((event) => ({
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
    }));
    return results;
  }

  public async toUserMembershipShape(
    rawMemberships: GroupMembersArraySchemaType,
    rawGroups: GroupsSchemaType,
    lookupMap: NameSlugDescriptionLookup,
  ): Promise<UserMembershipSchemaType[]> {
    const groupIds = rawMemberships.map((m) => m.group_id);
    const memberCounts =
      await this.db.groupMembers.getMemberCountsByGroupIds(groupIds);

    const results = rawMemberships.map((membership) => {
      const group = rawGroups.find((grp) => grp.id === membership.group_id);

      return {
        group_id: membership.group_id,
        group_name: group?.name ?? "",
        location: group?.location ?? "",
        roleInGroup: membership.role,
        group_slug: group?.slug ?? "",
        member_count: memberCounts[membership.group_id] ?? 0,
        group_description:
          lookupMap[membership.group_id]?.group_description ?? "",
      };
    });
    return UserMembershipSchemaArrayValidator(results);
  }
}
