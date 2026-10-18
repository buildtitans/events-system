"use client";
import MembersOnlyAttendanceForm from "@/src/client/components/sections/events/membersOnlyAttendanceForm";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import OpenedEventDetails from "@/src/client/components/ui/stack/openedEvent/contents/openedEventDetails";
import RescheduleEventForm from "@/src/client/components/sections/forms/event/rescheduleEventForm";
import type { EventDrawerFormState } from "@/src/client/components/ui/drawers/contents/memberAndOrganizerActions";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderOpenEventFormProps = {
  hydrated: HydratedEventSchemaType;
  state: EventDrawerFormState;
};

export function RenderOpenEventFormSection({
  hydrated,
  state,
}: RenderOpenEventFormProps) {
  switch (state) {
    case "details": {
      return <OpenedEventDetails hydrated={hydrated} />;
    }
    case "attendance form": {
      return <MembersOnlyAttendanceForm hydrated={hydrated} />;
    }
    case "schedule change": {
      return <RescheduleEventForm event={hydrated.event} />;
    }

    default: {
      assertNever(state);
    }
  }
}
