"use client";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import {
  enqueueDrawer,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import NavActions from "../global/navActions";
import NavBar from "../global/navBar";
import { PANEL_GRAY } from "@/src/styles/sx/sx";
import Box from "@mui/material/Box";
import LeftAnchoredSidebar from "@/src/components/ui/sidebars/leftAnchoredSidebar";

export default function TopNav() {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
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
        <Container
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: { md: "lg", lg: "lg" },
          }}
        >
          <NavBar userKind={userKind} />
          <NavActions
            userKind={userKind}
            openSignupDrawer={openSignupDrawer}
            showSignoutModal={showConfirmSignout}
          />
        </Container>
      </AppBar>
      <LeftAnchoredSidebar />
    </Box>
  );
}
