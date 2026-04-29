import { DBClient } from "../../db";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { type EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import {
  RsvpSchemaArrayValidator,
  RsvpStatusSchemaValidator,
  UserMembershipSchemaArrayValidator,
} from "../../lib/validation/schemaValidators";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { Authorization } from "../auth/authorization";
import { mapAttendanceDictionary } from "@/src/server/core/lib/utils/mapAttendanceDictionary";
import { CensusHandler } from "../handlers/censusHandler";
import { filterUserRsvps } from "@/src/server/core/lib/utils/filterRsvps";
import { buildGroupNameLookup } from "@/src/server/core/lib/utils/buildGroupNameLookup";
import { ParticipationDtoHandler } from "../handlers/participationDtoHandler";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export class ParticipationsService {
  public readonly census: CensusHandler;
  private readonly parse: ParticipationDtoHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.census = new CensusHandler(this.db);
    this.parse = new ParticipationDtoHandler(this.db);
  }

  async updateRsvpStatus(
    user_id: string | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);

    return await this.db.eventAttendants.updateAttendanceStatus(
      { event_id, user_id: userId },
      newStatus,
    );
  }

  async getMostPopularGroups(): Promise<GroupSchemaType[]> {
    return this.census.getPopularGroups();
  }

  async getUserRsvpToEvent(
    user_id: string | undefined | null,
    event_id: string,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    const result = await this.db.eventAttendants.getUserRsvpStatusToEvent(
      userId,
      event_id,
    );

    return RsvpStatusSchemaValidator(result);
  }

  async getAttendanceDictionary(user_id: string | undefined | null) {
    const userId = this.policy.requireAuthenticated(user_id);

    const ids = (await this.db.events.getEvents()).map((event) => event.id);

    const userAttendanceRecords =
      await this.db.eventAttendants.getUserAttendanceRecords(userId);

    return mapAttendanceDictionary(ids, userAttendanceRecords);
  }

  async getMemberships(
    user_id: string | null | undefined,
  ): Promise<UserMembershipSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);

    const rawGroups = await this.db.groups.getGroups();
    const rawMemberships =
      await this.db.groupMembers.getViewerMemberships(userId);

    const nameSlugDescriptionLookup = buildGroupNameLookup(rawGroups);
    const parsed = await this.parse.toUserMembershipShape(
      rawMemberships,
      rawGroups,
      nameSlugDescriptionLookup,
    );

    return UserMembershipSchemaArrayValidator(parsed);
  }

  async getRsvpdEvents(
    user_id: string | null | undefined,
  ): Promise<RsvpSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const activeUserRecords = await this.getUserAttendance(userId);
    const filtered = filterUserRsvps(activeUserRecords);
    const keys = Object.keys(filtered);
    if (keys.length === 0) return [];
    const groups = await this.db.groups.getGroups();
    const hash = buildGroupNameLookup(groups);
    const events = await this.db.events.getFlattenedEventsByIds(keys);
    const rsvps = this.parse.toRsvpShape(events, hash, filtered);
    return RsvpSchemaArrayValidator(rsvps);
  }

  private async getUserAttendance(userId: string) {
    const userRecords =
      await this.db.eventAttendants.getUserAttendanceRecords(userId);

    if (userRecords.length === 0) {
      return [];
    }
    const activeUserRecords =
      await this.getActiveAttendanceRecords(userRecords);

    if (activeUserRecords.length === 0) {
      return [];
    }
    return activeUserRecords;
  }

  private async getActiveAttendanceRecords(
    userRecords: EventAttendantsSchemaType[],
  ) {
    const ids = userRecords.map((record) => record.event_id);
    const events = await this.db.events.getFlattenedEventsByIds(ids);
    const activeEvents = events.map((event) => {
      const scheduledFor = new Date(event.starts_at);
      const today = new Date();
      if (today < scheduledFor) {
        return event.id;
      }
    });
    return userRecords.filter((record) => {
      const activeEvent = activeEvents.find((id) => id === record.event_id);
      if (activeEvent) {
        return record;
      }
    });
  }
}
