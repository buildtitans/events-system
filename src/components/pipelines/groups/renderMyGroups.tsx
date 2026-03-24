"use client";
import type { JSX } from "react";
import type { MyGroupsType } from "@/src/lib/store/slices/user/types";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import NoGroup from "../../ui/feedback/failure/noGroups";
import RenderGroupsOrFallback from "./renderGroupsOrFallback";

type RenderMyGroupsProps = {
  myGroups: MyGroupsType;
};

export default function RenderMyGroups({
  myGroups,
}: RenderMyGroupsProps): JSX.Element | null {
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

    case "failed": {
      <NoGroup />;
    }

    default: {
      return null;
    }
  }
}
