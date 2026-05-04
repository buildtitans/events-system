"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderOpenedGroup } from "../pipelines/groups/renderOpenedGroup";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { getDesktopSidebarOffsetSx } from "@/src/client/styles/sx/sidebar";

export default function OpenedGroup(): JSX.Element | null {
  const { group } = useSelector((s: RootState) => s.openGroup);
  const sidebar = useSelector((s: RootState) => s.rendering.sidebar);
  const showDesktopSidebar = sidebar === "group";

  return (
    <Container
      maxWidth={false}
      disableGutters
      component="main"
      sx={{
        height: "100%",
        ...getDesktopSidebarOffsetSx(showDesktopSidebar),
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <RenderOpenedGroup group={group} />
      </Box>
    </Container>
  );
}
