import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type GroupsFilter = "all" | "popular";

export type LandingGroupsDisplayed =
  | { status: "pending" }
  | { status: "ready"; data: GroupSchemaType[][] }
  | { status: "failed"; error: string };

export type FilterOption = {
  value: GroupsFilter;
  label: string;
};
