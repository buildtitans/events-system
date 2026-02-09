"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '@/src/components/ui/icons/CustomIcons';
import Email from '@/src/components/sections/inputs/Email';
import Password from '@/src/components/sections/inputs/Password';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import ForgotPassword from '@/src/features/auth/ForgotPassword';
import type { ValidateCredentialsHook } from '@/src/lib/hooks/validation/useValidateCredentialsInput';
import { UseLoginHook } from '@/src/lib/types/hooks/types';
import Stack from '@mui/material/Stack';

type SignInCardProps = Omit<ValidateCredentialsHook, "credentials"> & {
    handleSubmit: UseLoginHook["handleSubmit"]
}


export default function SignInCard({
    isSubmittable,
    emailErrorMessage,
    emailError,
    passwordError,
    passwordErrorMessage,
    handleEmail,
    handlePassword,
    handleSubmit
}: SignInCardProps) {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


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

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: '28px', fontWeight: 'light', borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 4 }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                method="POST"
                noValidate
                onSubmit={(e) => handleSubmit(e)}
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <Email
                    handleEmail={handleEmail}
                    emailError={emailError}
                    emailErrorMessage={emailErrorMessage}
                />
                <Password
                    handlePassword={handlePassword}
                    passwordError={passwordError}
                    passwordErrorMessage={passwordErrorMessage}
                    handleClickOpen={handleClickOpen}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained" disabled={(!isSubmittable) || (userKind === "authenticated")}>
                    Sign in
                </Button>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Sign in with Google')}
                    startIcon={<GoogleIcon />}
                >
                    Sign in with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Sign in with Facebook')}
                    startIcon={<FacebookIcon />}
                >
                    Sign in with Facebook
                </Button>
            </Box>
        </Stack>
    );
}
