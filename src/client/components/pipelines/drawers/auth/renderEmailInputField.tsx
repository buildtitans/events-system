import type { JSX } from "react";
import type { EmailInputProps } from "@/src/client/components/sections/inputs/auth/Email";
import TextField from "@mui/material/TextField";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export default function RenderEmailInputField({
  emailError,
  emailErrorMessage,
  handleEmail,
  authState,
}: EmailInputProps): JSX.Element {
  switch (authState.status) {
    case "failed": {
      return (
        <TextField
          onChange={(e) => handleEmail(e)}
          error={emailError}
          helperText={authState.error}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={emailError ? "error" : "primary"}
        />
      );
    }

    case "n/a": {
      return (
        <TextField
          onChange={(e) => handleEmail(e)}
          error={emailError}
          helperText={authState.message}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={emailError ? "error" : "primary"}
        />
      );
    }

    case "initial":
    case "pending":
    case "ready": {
      return (
        <TextField
          onChange={(e) => handleEmail(e)}
          error={emailError}
          helperText={emailErrorMessage}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          sx={authTextFieldSx}
          color={emailError ? "error" : "primary"}
        />
      );
    }

    default: {
      return assertNever(authState);
    }
  }
}
