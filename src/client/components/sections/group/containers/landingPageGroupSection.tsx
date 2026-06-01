"use client";
import SelectActiveGroupsFilter from "@/src/client/features/group/selectActiveGroupsFilter";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { changeDisplayedGroupFilter } from "@/src/lib/store/slices/groups/GroupsSlice";
import { AsyncStateRenderer } from "../../../pipelines/async/asyncStateRenderer";
import AsyncFailedFallback from "../../../ui/feedback/failure/asyncFailedFallback";
import GroupsPagesContainer from "./groupsPages";

export default function LandingPageGroupSection(): JSX.Element {
  const landingGroupsTab = useSelector((s: RootState) => s.groups.landingGroupsTab);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(changeDisplayedGroupFilter("all"));
    };
  }, [dispatch]);

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

        <AsyncStateRenderer state={landingGroupsTab} empty={(message) => <AsyncFailedFallback message={message} />}>
        {(state) => (
          <GroupsPagesContainer groupsPages={state}/>
        )}
        </AsyncStateRenderer>
      </Stack>
    </Container>
  );
}
