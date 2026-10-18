"use client";
import React, { type JSX } from "react";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import EventAttendants from "./eventAttendants";
import EventDescription from "./eventDescription";

type OpenedEventDetailsProps = {
  hydrated: HydratedEventSchemaType;
};

export default function OpenedEventDetails({
  hydrated,
}: OpenedEventDetailsProps): JSX.Element {
  const isCurrent = isFutureOrNow(new Date(hydrated.event.starts_at));

  return (
    <React.Fragment>
      <EventDescription description={hydrated.event.description} />

      {hydrated.event.status === "scheduled" && (
        <EventAttendants
          attendance={hydrated.meta.event.attendants}
          isCurrent={isCurrent}
        />
      )}
    </React.Fragment>
  );
}
