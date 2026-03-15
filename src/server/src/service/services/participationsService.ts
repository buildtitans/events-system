import { DBClient } from "../../db";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import {
  RsvpStatusSchemaValidator,
  type EventAttendantsSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import { RsvpSchemaArrayValidator } from "@/src/schemas/events/rsvpSchema";
import {
  UserMembershipSchemaArrayValidator,
  UserMembershipSchemaType,
} from "@/src/schemas/groups/userMembershipSchema";
import { AuthorizationService } from "./authorizationService";
import { mapAttendanceDictionary } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { CensusHandler } from "../handlers/censusHandler";
import { filterUserRsvps } from "@/src/server/src/lib/utils/filterRsvps";
import { buildGroupNameLookup } from "@/src/server/src/lib/utils/buildGroupNameLookup";
import { SchemaDtoHandler } from "../handlers/schemaDtoHandler";
import { GroupRoleSchemaValidator } from "@/src/schemas/groups/groupMembersSchema";

export class ParticipationsService {
  public readonly census: CensusHandler;
  private readonly parse: SchemaDtoHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
  ) {
    this.census = new CensusHandler(this.db);
    this.parse = new SchemaDtoHandler(this.db);
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

  async getRsvpdEvents(user_id: string | undefined): Promise<RsvpSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const groups = await this.db.groups.getGroups();
    const userRecords =
      await this.db.eventAttendants.getUserAttendanceRecords(userId);

    const hash = buildGroupNameLookup(groups);
    const filtered = filterUserRsvps(userRecords);
    const keys = Object.keys(filtered);
    if (keys.length === 0) return [];
    const events = await this.db.events.getFlattenedEventsByIds(keys);
    const rsvps = this.parse.toRsvpShape(events, hash, filtered);
    return RsvpSchemaArrayValidator(rsvps);
  }
}
