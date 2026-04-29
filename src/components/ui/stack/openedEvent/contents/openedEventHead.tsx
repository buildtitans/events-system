"use client"
import GroupName from "./groupName";
import EventTitle from "./eventTitle";
import OpenedEventImage from "../../../box/cards/openedEventImage";
import EventMeta from "./eventMeta";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import React from "react";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

type OpenedEventHeadProps = {
  event: EventSchemaType;
  numAttendants?: NumberOfAttendantsType;
  numInterested?: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export default function OpenedEventHead({
  event,
  slug,
  name,
}: OpenedEventHeadProps) {
  const thumbnail = event.img;
  const startTime = toMonthDayYearHour(event.starts_at);
  return (
    <React.Fragment>
      <GroupName slug={slug} name={name} />

      <EventTitle title={event.title} />

      <OpenedEventImage thumbnail={thumbnail} />

      <EventMeta startTime={startTime} location={event.meeting_location} />
    </React.Fragment>
  );
}
