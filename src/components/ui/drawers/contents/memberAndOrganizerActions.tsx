"use client";
import React, { useState } from "react";
import { Stack } from "@mui/material";
import { openedEventHeroSx } from "@/src/styles/sx/openedEventDrawer";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import OpenedEventHead from "../../stack/openedEvent/contents/openedEventHead";
import { RenderOpenEventFormSection } from "@/src/components/pipelines/drawers/interfaces/renderOpenedEventSection";
import { ActionButtons } from "../actions/actionButtons";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";

type MemberAndOrganizerActionsProps = {
  role: GroupMemberSchemaType["role"];
  event: EventSchemaType;
  numAttendants: NumberOfAttendantsType;
  numInterested: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export type EventDrawerFormState =
  | "details"
  | "attendance form"
  | "schedule change";

type ButtonAction = { kind: EventDrawerFormState; label: string };

export type ButtonActions = Array<ButtonAction>;

export function createActions(role: GroupMemberSchemaType["role"], isCurrent: boolean): ButtonActions {
  if (role === "member") {
    return [
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" }
    ];
  } else if ((role === "organizer") && isCurrent) {
    return [
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" },

      { label: "Event Status", kind: "schedule change" },
    ];
  } else if(role === "organizer" && (!isCurrent)) {
    return [
      
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" },
    ];
  } else { 
    return []
  }
}

export default function MemberAndOrganizerActions({
  role,
  event,
  numAttendants,
  name,
  slug,
  numInterested,
}: MemberAndOrganizerActionsProps) {
  const [openSection, setOpenSection] =
    useState<EventDrawerFormState>("details");
  const isCurrent = isFutureOrNow(new Date(event.starts_at));
  const actions = createActions(role, isCurrent);

  return (
    <React.Fragment>
      <Stack sx={openedEventHeroSx} spacing={1.35}>
        <OpenedEventHead
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        />
      <ActionButtons
        actions={actions}
        currentAction={openSection}
        setOpenAction={setOpenSection}
      />
        
      </Stack>
      <RenderOpenEventFormSection
          role={role}
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
          state={openSection}
        />
    </React.Fragment>
  );
}
