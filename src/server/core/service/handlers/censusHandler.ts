import { DBClient } from "@/src/server/core/db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { AttendantCountType } from "../types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { curatePopularEventsIds } from "../../lib/utils/curatePopularEventsIds";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export class CensusHandler {
  constructor(private readonly api: DBClient) {}

  async getNumberOfAttendantsForEvent(
    event_id: EventSchemaType["id"],
  ): Promise<AttendantCountType> {
    const attendants = await this.api.eventAttendants.getAttendants(event_id);

    return this.countEventAttendants(attendants);
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.api.groupMembers.getGroupMembers(group_id);

    return members.length;
  }

  async getPopularEventsIds() {
    const records = await this.api.eventAttendants.getAllAttendanceRecords();

    return curatePopularEventsIds(records);
  }

  async getPopularGroups() {
    const records = await this.api.groupMembers.getAllMembershipRecords();

    const popularGroupIds = this.filterPopularGroupIds(records);

    return await this.api.groups.getGroupsByIds(popularGroupIds);
  }

  private filterPopularGroupIds(
    records: GroupMemberSchemaType[],
  ): GroupSchemaType["id"][] {
    const MIN = 2;
    const counts = new Map<GroupSchemaType["id"], number>();

    for (const record of records) {
      counts.set(record.group_id, (counts.get(record.group_id) ?? 0) + 1);
    }

    return [...counts.entries()]
      .filter(([, count]) => count >= MIN)
      .map(([groupId]) => groupId);
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
      numGoing: filteredGoing.length ?? 0,
      numInterested: filteredInterested.length ?? 0,
    };
  }
}
