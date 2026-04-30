"use client";
import type { JSX } from "react";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "../../../sections/forms/rescheduleEventForm";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import MemberEventDrawer from "@/src/components/ui/drawers/memberEventDrawer";
import AnonEventDrawer from "@/src/components/ui/drawers/anonEventDrawer";

type RenderEventDrawerContentsProps = {
  role: GroupMemberSchemaType["role"];
  event: EventSchemaType;
  numAttendants: NumberOfAttendantsType;
  numInterested: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export default function RenderEventDrawerContents({
  role,
  event,
  numAttendants,
  numInterested,
  name,
  slug,
}: RenderEventDrawerContentsProps): JSX.Element | null {
  const isCurrent = isFutureOrNow(new Date(event.starts_at));

  if (!isCurrent) {
    return (
      <AnonEventDrawer
        role={role}
        event={event}
        numAttendants={numAttendants}
        numInterested={numInterested}
        name={name}
        slug={slug}
      />
    );
  }

  switch (role) {
    case "member":
      return (
        <MemberEventDrawer
          role={role}
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        />
      );
    case "organizer":
      return (
        <MemberEventDrawer
          role={role}
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        >
          {isCurrent && <RescheduleEventForm event={event} />}
        </MemberEventDrawer>
      );
    default: {
      return (
        <AnonEventDrawer
          role={role}
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        />
      );
    }
  }
}
