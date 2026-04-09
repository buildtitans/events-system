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
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function MobileNav() {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleHomeClicked = () => {
    router.push("/");
    setOpen(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
      <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
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
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
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
          {userKind === "anonymous" && (
            <Button color="primary" variant="contained" fullWidth>
              Sign up
            </Button>
          )}

          {userKind === "anonymous" && (
            <Button
              component={Link}
              href="/login"
              color="primary"
              variant="outlined"
              fullWidth
            >
              Sign in
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
