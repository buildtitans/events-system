"use client";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import {
  enqueueDrawer,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { PANEL_GRAY } from "@/src/styles/sx/sx";
import Box from "@mui/material/Box";
import LeftAnchoredSidebar from "@/src/components/ui/sidebars/leftAnchoredSidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DesktopNav from "./nav/desktop/desktopNav";
import MobileNav from "./nav/mobile/mobileNav";

export default function TopNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const openSignupDrawer = () => {
    dispatch(enqueueDrawer("sign up drawer"));
  };

  const showConfirmSignout = () => {
    dispatch(showModal("confirm signout"));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component={"nav"}
        position="absolute"
        enableColorOnDark
        elevation={24}
        sx={{
          paddingY: 1,
          boxShadow: 0,
          bgcolor: PANEL_GRAY,
          backgroundImage: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {isMobile ? (
          <MobileNav 
          openSignupDrawer={openSignupDrawer}
          showSignoutModal={showConfirmSignout}
          />
        ) : (
          <Container
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: { md: "lg", lg: "lg" },
            }}
          >
            <DesktopNav
              showSignoutModal={showConfirmSignout}
              openSignupDrawer={openSignupDrawer}
            />
          </Container>
        )}
      </AppBar>
      {!isMobile && <LeftAnchoredSidebar />}
    </Box>
  );
}
