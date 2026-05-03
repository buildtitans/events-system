"use client";
import { JSX } from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";
import { CalendarLookup } from "@/src/lib/hooks/hydration/useHydrateCalandar";
import { checkCalandarDay } from "@/src/lib/utils/dates/checkCalandarDay";
import {
  getGroupCalendarDayBadgeSx,
  getGroupCalendarDaySx,
} from "@/src/styles/sx/groupCalendar";

export type DayScheduledProps = PickersDayProps & {
  scheduledDateKeys?: CalendarLookup;
};

export default function DayScheduled(
  props: DayScheduledProps,
): JSX.Element {
  const { scheduledDateKeys, day, outsideCurrentMonth, ...rest } = props;
  const hasScheduledEvent = checkCalandarDay({
    scheduledDateKeys,
    outsideCurrentMonth,
    day,
  });
  const isPast = day.isBefore(dayjs(), "day");
  const badgeState = isPast ? "past" : "upcoming";

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      invisible={!hasScheduledEvent}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={getGroupCalendarDayBadgeSx(badgeState)}
      badgeContent={<span />}
    >
      <PickersDay
        {...rest}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={getGroupCalendarDaySx(
          hasScheduledEvent,
          isPast,
          Boolean(outsideCurrentMonth),
        )}
      />
    </Badge>
  );
}
