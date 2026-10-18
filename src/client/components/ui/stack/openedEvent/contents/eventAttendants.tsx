"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  openedEventAttendancePanelSx,
  openedEventAttendancePrimarySx,
  openedEventAttendanceSecondarySx,
  openedEventSectionLabelSx,
} from "@/src/client/styles/sx/openedEventDrawer";

export default function EventAttendants({
  attendance: { going, interested },
  isCurrent,
}: {
  attendance: HydratedEventSchemaType["meta"]["event"]["attendants"];
  isCurrent: boolean;
}) {
  const attendanceMessage =
    going === 0
      ? isCurrent
        ? "Nobody is attending yet"
        : "This event had no attendants"
      : `${going} ${going === 1 ? "person" : "people"} ${
          isCurrent ? (going === 1 ? "is going" : "are going") : "went"
        }`;

  return (
    <Box sx={openedEventAttendancePanelSx}>
      <Typography component="span" sx={openedEventSectionLabelSx}>
        Attendance
      </Typography>
      <Typography sx={openedEventAttendancePrimarySx}>
        {attendanceMessage}
      </Typography>
      {isCurrent && interested > 0 && (
        <Typography sx={openedEventAttendanceSecondarySx}>
          {interested === 1
            ? "1 person is interested"
            : `${interested} people have expressed interest`}
        </Typography>
      )}
    </Box>
  );
}
