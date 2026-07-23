import { EventAttendantsSchemaType } from "../../../../../schemas/events/eventAttendantsSchema";
import { EventSchemaType } from "../../../../../schemas/events/eventSchema";
import { RsvpSchemaType } from "../../../../../schemas/events/rsvpSchema";
import { GroupSchemaType } from "../../../../../schemas/groups/groupSchema";
import { PopularEventsIds } from "../../../lib/utils/curatePopularEventsIds";
import { AttendanceDictionaryType } from "../../../lib/utils/mapAttendanceDictionary";
import { AttendantCountType } from "../../types";

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
