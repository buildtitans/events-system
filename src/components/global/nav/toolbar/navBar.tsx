"use client";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import ColorModeIconDropdown from "../ColorModelIconDropdown";
import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import HomeButton from "../../../ui/buttons/homeButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Search } from "@/src/features/search/search";
import MenuList from "@mui/material/MenuList";
import { useRouter } from "next/navigation";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: 999,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

type NavLinksProps = {
  userKind: UserKind;
};

export default function NavBar({ userKind }: NavLinksProps) {
  const theme = useTheme();

  return (
    <StyledToolbar
      variant="dense"
      disableGutters
      sx={{
        ml: 0,
        padding: 0.8,
        mr: "auto",
        minWidth: { xs: "400px", md: "600px" },
      }}
    >
      <HomeButton />

      <Search />
    </StyledToolbar>
  );
}
