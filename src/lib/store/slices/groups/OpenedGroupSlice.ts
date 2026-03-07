import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventsPages } from "../events/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { LoadingStatus } from "@/src/lib/types/tokens/types";
import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";

export type GroupHydrated =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "failed"; error: "Group hydration error" }
  | { status: "ready"; data: GroupSchemaType };

export type HydratedEventsForOpenedGroup =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "refreshing" }
  | {
      status: "warning";
      message: "No events have been scheduled for this group";
    }
  | { status: "failed"; error: "Error hydrating events for opened group" }
  | { status: "ready"; data: EventsPages };

export type GroupHistoryType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: EventsArraySchemaType }
  | { status: "failed"; error: string };

export type CurrentDisplay = "overview" | "calandar" | "group history";

type InitialState = {
  group: GroupHydrated;
  events: HydratedEventsForOpenedGroup;
  syncStatus: LoadingStatus;
  currPage: number;
  activeSection: CurrentDisplay;
  history: GroupHistoryType;
  numMembers: number;
  organizerEmail: string;
};

const initialState: InitialState = {
  group: { status: "idle" },
  events: { status: "initial" },
  history: { status: "initial" },
  syncStatus: "idle",
  currPage: 0,
  activeSection: "overview",
  numMembers: 0,
  organizerEmail: "N/A",
};

const OpenedGroupSlice = createSlice({
  name: "OpenedGroup",
  initialState: initialState,
  reducers: {
    getGroupEvents: (
      state: InitialState,
      action: PayloadAction<HydratedEventsForOpenedGroup>,
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
    getEmailOfGroupOrganizer: (
      state: InitialState,
      action: PayloadAction<string>,
    ) => {
      state.organizerEmail = action.payload;
    },
    getNumMembers: (state: InitialState, action: PayloadAction<number>) => {
      state.numMembers = action.payload;
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
  clearOpenedGroupSlice,
  getNumMembers,
  getEmailOfGroupOrganizer,
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;
