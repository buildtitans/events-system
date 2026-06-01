import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventsPages } from "../events/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { LoadingStatus } from "@/src/lib/types/tokens/types";
import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import { AsyncState } from "@/src/lib/types/state/types";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { GroupArchivesState } from "@/src/lib/store/slices/groups/types";

export type GroupHydrated = AsyncState<GroupSchemaType>;

type EventsOfGroup =
  | AsyncState<EventsPages, "No events have been scheduled for this group">
  | { status: "refreshing" };

export type FlattenedGroupEventsState = AsyncState<
  EventsArraySchemaType,
  "No Events held for this group"
>;

export type GroupHistoryType = AsyncState<
  EventsArraySchemaType,
  "No history to display"
>;

export type CurrentDisplay =
  | "overview"
  | "events"
  | "group history"
  | "archives";

type InitialState = {
  group: GroupHydrated;
  events: EventsOfGroup;
  syncStatus: LoadingStatus;
  currPage: number;
  activeSection: CurrentDisplay;
  history: GroupHistoryType;
  archives: GroupArchivesState;
  numMembers: number;
  organizerEmail: string;
  flattenedEvents: FlattenedGroupEventsState;
  attendanceHistoryLookup: Record<
    EventAttendantsSchemaType["event_id"],
    number
  >;
  archivesAttendance: Record<EventAttendantsSchemaType["event_id"], number>;
};

const initialState: InitialState = {
  group: { status: "initial" },
  events: { status: "refreshing" },
  history: { status: "initial" },
  archives: { status: "initial" },
  syncStatus: "idle",
  currPage: 0,
  activeSection: "overview",
  numMembers: 0,
  organizerEmail: "N/A",
  flattenedEvents: { status: "initial" },
  attendanceHistoryLookup: {},
  archivesAttendance: {},
};

const OpenedGroupSlice = createSlice({
  name: "OpenedGroup",
  initialState: initialState,
  reducers: {
    getGroupEvents: (
      state: InitialState,
      action: PayloadAction<EventsOfGroup>,
    ) => {
      state.events = action.payload;
    },
    groupOpened: (
      state: InitialState,
      action: PayloadAction<GroupHydrated>,
    ) => {
      state.group = action.payload;
    },

    groupEventsStatus: (
      state: InitialState,
      action: PayloadAction<LoadingStatus>,
    ) => {
      state.syncStatus = action.payload;
    },
    displaySection: (
      state: InitialState,
      action: PayloadAction<CurrentDisplay>,
    ) => {
      state.activeSection = action.payload;
    },
    getGroupHistory: (
      state: InitialState,
      action: PayloadAction<GroupHistoryType>,
    ) => {
      state.history = action.payload;
    },
    populateGroupArchives: (
      state: InitialState,
      action: PayloadAction<GroupArchivesState>,
    ) => {
      state.archives = action.payload;
    },
    getEmailOfGroupOrganizer: (
      state: InitialState,
      action: PayloadAction<string>,
    ) => {
      state.organizerEmail = action.payload;
    },
    getNumMembers: (state: InitialState, action: PayloadAction<number>) => {
      state.numMembers = action.payload;
    },
    getFlattenedGroupEvents: (
      state: InitialState,
      action: PayloadAction<FlattenedGroupEventsState>,
    ) => {
      state.flattenedEvents = action.payload;
    },
    getPastEventsAttendanceRecords: (
      state: InitialState,
      action: PayloadAction<
        Record<EventAttendantsSchemaType["event_id"], number>
      >,
    ) => {
      state.attendanceHistoryLookup = action.payload;
    },
    getArchivesAttendanceRecords: (
      state: InitialState,
      action: PayloadAction<
        Record<EventAttendantsSchemaType["event_id"], number>
      >,
    ) => {
      state.archivesAttendance = action.payload;
    },

    clearOpenedGroupSlice: () => initialState,
  },
});

export const {
  getGroupEvents,
  groupOpened,
  groupEventsStatus,
  displaySection,
  getGroupHistory,
  populateGroupArchives,
  clearOpenedGroupSlice,
  getNumMembers,
  getEmailOfGroupOrganizer,
  getFlattenedGroupEvents,
  getPastEventsAttendanceRecords,
  getArchivesAttendanceRecords,
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;
