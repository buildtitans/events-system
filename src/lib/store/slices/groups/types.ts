import type {
  GroupDiscoverySummarySchemaType,
  GroupRefreshSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { AsyncState, AsyncStateWithRefresh } from "@/src/lib/types/state/types";
import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";
import {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  NextEventForGroupSummarySchemaType,
} from "@/src/schemas/groups/groupSchema";

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

type GroupHydratedMetaShape = GroupHydratedSchemaType["meta"];

type OpenGroupMetadata = Omit<GroupHydratedMetaShape, "events">;

type EventsScheduled =
  | {
      status: "n/a";
    }
  | {
      status: "ready";
      data: GroupRefreshSchemaType["group_events"];
    };

type GroupCalandarState =
  | {
      status: "n/a";
    }
  | {
      status: "ready";
      data: GroupRefreshSchemaType["calandar"];
    };

type NextEventState =
  | {
      status: "n/a";
    }
  | {
      status: "ready";
      data: NextEventForGroupSummarySchemaType;
    };

type GroupEvents = {
  scheduled: EventsScheduled;
  calandar: GroupCalandarState;
  next_event: NextEventState;
};

export type GroupEventsState = AsyncStateWithRefresh<GroupEvents>;

export type GroupOpened = {
  group: GroupHydratedSchemaType["group"];
  meta: OpenGroupMetadata;
};

export type GroupHydrated = AsyncState<GroupOpened>;

export type GroupHistoryType = AsyncState<
  GroupEventSummarySchemaType[],
  "No history to display"
>;

export type CurrentDisplay =
  | "overview"
  | "events"
  | "group history"
  | "archives";
