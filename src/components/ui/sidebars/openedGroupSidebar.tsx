"use client";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import GroupActonsContainer from "../stack/groupActionsContainer";
import { groupSidebarStyles } from "@/src/lib/tokens/sxTokens";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function OpenedGroupSidebar(): JSX.Element | null {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const group = useSelector((s: RootState) => s.openGroup.group);
  const status = group.status;

  return (
    <Drawer
      variant="persistent"
      elevation={1}
      anchor={isMobile ? "bottom" : "left"}
      open={status !== "idle" && !isMobile}
      transitionDuration={{ enter: 300, exit: 250 }}
      sx={{
        height: "100%",
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

function SidebarSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      animation="wave"
      width="100%"
      height="100%"
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.015)",
      }}
    />
  );
}
