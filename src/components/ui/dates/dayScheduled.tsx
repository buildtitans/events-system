"use client";
import { JSX } from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from '@mui/icons-material/History';
import dayjs from "dayjs";
import { CalendarLookup } from "@/src/lib/hooks/hydration/useHydrateCalandar";
import { checkCalandarDay } from "@/src/lib/utils/dates/checkCalandarDay";

export type DayScheduledProps = PickersDayProps & {
  scheduledDateKeys?: CalendarLookup;
};

export default function DayScheduled(
  props: DayScheduledProps,
): JSX.Element {
  const { scheduledDateKeys, day, outsideCurrentMonth, ...rest } = props;
  const isSelected = checkCalandarDay({scheduledDateKeys, outsideCurrentMonth, day});
  const isPast = day.isBefore(dayjs(), "day");

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={
        (isSelected && !isPast) ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (isSelected && isPast) ? <HistoryIcon color="warning" fontSize="small" /> : undefined
      }
    >
      <PickersDay
        {...rest}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}
