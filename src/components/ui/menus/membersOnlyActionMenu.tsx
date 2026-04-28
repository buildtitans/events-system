import type { JSX } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { useLeaveGroup } from "@/src/lib/hooks/auth/useLeaveGroup";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  groupSidebarActionCardSx,
  groupSidebarActionDescriptionSx,
  groupSidebarActionTitleSx,
  groupSidebarDangerButtonSx,
} from "@/src/styles/sx/groupSidebar";

type MembersOnlyActionsMenuProps = {
  group_id: GroupMemberSchemaType["group_id"];
};

export default function MembersOnlyActionMenu({
  group_id,
}: MembersOnlyActionsMenuProps): JSX.Element {
  const { removeUserFromGroup } = useLeaveGroup();

  return (
    <Box sx={groupSidebarActionCardSx}>
      <Typography sx={groupSidebarActionTitleSx}>Membership</Typography>
      <Typography sx={groupSidebarActionDescriptionSx}>
        Leave this group if you no longer want updates or member access.
      </Typography>
      <Button
        onClick={() => removeUserFromGroup(group_id)}
        startIcon={<LogoutRoundedIcon />}
        sx={groupSidebarDangerButtonSx}
      >
        Leave Group
      </Button>
    </Box>
  );
}
