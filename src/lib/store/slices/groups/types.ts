import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type LandingGroupsDisplayed =
  | { status: "pending" }
  | { status: "ready"; data: GroupSchemaType[][] }
  | { status: "failed"; error: string };
