"use client"
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import ColorModeIconDropdown from '../ColorModelIconDropdown';
import { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { UserKind } from '@/src/lib/store/slices/auth/AuthSlice';
import { AuthenticationSchemaType } from '@/src/schemas/auth/loginCredentialsSchema';
import { Search } from '@/src/features/search/search';
import HomeButton from '../../buttons/homeButton';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: 999,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));


type NavLinksProps = {
    userKind: UserKind,
    handleSignout: () => Promise<void>,
    handleLogoutResponse: (success: AuthenticationSchemaType["success"]) => void
};


export default function NavBar({ userKind }: NavLinksProps) {
    const [open, setOpen] = useState(false);


    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <StyledToolbar variant="dense" disableGutters sx={{
            ml: 0,
            mr: 'auto',
            minWidth: { xs: '400px', md: '600px' }
        }}>
            <HomeButton />
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
            <Search />
        </StyledToolbar>
    )

}