import JoinGroupButton from "../../ui/buttons/joinGroupButton";
import type { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { JSX } from "react";
import OrganizerOnlyActionsMenu from "../../ui/menus/organizerOnlyActionsMenu";
import MembersOnlyActionMenu from "../../ui/menus/membersOnlyActionMenu";

export const RenderSidebarContents = (
  role: GroupMembersSchemaType["role"],
  group_id: GroupMembersSchemaType["group_id"],
): JSX.Element | null => {
  switch (role) {
    case "organizer":
      return <OrganizerOnlyActionsMenu />;

    case "anonymous":
      return <JoinGroupButton group_id={group_id} />;

    case "member":
      return <MembersOnlyActionMenu />

    default: {
      return null;
    }
  }
};