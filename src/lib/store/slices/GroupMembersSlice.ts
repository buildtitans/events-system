import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type ViewerAccess = Record<GroupMembersSchemaType["group_id"], GroupMembersSchemaType["role"]>;

type GroupMembersSliceState = {
    members: GroupMembersSchemaType[],
    accessPermissions: ViewerAccess
};


const initialState: GroupMembersSliceState = {
    members: [],
    accessPermissions: {}
};

const GroupMembersSlice = createSlice({
    name: "group/members",
    initialState: initialState,
    reducers: {
        getGroupMembers: (state: GroupMembersSliceState, action: PayloadAction<GroupMembersSchemaType[]>) => {
            state.members = action.payload
        },
        addToGroupMembersState: (state: GroupMembersSliceState, action: PayloadAction<GroupMembersSchemaType>) => {
            state.members.push(action.payload);
        },
        getViewerPermissions: (state: GroupMembersSliceState, action: PayloadAction<ViewerAccess>) => {
            state.accessPermissions = action.payload;
        },
        clearMembersState: () => initialState,
    }
});


export type GroupMembersSliceType = ReturnType<typeof GroupMembersSlice.reducer>;

export const {
    getGroupMembers,
    addToGroupMembersState,
    clearMembersState,
    getViewerPermissions
} = GroupMembersSlice.actions;

export default GroupMembersSlice.reducer;