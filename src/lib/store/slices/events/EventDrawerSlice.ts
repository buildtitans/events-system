import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AsyncState } from "@/src/lib/types/state/types";
import { hydrateEventDrawer } from "./thunks";

export type OpenedEventState = AsyncState<
  HydratedEventSchemaType,
  "Event not found"
>;

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

const EventDrawerSlice = createSlice({
  name: "EventDrawer",
  initialState: initialState,
  reducers: {
    updateRsvpStatus: (
      state: InitialState,
      action: PayloadAction<EventAttendantsSchemaType["status"]>,
    ) => {
      state.viewerAttendanceStatus = action.payload;
      if (state.event.status === "ready") {
        state.event.data.meta.user.status = action.payload;
      }
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
        state.event = { status: "ready", data: action.payload };
      },
    );

    builder.addCase(hydrateEventDrawer.pending, (state: InitialState) => {
      state.event = { status: "pending" };
    });
  },
});

export type EventDrawerSliceType = ReturnType<typeof EventDrawerSlice.reducer>;

export const { closeEventDrawer, updateRsvpStatus } = EventDrawerSlice.actions;

export default EventDrawerSlice.reducer;
