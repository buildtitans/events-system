"use client";
import { JSX } from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import { CalendarLookup } from "@/src/lib/hooks/hydration/group/useHydrateCalandar";
import {
  getGroupCalendarDayBadgeSx,
  getGroupCalendarDaySx,
} from "@/src/client/styles/sx/groupCalendar";

export type DayScheduledProps = PickersDayProps & {
  scheduledDateKeys?: CalendarLookup;
};

export default function DayScheduled(props: DayScheduledProps): JSX.Element {
  const { scheduledDateKeys, day, outsideCurrentMonth, ...rest } = props;
  const item = scheduledDateKeys?.get(day.format("YYYY-MM-DD"));
  const badgeState =
    item?.timeline_status === "today"
      ? item.event_phase
      : item?.timeline_status;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      invisible={outsideCurrentMonth || !item}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={getGroupCalendarDayBadgeSx(badgeState)}
      badgeContent={<span />}
    >
      <PickersDay
        {...rest}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={getGroupCalendarDaySx(badgeState, Boolean(outsideCurrentMonth))}
      />
    </Badge>
  );
}
