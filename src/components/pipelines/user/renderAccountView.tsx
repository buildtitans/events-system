"use client";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import MyGroups from "@/src/components/sections/user/myGroups";
import RenderMemberships from "./renderMemberships";
import RenderRsvps from "./renderRsvps";

export default function RenderAccountView() {
  const view = useSelector((s: RootState) => s.user.view);
  const participations = useSelector((s: RootState) => s.user.participations);

  switch (view) {
    case "rsvps": {
        return (
          <RenderRsvps participations={participations} />
        ) 
    }
    case "memberships": {
      return <RenderMemberships participations={participations} />;
    }
    case "my groups": {
      return <MyGroups />;
    }

    default: {
      <MyGroups />;
    }
  }
}
