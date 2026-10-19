import type { GetThunkAPI, AsyncThunkConfig } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSnackbar,
} from "../rendering/RenderingSlice";
import { wait } from "@/src/lib/utils/rendering/wait";
import { LoginCredentialsSchemaType } from "@/src/schemas/auth/loginCredentialsSchema";
import { resetPassword } from "./userSlice";

export const hydrateUserMemberships = createAsyncThunk(
  "UserSlice/hydrateUserMemberships",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      const result = await trpcClient.entities.user.memberships.query();

      if (!result) {
        throw new Error(`Failed to hydrate user memberships`);
      }

      return result;
    } catch (err) {
      logCaughtError("UserSlice.hydrateUserMemberships()", err);
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to hydrate memberships",
      );
    }
  },
);

export const hydrateUserRsvps = createAsyncThunk(
  "UserSlice/hydrateUserRsvps",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      const result = await trpcClient.entities.user.rsvps.query();

      if (!result) {
        throw new Error(`Failed to hydrate user rsvps`);
      }

      return result;
    } catch (err) {
      logCaughtError("UserSlice.hydrateUserRsvps()", err);
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Failed to hydrate memberships",
      );
    }
  },
);

export const leaveGroup = createAsyncThunk(
  "UserSlice/leaveGroup",
  async (
    group_id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(
      enqueueSnackbar({ kind: "leaveGroup", status: "pending" }),
    );

    try {
      const successful =
        await trpcClient.entities.group.member.leaveGroup.mutate(group_id);

      if (!successful) {
        throw new Error(`Failed to leave group with group_id: ${group_id}`);
      }

      await wait(600);
      thunkAPI.dispatch(
        enqueueAlert({ action: "leaveGroup", kind: "success" }),
      );
    } catch (err) {
      logCaughtError("UserSlice.leaveGroup()", err);
      thunkAPI.dispatch(enqueueAlert({ action: "leaveGroup", kind: "error" }));
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const resetUserPassword = createAsyncThunk(
  "AuthSlice/resetPassword",
  async (
    args: {
      newPassword: LoginCredentialsSchemaType["password"];
      token: string;
    },
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(resetPassword({ status: "pending" }));

    try {
      const result = await trpcClient.auth.write.resetPassword.mutate({
        password: args.newPassword,
        token: args.token,
      });

      thunkAPI.dispatch(resetPassword({ status: "ready", data: result }));
      thunkAPI.dispatch(
        enqueueAlert({ action: "passwordReset", kind: "success" }),
      );
      thunkAPI.dispatch(enqueueDrawer("sign in drawer"));

      return result;
    } catch (err) {
      logCaughtError("AuthSlice.resetUserPassword()", err);
      thunkAPI.dispatch(
        enqueueAlert({ action: "passwordReset", kind: "error" }),
      );

      return thunkAPI.rejectWithValue(err);
    }
  },
);
