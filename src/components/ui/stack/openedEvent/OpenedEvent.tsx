"use client";
import Stack from "@mui/material/Stack";
import FadeInOutBox from "@/src/components/ui/box/motionboxes/fadeInOutBox";
import { type JSX } from "react";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import OpenedEventImage from "@/src/components/ui/box/cards/openedEventImage";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import EventAttendants from "@/src/components/ui/stack/openedEvent/contents/eventAttendants";
import EventTitle from "@/src/components/ui/stack/openedEvent/contents/eventTitle";
import GroupName from "@/src/components/ui/stack/openedEvent/contents/groupName";
import EventDescription from "@/src/components/ui/stack/openedEvent/contents/eventDescription";
import EventMeta from "@/src/components/ui/stack/openedEvent/contents/eventMeta";
import { openedEventHeroSx } from "@/src/styles/sx/openedEventDrawer";

type OpenedEventProps = {
  event: EventSchemaType;
  numAttendants?: NumberOfAttendantsType;
  numInterested?: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};


export default function OpenedEvent({
  event,
  numAttendants,
  numInterested,
  name,
  slug,
}: OpenedEventProps): JSX.Element {
  const thumbnail = event.img;
  const startTime = toMonthDayYearHour(event.starts_at);
  const isCurrent = isFutureOrNow(new Date(event.starts_at));
  return (
    <FadeInOutBox>
      <Stack sx={openedEventHeroSx} spacing={1}>
        <GroupName slug={slug} name={name} />

        <EventTitle title={event.title} />

        <OpenedEventImage thumbnail={thumbnail} />

        <EventMeta startTime={startTime} location={event.meeting_location} />

        <EventDescription description={event.description} />

        {numAttendants && event.status === "scheduled" && (
          <EventAttendants
            numAttendants={numAttendants}
            numInterested={numInterested}
            isCurrent={isCurrent}
          />
        )}
      </Stack>
    </FadeInOutBox>
  );
}
