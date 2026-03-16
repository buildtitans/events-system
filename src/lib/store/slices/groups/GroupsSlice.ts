import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { NameSlugDescriptionLookup } from "@/src/lib/types/server/types";

type GroupsInitialState = {
  communities: GroupsSchemaType;
  currentPage: number;
  groupNameLookup: NameSlugDescriptionLookup;
};

const initialState: GroupsInitialState = {
  communities: [],
  currentPage: 0,
  groupNameLookup: {},
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
  },
});

export const { getAllGroups, addGroup, paginateGroups, getNameLookup } =
  GroupsSlice.actions;

type GroupsSliceType = ReturnType<typeof GroupsSlice.reducer>;

export default GroupsSlice.reducer;

export type { GroupsSliceType, GroupsInitialState };
