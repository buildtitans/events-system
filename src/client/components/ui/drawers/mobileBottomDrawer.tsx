"use client";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import RenderMobileBottomDrawerContents from "../../pipelines/nav/renderMobileBottomDrawerContents";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  mobileBottomDrawerHandleSx,
  mobileBottomDrawerInnerSx,
  mobileBottomDrawerPanelSx,
  mobileBottomDrawerPaperSx,
} from "@/src/client/styles/sx/mobileBottomDrawer";

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
          sx: mobileBottomDrawerPaperSx,
        },
      }}
    >
      <Box sx={mobileBottomDrawerPanelSx}>
        <Box sx={mobileBottomDrawerInnerSx}>
          <Box sx={mobileBottomDrawerHandleSx} />
          <RenderMobileBottomDrawerContents sideBar={sideBar} />
        </Box>
      </Box>
    </Drawer>
  );
}
