import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { JSX } from "react";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

export default function RenderMobileAuthButtons({
    userKind, 
    showSigninDrawer,
    showSignoutModal,
    openSignupDrawer,
    openUserDashboard,
    mobileOpenSignOutModal
}: {
    userKind: UserKind, 
    showSigninDrawer: () => void,
    showSignoutModal: () => void,
    openSignupDrawer: () => void,
    openUserDashboard: () => void,
    mobileOpenSignOutModal: () => void
}): JSX.Element {
  switch (userKind) {
    case "authenticated": {
      return (
        <Stack
        gap={2}
        >
          <Button 
              onClick={openUserDashboard}
              type="button"
              color="primary"
              variant="contained"
              fullWidth
              startIcon={<SpaceDashboardIcon />}
          >
            Dashboard
          </Button>

          <Button
              onClick={mobileOpenSignOutModal}
              type="button"
              color="info"
              variant="outlined"
              fullWidth
            >
              Sign Out
            </Button>
        </Stack>
      );
    }
    case "anonymous": {
      return (
        <Stack
        gap={2}
        >
          <Button 
          onClick={openSignupDrawer}
          color="primary" variant="outlined" fullWidth>
            Sign up
          </Button>

            <Button
              onClick={showSigninDrawer}
              type="button"
              color="primary"
              variant="contained"
              fullWidth
            >
              Sign in
            </Button>
        </Stack>
      );
    }
  }
}
