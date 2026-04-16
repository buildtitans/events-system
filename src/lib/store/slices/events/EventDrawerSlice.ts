import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AsyncState } from "@/src/lib/types/state/types";

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
