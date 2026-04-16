"use client";
import SimpleBackdrop from "@/src/components/ui/feedback/pending/backdrop";
import MyMemberships from "@/src/components/sections/user/myMemberships";
import { PariticpationsState } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";
import NoMemberships from "../../ui/feedback/fallbacks/noMemberships";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";

export default function RenderMemberships({
  participations,
}: {
  participations: PariticpationsState;
}): JSX.Element {
  switch (participations.status) {
    case "pending": {
      return <SimpleBackdrop />;
    }

    case "ready": {
      if (participations.data.memberships.length > 0) {
        return <MyMemberships memberships={participations.data.memberships} />;
      } else {
        return <NoMemberships />;
      }
    }

    case "failed": {
      return <AsyncFailedFallback error={participations.error} />;
    }
    case "n/a": {
      <AsyncFailedFallback message={participations.message} />;
    }

    default: {
      return <SimpleBackdrop />;
    }
  }
}
