import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";

export type AttendantCountType = {
  numGoing: number;
  numInterested: number;
};

export type GroupNameLookupMap = Record<
  GroupSchemaType["id"],
  { name: GroupSchemaType["name"]; slug: GroupSchemaType["slug"] }
>;

export type UpComingEventsLookup = Record<
  GroupSchemaType["id"],
  EventSchemaType["starts_at"]
>;
