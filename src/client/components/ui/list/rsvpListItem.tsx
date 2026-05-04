"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import EditIcon from "@mui/icons-material/Edit";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import IconButton from "@mui/material/IconButton";
import {
  getRsvpAttendanceChipSx,
  getRsvpMetaChipSx,
  getRsvpMetaIconSx,
  rsvpActionLabelSx,
  rsvpActionsRowSx,
  rsvpActionsWrapSx,
  rsvpEditButtonSx,
  rsvpEventTitleSx,
  rsvpGroupChipSx,
  rsvpListItemLayoutSx,
  rsvpListItemSx,
  rsvpMetaRowSx,
  rsvpPrimaryColumnSx,
  rsvpScheduledChipSx,
  rsvpTopRowSx,
} from "@/src/client/styles/sx/rsvpListItem";

type RsvpListItemProps = {
  rsvp: RsvpSchemaType;
  handleOpenEditStatus: (event_id: EventSchemaType["id"]) => Promise<void>;
  handleNavigateToGroup: (slug: RsvpSchemaType["group_slug"]) => void;
};

export default function RsvpListItem({
  rsvp,
  handleOpenEditStatus,
  handleNavigateToGroup,
}: RsvpListItemProps): JSX.Element {
  const attendanceLabel = formatAttendanceStatus(rsvp.attendance_status);

  return (
    <ListItem component="li" disablePadding sx={rsvpListItemSx}>
      <Stack sx={rsvpListItemLayoutSx}>
        <Stack sx={rsvpPrimaryColumnSx}>
          <Box sx={rsvpTopRowSx}>
            <Chip
              clickable
              component="div"
              onClick={() => handleNavigateToGroup(rsvp.group_slug)}
              size="small"
              label={rsvp.group_name}
              sx={rsvpGroupChipSx}
              icon={<GroupRoundedIcon fontSize="small" />}
            />

            {rsvp.scheduled_status === "cancelled" && (
              <Chip
                size="small"
                label="Cancelled"
                sx={rsvpScheduledChipSx}
                icon={<EventBusyIcon fontSize="small" />}
              />
            )}
          </Box>

          <Typography variant="h6" sx={rsvpEventTitleSx}>
            {rsvp.event_title}
          </Typography>

          <Stack direction="row" sx={rsvpMetaRowSx}>
            <Box sx={getRsvpMetaChipSx(true)}>
              <EventRoundedIcon sx={getRsvpMetaIconSx(true)} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {toMonthDayYearHour(rsvp.starts_at)}
              </Typography>
            </Box>

            {rsvp.location && (
              <Box sx={getRsvpMetaChipSx()}>
                <LocationOnRoundedIcon sx={getRsvpMetaIconSx()} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {rsvp.location}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>

        <Stack sx={rsvpActionsWrapSx}>
          <Typography variant="caption" sx={rsvpActionLabelSx}>
            Your RSVP
          </Typography>
          <Box sx={rsvpActionsRowSx}>
            <Chip
              label={attendanceLabel}
              variant="filled"
              size="small"
              sx={getRsvpAttendanceChipSx(rsvp.attendance_status)}
            />
            <IconButton
              aria-label="Edit RSVP status"
              onClick={() => handleOpenEditStatus(rsvp.event_id)}
              sx={rsvpEditButtonSx}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </ListItem>
  );
}

function formatAttendanceStatus(status: RsvpSchemaType["attendance_status"]) {
  switch (status) {
    case "not_going":
      return "Not Going";
    case "interested":
      return "Interested";
    default:
      return "Going";
  }
}
