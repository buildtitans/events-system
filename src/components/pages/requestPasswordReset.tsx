import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { JSX } from "react";
import { useValidateSignupCredentials } from "@/src/lib/hooks/auth/useValidateSignupCredentials";
import Password from "../sections/inputs/Password";
import ConfirmPassword from "../sections/inputs/ConfirmPassword";


export default function ResetPasswordReset(): JSX.Element {
const { errors, handlePasswordInput, handleConfirmingPassword } =  useValidateSignupCredentials()


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
                    passwordError={errors.invalidPassword !== "Password must be at least 8 characters"}
                    passwordErrorMessage={errors.invalidPassword}
                    />
                </Box>
                <Box>
                    <ConfirmPassword 
                    handleConfirmingPassword={handleConfirmingPassword}
                    passwordErrorMessage={errors.needPasswordConfirmation}
                    passwordError={errors.needPasswordConfirmation !== "Password must match"}
                    />
                </Box>

                <Box >
                    <Button 
                    variant="contained"
                    size="medium"
                    
                    >

                    </Button>
                </Box>
            </Stack>
        </Container>
    )
}