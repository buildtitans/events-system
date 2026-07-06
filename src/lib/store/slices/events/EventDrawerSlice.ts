import {
  AsyncThunkConfig,
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AsyncState } from "@/src/lib/types/state/types";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { enqueueDrawer } from "../rendering/RenderingSlice";

export type OpenedEventState = AsyncState<EventSchemaType, "Event not found">;

export type NumberOfAttendantsType =
  | { status: "initial" }
  | { status: "none" }
  | { status: "ready"; data: number };

export type NameOfGroup =
  | { status: "initial" }
  | { status: "ready"; data: string };

export type GroupSlug =
  | { status: "initial" }
  | { status: "ready"; data: GroupSchemaType["slug"] };

type InitialState = {
  event: OpenedEventState;
  groupName: NameOfGroup;
  groupSlug: GroupSlug;
  viewerAttendanceStatus: EventAttendantsSchemaType["status"];
  numberAttending: NumberOfAttendantsType;
  numberInterested: NumberOfAttendantsType;
  drawerViewerRole: GroupMemberSchemaType["role"];
};

const initialState: InitialState = {
  event: { status: "initial" },
  groupName: { status: "initial" },
  groupSlug: { status: "initial" },
  viewerAttendanceStatus: "not_going",
  numberAttending: { status: "initial" },
  numberInterested: { status: "initial" },
  drawerViewerRole: "anonymous",
};

export const hydrateEventDrawer = createAsyncThunk(
  "EventDrawer/hydrate",
  async (
    id: EventSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueDrawer("event drawer"));

    try {
      const result = await trpcClient.events.eventForDrawer.mutate(id);

      if (!result) {
        throw new Error("Failed to hydrate selected event");
      }

      return result;
    } catch (err) {
      logCaughtError("hydrateEventDrawer()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const EventDrawerSlice = createSlice({
  name: "EventDrawer",
  initialState: initialState,
  reducers: {
    fillEventDrawer: (
      state: InitialState,
      action: PayloadAction<OpenedEventState>,
    ) => {
      state.event = action.payload;
    },
    getDrawerViewerRole: (
      state: InitialState,
      action: PayloadAction<GroupMemberSchemaType["role"]>,
    ) => {
      state.drawerViewerRole = action.payload;
    },
    getNumAttendants: (
      state: InitialState,
      action: PayloadAction<NumberOfAttendantsType>,
    ) => {
      state.numberAttending = action.payload;
    },
    getNumInterested: (
      state: InitialState,
      action: PayloadAction<NumberOfAttendantsType>,
    ) => {
      state.numberInterested = action.payload;
    },
    getGroupName: (state: InitialState, action: PayloadAction<NameOfGroup>) => {
      state.groupName = action.payload;
    },
    getGroupSlug: (state: InitialState, action: PayloadAction<GroupSlug>) => {
      state.groupSlug = action.payload;
    },
    getUserAttendanceStatus: (
      state: InitialState,
      action: PayloadAction<EventAttendantsSchemaType["status"]>,
    ) => {
      state.viewerAttendanceStatus = action.payload;
    },
    closeEventDrawer: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(hydrateEventDrawer.rejected, (state: InitialState) => {
      state.event = {
        status: "failed",
        error: "Failed to hydrate event drawer",
      };
    });
    builder.addCase(
      hydrateEventDrawer.fulfilled,
      (state: InitialState, action) => {
        const { meta, event } = action.payload;

        state.groupName = { status: "ready", data: meta.name };
        state.drawerViewerRole = meta.role;
        state.groupSlug = { status: "ready", data: meta.slug };
        state.numberAttending = {
          status: "ready",
          data: meta.attendants.going,
        };
        state.numberInterested = {
          status: "ready",
          data: meta.attendants.interested,
        };
        state.viewerAttendanceStatus = meta.rsvpStatus;

        state.event = { status: "ready", data: event };
      },
    );

    builder.addCase(hydrateEventDrawer.pending, (state: InitialState) => {
      state.event = { status: "pending" };
    });
  },
});

export type EventDrawerSliceType = ReturnType<typeof EventDrawerSlice.reducer>;

export const {
  fillEventDrawer,
  closeEventDrawer,
  getNumAttendants,
  getNumInterested,
  getGroupName,
  getGroupSlug,
  getUserAttendanceStatus,
  getDrawerViewerRole,
} = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;
