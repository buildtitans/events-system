
"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type {
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import {
  openedEventAttendancePanelSx,
  openedEventAttendancePrimarySx,
  openedEventAttendanceSecondarySx,
  openedEventSectionLabelSx,
} from "@/src/client/styles/sx/openedEventDrawer";

export default function EventAttendants({
  numAttendants,
  numInterested,
  isCurrent,
}: {
  numAttendants: NumberOfAttendantsType;
  isCurrent: boolean;
  numInterested?: NumberOfAttendantsType;
}) {
  return (
    <Box sx={openedEventAttendancePanelSx}>
      <Typography component="span" sx={openedEventSectionLabelSx}>
        Attendance
      </Typography>
      {isCurrent && (
        <>
          {numAttendants.status === "ready" && (
            <Typography sx={openedEventAttendancePrimarySx}>
              {numAttendants.data > 1 &&
                `${numAttendants.data} people are going`}
              {numAttendants.data === 1 &&
                `${numAttendants.data} person is going`}
              {numAttendants.data === 0 && "Nobody is attending yet"}
            </Typography>
          )}

          {numInterested && numInterested.status === "ready" && (
            <Typography sx={openedEventAttendanceSecondarySx}>
              {numInterested.data > 1 &&
                `${numInterested.data} people have expressed interest`}
              {numInterested.data === 1 &&
                `${numInterested.data} person is interested`}
            </Typography>
          )}
        </>
      )}

      {!isCurrent && numAttendants.status === "ready" && (
        <>
          <Typography sx={openedEventAttendancePrimarySx}>
            {numAttendants.data > 1 && `${numAttendants.data} people went`}
            {numAttendants.data === 1 && `${numAttendants.data} person went`}
            {numAttendants.data < 1 && "This event had no attendants"}
          </Typography>
        </>
      )}
    </Box>
  );
}