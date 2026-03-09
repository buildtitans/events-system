"use client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useHydrateCalendar } from "@/src/lib/hooks/hydration/useHydrateCalandar";

type CalandarProps = {
  history: EventsArraySchemaType;
};

export default function Calandar({ history }: CalandarProps): JSX.Element {
    const scheduledDateKeys = useHydrateCalendar(history);

    console.log({
        "Scheduled   Day Keys": scheduledDateKeys
    })

  return (
    <Box
      sx={{
        width: "500px",
        height: "500px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
       <DateCalendar
  readOnly
  sx={{
    backgroundColor: "#373737",
    borderRadius: 3,
    width: "100%",
    height: "100%",
  }}
  slots={{
    day: DayScheduled,
  }}
  slotProps={{
    day: {
      scheduledDateKeys,
    } as any,
  }}
/>
      </LocalizationProvider>
    </Box>
  );
}
function DayScheduled(
  props: PickersDayProps & { scheduledDateKeys?: Set<string> }
): JSX.Element {
  const { scheduledDateKeys, day, outsideCurrentMonth, ...rest } = props;

  const isSelected =
    !outsideCurrentMonth &&
    !!scheduledDateKeys?.has(day.format("YYYY-MM-DD"));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <CheckCircleIcon color="success" fontSize="small" /> : undefined}
    >
      <PickersDay
        {...rest}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}