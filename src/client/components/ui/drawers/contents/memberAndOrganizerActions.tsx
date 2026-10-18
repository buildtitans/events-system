"use client";
import React, { useState } from "react";
import { Stack } from "@mui/material";
import { openedEventHeroSx } from "@/src/client/styles/sx/openedEventDrawer";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import OpenedEventHead from "../../stack/openedEvent/contents/openedEventHead";
import { RenderOpenEventFormSection } from "@/src/client/components/pipelines/drawers/interfaces/renderOpenedEventSection";
import { ActionButtons } from "../actions/actionButtons";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";

export type EventDrawerFormState =
  | "details"
  | "attendance form"
  | "schedule change";

type ButtonAction = { kind: EventDrawerFormState; label: string };

export type ButtonActions = Array<ButtonAction>;

export function createActions(
  role: GroupMemberSchemaType["role"],
  isCurrent: boolean,
): ButtonActions {
  if (role === "member") {
    return [
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" },
    ];
  } else if (role === "organizer" && isCurrent) {
    return [
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" },

      { label: "Event Status", kind: "schedule change" },
    ];
  } else if (role === "organizer" && !isCurrent) {
    return [
      { label: "Event Details", kind: "details" },
      { label: "RSVP Update", kind: "attendance form" },
    ];
  } else {
    return [];
  }
}

export default function MemberAndOrganizerActions({
  hydrated,
}: {
  hydrated: HydratedEventSchemaType;
}) {
  const [openSection, setOpenSection] =
    useState<EventDrawerFormState>("details");
  const isCurrent = isFutureOrNow(new Date(hydrated.event.starts_at));
  const actions = createActions(hydrated.meta.user.role, isCurrent);

  return (
    <React.Fragment>
      <Stack sx={openedEventHeroSx} spacing={1.35}>
        <OpenedEventHead hydrated={hydrated} />
        <ActionButtons
          actions={actions}
          currentAction={openSection}
          setOpenAction={setOpenSection}
          eventStatus={hydrated.event.status}
        />
      </Stack>
      <RenderOpenEventFormSection hydrated={hydrated} state={openSection} />
    </React.Fragment>
  );
}
