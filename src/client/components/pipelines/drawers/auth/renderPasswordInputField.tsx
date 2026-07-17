import type { JSX } from "react";
import TextField from "@mui/material/TextField";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { PasswordInputProps } from "@/src/client/components/sections/inputs/auth/Password";

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
          error={authState.status === "failed"}
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
          color={authState.status === "failed" ? "error" : "primary"}
        />
      );
    }

    case "n/a": {
      return (
        <TextField
          onChange={(e) => handlePassword(e)}
          error={authState.status === "n/a"}
          helperText={authState.message}
          name="password"
          placeholder="Enter your password"
          type="password"
          id="password"
          autoComplete="current-password"
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={authState.status === "n/a" ? "error" : "primary"}
        />
      );
    }

    case "initial":
    case "pending":
    case "ready": {
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
