"use client";
import React, { type JSX } from "react";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import EventAttendants from "./eventAttendants";
import EventDescription from "./eventDescription";

type OpenedEventDetailsProps = {
  event: EventSchemaType;
  numAttendants?: NumberOfAttendantsType;
  numInterested?: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export default function OpenedEventDetails({
  event,
  numAttendants,
  numInterested,
  name,
  slug,
}: OpenedEventDetailsProps): JSX.Element {
  const isCurrent = isFutureOrNow(new Date(event.starts_at));

  return (
    <React.Fragment>
      <EventDescription description={event.description} />

      {numAttendants && event.status === "scheduled" && (
        <EventAttendants
          numAttendants={numAttendants}
          numInterested={numInterested}
          isCurrent={isCurrent}
        />
      )}
    </React.Fragment>
  );
}
