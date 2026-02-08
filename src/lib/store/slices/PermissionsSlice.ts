import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type ViewerAccess = Record<GroupMembersSchemaType["group_id"], GroupMembersSchemaType["role"]>;

type GroupMembersSliceState = {
    accessPermissions: ViewerAccess
};


const initialState: GroupMembersSliceState = {
    accessPermissions: {}
};

const PermissionsSlice = createSlice({
    name: "group/members",
    initialState: initialState,
    reducers: {

        getViewerPermissions: (state: GroupMembersSliceState, action: PayloadAction<ViewerAccess>) => {
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