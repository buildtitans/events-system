import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GroupsSchemaType } from "@/src/schemas/groupSchema";

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
        }
    }
});

export const { getAllGroups } = GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer

export type { GroupsSliceType, GroupsInitialState };