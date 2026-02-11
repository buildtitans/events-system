import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groups/groupSchema";

type GroupsInitialState = {
    communities: GroupsSchemaType,
    currentPage: number
};

const initialState: GroupsInitialState = {
    communities: [],
    currentPage: 0
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
        },
        paginateGroups: (state: GroupsInitialState, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        }
    }
});

export const { getAllGroups, addGroup, paginateGroups } = GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer

export type { GroupsSliceType, GroupsInitialState };