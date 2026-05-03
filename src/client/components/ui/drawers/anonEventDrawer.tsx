"use client";
import type { JSX } from "react";
import OpenedEvent from "@/src/client/components/ui/stack/openedEvent/OpenedEvent";
import CheckOutGroupButton from "../buttons/checkOutGroupButton";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  openedEventDrawerInnerSx,
  openedEventDrawerRootSx,
} from "@/src/styles/sx/openedEventDrawer";

type AnonEventDrawerProps = {
  role: GroupMemberSchemaType["role"];
  event: EventSchemaType;
  numAttendants: NumberOfAttendantsType;
  numInterested: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export default function AnonEventDrawer({
  numAttendants,
  numInterested,
  event,
  name,
  slug,
}: AnonEventDrawerProps): JSX.Element {
  return (
    <Box sx={openedEventDrawerRootSx}>
      <Stack sx={openedEventDrawerInnerSx}>
        <OpenedEvent
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        />

        <CheckOutGroupButton event={event} />
      </Stack>
    </Box>
  );
}
