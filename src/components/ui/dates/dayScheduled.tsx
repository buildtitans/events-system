"use client";
import { JSX } from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function DayScheduled(
  props: PickersDayProps & { scheduledDateKeys?: Set<string> },
): JSX.Element {
  const { scheduledDateKeys, day, outsideCurrentMonth, ...rest } = props;

  const isSelected =
    !outsideCurrentMonth && !!scheduledDateKeys?.has(day.format("YYYY-MM-DD"));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : undefined
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
