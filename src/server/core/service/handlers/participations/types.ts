import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { PopularEventsIds } from "@/src/server/core/lib/utils/curatePopularEventsIds";
import { AttendanceDictionaryType } from "@/src/server/core/lib/utils/mapAttendanceDictionary";
import { AttendantCountType } from "@/src/server/core/service/types";

export interface ICensusHandler {
  getNumberOfAttendantsForEvent(
    event_id: EventSchemaType["id"],
  ): Promise<AttendantCountType>;
  getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number>;
  getPopularEventsIds(): Promise<PopularEventsIds>;
  getPopularGroups(): Promise<GroupSchemaType[]>;
}

export interface IRsvpHandler {
  updateRsvpStatus(
    user_id: string | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType>;
  getUserRsvpToEvent(
    user_id: string | undefined | null,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]>;
  getRsvpdEvents(user_id: string | null | undefined): Promise<RsvpSchemaType[]>;
  getAttendanceDictionary(
    user_id: string | undefined | null,
  ): Promise<AttendanceDictionaryType>;
}
