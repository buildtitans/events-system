import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { initializeDomains } from "../rendering/RenderingSlice";
import { GroupsFilter } from "./types";

type GroupsInitialState = {
  communities: GroupDiscoverySummarySchemaType[];
  currentPage: number;
  groupsDisplayed: GroupsFilter;
};

const initialState: GroupsInitialState = {
  communities: [],
  currentPage: 0,
  groupsDisplayed: "all",
};

const GroupsSlice = createSlice({
  name: "Groups",
  initialState: initialState,
  reducers: {
    getAllGroups: (
      state: GroupsInitialState,
      action: PayloadAction<GroupsInitialState["communities"]>,
    ) => {
      state.communities = action.payload;
    },
    addGroup: (
      state: GroupsInitialState,
      action: PayloadAction<GroupDiscoverySummarySchemaType>,
    ) => {
      state.communities.push(action.payload);
    },
    paginateGroups: (
      state: GroupsInitialState,
      action: PayloadAction<number>,
    ) => {
      state.currentPage = action.payload;
    },

    changeDisplayedGroupFilter: (
      state: GroupsInitialState,
      action: PayloadAction<GroupsFilter>,
    ) => {
      state.groupsDisplayed = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(initializeDomains, (state, action) => {
      const result = action.payload;

      if (result.status === "fulfilled") {
        state.communities = result.data.groups;
      }
    });
  },
});

export const {
  getAllGroups,
  addGroup,
  paginateGroups,
  changeDisplayedGroupFilter,
} = GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer;

export type { GroupsSliceType, GroupsInitialState };
