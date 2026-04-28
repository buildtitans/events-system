import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {
  authFieldControlSx,
  authFieldLabelSx,
  authLinkSx,
  authTextFieldSx,
} from "@/src/styles/sx/authDrawer";

type PasswordInputProps = {
  handleClickOpen?: () => void;
  handlePassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  passwordError: boolean;
  passwordErrorMessage: string;
};

function Password({
  handleClickOpen,
  handlePassword,
  passwordError,
  passwordErrorMessage,
}: PasswordInputProps): JSX.Element {
  return (
    <FormControl fullWidth sx={authFieldControlSx}>
      <FormLabel htmlFor="password" sx={authFieldLabelSx}>
        Password
      </FormLabel>
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
      {handleClickOpen && (
        <Box sx={{ display: "flex", justifyContent: "end", pt: 1 }}>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ ...authLinkSx, alignSelf: "baseline" }}
          >
            Forgot your password?
          </Link>
        </Box>
      )}
    </FormControl>
  );
}

export default Password;
