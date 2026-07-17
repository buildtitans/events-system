import type { JSX } from "react";
import type { AuthenticationState } from "@/src/lib/store/slices/auth/types";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import TextField from "@mui/material/TextField";

type RenderConfirmPasswordInputFieldProps = {
  handleConfirmingPassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  passwordError: boolean;
  passwordErrorMessage: string;
  authState: AuthenticationState;
};

export default function RenderConfirmPasswordInputField({
  authState,
  handleConfirmingPassword,
  passwordError,
  passwordErrorMessage,
}: RenderConfirmPasswordInputFieldProps): JSX.Element {
  console.log(authState.status);

  switch (authState.status) {
    case "failed": {
      return (
        <TextField
          onChange={(e) => handleConfirmingPassword(e)}
          error={authState.status === "failed"}
          helperText={authState.error}
          name="password"
          placeholder="Confirm your password"
          type="password"
          id="password"
          autoComplete="new-password"
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={authState.status === "failed" ? "error" : "primary"}
        />
      );
    }

    case "initial":
    case "pending":
    case "ready":
    case "n/a": {
      return (
        <TextField
          onChange={(e) => handleConfirmingPassword(e)}
          error={passwordError}
          helperText={passwordErrorMessage}
          name="password"
          placeholder="Confirm your password"
          type="password"
          id="password"
          autoComplete="new-password"
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
