import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { RBACType } from "@/src/server/src/db/clients/types/types";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  accessPermissions: RBACType;
  viewerAttendance: AttendanceDictionaryType;
  notifications: NotificationSchemaArrayType;
  viewerRole: GroupMemberSchemaType["role"];
};

const initialState: InitialState = {
  accessPermissions: {},
  viewerAttendance: {},
  notifications: [],
  viewerRole: "anonymous",
};

const PermissionsSlice = createSlice({
  name: "group/members",
  initialState: initialState,
  reducers: {
    getViewerPermissions: (
      state: InitialState,
      action: PayloadAction<RBACType>,
    ) => {
      state.accessPermissions = action.payload;
    },
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

export type GroupMembersSliceType = ReturnType<typeof PermissionsSlice.reducer>;

export const {
  clearPermissionsSlice,
  getViewerPermissions,
  getAttendanceDictionary,
  getCurrentRole,
} = PermissionsSlice.actions;

export default PermissionsSlice.reducer;
