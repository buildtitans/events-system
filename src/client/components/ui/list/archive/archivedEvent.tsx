import type { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import ListItem from "@mui/material/ListItem";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { limitDescription } from "@/src/lib/utils/rendering/limitDescription";
import {
  
} from "@/src/client/styles/sx/groupHistoryListItem";
import {
  archivedEventActionsRowSx,
  getArchivedEventStatusChipSx,
  archivedEventActionsWrapSx,
  archivedEventListItemSx,
  archivedEventLayoutSx,
  archivedEventPrimaryColumnSx,
  archivedEventDescriptionSx,
  archivedEventMetaRowSx,
  archivedEventTitleSx,
  archivedEventTitleWrapSx,
  archivedEventTopRowSx,
  archivedEventAttendanceLabelSx,
  archivedEventAttendanceTextSx,
  archivedEventEditButtonSx,
  getArchivedEventMetaChipSx,
  getArchivedEventMetaIconSx
} from "@/src/client/styles/sx/archivedEventSx";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type TimelineItemProps = {
  archivedEvent: EventSchemaType;
  rsvpStatus: EventAttendantsSchemaType["status"];
  isMobile: boolean;
  attendanceRecord: string;
  openArchivedEvent: (event_id: EventSchemaType["id"]) => Promise<void>;
};

export default function ArchivedEvent({
  archivedEvent,
  isMobile,
  attendanceRecord,
  openArchivedEvent,
}: TimelineItemProps): JSX.Element {
  const date = new Date(archivedEvent.starts_at);
  const current = isFutureOrNow(date);
  const description = limitDescription(archivedEvent.description, 80);
  const statusState = current ? "upcoming" : "past";
  const statusLabel = current ? "Upcoming" : "Past";

  return (
    <ListItem disablePadding sx={archivedEventListItemSx}>
      <Stack sx={archivedEventLayoutSx}>
        <Stack sx={archivedEventPrimaryColumnSx}>
          <Box sx={archivedEventTopRowSx}>
            <Box sx={archivedEventTitleWrapSx}>
              <Typography variant="h6" sx={archivedEventTitleSx}>
                {archivedEvent.title}
              </Typography>
            </Box>
          </Box>

          <Typography sx={archivedEventDescriptionSx}>
            {isMobile ? description : archivedEvent.description}
          </Typography>

          <Stack direction="row" sx={archivedEventMetaRowSx}>
            <Box sx={getArchivedEventMetaChipSx(true)}>
              <EventRoundedIcon sx={getArchivedEventMetaIconSx(true)} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {toMonthDayYearHour(archivedEvent.starts_at)}
              </Typography>
            </Box>

            {archivedEvent.meeting_location && (
              <Box sx={getArchivedEventMetaChipSx()}>
                <LocationOnRoundedIcon sx={getArchivedEventMetaIconSx()} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {archivedEvent.meeting_location}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>

        <Stack sx={archivedEventActionsWrapSx}>
          <Box sx={archivedEventActionsRowSx}>
            <Chip
              label={statusLabel}
              variant="filled"
              size="small"
              sx={getArchivedEventStatusChipSx(statusState)}
            />
            <IconButton
              aria-label="Edit RSVP status"
              onClick={() => openArchivedEvent(archivedEvent.id)}
              sx={archivedEventEditButtonSx}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Stack sx={archivedEventActionsWrapSx}>
            <Typography
              variant="caption"
              sx={archivedEventAttendanceLabelSx}
            ></Typography>
            <Box sx={archivedEventAttendanceTextSx}>{attendanceRecord}</Box>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
}
