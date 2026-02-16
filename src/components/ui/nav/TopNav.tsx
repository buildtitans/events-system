"use client"
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/lib/store';
import { trpcClient } from '@/src/trpc/trpcClient';
import { logout } from '@/src/lib/store/slices/auth/AuthSlice';
import { enqueueSnackbar } from '@/src/lib/store/slices/rendering/RenderingSlice';
import { AuthenticationSchemaType } from '@/src/schemas/auth/loginCredentialsSchema';
import NavActions from './global/navActions';
import NavBar from './global/navBar';
import { syncPermissions } from '@/src/lib/store/sync/syncPermissions';
import { getViewerPermissions } from '@/src/lib/store/slices/viewer/PermissionsSlice';
import { wait } from '@/src/lib/utils/rendering/wait';

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


    const handleSignout = async (): Promise<void> => {
        dispatch(enqueueSnackbar({ kind: 'logout', status: 'pending' }));
        const res = await trpcClient.auth.signout.mutate();
        await handleLogoutResponse(res ? true : false);
    };


    return (
        <AppBar
            component={"nav"}
            position="absolute"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 20px)',
                py: 1,
            }}
        >
            <Container maxWidth={"lg"} disableGutters
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <NavBar
                    userKind={userKind}
                />
                <NavActions
                    userKind={userKind}
                    handleSignout={handleSignout}
                />
            </Container>
        </AppBar>
    );
}