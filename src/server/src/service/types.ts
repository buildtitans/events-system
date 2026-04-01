import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export type AttendantCountType = {
  numGoing: number;
  numInterested: number;
};

export type GroupNameLookupMap = Record<
  GroupSchemaType["id"],
  { name: GroupSchemaType["name"]; slug: GroupSchemaType["slug"] }
>;

export type EventsByGroupId = Record<
  EventSchemaType["group_id"],
  EventSchemaType[]
>;

export type UpComingEventsLookup = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;

export type NewOrganizerInput = Pick<
  GroupMemberSchemaType,
  "user_id" | "group_id"
>;

export type GroupCreatedResult = {
  group: GroupSchemaType;
  organizer: GroupMemberSchemaType;
};

export type GroupAction =
  | "manage group"
  | "manage events"
  | "change membership";
