"use client";
import SimpleBackdrop from "@/src/components/ui/feedback/pending/backdrop";
import MyMemberships from "@/src/components/sections/user/myMemberships";
import { ParticipationsType } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";
import NoMemberships from "../../ui/feedback/fallbacks/noMemberships";

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
        if(participations.data.memberships.length > 0) {
      return <MyMemberships memberships={participations.data.memberships} />;

        } else {
          return <NoMemberships />
        }
    }

    default: {
      return <SimpleBackdrop />;
    }
  }
}
