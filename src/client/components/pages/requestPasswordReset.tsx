import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { JSX } from "react";
import { useValidateSignupCredentials } from "@/src/lib/hooks/auth/useValidateSignupCredentials";
import Password from "../sections/inputs/auth/Password";
import ConfirmPassword from "../sections/inputs/auth/ConfirmPassword";

export default function ResetPasswordReset(): JSX.Element {
  const { messages, handlePasswordInput, handleConfirmingPassword } =
    useValidateSignupCredentials();

  return (
    <Container>
      <Stack>
        <Box>
          <Typography
            variant="body1"
            color="textPrimary"
            fontSize={"18px"}
            textAlign={"center"}
          >
            Reset your password
          </Typography>
        </Box>
        <Box>
          <Password
            handlePassword={handlePasswordInput}
            passwordError={
              messages.inputErrors.invalidPassword !==
              "Password must be at least 8 characters"
            }
            passwordErrorMessage={messages.inputErrors.invalidPassword}
            authState={messages.authState}
          />
        </Box>
        <Box>
          <ConfirmPassword
            handleConfirmingPassword={handleConfirmingPassword}
            passwordErrorMessage={messages.inputErrors.needPasswordConfirmation}
            passwordError={
              messages.inputErrors.needPasswordConfirmation !==
              "Password must match"
            }
            authState={messages.authState}
          />
        </Box>

        <Box>
          <Button variant="contained" size="medium"></Button>
        </Box>
      </Stack>
    </Container>
  );
}
