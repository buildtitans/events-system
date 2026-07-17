import { trpcClient } from "@/src/trpc/trpcClient";
import {
  AsyncThunkConfig,
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { enqueueDrawer, enqueueSnackbar } from "../rendering/RenderingSlice";
import { getAttendanceDictionary } from "../viewer/ViewerSlice";
import { storeUserEmail } from "../user/userSlice";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { LoginCredentials } from "@/src/lib/types/tokens/types";
import { AttendanceDictionaryType } from "@/src/lib/types/hooks/types";
import type { AuthenticationState, UserKind } from "./types";

type AuthInitialState = {
  userKind: UserKind;
  authenticationState: AuthenticationState;
};

const initialState: AuthInitialState = {
  userKind: "anonymous",
  authenticationState: { status: "initial" },
};

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
      thunkAPI.dispatch(enqueueDrawer(null));
      thunkAPI.dispatch(enqueueSnackbar({ status: "success", kind: "login" }));
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
      return thunkAPI.rejectWithValue(err);
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
      const signupReq = await trpcClient.auth.write.signup.mutate(credentials);

      const { email } = signupReq;

      thunkAPI.dispatch(enqueueSnackbar({ kind: "signup", status: "success" }));

      await thunkAPI.dispatch(
        authenticateUser({ email, password: credentials.password }),
      );
    } catch (err) {
      logCaughtError("AuthSlice.joinAndAuthenticate()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: initialState,
  reducers: {
    loginSuccess: (state: AuthInitialState) => {
      state.userKind = "authenticated";
    },
    logout: (state: AuthInitialState) => {
      state.userKind = "anonymous";
    },
  },
  extraReducers(builder) {
    builder.addCase(authenticateUser.rejected, (state: AuthInitialState) => {
      state.authenticationState = {
        status: "failed",
        error: "Invalid Email or password",
      };
      state.userKind = "anonymous";
    });
    builder.addCase(
      authenticateUser.fulfilled,
      (
        state: AuthInitialState,
        action: PayloadAction<{
          status: "ok";
          email: string;
          attendanceDictionary: AttendanceDictionaryType;
        }>,
      ) => {
        state.authenticationState = {
          status: "ready",
          data: action.payload.status,
        };
        state.userKind = "authenticated";
      },
    );
    builder.addCase(authenticateUser.pending, (state: AuthInitialState) => {
      state.authenticationState = { status: "pending" };
    });
  },
});

export const { loginSuccess, logout } = AuthSlice.actions;

export default AuthSlice.reducer;

export type AuthSliceType = ReturnType<typeof AuthSlice.reducer>;
