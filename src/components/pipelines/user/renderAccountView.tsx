"use client";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import RenderMemberships from "./renderMemberships";
import RenderRsvps from "./renderRsvps";
import RenderMyGroups from "../groups/renderMyGroups";
import { JSX } from "react";

export default function RenderAccountView(): JSX.Element | null {
  const view = useSelector((s: RootState) => s.user.view);
  const participations = useSelector((s: RootState) => s.user.participations);
 const myGroups = useSelector((s: RootState) => s.user.myGroups);

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
      return <RenderMyGroups myGroups={myGroups}/>
    }

    default: {
      return null;
    }
  }
}
