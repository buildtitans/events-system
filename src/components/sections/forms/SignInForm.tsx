import Stack from '@mui/material/Stack';
import SignInCard from '@/src/features/auth/SignInCard';
import Content from '@/src/features/auth/LoginCopy';
import type { JSX } from 'react';
import { useLogin } from '@/src/lib/hooks/auth/useLogin';
import { useValidateCredentials } from '@/src/lib/hooks/useValidateCredentialsInput';
import { AnimatePresence } from 'framer-motion';
import AuthenticatonSnackbar from '../../ui/feedback/pending/authenticationSnackbar';

export default function SignInForm(): JSX.Element {
    const {
        isSubmittable,
        emailErrorMessage,
        emailError,
        passwordError,
        passwordErrorMessage,
        credentials,
        handleEmail,
        handlePassword,
    } = useValidateCredentials();
    const { handleSubmit, loginStatus } = useLogin(credentials);


    return (

        <Stack
            direction="column"
            component="main"
            sx={[
                {
                    justifyContent: 'center',
                    height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
                    marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
                    minHeight: '100%',
                },
                (theme) => ({
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        zIndex: -1,
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                        backgroundRepeat: 'no-repeat',
                        ...theme.applyStyles('dark', {
                            backgroundImage:
                                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                        }),
                    },
                }),
            ]}
        >
            <AnimatePresence>
                <AuthenticatonSnackbar status={loginStatus} statusKind="login" />
            </AnimatePresence>

            <Stack
                direction={{ xs: 'column-reverse', md: 'row' }}
                sx={{
                    justifyContent: 'center',
                    gap: { xs: 6, sm: 12 },
                    p: 2,
                    mx: 'auto',
                }}
            >
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    sx={{
                        justifyContent: 'center',
                        gap: { xs: 6, sm: 12 },
                        p: { xs: 2, sm: 4 },
                        m: 'auto',
                    }}
                >
                    <Content />
                    <SignInCard
                        isSubmittable={isSubmittable}
                        emailErrorMessage={emailErrorMessage}
                        emailError={emailError}
                        passwordError={passwordError}
                        passwordErrorMessage={passwordErrorMessage}
                        handleEmail={handleEmail}
                        handleSubmit={handleSubmit}
                        handlePassword={handlePassword}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}
