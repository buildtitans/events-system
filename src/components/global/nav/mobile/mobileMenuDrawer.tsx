"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import RenderMobileAuthButtons from "@/src/components/pipelines/nav/renderMobileAuthButtons";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";

type MobileMenuDrawerProps = {
  toggleDrawer: (newOpen: boolean) => () => void;
  handleHomeClicked: () => void;
  userKind: UserKind;
  showSigninDrawer: () => void;
  showSignoutModal: () => void;
  open: boolean;
  openSignupDrawer: () => void
};

export default function MobileMenuDrawer({
  toggleDrawer,
  handleHomeClicked,
  userKind,
  showSigninDrawer,
  showSignoutModal,
  open,
  openSignupDrawer
}: MobileMenuDrawerProps) {
  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          top: "var(--template-frame-height, 0px)",
        },
      }}
    >
      <Stack sx={{ p: 2, backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <MenuList>
          <MenuItem onClick={handleHomeClicked}>Home</MenuItem>
        </MenuList>
        <Divider sx={{ my: 3 }} />

        <RenderMobileAuthButtons
          userKind={userKind}
          showSigninDrawer={showSigninDrawer}
          showSignoutModal={showSignoutModal}
          openSignupDrawer={openSignupDrawer}
        />
      </Stack>
    </Drawer>
  );
}
