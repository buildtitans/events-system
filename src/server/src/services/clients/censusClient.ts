import { DBClient } from "@/src/server/src/db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { AttendantCountType } from "../types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export class CensusClient {
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
