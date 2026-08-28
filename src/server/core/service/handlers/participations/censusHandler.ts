import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { AttendantCountType } from "@/src/server/core/service/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { ICensusHandler } from "./types";
import type { ParticipationsServiceDb } from "@/src/server/core/service/services/types";

export class CensusHandler implements ICensusHandler {
  constructor(private readonly api: ParticipationsServiceDb) {}

  async getNumberOfAttendantsForEvent(
    event_id: EventSchemaType["id"],
  ): Promise<AttendantCountType> {
    const attendants =
      await this.api.eventAttendants.select.attendants(event_id);

    return this.countEventAttendants(attendants);
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.api.groupMembers.select.allMembers(group_id);

    return members.length;
  }

  async getPopularGroups(): Promise<GroupSchemaType[]> {
    const records = await this.api.groupMembers.select.all();

    const popularGroupIds = this.filterPopularGroupIds(records);

    return await this.api.groups.select.byIds(popularGroupIds);
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
