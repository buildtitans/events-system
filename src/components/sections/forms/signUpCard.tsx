"use client"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Email from '@/src/components/sections/inputs/Email';
import Stack from '@mui/material/Stack';
import { useValidateSignupCredentials } from '@/src/lib/hooks/auth/useValidateSignupCredentials';
import ConfirmPassword from '../inputs/ConfirmPassword';
import { useSignUp } from '@/src/lib/hooks/auth/useJoin';
import CreatePassword from '../inputs/CreatePassword';

export default function SignUpCard() {
    const { 
        email,
        password,
        handleEmailInput, 
        handlePasswordInput, 
        handleConfirmingPassword, 
        errors,
        isValidated 
    } = useValidateSignupCredentials();
    const {
        handleSubmit
     } = useSignUp(email, password);

 
    return (
         <Stack
            sx={{
                width: '80%',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                paddingTop: 4,
                marginX: 'auto',

            }}
        >

            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: '28px', fontWeight: 'light', borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 4 }}
            >
                Sign up
            </Typography>
            <Box
                component="form"
                method="POST"
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <Email
                    handleEmail={handleEmailInput}
                    emailError={(errors.invalidEmail !== "")}
                    emailErrorMessage={errors.invalidEmail}
                />
                <CreatePassword
                    handlePassword={handlePasswordInput}
                    passwordError={(errors.invalidPassword !== "")}
                    passwordErrorMessage={errors.invalidPassword}
                />
                <ConfirmPassword 
                handleConfirmingPassword={handleConfirmingPassword}
                passwordError={(errors.needPasswordConfirmation !== "")}
                passwordErrorMessage={errors.needPasswordConfirmation}
                />

                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button 

                onClick={(e) => handleSubmit(e)}
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={!isValidated}>
                    Sign up
                </Button>
            </Box>
            </Stack>
    )
}