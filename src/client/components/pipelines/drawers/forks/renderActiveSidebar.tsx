"use client";
import type { JSX } from "react";
import { ActiveSidebar } from "@/src/lib/store/slices/rendering/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../../async/asyncStateRenderer";
import SidebarSkeleton from "../../../ui/skeletons/sidebarSkeleton";
import GroupActonsContainer from "../../../ui/stack/groupActionsContainer";
import UserAccountMenu from "../../../ui/menus/dashboard/userAccountMenu";

type RenderActiveSidebarProps = {
  sidebar: ActiveSidebar;
};

export function RenderActiveSidebar({
  sidebar,
}: RenderActiveSidebarProps): JSX.Element | null {
  const email = useSelector((s: RootState) => s.user.email);
  const group = useSelector((s: RootState) => s.openGroup.group);

  switch (sidebar) {
    case "group": {
      return (
        <AsyncStateRenderer state={group} pending={() => (<SidebarSkeleton />)}>
          {(state) => (
            <GroupActonsContainer group_id={state.id}/>
          )}
        </AsyncStateRenderer>
      )
    }

    case "user": {
      return (
        <AsyncStateRenderer state={email} pending={() => (<SidebarSkeleton />)} >
          {(state) => (
            <UserAccountMenu email={state} />
          )}
        </AsyncStateRenderer>
      );
    }

    case null: {
      return null;
    }

    default: {
      return assertNever(sidebar);
    }
  }
}
