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
  RsvpsState,
  UserEmailState,
  PasswordResetState,
  RequestPwResetState,
  MembershipsState,
} from "./types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { enqueueSidebar } from "../rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { hydrateUserMemberships, hydrateUserRsvps } from "./thunks";

type InitialState = {
  email: UserEmailState;
  rsvps: RsvpsState;
  memberships: MembershipsState;
  myGroups: MyGroupsState;
  view: UserAccountViewType;
  requestPwReset: RequestPwResetState;
  pwReset: PasswordResetState;
};

const initialState: InitialState = {
  email: { status: "initial" },
  myGroups: { status: "initial" },
  rsvps: { status: "initial" },
  memberships: { status: "initial" },
  view: "my groups",
  pwReset: { status: "initial" },
  requestPwReset: { status: "initial" },
};

export const hydrateAccountPage = createAsyncThunk(
  "UserSlice/hydrateDashboard",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    thunkAPI.dispatch(enqueueSidebar("user"));

    try {
      const myGroups = await trpcClient.entities.user.createdGroups.query();
      const email = await trpcClient.entities.user.email.query();

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
      action: PayloadAction<RsvpsState>,
    ) => {
      state.rsvps = action.payload;
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

    builder.addCase(hydrateUserRsvps.pending, (state) => {
      state.rsvps = { status: "pending" };
    });

    builder.addCase(hydrateUserRsvps.rejected, (state, action) => {
      state.rsvps = {
        status: "failed",
        error: action.error.message ?? "Failed to hydrate rsvps",
      };
    });

    builder.addCase(hydrateUserRsvps.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.length === 0) {
        state.rsvps = {
          status: "n/a",
          message: "We couldn't find any records of user participations",
        };
      } else {
        state.rsvps = { status: "ready", data: payload };
      }
    });

    builder.addCase(hydrateUserMemberships.pending, (state) => {
      state.memberships = { status: "pending" };
    });

    builder.addCase(hydrateUserMemberships.rejected, (state, action) => {
      state.memberships = {
        status: "failed",
        error: action.error.message ?? "Failed to hydrate memberships",
      };
    });

    builder.addCase(hydrateUserMemberships.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.length === 0) {
        state.memberships = {
          status: "n/a",
          message: "No records of any memberships",
        };
        return;
      } else {
        state.memberships = { status: "ready", data: payload };
      }
    });
  },
});

export const {
  storeUserEmail,
  getParticipations,
  getMyGroups,
  changeAccountTab,
  requestResetPassword,
  resetPassword,
  getMemberships,
} = UserSlice.actions;

export type UserSliceType = ReturnType<typeof UserSlice.reducer>;

export default UserSlice.reducer;
