import JoinGroupButton from "@/src/components/ui/buttons/joinGroupButton";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { JSX } from "react";
import OrganizerOnlyActionsMenu from "@/src/components/ui/menus/organizerOnlyActionsMenu";
import MembersOnlyActionMenu from "@/src/components/ui/menus/membersOnlyActionMenu";

type RenderSidebarContentsProps = {
  role: GroupMemberSchemaType["role"],
  group_id: GroupMemberSchemaType["group_id"],
}

export const RenderRoleBasedSidebarContents= ({
  role,
  group_id
}: RenderSidebarContentsProps
): JSX.Element | null => {

  switch (role) {
    case "organizer":
      return <OrganizerOnlyActionsMenu />;

    case "anonymous":
      return <JoinGroupButton group_id={group_id} />;

    case "member":
      return <MembersOnlyActionMenu group_id={group_id} />;

    default: {
      return null;
    }
  }
};
