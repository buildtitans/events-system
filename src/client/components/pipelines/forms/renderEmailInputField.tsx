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
  emailRef,
}: EmailInputProps): JSX.Element {
  switch (authState.status) {
    case "failed": {
      return (
        <TextField
          inputRef={emailRef}
          onChange={(e) => handleEmail(e)}
          error={authState.status === "failed"}
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
          color={authState.status === "failed" ? "error" : "primary"}
        />
      );
    }

    case "n/a": {
      return (
        <TextField
          inputRef={emailRef}
          onChange={(e) => handleEmail(e)}
          error={authState.status === "n/a"}
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
          inputRef={emailRef}
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
