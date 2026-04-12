"use client";
import AppBar from "@mui/material/AppBar";
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
import RenderNavigation from "../pipelines/nav/renderNavigation";
import { MobileBottomDrawer } from "../ui/drawers/mobileBottomDrawer";

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

  const navProps = {
    openSignupDrawer,
    showSignoutModal: showConfirmSignout
  }

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
       <RenderNavigation 
       isMobile={isMobile}
       navProps={navProps}
       />
      </AppBar>
      {!isMobile && <LeftAnchoredSidebar />}
      {isMobile && <MobileBottomDrawer />}
    </Box>
  );
}
