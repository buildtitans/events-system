import JoinGroupButton from "@/src/client/components/ui/buttons/joinGroupButton";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { JSX } from "react";
import OrganizerOnlyActionsMenu from "@/src/client/components/ui/menus/openGroup/organizerOnlyActionsMenu";
import MembersOnlyActionMenu from "@/src/client/components/ui/menus/openedEvent/membersOnlyActionMenu";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderSidebarContentsProps = {
  role: GroupMemberSchemaType["role"],
  group_id: GroupMemberSchemaType["group_id"],
}

export const RenderRoleBasedSidebarContents= ({
  role,
  group_id
}: RenderSidebarContentsProps
): JSX.Element => {

  switch (role) {
    case "organizer":
      return <OrganizerOnlyActionsMenu group_id={group_id}/>;

    case "anonymous":
      return <JoinGroupButton group_id={group_id} />;

    case "member":
      return <MembersOnlyActionMenu group_id={group_id} />;

    default: {
      return assertNever(role);
    }
  }
};
