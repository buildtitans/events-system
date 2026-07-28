"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Email from "@/src/client/components/sections/inputs/auth/Email";
import { useValidateSignupCredentials } from "@/src/lib/hooks/auth/credentials/useValidateSignupCredentials";
import ConfirmPassword from "@/src/client/components/sections/inputs/auth/ConfirmPassword";
import { useSignUp } from "@/src/lib/hooks/auth/authenticate/useJoin";
import CreatePassword from "@/src/client/components/sections/inputs/auth/CreatePassword";
import AuthDrawerShell from "@/src/client/components/ui/drawers/authDrawerShell";
import {
  authCheckboxLabelSx,
  authCheckboxSx,
  authDrawerFormSx,
  authPrimaryButtonSx,
} from "@/src/client/styles/sx/authDrawer";

export default function SignUpCard() {
  const {
    email,
    password,
    handleEmailInput,
    handlePasswordInput,
    handleConfirmingPassword,
    messages,
    isValidated,
  } = useValidateSignupCredentials();
  const { handleSubmit } = useSignUp(email, password);

  return (
    <AuthDrawerShell
      eyebrow="Get Started"
      title="Sign up"
      description="Create an account to RSVP, join communities, and manage your event activity in one place."
    >
      <Box component="form" method="POST" noValidate sx={authDrawerFormSx}>
        <Email
          handleEmail={handleEmailInput}
          emailError={messages.inputErrors.invalidEmail !== ""}
          emailErrorMessage={messages.inputErrors.invalidEmail}
          authState={messages.authState}
        />
        <CreatePassword
          handlePassword={handlePasswordInput}
          passwordError={messages.inputErrors.invalidPassword !== ""}
          passwordErrorMessage={messages.inputErrors.invalidPassword}
        />
        <ConfirmPassword
          handleConfirmingPassword={handleConfirmingPassword}
          passwordError={messages.inputErrors.needPasswordConfirmation !== ""}
          passwordErrorMessage={messages.inputErrors.needPasswordConfirmation}
          authState={messages.authState}
        />

        <FormControlLabel
          sx={authCheckboxLabelSx}
          control={<Checkbox value="remember" sx={authCheckboxSx} />}
          label="Remember me"
        />
        <Button
          onClick={(e) => handleSubmit(e)}
          type="submit"
          fullWidth
          sx={authPrimaryButtonSx}
          variant="contained"
          disabled={!isValidated}
        >
          Sign up
        </Button>
      </Box>
    </AuthDrawerShell>
  );
}
