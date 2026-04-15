import { AsyncState } from "@/src/lib/types/state/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type GroupsFilter = "all" | "popular";

export type LandingGroupsDisplayedState = AsyncState<
  GroupSchemaType[][],
  "Failed to retrieve groups"
>;

export type FilterOption = {
  value: GroupsFilter;
  label: string;
};
