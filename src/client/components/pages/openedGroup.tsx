"use client";
import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { RenderOpenedGroup } from "@/src/client/components/pipelines/groups/status/renderOpenedGroup";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { getDesktopSidebarOffsetSx } from "@/src/client/styles/sx/sidebar";
import { clearOpenedGroupSlice } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

export default function OpenedGroup(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const { group } = useSelector((s: RootState) => s.openGroup);
  const sidebar = useSelector((s: RootState) => s.rendering.sidebar);
  const showDesktopSidebar = sidebar === "group";

  useEffect(() => {

    return () => {
      dispatch(clearOpenedGroupSlice());
    }
  }, [dispatch])

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
