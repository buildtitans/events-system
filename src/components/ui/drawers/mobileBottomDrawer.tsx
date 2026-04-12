"use client";
import Drawer from "@mui/material/Drawer";
import RenderMobileBottomDrawer from "../../pipelines/nav/renderMobileBottomDrawer";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { bottomDrawerSx } from "@/src/styles/sx/sx";

export function MobileBottomDrawer() {
  const sideBar = useSelector((s: RootState) => s.rendering.sidebar);

  return (
    <Drawer
      anchor="bottom"
      variant="persistent"
      open={sideBar !== null}
      transitionDuration={{ enter: 300, exit: 250 }}
      sx={{
        width: "100%",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: "100%",
          boxSizing: "border-box",
        },
      }}
      slotProps={{
        paper: {
          elevation: 16,
          sx: bottomDrawerSx,
        },
      }}
    >
      <RenderMobileBottomDrawer sideBar={sideBar} />
    </Drawer>
  );
}
