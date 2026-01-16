"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '@/src/components/ui/icons/CustomIcons';
import Email from '@/src/components/sections/inputs/Email';
import Password from '@/src/components/sections/inputs/Password';
import StyledSigninCard from '@/src/styles/styledComponents/styledSigninCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';


export default function SignInCard({
    isSubmittable,
    emailErrorMessage,
    emailError,
    passwordError,
    passwordErrorMessage,
    handleEmail,
    handlePassword,
    handleSubmit
}: any) {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <StyledSigninCard variant="outlined">

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
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
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
                        <Link
                            href="/material-ui/getting-started/templates/sign-in/"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>
                    </span>
                </Typography>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        </StyledSigninCard>
    );
}
