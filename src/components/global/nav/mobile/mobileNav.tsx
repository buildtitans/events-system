"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuList from "@mui/material/MenuList";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { Search } from "@/src/features/search/search";
import { NavActionsProps } from "../toolbar/navActions";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import Stack from "@mui/material/Stack";
import RenderMobileAuthButtons from "@/src/components/pipelines/nav/renderMobileAuthButtons";

export default function MobileNav({ 
  openSignupDrawer,
  showSignoutModal
}: Pick<NavActionsProps, "openSignupDrawer" | "showSignoutModal">) {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleHomeClicked = () => {
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
        justifyContent: "flex-start",
        gap: 1,
        px: { xs: 2, sm: 3 },
      }}
    >
      <IconButton aria-label="Menu button" onClick={() => setOpen(prev => !prev)}>
        <MenuIcon />
      </IconButton>

      <Search />
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
            />
          
        </Stack>
      </Drawer>
    </Box>
  );
}
