"use client";
import type { JSX } from "react";
import type { MyGroupsState } from "@/src/lib/store/slices/user/types";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import NoGroup from "../../ui/feedback/failure/noGroups";
import RenderGroupsOrFallback from "./renderGroupsOrFallback";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";
import { Container } from "@mui/material";

type RenderMyGroupsProps = {
  myGroups: MyGroupsState;
};

export default function RenderMyGroups({
  myGroups,
}: RenderMyGroupsProps): JSX.Element | null {


  switch (myGroups.status) {
    case "ready": {
      return (
        <Container>
<RenderGroupsOrFallback 
        pages={myGroups.data} 
        />
        </Container>
        
      )
    }

    case "pending": {
      <RelativeSpinner />;
    }

    case "n/a": {
     return <NoGroup />;
    }

    case "failed": {
     return (<AsyncFailedFallback 
      message={myGroups.error}
      />) 
    }

    default: {
      return null;
    }
  }
}
