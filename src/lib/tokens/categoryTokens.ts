import type { EventDisplayFilter } from "../store/slices/events/types";
import { GroupsFilter } from "../store/slices/groups/types";

const FILTERS: EventDisplayFilter[] = [
  "All Events",
  "Popular Events",
  "Upcoming events",
];

export type FilterLabels = "All Groups" | "Popular Groups" | "By Category";

export type GroupFilterOptions = {
  label: FilterLabels;
  filter: GroupsFilter;
};

const FILTER_OPTIONS = [
  {
    label: "All Groups",
    filter: "all",
  },
  {
    label: "Popular Groups",
    filter: "popular",
  },
  {
    label: "By Category",
    filter: "category",
  },
] satisfies GroupFilterOptions[];

export { FILTERS, FILTER_OPTIONS };
