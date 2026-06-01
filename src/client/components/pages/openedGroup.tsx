"use client";
import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { getDesktopSidebarOffsetSx } from "@/src/client/styles/sx/sidebar";
import { clearOpenedGroupSlice } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { AsyncStateRenderer } from "../pipelines/asyncRenderer";
import ViewGroupSection from "../sections/group/openedGroup/viewGroupSection";
import SimpleBackdrop from "../ui/feedback/pending/backdrop";

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
        <AsyncStateRenderer state={group} pending={() => (<SimpleBackdrop />)}>
          {(state) => (
            <ViewGroupSection group={state}/>
          )}
        </AsyncStateRenderer>
      </Box>
    </Container>
  );
}
