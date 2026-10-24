import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { AsyncState } from "@/src/lib/types/state/types";
import type {
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import { EventsPages } from "../events/types";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";

export type GroupsFilter = "all" | "popular" | "category";

export type LandingGroupsDisplayedState = AsyncState<
  GroupDiscoverySummarySchemaType[][],
  "0 results for the applied filter"
>;

export type GroupArchivesState = AsyncState<
  ArchivedEventSchemaType[],
  "This group has no archived events"
>;

export type FilterOption = {
  value: GroupsFilter;
  label: string;
};

export type GroupCategoryState = AsyncState<
  CategorySchemaType,
  "Could not find a valid category for this group"
>;

export type GroupEventsCalandarState = AsyncState<
  TimelineElementSchemaType[],
  "No Events held for this group"
>;

export type NextEventState = AsyncState<
  NextEventForGroupSummarySchemaType,
  "This Group does not have any upcoming events"
>;

export type GroupHydrated = AsyncState<GroupHydratedSchemaType>;

export type EventsOfGroup =
  | AsyncState<EventsPages, "No events have been scheduled for this group">
  | { status: "refreshing" };

export type GroupHistoryType = AsyncState<
  GroupEventSummarySchemaType[],
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
