import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GroupMembersSliceState = {
    members: GroupMembersSchemaType[],
    viewerKind: GroupMembersSchemaType["role"],
};

const initialState: GroupMembersSliceState = {
    members: [],
    viewerKind: "anonymous",

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
        designateViewerKind: (state: GroupMembersSliceState, action: PayloadAction<GroupMembersSchemaType["role"]>) => {
            state.viewerKind = action.payload
        },
        clearMembersState: () => initialState,
    }
});


export type GroupMembersSliceType = ReturnType<typeof GroupMembersSlice.reducer>;

export const { getGroupMembers, addToGroupMembersState, clearMembersState, designateViewerKind } = GroupMembersSlice.actions;

export default GroupMembersSlice.reducer;