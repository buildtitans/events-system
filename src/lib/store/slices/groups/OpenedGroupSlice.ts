import {
  AsyncThunkConfig,
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { GroupArchivesState } from "@/src/lib/store/slices/groups/types";
import type {
  FlattenedGroupEventsState,
  GroupHydrated,
  EventsOfGroup,
  GroupHistoryType,
  CurrentDisplay,
} from "@/src/lib/store/slices/groups/types";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import {
  OpenedGroupPayload,
  syncOpenedGroup,
} from "../../sync/syncOpenedGroup";
import { getCurrentRole } from "../viewer/ViewerSlice";
import { enqueueSidebar } from "../rendering/RenderingSlice";

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

export const hydrateGroup = createAsyncThunk(
  "OpenedGroup/hydrate",
  async (
    slug: GroupSchemaType["slug"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueSidebar("group"));

    try {
      const results = await syncOpenedGroup(slug);

      if (!results.ok) {
        throw new Error("Failed to hydrate group selected");
      }

      thunkAPI.dispatch(getCurrentRole(results.data.role));

      return results.data;
    } catch (err) {
      logCaughtError("OpenedGroupSlice.hydrateGroup()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

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

  extraReducers(builder) {
    builder.addCase(hydrateGroup.rejected, (state: InitialState) => {
      state.group = {
        status: "failed",
        error: "Unexpected error while trying to hydrate selected group",
      };
      state.events = {
        status: "failed",
        error: "Failed to hydrate group and associated events",
      };
      state.flattenedEvents = {
        status: "failed",
        error: "Failed to hydrate selected group and associated schedule",
      };
    });

    builder.addCase(hydrateGroup.pending, (state: InitialState) => {
      state.group = { status: "pending" };
      state.events = { status: "pending" };
      state.flattenedEvents = { status: "pending" };
      state.history = { status: "initial" };
    });

    builder.addCase(
      hydrateGroup.fulfilled,
      (state: InitialState, action: PayloadAction<OpenedGroupPayload>) => {
        const { group, events, allGroupEvents, numMembers, organizerEmail } =
          action.payload;

        state.group = { status: "ready", data: group };
        state.numMembers = numMembers;
        state.organizerEmail = organizerEmail;

        if (events.length > 0) {
          state.events = { status: "ready", data: events };
        } else {
          state.events = {
            status: "n/a",
            message: "No events have been scheduled for this group",
          };
        }

        if (allGroupEvents.length > 0) {
          state.flattenedEvents = { status: "ready", data: allGroupEvents };
        } else {
          state.flattenedEvents = {
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
