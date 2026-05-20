"use client";
import { Box, Stack } from "@mui/material";
import {
  openedEventDrawerInnerSx,
  openedEventDrawerRootSx,
} from "@/src/client/styles/sx/openedEventDrawer";
import { PropsWithChildren } from "react";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
    GroupSlug,
    NameOfGroup,
    NumberOfAttendantsType
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import MemberAndOrganizerActions from "./contents/memberAndOrganizerActions";

type MemberEventDrawerProps = PropsWithChildren<{
   role: GroupMemberSchemaType["role"],
      event: EventSchemaType,
      numAttendants: NumberOfAttendantsType,
      numInterested: NumberOfAttendantsType,
      name: NameOfGroup,
      slug: GroupSlug,
}>;

export default function MemberEventDrawer({
 role,
    event,
    numAttendants,
    numInterested,
    name,
    slug,
  children,
}: MemberEventDrawerProps) {
  return (
    <Box sx={openedEventDrawerRootSx}>
      <Stack sx={openedEventDrawerInnerSx}>
        <MemberAndOrganizerActions 
        event={event}
        numAttendants={numAttendants}
        numInterested={numInterested}
        name={name}
        slug={slug}
        role={role}
        />
      </Stack>
    </Box>
  );
}
