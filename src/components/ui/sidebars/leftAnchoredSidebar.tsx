"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import { sidebarStyles } from "@/src/lib/tokens/sxTokens";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderActiveSidebar } from "../../pipelines/drawers/forks/renderActiveSidebar";

export default function LeftAnchoredSidebar(): JSX.Element | null {
  const sidebar = useSelector((s:RootState) => s.rendering.sidebar);
  const drawerWidth = 200;

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