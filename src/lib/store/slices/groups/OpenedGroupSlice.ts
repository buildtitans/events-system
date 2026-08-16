import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type {
  GroupArchivesState,
  GroupCategoryState,
  NextEventState,
} from "@/src/lib/store/slices/groups/types";
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
  category: GroupCategoryState;
  events: EventsOfGroup;
  currPage: number;
  activeSection: CurrentDisplay;
  history: GroupHistoryType;
  archives: GroupArchivesState;
  numMembers: number;
  organizerEmail: string;
  calandar: GroupEventsCalandarState;
  nextEvent: NextEventState;
  attendanceHistoryLookup: Record<
    EventAttendantsSchemaType["event_id"],
    number
  >;
  archivesAttendance: Record<EventAttendantsSchemaType["event_id"], number>;
};

const initialState: InitialState = {
  group: { status: "initial" },
  category: { status: "initial" },
  events: { status: "initial" },
  history: { status: "initial" },
  archives: { status: "initial" },
  currPage: 0,
  activeSection: "overview",
  numMembers: 0,
  nextEvent: { status: "initial" },
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
      state.archivesAttendance = {};
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
        const payload = action.payload;
        if (payload.archives.length > 0) {
          state.archives = { status: "ready", data: payload.archives };
          state.archivesAttendance = payload.archivedAttendanceRecords;
        } else {
          state.archives = {
            status: "n/a",
            message: "This group has no archived events",
          };
          state.archivesAttendance = {};
        }
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
      state.nextEvent = {
        status: "failed",
        error: "Failed to refresh soonest upcoming event",
      };
    });
    builder.addCase(refreshGroupEvents.pending, (state: InitialState) => {
      state.calandar = { status: "pending" };
      state.events = { status: "refreshing" };
      state.nextEvent = { status: "pending" };
    });
    builder.addCase(
      refreshGroupEvents.fulfilled,
      (
        state: InitialState,
        action: PayloadAction<{
          refreshedEventsLayout: EventsPages;
          calandarEvents: EventSchemaType[];
          nextEvent: EventSchemaType | undefined;
        }>,
      ) => {
        const { refreshedEventsLayout, calandarEvents, nextEvent } =
          action.payload;

        if (nextEvent) {
          state.nextEvent = { status: "ready", data: nextEvent };
        } else {
          state.nextEvent = {
            status: "n/a",
            message: "This Group does not have any upcoming events",
          };
        }

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
      state.nextEvent = {
        status: "failed",
        error: "Failed to find the next scheduled event for this group",
      };
      state.category = {
        status: "failed",
        error: "Failed to find the category of this group",
      };
    });

    builder.addCase(hydrateGroup.pending, (state: InitialState) => {
      state.group = { status: "pending" };
      state.events = { status: "pending" };
      state.calandar = { status: "pending" };
      state.history = { status: "initial" };
      state.nextEvent = { status: "pending" };
      state.category = { status: "pending" };
    });

    builder.addCase(
      hydrateGroup.fulfilled,
      (state: InitialState, action: PayloadAction<OpenedGroupPayload>) => {
        const {
          group,
          layout,
          calandar,
          numMembers,
          organizerEmail,
          nextEvent,
          category,
        } = action.payload;

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

        if (category) {
          state.category = { status: "ready", data: category };
        } else {
          state.category = {
            status: "n/a",
            message: "Could not find a valid category for this group",
          };
        }

        if (nextEvent) {
          state.nextEvent = { status: "ready", data: nextEvent };
        } else {
          state.nextEvent = {
            status: "n/a",
            message: "This Group does not have any upcoming events",
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
  getCalandarEvents,
  getPastEventsAttendanceRecords,
  getArchivesAttendanceRecords,
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;
