import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type AttendantCountType = {
  numGoing: number;
  numInterested: number;
};

export type GroupNameLookupMap = Record<
  GroupSchemaType["id"],
  GroupSchemaType["name"]
>;
