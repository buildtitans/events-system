import Button from "@mui/material/Button";
import { useDispatch, useSelector } from 'react-redux';
import { enqueueDrawer } from '@/src/lib/store/slices/rendering/RenderingSlice';
import { AppDispatch, RootState } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import { JSX, useMemo } from "react";
import NotificationBadge from "../../badges/notificationBadge";

type NavActionsProps = { userKind: UserKind, handleSignout: () => Promise<void> }

export default function NavActions({
    userKind,
    handleSignout
}: NavActionsProps): JSX.Element | null {
    const newNotifications = useSelector((s: RootState) => s.notifications.new);
    const dispatch = useDispatch<AppDispatch>();
    const numNotifications = useMemo(() => {
        if (newNotifications.status === "ready") return newNotifications.data.length;
        return 0;
    }, [newNotifications]);

    return (
        <Stack
            sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', justifyContent: 'center' } }}
        >
            <Container
                sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', justifyContent: 'center', gap: (userKind === 'authenticated') ? 40 : 12 } }}
            >
                {(userKind === "authenticated") && <NotificationBadge badgeContent={numNotifications} />}

                {(userKind === 'authenticated') &&
                    <Button onClick={() => dispatch(enqueueDrawer("new group"))} variant="text" color="info" size="medium" sx={{
                        borderRadius: 999,
                        backgroundColor: 'white',
                        color: 'black',
                        ':hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            transition: 'all 0.3s ease'
                        }
                    }}>
                        Create Group
                    </Button>
                }

                {(userKind === 'anonymous') &&
                    <Button

                        onClick={() => dispatch(enqueueDrawer("sign in drawer"))}
                        color="info"
                        variant="contained"
                        size="medium"
                        sx={{
                            borderRadius: 999,
                            ':hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Sign in
                    </Button>
                }                        {(userKind === 'anonymous') && <Button
                    sx={{
                        borderRadius: 999,
                        ':hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            transition: 'all 0.3s ease'
                        }
                    }}
                    color="info" variant="contained" size="medium">
                    Sign up
                </Button>}
                {(userKind === "authenticated") &&
                    <Button
                        sx={{
                            borderRadius: 999,
                            ':hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                transition: 'all 0.3s ease'
                            }
                        }}
                        onClick={handleSignout} color="info" variant="contained" size="medium">
                        Sign out
                    </Button>}
            </Container>
        </Stack>

    )
}