"use client"
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { type JSX } from "react";
import { useJoinGroup } from "@/src/lib/hooks/insert/useJoinGroup";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  groupSidebarActionCardSx,
  groupSidebarActionDescriptionSx,
  groupSidebarActionTitleSx,
  groupSidebarPrimaryButtonSx,
} from "@/src/client/styles/sx/groupSidebar";

type JoinGroupButtonProps = {
    group_id: GroupSchemaType["id"],
}

export default function JoinGroupButton({
    group_id,
}: JoinGroupButtonProps): JSX.Element | null {
    const { handleClick } = useJoinGroup();

    return (
      <Box sx={groupSidebarActionCardSx}>
        <Typography sx={groupSidebarActionTitleSx}>Become a Member</Typography>
        <Typography sx={groupSidebarActionDescriptionSx}>
          Join this group to RSVP to events and keep up with new activity.
        </Typography>
        <Button
          onClick={() => handleClick(group_id)}
          startIcon={<HowToRegRoundedIcon />}
          sx={groupSidebarPrimaryButtonSx}
        >
          Join Group
        </Button>
      </Box>
    );
}
