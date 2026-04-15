import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { NameSlugDescriptionLookup } from "@/src/lib/types/server/types";
import { initializeDomains } from "../rendering/RenderingSlice";
import { GroupsFilter, LandingGroupsDisplayedState } from "./types";

type GroupsInitialState = {
  communities: GroupsSchemaType;
  currentPage: number;
  groupNameLookup: NameSlugDescriptionLookup;
  popularCommunities: GroupsSchemaType;
  groupsDisplayed: GroupsFilter;
  landingGroupsTab: LandingGroupsDisplayedState;
};

const initialState: GroupsInitialState = {
  communities: [],
  currentPage: 0,
  groupNameLookup: {},
  popularCommunities: [],
  groupsDisplayed: "all",
  landingGroupsTab: { status: "pending" },
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
    getNameLookup: (
      state: GroupsInitialState,
      action: PayloadAction<NameSlugDescriptionLookup>,
    ) => {
      state.groupNameLookup = action.payload;
    },
    addGroup: (
      state: GroupsInitialState,
      action: PayloadAction<GroupSchemaType>,
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
    changeLandingGroupsTab: (
      state: GroupsInitialState,
      action: PayloadAction<LandingGroupsDisplayedState>,
    ) => {
      state.landingGroupsTab = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(initializeDomains, (state, action) => {
      const result = action.payload;

      if (result.status === "fulfilled") {
        state.communities = result.data.groups;
        state.groupNameLookup = result.data.groupNameDictionary;
      }
    });
  },
});

export const {
  getAllGroups,
  addGroup,
  paginateGroups,
  getNameLookup,
  changeLandingGroupsTab,
  changeDisplayedGroupFilter,
} = GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer;

export type { GroupsSliceType, GroupsInitialState };
