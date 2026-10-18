"use client";
import Stack from "@mui/material/Stack";
import FadeInOutBox from "@/src/client/components/ui/box/motionboxes/fadeInOutBox";
import { type JSX } from "react";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import OpenedEventImage from "@/src/client/components/ui/box/cards/openedEventImage";

import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import EventAttendants from "@/src/client/components/ui/stack/openedEvent/contents/eventAttendants";
import EventTitle from "@/src/client/components/ui/stack/openedEvent/contents/eventTitle";
import GroupName from "@/src/client/components/ui/stack/openedEvent/contents/groupName";
import EventDescription from "@/src/client/components/ui/stack/openedEvent/contents/eventDescription";
import EventMeta from "@/src/client/components/ui/stack/openedEvent/contents/eventMeta";
import { openedEventHeroSx } from "@/src/client/styles/sx/openedEventDrawer";

type OpenedEventProps = {
  hydrated: HydratedEventSchemaType;
};

export default function OpenedEvent({
  hydrated,
}: OpenedEventProps): JSX.Element {
  const thumbnail = hydrated.event.img;
  const startTime = toMonthDayYearHour(hydrated.event.starts_at);
  const isCurrent = isFutureOrNow(new Date(hydrated.event.starts_at));
  return (
    <FadeInOutBox>
      <Stack sx={openedEventHeroSx} spacing={1}>
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

        <EventDescription description={hydrated.event.description} />

        {hydrated.event.status === "scheduled" && (
          <EventAttendants
            attendance={hydrated.meta.event.attendants}
            isCurrent={isCurrent}
          />
        )}
      </Stack>
    </FadeInOutBox>
  );
}
