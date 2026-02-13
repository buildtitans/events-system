import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type ViewerAccess = Record<GroupMembersSchemaType["group_id"], GroupMembersSchemaType["role"]>;

type InitialState = {
    accessPermissions: ViewerAccess,
    notifications: NotificationSchemaArrayType
};


const initialState: InitialState = {
    accessPermissions: {},
    notifications: []
};

const PermissionsSlice = createSlice({
    name: "group/members",
    initialState: initialState,
    reducers: {

        getViewerPermissions: (state: InitialState, action: PayloadAction<ViewerAccess>) => {
            state.accessPermissions = action.payload;
        },

        clearPermissionsSlice: () => initialState,
    }
});


export type GroupMembersSliceType = ReturnType<typeof PermissionsSlice.reducer>;

export const {
    clearPermissionsSlice,
    getViewerPermissions
} = PermissionsSlice.actions;

export default PermissionsSlice.reducer;