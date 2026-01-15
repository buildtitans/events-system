import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groupSchema";

type GroupsInitialState = {
    communities: GroupsSchemaType
};

const initialState: GroupsInitialState = {
    communities: []
};

const GroupsSlice = createSlice({
    name: "Groups",
    initialState: initialState,
    reducers: {
        getAllGroups: (state: GroupsInitialState, action: PayloadAction<GroupsInitialState["communities"]>) => {
            state.communities = action.payload
        },
        addGroup: (state: GroupsInitialState, action: PayloadAction<GroupSchemaType>) => {
            state.communities.push(action.payload);
        }
    }
});

export const { getAllGroups, addGroup } = GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer

export type { GroupsSliceType, GroupsInitialState };