import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttendanceDictionaryType } from "@/src/lib/types/hooks/types";
import type { AuthenticationState, UserKind } from "./types";
import { authenticateUser } from "./thunks";

type AuthInitialState = {
  userKind: UserKind;
  authenticationState: AuthenticationState;
};

const initialState: AuthInitialState = {
  userKind: "anonymous",
  authenticationState: { status: "initial" },
};

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
