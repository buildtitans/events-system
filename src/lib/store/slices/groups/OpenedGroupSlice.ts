import { updateEventStatus } from "../events/thunks";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  GroupArchivesState,
  GroupEventsState,
} from "@/src/lib/store/slices/groups/types";
import type {
  GroupHydrated,
  GroupHistoryType,
  CurrentDisplay,
} from "@/src/lib/store/slices/groups/types";
import {
  hydrateGroup,
  refreshGroupEvents,
  refreshArchivedEvents,
  scheduleNewEvent,
} from "./thunks";
import type {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  GroupRefreshSchemaType,
} from "@/src/schemas/groups/groupSchema";

type InitialState = {
  group: GroupHydrated;
  events: GroupEventsState;
  history: GroupHistoryType;
  archives: GroupArchivesState;
  activeSection: CurrentDisplay;
  currPage: number;
};

const initialState: InitialState = {
  group: { status: "initial" },
  events: { status: "initial" },
  history: { status: "initial" },
  archives: { status: "initial" },
  currPage: 0,
  activeSection: "overview",
};

function toGroupEventsState({
  group_events,
  calandar,
  next_event,
}: GroupRefreshSchemaType): Extract<GroupEventsState, { status: "ready" }> {
  return {
    status: "ready",
    data: {
      scheduled: group_events.length > 0
        ? { status: "ready", data: group_events }
        : { status: "n/a" },
      calandar: calandar.length > 0
        ? { status: "ready", data: calandar }
        : { status: "n/a" },
      next_event: next_event !== undefined
        ? { status: "ready", data: next_event }
        : { status: "n/a" },
    },
  };
}

const OpenedGroupSlice = createSlice({
  name: "OpenedGroup",
  initialState: initialState,
  reducers: {
    getCurrentRole: (
      state,
      action: PayloadAction<GroupMemberSchemaType["role"]>,
    ) => {
      if (state.group.status === "ready") {
        state.group.data.meta.viewer_role = action.payload;
      }
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
    clearOpenedGroupSlice: () => initialState,
  },

  extraReducers(builder) {
    builder.addCase(updateEventStatus.fulfilled, (state: InitialState) => {
      state.events = { status: "refreshing" };
    });

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
        action: PayloadAction<ArchivedEventSchemaType[]>,
      ) => {
        const payload = action.payload;
        if (payload.length > 0) {
          state.archives = { status: "ready", data: payload };
        } else {
          state.archives = {
            status: "n/a",
            message: "This group has no archived events",
          };
        }
      },
    );

    builder.addCase(refreshGroupEvents.rejected, (state: InitialState) => {
      state.events = {
        status: "failed",
        error: "Failed to refresh group events",
      };
    });
    builder.addCase(refreshGroupEvents.pending, (state: InitialState) => {
      state.events = { status: "refreshing" };
    });
    builder.addCase(
      refreshGroupEvents.fulfilled,
      (state: InitialState, action: PayloadAction<GroupRefreshSchemaType>) => {
        if (state.group.status === "ready") {
          state.events = toGroupEventsState(action.payload);
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
    });

    builder.addCase(hydrateGroup.pending, (state: InitialState) => {
      state.group = { status: "pending" };
      state.events = { status: "pending" };
      state.history = { status: "initial" };
    });

    builder.addCase(
      hydrateGroup.fulfilled,
      (state: InitialState, action: PayloadAction<GroupHydratedSchemaType>) => {
        const { group, meta } = action.payload;
        const { events, ...groupMeta } = meta;

        state.group = {
          status: "ready",
          data: {
            group,
            meta: groupMeta,
          },
        };

        state.events = toGroupEventsState(events);
      },
    );
  },
});

export const {
  getCurrentRole,
  displaySection,
  getGroupHistory,
  populateGroupArchives,
  clearOpenedGroupSlice,
} = OpenedGroupSlice.actions;

export type OpenedGroupSliceType = ReturnType<typeof OpenedGroupSlice.reducer>;

export default OpenedGroupSlice.reducer;
