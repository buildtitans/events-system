"use client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { Search } from "@/src/features/search/search";
import { NavActionsProps } from "../toolbar/navActions";
import { enqueueDrawer, enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import MobileMenuDrawer from "./mobileMenuDrawer";
import {
  mobileNavIconButtonSx,
  mobileNavSurfaceSx,
} from "@/src/styles/sx/nav";

export default function MobileNav({ 
  openSignupDrawer,
  showSignoutModal
}: Pick<NavActionsProps, "openSignupDrawer" | "showSignoutModal">) {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const openUserDashboard = () => {
    setOpen(false);
    const route = "/user";
    router.push(route);
  };

  const mobileOpenSignOutModal = () => {
    setOpen(false);
    showSignoutModal();
  }

  const handleHomeClicked = () => {
    dispatch(enqueueSidebar(null));
    router.push("/");
    setOpen(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const showSigninDrawer = () => {
    dispatch(enqueueDrawer("sign in drawer"));
    setOpen(false)
  };

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        width: "100%",
        alignItems: "center",
        px: { xs: 1, sm: 3 },
      }}
    >
      <Box sx={mobileNavSurfaceSx}>
        <IconButton
          aria-label="Menu button"
          onClick={() => setOpen(prev => !prev)}
          sx={mobileNavIconButtonSx}
        >
          <MenuIcon />
        </IconButton>

        <Search />
      </Box>
      <MobileMenuDrawer 
      toggleDrawer={toggleDrawer}
      showSigninDrawer={showSigninDrawer}
      open={open}
      userKind={userKind}
      handleHomeClicked={handleHomeClicked}
      openSignupDrawer={openSignupDrawer}
      openUserDashboard={openUserDashboard}
      mobileOpenSignOutModal={mobileOpenSignOutModal}
      />
    </Box>
  );
}
