import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import {
  authFieldControlSx,
  authFieldLabelSx,
  authLinkSx,
} from "@/src/client/styles/sx/authDrawer";
import { AuthenticationState } from "@/src/lib/store/slices/auth/types";
import RenderPasswordInputField from "../../../pipelines/drawers/auth/renderPasswordInputField";

export type PasswordInputProps = {
  handleClickOpen?: () => void;
  handlePassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  passwordError: boolean;
  passwordErrorMessage: string;
  authState: AuthenticationState;
};

function Password({
  handleClickOpen,
  handlePassword,
  passwordError,
  passwordErrorMessage,
  authState,
}: PasswordInputProps): JSX.Element {
  return (
    <FormControl fullWidth sx={authFieldControlSx}>
      <FormLabel htmlFor="password" sx={authFieldLabelSx}>
        Password
      </FormLabel>
      <RenderPasswordInputField
        handlePassword={handlePassword}
        passwordError={passwordError}
        passwordErrorMessage={passwordErrorMessage}
        authState={authState}
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
