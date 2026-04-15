"use client";
import type { JSX } from "react";
import type { MyGroupsState } from "@/src/lib/store/slices/user/types";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import NoGroup from "../../ui/feedback/failure/noGroups";
import RenderGroupsOrFallback from "./renderGroupsOrFallback";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";

type RenderMyGroupsProps = {
  myGroups: MyGroupsState;
};

export default function RenderMyGroups({
  myGroups,
}: RenderMyGroupsProps): JSX.Element | null {

  console.log(myGroups.status)

  switch (myGroups.status) {
    case "ready": {
      return (
        <RenderGroupsOrFallback 
        pages={myGroups.data} 
        />
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
