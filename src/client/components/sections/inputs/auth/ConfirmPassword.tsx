import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import {
  authFieldControlSx,
  authFieldLabelSx,
  authTextFieldSx,
} from "@/src/client/styles/sx/authDrawer";

type PasswordInputProps = {
  handleClickOpen?: () => void;
  handleConfirmingPassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  passwordError: boolean;
  passwordErrorMessage: string;
};

function ConfirmPassword({
  handleConfirmingPassword,
  passwordError,
  passwordErrorMessage,
}: PasswordInputProps): JSX.Element {
  return (
    <FormControl fullWidth sx={authFieldControlSx}>
      <FormLabel htmlFor="password" sx={authFieldLabelSx}>
        Confirm Password
      </FormLabel>
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
    </FormControl>
  );
}

export default ConfirmPassword;
