"use client";
import type { JSX } from "react";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "@/src/client/components/sections/forms/event/rescheduleEventForm";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import MemberEventDrawer from "@/src/client/components/ui/drawers/memberEventDrawer";
import AnonEventDrawer from "@/src/client/components/ui/drawers/anonEventDrawer";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderEventDrawerContentsProps = {
  hydrated: HydratedEventSchemaType;
};

export default function RenderEventDrawerContents({
  hydrated,
}: RenderEventDrawerContentsProps): JSX.Element | null {
  const isCurrent = isFutureOrNow(new Date(hydrated.event.starts_at));

  if (!isCurrent) {
    return <AnonEventDrawer hydrated={hydrated} />;
  }

  switch (hydrated.meta.user.role) {
    case "member":
      return <MemberEventDrawer hydrated={hydrated} />;
    case "organizer":
      return (
        <MemberEventDrawer hydrated={hydrated}>
          {isCurrent && <RescheduleEventForm event={hydrated.event} />}
        </MemberEventDrawer>
      );

    case "anonymous": {
      return <AnonEventDrawer hydrated={hydrated} />;
    }
    default: {
      return assertNever(hydrated.meta.user.role);
    }
  }
}
