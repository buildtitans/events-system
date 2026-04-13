"use client";
import SelectActiveGroupsFilter from "@/src/features/group/selectActiveGroupsFilter";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import RenderLandingGroupsTab from "../../pipelines/groups/renderLandingGroupsTab";
import { JSX, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { changeDisplayedGroupFilter } from "@/src/lib/store/slices/groups/GroupsSlice";

export default function LandingPageGroupSection(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(changeDisplayedGroupFilter("all"));
    };
  }, []);

  return (
    <Container
      disableGutters
    >
      <Stack
        minHeight={800}
        gap={2}
        direction={"column"}
        alignItems={"start"}
        justifyContent={"start"}
      >
        <SelectActiveGroupsFilter 
        />

        <RenderLandingGroupsTab />
      </Stack>
    </Container>
  );
}
