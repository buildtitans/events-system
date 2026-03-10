import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  UserEmailType,
  ParticipationsType,
  MyGroupsType,
  UserAccountViewType,
} from "./types";

type InitialState = {
  email: UserEmailType;
  participations: ParticipationsType;
  myGroups: MyGroupsType;
  view: UserAccountViewType;
};

const initialState: InitialState = {
  email: { status: "initial" },
  myGroups: { status: "initial" },
  participations: { status: "initial" },
  view: "my groups",
};

const UserSlice = createSlice({
  name: "slice/user",
  initialState: initialState,
  reducers: {
    storeUserEmail: (
      state: InitialState,
      action: PayloadAction<UserEmailType>,
    ) => {
      state.email = action.payload;
    },
    getParticipations: (
      state: InitialState,
      action: PayloadAction<ParticipationsType>,
    ) => {
      state.participations = action.payload;
    },
    getMyGroups: (state: InitialState, action: PayloadAction<MyGroupsType>) => {
      state.myGroups = action.payload;
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
} = UserSlice.actions;

export type UserSliceType = ReturnType<typeof UserSlice.reducer>;

export default UserSlice.reducer;
