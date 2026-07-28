import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { GroupArchivesState } from "@/src/lib/store/slices/groups/types";
import type {
  GroupEventsCalandarState,
  GroupHydrated,
  EventsOfGroup,
  GroupHistoryType,
  CurrentDisplay,
} from "@/src/lib/store/slices/groups/types";
import type { OpenedGroupPayload } from "../../services/types";
import { EventsPages } from "../events/types";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  hydrateGroup,
  refreshGroupEvents,
  refreshArchivedEvents,
  scheduleNewEvent,
} from "./thunks";
import { PastEventAttendanceLookup } from "@/src/server/core/service/types";

type InitialState = {
  group: GroupHydrated;
  events: EventsOfGroup;
  currPage: number;
  activeSection: CurrentDisplay;
  history: GroupHistoryType;
  archives: GroupArchivesState;
  numMembers: number;
  organizerEmail: string;
  calandar: GroupEventsCalandarState;
  attendanceHistoryLookup: Record<
    EventAttendantsSchemaType["event_id"],
    number
  >;
  archivesAttendance: Record<EventAttendantsSchemaType["event_id"], number>;
};

const initialState: InitialState = {
  group: { status: "initial" },
  events: { status: "initial" },
  history: { status: "initial" },
  archives: { status: "initial" },
  currPage: 0,
  activeSection: "overview",
  numMembers: 0,
  organizerEmail: "N/A",
  calandar: { status: "initial" },
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
    getCalandarEvents: (
      state: InitialState,
      action: PayloadAction<GroupEventsCalandarState>,
    ) => {
      state.calandar = action.payload;
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

  extraReducers(builder) {
    builder.addCase(scheduleNewEvent.fulfilled, (state: InitialState) => {
      state.events = { status: "refreshing" };
    });

    builder.addCase(refreshArchivedEvents.rejected, (state: InitialState) => {
      state.archives = {
        status: "failed",
        error: "Failed to refresh archived events",
      };
    });

    builder.addCase(refreshArchivedEvents.pending, (state: InitialState) => {
      state.archives = { status: "pending" };
    });

    builder.addCase(
      refreshArchivedEvents.fulfilled,
      (
        state: InitialState,
        action: PayloadAction<{
          archives: EventSchemaType[];
          archivedAttendanceRecords: PastEventAttendanceLookup;
        }>,
      ) => {
        state.archives = { status: "ready", data: action.payload.archives };
        state.archivesAttendance = action.payload.archivedAttendanceRecords;
      },
    );

    builder.addCase(refreshGroupEvents.rejected, (state: InitialState) => {
      state.events = {
        status: "failed",
        error: "Failed to refresh group events",
      };
      state.calandar = {
        status: "failed",
        error: "Failed to refresh group calandar",
      };
    });
    builder.addCase(refreshGroupEvents.pending, (state: InitialState) => {
      state.calandar = { status: "pending" };
    });
    builder.addCase(
      refreshGroupEvents.fulfilled,
      (
        state: InitialState,
        action: PayloadAction<{
          refreshedEventsLayout: EventsPages;
          calandarEvents: EventSchemaType[];
        }>,
      ) => {
        const { refreshedEventsLayout, calandarEvents } = action.payload;

        if (refreshedEventsLayout.length > 0) {
          state.events = { status: "ready", data: refreshedEventsLayout };
        } else {
          state.events = {
            status: "n/a",
            message: "No events have been scheduled for this group",
          };
        }

        if (calandarEvents.length > 0) {
          state.calandar = { status: "ready", data: calandarEvents };
        } else {
          state.calandar = {
            status: "n/a",
            message: "No Events held for this group",
          };
        }
      },
    );

    builder.addCase(hydrateGroup.rejected, (state: InitialState) => {
      state.group = {
        status: "failed",
        error: "Unexpected error while trying to hydrate selected group",
      };
      state.events = {
        status: "failed",
        error: "Failed to hydrate group and associated events",
      };
      state.calandar = {
        status: "failed",
        error: "Failed to hydrate selected group and associated schedule",
      };
    });

    builder.addCase(hydrateGroup.pending, (state: InitialState) => {
      state.group = { status: "pending" };
      state.events = { status: "pending" };
      state.calandar = { status: "pending" };
      state.history = { status: "initial" };
    });

    builder.addCase(
      hydrateGroup.fulfilled,
      (state: InitialState, action: PayloadAction<OpenedGroupPayload>) => {
        const { group, layout, calandar, numMembers, organizerEmail } =
          action.payload;

        state.group = { status: "ready", data: group };
        state.numMembers = numMembers;
        state.organizerEmail = organizerEmail;

        if (layout.length > 0) {
          state.events = { status: "ready", data: layout };
        } else {
          state.events = {
            status: "n/a",
            message: "No events have been scheduled for this group",
          };
        }

        if (calandar.length > 0) {
          state.calandar = { status: "ready", data: calandar };
        } else {
          state.calandar = {
            status: "n/a",
            message: "No Events held for this group",
          };
        }
      },
    );
  },
});

export const {
  getGroupEvents,
  groupOpened,
  displaySection,
  getGroupHistory,
  populateGroupArchives,
  clearOpenedGroupSlice,
  getNumMembers,
  getEmailOfGroupOrganizer,
  getCalandarEvents,
  getPastEventsAttendanceRecords,
  getArchivesAttendanceRecords,
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;
