"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Email from '@/src/client/components/sections/inputs/auth/Email';
import Password from '@/src/client/components/sections/inputs/auth/Password';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import ForgotPassword from '@/src/client/features/auth/ForgotPassword';
import type { ValidateCredentialsHook } from '@/src/lib/types/hooks/types';
import type { UseLoginHook } from '@/src/lib/types/hooks/types';
import AuthDrawerShell from '@/src/client/components/ui/drawers/authDrawerShell';
import {
    authCheckboxLabelSx,
    authCheckboxSx,
    authDrawerFormSx,
    authPrimaryButtonSx,
} from '@/src/styles/sx/authDrawer';

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
        <AuthDrawerShell
            eyebrow="Welcome Back"
            title="Sign in"
            description="Jump back into your groups, events, and dashboard with the account you already use."
        >
            <Box
                component="form"
                method="POST"
                noValidate
                onSubmit={(e) => handleSubmit(e)}
                sx={authDrawerFormSx}
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
                    sx={authCheckboxLabelSx}
                    control={<Checkbox value="remember" sx={authCheckboxSx} />}
                    label="Remember me"
                />
                <ForgotPassword 
                open={open} 
                handleClose={handleClose} 
                setOpen={setOpen}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={authPrimaryButtonSx}
                    disabled={(!isSubmittable) || (userKind === "authenticated")}
                >
                    Sign in
                </Button>
            </Box>
            
        </AuthDrawerShell>
    );
}
