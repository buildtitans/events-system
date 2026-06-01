"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import SidebarSkeleton from "../../../ui/skeletons/sidebarSkeleton";
import GroupActonsContainer from "../../../ui/stack/groupActionsContainer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export function RenderGroupSidebar() {
  const group = useSelector((s: RootState) => s.openGroup.group);

  switch (group.status) {
   case "failed": 
   case "initial": return null;
    case "pending": {
      return <SidebarSkeleton />;
    }
    case "ready": {
      return <GroupActonsContainer group_id={group.data.id} />;
    }
    case "n/a": {
      return null;
    }
    default: {
      return assertNever(group)
    }
  }
}
