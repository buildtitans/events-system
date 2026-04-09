import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AttendanceDictionaryType } from "@/src/lib/types/hooks/types";

type InitialState = {
  viewerAttendance: AttendanceDictionaryType;
  viewerRole: GroupMemberSchemaType["role"];
};

const initialState: InitialState = {
  viewerAttendance: {},
  viewerRole: "anonymous",
};

const ViewerSlice = createSlice({
  name: "group/members",
  initialState: initialState,
  reducers: {
    getAttendanceDictionary: (
      state: InitialState,
      action: PayloadAction<AttendanceDictionaryType>,
    ) => {
      state.viewerAttendance = action.payload;
    },
    getCurrentRole: (
      state: InitialState,
      action: PayloadAction<GroupMemberSchemaType["role"]>,
    ) => {
      state.viewerRole = action.payload;
    },
    clearPermissionsSlice: () => initialState,
  },
});

export type GroupMembersSliceType = ReturnType<typeof ViewerSlice.reducer>;

export const {
  clearPermissionsSlice,
  getAttendanceDictionary,
  getCurrentRole,
} = ViewerSlice.actions;

export default ViewerSlice.reducer;
