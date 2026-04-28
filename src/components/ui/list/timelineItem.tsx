import ListItem from "@mui/material/ListItem";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import type { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { limitDescription } from "@/src/lib/utils/rendering/limitDescription";
import Typography from "@mui/material/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import {
  getGroupHistoryMetaChipSx,
  getGroupHistoryMetaIconSx,
  getGroupHistoryStatusChipSx,
  groupHistoryActionsWrapSx,
  groupHistoryAttendanceLabelSx,
  groupHistoryAttendanceTextSx,
  groupHistoryDescriptionSx,
  groupHistoryItemLayoutSx,
  groupHistoryListItemSx,
  groupHistoryMetaRowSx,
  groupHistoryPrimaryColumnSx,
  groupHistoryTitleSx,
  groupHistoryTitleWrapSx,
  groupHistoryTopRowSx,
} from "@/src/styles/sx/groupHistoryListItem";

type TimelineItemProps = {
  historyLog: EventSchemaType;
  rsvpStatus: EventAttendantsSchemaType["status"];
  isMobile: boolean;
  attendanceRecord: string;
};

export default function TimelineItem({
  historyLog,
  isMobile,
  attendanceRecord,
}: TimelineItemProps): JSX.Element {
  const date = new Date(historyLog.starts_at);
  const current = isFutureOrNow(date);
  const description = limitDescription(historyLog.description, 80);
  const statusState = current ? "upcoming" : "past";
  const statusLabel = current ? "Upcoming" : "Past";

  return (
    <ListItem disablePadding sx={groupHistoryListItemSx}>
      <Stack sx={groupHistoryItemLayoutSx}>
        <Stack sx={groupHistoryPrimaryColumnSx}>
          <Box sx={groupHistoryTopRowSx}>
            <Box sx={groupHistoryTitleWrapSx}>
              <Typography variant="h6" sx={groupHistoryTitleSx}>
                {historyLog.title}
              </Typography>
            </Box>

            <Chip
              size="small"
              variant="filled"
              label={statusLabel}
              sx={getGroupHistoryStatusChipSx(statusState)}
              icon={
                current ? (
                  <EventAvailableRoundedIcon fontSize="small" />
                ) : (
                  <EventBusyIcon fontSize="small" />
                )
              }
            />
          </Box>

          <Typography sx={groupHistoryDescriptionSx}>
            {isMobile ? description : historyLog.description}
          </Typography>

          <Stack direction="row" sx={groupHistoryMetaRowSx}>
            <Box sx={getGroupHistoryMetaChipSx(true)}>
              <EventRoundedIcon sx={getGroupHistoryMetaIconSx(true)} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {toMonthDayYearHour(historyLog.starts_at)}
              </Typography>
            </Box>

            {historyLog.meeting_location && (
              <Box sx={getGroupHistoryMetaChipSx()}>
                <LocationOnRoundedIcon sx={getGroupHistoryMetaIconSx()} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {historyLog.meeting_location}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>

        <Stack sx={groupHistoryActionsWrapSx}>
          <Typography variant="caption" sx={groupHistoryAttendanceLabelSx}>
            Attendance
          </Typography>
          <Box sx={groupHistoryAttendanceTextSx}>{attendanceRecord}</Box>
        </Stack>
      </Stack>
    </ListItem>
  );
}
