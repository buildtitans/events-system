import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type GroupMembersSliceState = {
    members: GroupMembersSchemaType[]
};

const initialState: GroupMembersSliceState = {
    members: []
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
        clearMembersState: (state: GroupMembersSliceState) => initialState,
    }
});


export type GroupMembersSliceType = ReturnType<typeof GroupMembersSlice.reducer>;

export const { getGroupMembers, addToGroupMembersState, clearMembersState } = GroupMembersSlice.actions;

export default GroupMembersSlice.reducer;