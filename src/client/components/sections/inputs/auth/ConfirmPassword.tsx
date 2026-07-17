import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  authFieldControlSx,
  authFieldLabelSx,
} from "@/src/client/styles/sx/authDrawer";
import { AuthenticationState } from "@/src/lib/store/slices/auth/types";
import RenderConfirmPasswordInputField from "@/src/client/components/pipelines/forms/renderConfirmPasswordInputField";

type PasswordInputProps = {
  handleClickOpen?: () => void;
  handleConfirmingPassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  passwordError: boolean;
  passwordErrorMessage: string;
  authState: AuthenticationState;
};

function ConfirmPassword({
  handleConfirmingPassword,
  passwordError,
  passwordErrorMessage,
  authState,
}: PasswordInputProps): JSX.Element {
  return (
    <FormControl fullWidth sx={authFieldControlSx}>
      <FormLabel htmlFor="password" sx={authFieldLabelSx}>
        Confirm Password
      </FormLabel>
      <RenderConfirmPasswordInputField
        handleConfirmingPassword={handleConfirmingPassword}
        passwordError={passwordError}
        passwordErrorMessage={passwordErrorMessage}
        authState={authState}
      />
    </FormControl>
  );
}

export default ConfirmPassword;
