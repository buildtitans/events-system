import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { JSX } from "react";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import {
  navPrimaryButtonSx,
  navSecondaryButtonSx,
} from "@/src/styles/sx/nav";

export default function RenderMobileAuthButtons({
    userKind, 
    showSigninDrawer,
    openSignupDrawer,
    openUserDashboard,
    mobileOpenSignOutModal
}: {
    userKind: UserKind, 
    showSigninDrawer: () => void,
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
            variant="contained"
            fullWidth
            startIcon={<SpaceDashboardIcon />}
            sx={{
              ...navPrimaryButtonSx,
              justifyContent: "flex-start",
              px: 2,
            }}
          >
            Dashboard
          </Button>

          <Button
            onClick={mobileOpenSignOutModal}
            type="button"
            variant="contained"
            fullWidth
            sx={{
              ...navSecondaryButtonSx,
              justifyContent: "flex-start",
              px: 2,
            }}
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
            variant="contained"
            fullWidth
            sx={{
              ...navPrimaryButtonSx,
              justifyContent: "flex-start",
              px: 2,
            }}
          >
            Sign up
          </Button>

          <Button
            onClick={showSigninDrawer}
            type="button"
            variant="contained"
            fullWidth
            sx={{
              ...navSecondaryButtonSx,
              justifyContent: "flex-start",
              px: 2,
            }}
          >
            Sign in
          </Button>
        </Stack>
      );
    }
  }
}
