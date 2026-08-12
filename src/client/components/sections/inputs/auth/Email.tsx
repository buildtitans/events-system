import type { JSX } from "react";
import type { AuthenticationState } from "@/src/lib/store/slices/auth/types";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  authFieldControlSx,
  authFieldLabelSx,
} from "@/src/client/styles/sx/authDrawer";
import RenderEmailInputField from "@/src/client/components/pipelines/forms/renderEmailInputField";
import type { RefObject } from "react";

export type EmailInputProps = {
  emailErrorMessage: string;
  handleEmail: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  emailError: boolean;
  authState: AuthenticationState;
  emailRef: RefObject<HTMLInputElement | null>;
};

function Email({
  emailErrorMessage,
  handleEmail,
  emailError,
  authState,
  emailRef,
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
        authState={authState}
        emailRef={emailRef}
      />
    </FormControl>
  );
}

export default Email;
