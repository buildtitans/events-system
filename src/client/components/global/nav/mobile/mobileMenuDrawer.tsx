"use client";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import RenderMobileAuthButtons from "@/src/client/components/pipelines/nav/renderMobileAuthButtons";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import Button from "@mui/material/Button";
import {
  mobileNavDrawerPaperSx,
  navSecondaryButtonSx,
} from "@/src/client/styles/sx/nav";

type MobileMenuDrawerProps = {
  toggleDrawer: (newOpen: boolean) => () => void;
  handleHomeClicked: () => void;
  userKind: UserKind;
  showSigninDrawer: () => void;
  open: boolean;
  openSignupDrawer: () => void;
  openUserDashboard: () => void;
  mobileOpenSignOutModal: () => void;
};

export default function MobileMenuDrawer({
  toggleDrawer,
  handleHomeClicked,
  userKind,
  showSigninDrawer,
  open,
  openSignupDrawer,
  openUserDashboard,
  mobileOpenSignOutModal
}: MobileMenuDrawerProps) {

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={toggleDrawer(false)}
      slotProps={{ paper: {
        sx: {
          top: "var(--template-frame-height, 40px)",
          ...mobileNavDrawerPaperSx,
        }
      }}}
    >
      <Stack
        sx={{
          p: 3,
          gap: 2.5,
          marginTop: 4,
          backgroundColor: "transparent",
        }}
      >
        <Button
          type="button"
          variant="contained"
          fullWidth
          onClick={handleHomeClicked}
          sx={{
            ...navSecondaryButtonSx,
            justifyContent: "flex-start",
            px: 2,
          }}
        >
          Home
        </Button>
       
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <RenderMobileAuthButtons
          userKind={userKind}
          showSigninDrawer={showSigninDrawer}
          openSignupDrawer={openSignupDrawer}
          openUserDashboard={openUserDashboard}
          mobileOpenSignOutModal={mobileOpenSignOutModal}
        />
      </Stack>
    </Drawer>
  );
}

