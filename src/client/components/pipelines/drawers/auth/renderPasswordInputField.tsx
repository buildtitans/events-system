import type { JSX } from "react";
import TextField from "@mui/material/TextField";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { PasswordInputProps } from "../../../sections/inputs/auth/Password";

type RenderPasswordInputFieldProps = Omit<
  PasswordInputProps,
  "handleClickOpen"
>;

export default function RenderPasswordInputField({
  passwordError,
  passwordErrorMessage,
  handlePassword,
  authState,
}: RenderPasswordInputFieldProps): JSX.Element {
  switch (authState.status) {
    case "failed": {
      return (
        <TextField
          onChange={(e) => handlePassword(e)}
          error={passwordError}
          helperText={authState.error}
          name="password"
          placeholder="Enter your password"
          type="password"
          id="password"
          autoComplete="current-password"
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={passwordError ? "error" : "primary"}
        />
      );
    }
    case "ready":
    case "initial":
    case "pending":
    case "n/a": {
      return (
        <TextField
          onChange={(e) => handlePassword(e)}
          error={passwordError}
          helperText={passwordErrorMessage}
          name="password"
          placeholder="Enter your password"
          type="password"
          id="password"
          autoComplete="current-password"
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={passwordError ? "error" : "primary"}
        />
      );
    }

    default: {
      return assertNever(authState);
    }
  }
}
