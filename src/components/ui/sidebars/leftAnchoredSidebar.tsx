"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import { sidebarStyles } from "@/src/styles/sx/sx";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderActiveSidebar } from "../../pipelines/drawers/forks/renderActiveSidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { getDesktopSidebarWidth } from "@/src/styles/sx/sidebar";

export default function LeftAnchoredSidebar(): JSX.Element | null {
  const theme = useTheme();
  const sidebar = useSelector((s:RootState) => s.rendering.sidebar);
  const lgScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const drawerWidth = getDesktopSidebarWidth(lgScreen);

  return (
    <Drawer
      variant="persistent"
      elevation={0}
      anchor="left"
      open={(sidebar !== null)}
      transitionDuration={{ enter: 300, exit: 250 }}
      sx={{
width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          
      }}
      slotProps={{
        paper: {
          sx: sidebarStyles,
          elevation: 0,
        },
      }}
    >
      <RenderActiveSidebar sidebar={sidebar}/>
    </Drawer>
  );
}
