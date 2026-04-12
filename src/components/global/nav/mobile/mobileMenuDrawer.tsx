"use client";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import RenderMobileAuthButtons from "@/src/components/pipelines/nav/renderMobileAuthButtons";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import Button from "@mui/material/Button";

type MobileMenuDrawerProps = {
  toggleDrawer: (newOpen: boolean) => () => void;
  handleHomeClicked: () => void;
  userKind: UserKind;
  showSigninDrawer: () => void;
  showSignoutModal: () => void;
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
  showSignoutModal,
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
        }
      }}}
    >
      <Stack sx={{ p: 4, backgroundColor: "background.default" }}>
        <Button
              type="button"
              color="primary"
              variant="outlined"
              fullWidth
                        onClick={handleHomeClicked}
          >
          Home
          </Button>
       
        <Divider sx={{ my: 3 }} />

        <RenderMobileAuthButtons
          userKind={userKind}
          showSigninDrawer={showSigninDrawer}
          showSignoutModal={showSignoutModal}
          openSignupDrawer={openSignupDrawer}
          openUserDashboard={openUserDashboard}
          mobileOpenSignOutModal={mobileOpenSignOutModal}
        />
      </Stack>
    </Drawer>
  );
}

