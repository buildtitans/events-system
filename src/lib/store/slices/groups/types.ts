import { AsyncState } from "@/src/lib/types/state/types";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventsPages } from "../events/types";

export type GroupsFilter = "all" | "popular";

export type LandingGroupsDisplayedState = AsyncState<
  GroupSchemaType[][],
  "Failed to retrieve groups"
>;

export type GroupArchivesState = AsyncState<
  EventSchemaType[],
  "This group has no archived events"
>;

export type FilterOption = {
  value: GroupsFilter;
  label: string;
};

export type FlattenedGroupEventsState = AsyncState<
  EventSchemaType[],
  "No Events held for this group"
>;

export type GroupHydrated = AsyncState<GroupSchemaType>;

export type EventsOfGroup =
  | AsyncState<EventsPages, "No events have been scheduled for this group">
  | { status: "refreshing" };

export type GroupHistoryType = AsyncState<
  EventSchemaType[],
  "No history to display"
>;

export type CurrentDisplay =
  | "overview"
  | "events"
  | "group history"
  | "archives";

// ******** New Display State Model Prototype Example Below ***************

export type OpenedGroupSection =
  | "overview"
  | "events"
  | "group history"
  | "archives";

export const openedGroupSections = {
  overview: { label: "Overview", access: "public" },
  events: { label: "Events", access: "public" },
  groupHistory: { label: "History", access: "public" },
  archives: { label: "Archives", access: "organizer" },
} as const;

// *****************************************************
