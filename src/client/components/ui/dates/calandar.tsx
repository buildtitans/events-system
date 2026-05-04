"use client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import DayScheduled from "./dayScheduled";
import { JSX } from "react";
import type { DayScheduledProps } from "./dayScheduled";
import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import { useHydrateCalendar } from "@/src/lib/hooks/hydration/useHydrateCalandar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  getGroupCalendarLegendDotSx,
  groupCalendarLegendItemSx,
  groupCalendarLegendSx,
  groupCalendarPickerSx,
  groupCalendarPickerWrapSx,
  groupCalendarRootSx,
  groupCalendarSurfaceSx,
} from "@/src/client/styles/sx/groupCalendar";

type CalandarProps = {
  history: EventsArraySchemaType;
};

export default function Calandar({ history }: CalandarProps): JSX.Element {
  const scheduledDateKeys = useHydrateCalendar(history);

  return (
    <Box sx={groupCalendarRootSx}>
      <Box sx={groupCalendarSurfaceSx}>
        <Box sx={groupCalendarPickerWrapSx}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              readOnly
              sx={groupCalendarPickerSx}
              slots={{
                day: DayScheduled,
              }}
              slotProps={{
                day: {
                  scheduledDateKeys,
                } as Partial<DayScheduledProps>,
              }}
            />
          </LocalizationProvider>
        </Box>
        <Stack direction="row" sx={groupCalendarLegendSx}>
          <Box sx={groupCalendarLegendItemSx}>
            <Box sx={getGroupCalendarLegendDotSx("upcoming")} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Upcoming event
            </Typography>
          </Box>
          <Box sx={groupCalendarLegendItemSx}>
            <Box sx={getGroupCalendarLegendDotSx("past")} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Past event
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
