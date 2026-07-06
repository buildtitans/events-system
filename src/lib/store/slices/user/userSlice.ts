import {
  AsyncThunkConfig,
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import type {
  MyGroupsState,
  UserAccountViewType,
  PariticpationsState,
  NextGroupEventLookupMapType,
  UserEmailState,
  PasswordResetState,
  RequestPwResetState,
  MembershipsState,
} from "./types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { enqueueSidebar } from "../rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

type InitialState = {
  email: UserEmailState;
  participations: PariticpationsState;
  memberships: MembershipsState;
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
  memberships: { status: "initial" },
  view: "my groups",
  nextEventLookup: {},
  pwReset: { status: "initial" },
  requestPwReset: { status: "initial" },
};

export const hydrateAccountPage = createAsyncThunk(
  "UserSlice/hydrateDashboard",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    thunkAPI.dispatch(enqueueSidebar("user"));

    try {
      const myGroups = await trpcClient.users.createdGroups.mutate();
      const email = await trpcClient.users.getUserEmail.mutate();

      if (!email) {
        throw new Error("Dashboard access requires authentication");
      }

      return {
        myGroups,
        email,
      };
    } catch (err) {
      logCaughtError("UserSlice.hydrateAccountPage()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

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
    getMemberships: (
      state: InitialState,
      action: PayloadAction<MembershipsState>,
    ) => {
      state.memberships = action.payload;
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

  extraReducers(builder) {
    builder.addCase(hydrateAccountPage.pending, (state: InitialState) => {
      state.email = { status: "pending" };
      state.myGroups = { status: "pending" };
    });

    builder.addCase(hydrateAccountPage.rejected, (state: InitialState) => {
      state.email = { status: "failed", error: "Failed to retrieve email" };
      state.myGroups = {
        status: "failed",
        error: "Failed to retrieve created groups",
      };
    });

    builder.addCase(
      hydrateAccountPage.fulfilled,
      (
        state: InitialState,
        action: PayloadAction<{ email: string; myGroups: GroupSchemaType[][] }>,
      ) => {
        state.email = { status: "ready", data: action.payload.email };

        if (action.payload.myGroups.length > 0) {
          state.myGroups = { status: "ready", data: action.payload.myGroups };
        } else {
          state.myGroups = { status: "n/a", message: "No groups created yet" };
        }
      },
    );
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
  getMemberships,
} = UserSlice.actions;

export type UserSliceType = ReturnType<typeof UserSlice.reducer>;

export default UserSlice.reducer;
