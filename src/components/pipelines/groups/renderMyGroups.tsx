"use client";
import type { JSX } from "react";
import type { MyGroupsType } from "@/src/lib/store/slices/user/types";
import GroupsPagesContainer from "../../sections/group/groupsPages";
import { chunkGroupsIntoPages } from "@/src/lib/utils/helpers/chunk/chunkGroupsIntoPages";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import NoGroup from "../../ui/feedback/failure/noGroups";

type RenderMyGroupsProps = {
  myGroups: MyGroupsType;
};

export default function RenderMyGroups({
  myGroups,
}: RenderMyGroupsProps): JSX.Element | null {
  switch (myGroups.status) {
    case "ready": {
      return (
        <GroupsPagesContainer
          groupsPages={chunkGroupsIntoPages(myGroups.data)}
          silenceHeader={true}
        />
      );
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
