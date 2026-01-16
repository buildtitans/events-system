"use client"
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useRef, useState } from 'react';
import SitemarkIcon from './Sitemark';
import ColorModeIconDropdown from './ColorModelIconDropdown';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/lib/store';
import { trpcClient } from '@/src/trpc/trpcClient';
import { logout } from '@/src/lib/store/slices/AuthSlice';
import { currentLougoutStatus } from '@/src/lib/store/slices/RenderingSlice';
import { AuthenticationSchemaType } from '@/src/schemas/loginCredentialsSchema';
import AuthenticatonSnackbar from '../feedback/pending/authenticationSnackbar';
import { AnimatePresence } from 'framer-motion';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));





export default function AppAppBar() {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const logoutStatus = useSelector((s: RootState) => s.rendering.logoutStatus);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    function handleLogoutResponse(success: AuthenticationSchemaType["success"]) {

        timerRef.current = window.setTimeout(() => {
            dispatch(currentLougoutStatus(success ? "success" : "failed"))
            dispatch(logout());
            timerRef.current = null;
        }, 1500)


    };

    const handleSignout = async (): Promise<void> => {
        dispatch(currentLougoutStatus("pending"));
        const res = await trpcClient.auth.signout.mutate();
        handleLogoutResponse(res.success);
    };


    useEffect(() => { return () => { if (timerRef.current !== null) clearTimeout(timerRef.current) } }, [])


    return (
        <AppBar
            component={"nav"}
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <AnimatePresence>
                {(logoutStatus !== "idle") &&
                    <AuthenticatonSnackbar status={logoutStatus} />
                }
            </AnimatePresence>

            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <SitemarkIcon />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button variant="text" color="info" size="small">
                                Features
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        {(userKind === 'anonymous') && <Button component={Link} href='/login' color="info" variant="text" size="small">
                            Sign in
                        </Button>
                        }                        {(userKind === 'anonymous') && <Button color="info" variant="contained" size="small">
                            Sign up
                        </Button>}
                        {(userKind === "authenticated") &&
                            <Button onClick={handleSignout} color="info" variant="contained" size="small">
                                Sign out
                            </Button>}
                        <ColorModeIconDropdown />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <ColorModeIconDropdown size="medium" />
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem>Features</MenuItem>
                                <MenuItem>Testimonials</MenuItem>
                                <MenuItem>Highlights</MenuItem>
                                <MenuItem>Pricing</MenuItem>
                                <MenuItem>FAQ</MenuItem>
                                <MenuItem>Blog</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                {(userKind === "anonymous") && <Button
                                    color="primary" variant="contained" fullWidth>
                                    Sign up
                                </Button>}

                                {(userKind === "anonymous") && <Button component={Link} href='/login' color="primary" variant="outlined" fullWidth>
                                    Sign in
                                </Button>}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
