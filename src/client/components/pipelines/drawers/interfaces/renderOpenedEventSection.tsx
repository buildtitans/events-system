"use client";
import MembersOnlyAttendanceForm from "@/src/client/components/sections/events/membersOnlyAttendanceForm";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import OpenedEventDetails from "@/src/client/components/ui/stack/openedEvent/contents/openedEventDetails";
import RescheduleEventForm from "@/src/client/components/sections/forms/event/rescheduleEventForm";
import type { EventDrawerFormState } from "@/src/client/components/ui/drawers/contents/memberAndOrganizerActions";


type RenderOpenEventFormProps = {
  role: GroupMemberSchemaType["role"];
  event: EventSchemaType;
  numAttendants: NumberOfAttendantsType;
  numInterested: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
  state: EventDrawerFormState;
};

export function RenderOpenEventFormSection({
  role,
  event,
  numAttendants,
  numInterested,
  name,
  slug,
  state,
}: RenderOpenEventFormProps) {
  switch (state) {
    case "details": {
      return (
        <OpenedEventDetails
          event={event}
          numAttendants={numAttendants}
          numInterested={numInterested}
          name={name}
          slug={slug}
        />
      );
    }
    case "attendance form": {
      return (
        <MembersOnlyAttendanceForm role={role} scheduleStatus={event.status} />
      );
    }
    case "schedule change": {
     return (<RescheduleEventForm event={event} />);
    }
  }
}
