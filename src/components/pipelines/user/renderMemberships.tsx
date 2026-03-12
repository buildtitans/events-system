"use client";
import SimpleBackdrop from "@/src/components/ui/feedback/pending/backdrop";
import MyMemberships from "@/src/components/sections/user/myMemberships";
import { ParticipationsType } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";

export default function RenderMemberships({
  participations,
}: {
  participations: ParticipationsType;
}): JSX.Element {
  switch (participations.status) {
    case "pending": {
      return <SimpleBackdrop />;
    }

    case "ready": {
      return <MyMemberships memberships={participations.data.memberships} />;
    }

    default: {
      return <SimpleBackdrop />;
    }
  }
}
