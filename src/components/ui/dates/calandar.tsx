"use client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import DayScheduled from "./dayScheduled";
import { JSX } from "react";
import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import { useHydrateCalendar } from "@/src/lib/hooks/hydration/useHydrateCalandar";

type CalandarProps = {
  history: EventsArraySchemaType;
};

export default function Calandar({ history }: CalandarProps): JSX.Element {
  const scheduledDateKeys = useHydrateCalendar(history);

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
