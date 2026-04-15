import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ParticipationsType,
  MyGroupsState,
  UserAccountViewType,
  NextGroupEventLookupMapType,
  UserEmailState,
} from "./types";

type InitialState = {
  email: UserEmailState;
  participations: ParticipationsType;
  myGroups: MyGroupsState;
  view: UserAccountViewType;
  nextEventLookup: NextGroupEventLookupMapType;
};

const initialState: InitialState = {
  email: { status: "initial" },
  myGroups: { status: "initial" },
  participations: { status: "initial" },
  view: "my groups",
  nextEventLookup: {},
};

const UserSlice = createSlice({
  name: "slice/user",
  initialState: initialState,
  reducers: {
    storeUserEmail: (
      state: InitialState,
      action: PayloadAction<UserEmailState>,
    ) => {
      state.email = action.payload;
    },
    getParticipations: (
      state: InitialState,
      action: PayloadAction<ParticipationsType>,
    ) => {
      state.participations = action.payload;
    },
    getMyGroups: (
      state: InitialState,
      action: PayloadAction<MyGroupsState>,
    ) => {
      state.myGroups = action.payload;
    },
    getNextGroupEventLookup: (
      state: InitialState,
      action: PayloadAction<NextGroupEventLookupMapType>,
    ) => {
      state.nextEventLookup = action.payload;
    },
    changeAccountTab: (
      state: InitialState,
      action: PayloadAction<UserAccountViewType>,
    ) => {
      state.view = action.payload;
    },
  },
});

export const {
  storeUserEmail,
  getParticipations,
  getMyGroups,
  changeAccountTab,
  getNextGroupEventLookup,
} = UserSlice.actions;

export type UserSliceType = ReturnType<typeof UserSlice.reducer>;

export default UserSlice.reducer;
