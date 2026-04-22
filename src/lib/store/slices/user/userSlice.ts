import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  MyGroupsState,
  UserAccountViewType,
  PariticpationsState,
  NextGroupEventLookupMapType,
  UserEmailState,
  PasswordResetState,
  RequestPwResetState,
} from "./types";

type InitialState = {
  email: UserEmailState;
  participations: PariticpationsState;
  myGroups: MyGroupsState;
  view: UserAccountViewType;
  nextEventLookup: NextGroupEventLookupMapType;
  requestPwReset: RequestPwResetState;
  pwReset: PasswordResetState;
};

const initialState: InitialState = {
  email: { status: "initial" },
  myGroups: { status: "initial" },
  participations: { status: "initial" },
  view: "my groups",
  nextEventLookup: {},
  pwReset: { status: "initial" },
  requestPwReset: { status: "initial" },
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
      action: PayloadAction<PariticpationsState>,
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
    requestResetPassword: (
      state: InitialState,
      action: PayloadAction<RequestPwResetState>,
    ) => {
      state.requestPwReset = action.payload;
    },
    resetPassword: (
      state: InitialState,
      action: PayloadAction<PasswordResetState>,
    ) => {
      state.pwReset = action.payload;
    },
  },
});

export const {
  storeUserEmail,
  getParticipations,
  getMyGroups,
  changeAccountTab,
  getNextGroupEventLookup,
  requestResetPassword,
  resetPassword,
} = UserSlice.actions;

export type UserSliceType = ReturnType<typeof UserSlice.reducer>;

export default UserSlice.reducer;
