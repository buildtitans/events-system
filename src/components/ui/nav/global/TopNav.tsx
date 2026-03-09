"use client"
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/lib/store';
import { trpcClient } from '@/src/trpc/trpcClient';
import { logout } from '@/src/lib/store/slices/auth/AuthSlice';
import { enqueueDrawer, enqueueSnackbar, showModal } from '@/src/lib/store/slices/rendering/RenderingSlice';
import { AuthenticationSchemaType } from '@/src/schemas/auth/loginCredentialsSchema';
import NavActions from '../global/navActions';
import NavBar from '../global/navBar';
import { syncPermissions } from '@/src/lib/store/sync/syncPermissions';
import { getViewerPermissions } from '@/src/lib/store/slices/viewer/PermissionsSlice';
import { wait } from '@/src/lib/utils/rendering/wait';
import { PANEL_GRAY } from '@/src/styles/sx/sx';
import Box from '@mui/material/Box';
import OpenedGroupSidebar from "@/src/components/ui/sidebars/openedGroupSidebar";

export default function TopNav() {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const dispatch = useDispatch<AppDispatch>();

    async function handleLogoutResponse(success: AuthenticationSchemaType["success"]) {

        await wait(1500);
        dispatch(enqueueSnackbar({ kind: 'logout', status: success ? "success" : "failed" }))
        dispatch(logout());

        const permissions = await syncPermissions();
        dispatch(getViewerPermissions(permissions))
    };

    const openSignupDrawer = () => {
        dispatch(enqueueDrawer("sign up drawer"));
    };

    const showConfirmSignout = () => {
        dispatch(showModal("confirm signout"));
    }


    const handleSignout = async (): Promise<void> => {
        dispatch(enqueueSnackbar({ kind: 'logout', status: 'pending' }));
        const res = await trpcClient.auth.signout.mutate();
        await handleLogoutResponse(res ? true : false);
    };


    return (
        <Box
        sx={{ display: 'flex' }}
        >
        <AppBar
            component={"nav"}
            position="absolute"
            enableColorOnDark
            elevation={24}
            sx={{
                paddingY: 1,
                boxShadow: 0,
                bgcolor: PANEL_GRAY,
                backgroundImage: 'none',
                 zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Container  disableGutters
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: { md: 'md', lg: 'lg'} }}
            >
                <NavBar
                    userKind={userKind}
                />
                <NavActions
                    userKind={userKind}
                    handleSignout={handleSignout}
                    openSignupDrawer={openSignupDrawer}
                    showSignoutModal={showConfirmSignout}
                />
            </Container>
        </AppBar>
        <OpenedGroupSidebar />    
        </Box>
        
    );
}