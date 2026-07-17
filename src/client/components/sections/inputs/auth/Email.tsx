import type { JSX } from "react";
import type { AuthenticationState } from "@/src/lib/store/slices/auth/types";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  authFieldControlSx,
  authFieldLabelSx,
} from "@/src/client/styles/sx/authDrawer";
import RenderEmailInputField from "@/src/client/components/pipelines/drawers/auth/renderEmailInputField";

export type EmailInputProps = {
  emailErrorMessage: string;
  handleEmail: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  emailError: boolean;
  authError: AuthenticationState;
};

function Email({
  emailErrorMessage,
  handleEmail,
  emailError,
  authError,
}: EmailInputProps): JSX.Element {
  return (
    <FormControl fullWidth sx={authFieldControlSx}>
      <FormLabel htmlFor="email" sx={authFieldLabelSx}>
        Email
      </FormLabel>
      <RenderEmailInputField
        emailErrorMessage={emailErrorMessage}
        handleEmail={handleEmail}
        emailError={emailError}
        authError={authError}
      />
    </FormControl>
  );
}

export default Email;
