"use client";
import GroupName from "./groupName";
import EventTitle from "./eventTitle";
import OpenedEventImage from "../../../box/cards/openedEventImage";
import EventMeta from "./eventMeta";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import React from "react";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

type OpenedEventHeadProps = {
  hydrated: HydratedEventSchemaType;
};

export default function OpenedEventHead({ hydrated }: OpenedEventHeadProps) {
  const thumbnail = hydrated.event.img;
  const startTime = toMonthDayYearHour(hydrated.event.starts_at);
  return (
    <React.Fragment>
      <GroupName
        slug={hydrated.meta.event.group_slug}
        name={hydrated.meta.event.group_name}
      />

      <EventTitle title={hydrated.event.title} />

      <OpenedEventImage thumbnail={thumbnail} />

      <EventMeta
        startTime={startTime}
        location={hydrated.event.meeting_location}
      />
    </React.Fragment>
  );
}
