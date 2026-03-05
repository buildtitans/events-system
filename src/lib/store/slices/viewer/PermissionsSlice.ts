import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { RBACType } from "@/src/server/src/db/clients/types/types";
import { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  accessPermissions: RBACType;
  viewerAttendance: AttendanceDictionaryType;
  notifications: NotificationSchemaArrayType;
};

const initialState: InitialState = {
  accessPermissions: {},
  viewerAttendance: {},
  notifications: [],
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
    clearPermissionsSlice: () => initialState,
  },
});

export type GroupMembersSliceType = ReturnType<typeof PermissionsSlice.reducer>;

export const {
  clearPermissionsSlice,
  getViewerPermissions,
  getAttendanceDictionary,
} = PermissionsSlice.actions;

export default PermissionsSlice.reducer;
