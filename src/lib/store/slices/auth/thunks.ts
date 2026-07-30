import { LoginCredentials } from "@/src/lib/types/tokens/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { trpcClient } from "@/src/trpc/trpcClient";
import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSnackbar,
} from "../rendering/RenderingSlice";
import { storeUserEmail } from "../user/userSlice";
import { getAttendanceDictionary } from "../viewer/ViewerSlice";

export const authenticateUser = createAsyncThunk(
  "AuthSlice/authenticateUser",
  async (
    credentials: LoginCredentials,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueSnackbar({ kind: "login", status: "pending" }));
    thunkAPI.dispatch(storeUserEmail({ status: "pending" }));

    try {
      const request = await trpcClient.auth.session.login.mutate(credentials);

      if (request.status === "failed") {
        throw new Error(`Failed to log in user @${credentials.email}`);
      }

      const { attendanceDictionary, email } = request;

      thunkAPI.dispatch(getAttendanceDictionary(attendanceDictionary));
      thunkAPI.dispatch(storeUserEmail({ status: "ready", data: email }));
      thunkAPI.dispatch(enqueueSnackbar({ status: "success", kind: "login" }));
      thunkAPI.dispatch(enqueueDrawer(null));

      return request;
    } catch (err) {
      thunkAPI.dispatch(enqueueSnackbar({ kind: "login", status: "failed" }));
      thunkAPI.dispatch(
        storeUserEmail({
          status: "failed",
          error: "Failed to authenticate user",
        }),
      );
      logCaughtError("AuthSlice.authenticateUser()", err);
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : String(err),
      );
    }
  },
);

export const joinAndAuthenticate = createAsyncThunk(
  "AuthSlice/joinAndAuthenticate",
  async (
    credentials: LoginCredentials,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueSnackbar({ kind: "signup", status: "pending" }));

    try {
      const result = await trpcClient.auth.write.signup.mutate(credentials);

      if (!result.email) {
        throw new Error("Failed to create account");
      }

      thunkAPI.dispatch(enqueueSnackbar({ kind: "signup", status: "success" }));
    } catch (err) {
      logCaughtError("AuthSlice.joinAndAuthenticate.signup()", err);
      thunkAPI.dispatch(enqueueAlert({ action: "signup", kind: "error" }));
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : String(err),
      );
    }

    try {
      await thunkAPI
        .dispatch(
          authenticateUser({
            email: credentials.email,
            password: credentials.password,
          }),
        )
        .unwrap();
    } catch (err) {
      logCaughtError("AuthSlice.joinAndAuthenticate.authenticateUser()", err);

      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : String(err),
      );
    }
  },
);
