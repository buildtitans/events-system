"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import GroupActonsContainer from "../stack/groupActionsContainer";
import { groupSidebarStyles } from "@/src/lib/tokens/sxTokens";
import SidebarSkeleton from "../skeletons/sidebarSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function OpenedGroupSidebar(): JSX.Element | null {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const group = useSelector((s: RootState) => s.openGroup.group);
  const status = group.status;
  const drawerWidth = 200;

  return (
    <Drawer
      variant="persistent"
      elevation={0}
      anchor="left"
      open={status !== "idle" && !isMobile}
      transitionDuration={{ enter: 300, exit: 250 }}
      sx={{
width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          
      }}
      slotProps={{
        paper: {
          sx: groupSidebarStyles,
          elevation: 0,
        },
      }}
    >
      {status === "pending" && <SidebarSkeleton key={"sidebar-skeleton"} />}

      {status === "ready" && <GroupActonsContainer group_id={group.data.id} />}
    </Drawer>
  );
}