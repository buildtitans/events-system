import type { ParticipationsServiceDb } from "@/src/server/core/service/services/types";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { ParticipationDtoHandler } from "./participationDtoHandler";
import { buildGroupNameLookup } from "@/src/server/core/lib/utils/buildGroupNameLookup";
import {
  filterUserRsvps,
  StatusLookupType,
} from "@/src/server/core/lib/utils/filterRsvps";
import {
  type AttendanceDictionaryType,
  mapAttendanceDictionary,
} from "@/src/server/core/lib/utils/mapAttendanceDictionary";
import {
  RsvpSchemaArrayValidator,
  RsvpStatusSchemaValidator,
} from "@/src/server/core/lib/validation/schemaValidators";

export class RsvpHandler {
  constructor(
    private readonly db: ParticipationsServiceDb,
    private readonly policy: Authorization,
    private readonly parse: ParticipationDtoHandler,
  ) {}

  public async updateRsvpStatus(
    user_id: string | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);

    return await this.db.eventAttendants.write.updateAttendanceStatus(
      { event_id, user_id: userId },
      newStatus,
    );
  }

  public async getUserRsvpToEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const result = await this.db.eventAttendants.select.rsvp(userId, event_id);

    return RsvpStatusSchemaValidator(result);
  }

  public async getRsvpdEvents(
    user_id: string | null | undefined,
  ): Promise<RsvpSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const { keys, filtered } = await this.getUserRecords(userId);
    if (keys.length === 0) return [];
    return await this.toRsvps(keys, filtered);
  }

  async getAttendanceDictionary(
    user_id: string | undefined | null,
  ): Promise<AttendanceDictionaryType> {
    const userId = this.policy.requireAuthenticated(user_id);

    const ids = (await this.db.events.select.allScheduled()).map(
      (event) => event.id,
    );

    const userAttendanceRecords =
      await this.db.eventAttendants.select.userRecords(userId);

    return mapAttendanceDictionary(ids, userAttendanceRecords);
  }

  private async getUserRecords(
    userId: string,
  ): Promise<{ keys: string[]; filtered: StatusLookupType }> {
    const activeUserRecords = await this.getUserAttendance(userId);
    const filtered = filterUserRsvps(activeUserRecords);
    const keys = Object.keys(filtered);

    return { keys, filtered };
  }

  private async toRsvps(
    keys: string[],
    filtered: StatusLookupType,
  ): Promise<RsvpSchemaType[]> {
    const groups = await this.db.groups.select.all();
    const hash = buildGroupNameLookup(groups);
    const events = await this.db.events.select.byIds(keys);
    const rsvps = this.parse.toRsvpShape(events, hash, filtered);
    return RsvpSchemaArrayValidator(rsvps);
  }

  private async getUserAttendance(
    userId: string,
  ): Promise<EventAttendantsSchemaType[]> {
    const userRecords =
      await this.db.eventAttendants.select.userRecords(userId);

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
  ): Promise<EventAttendantsSchemaType[]> {
    const ids = userRecords.map((record) => record.event_id);
    const events = await this.db.events.select.byIds(ids);
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
