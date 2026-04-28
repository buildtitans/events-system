import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { JSX } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import {
  eventCardFooterClusterSx,
  eventCardFooterSx,
  eventCardFooterTextSx,
  getEventCardFooterIconSx,
} from "@/src/styles/sx/eventCard";

type CardFooterProps = {
  location?: EventSchemaType["meeting_location"] | GroupSchemaType["location"];
  scheduled_at?: EventSchemaType["starts_at"];
  groupName?: GroupSchemaType["name"];
  isFutureDateOrNow: boolean | undefined;
};

function CardFooter({
  scheduled_at,
  location,
  groupName,
  isFutureDateOrNow,
}: CardFooterProps): JSX.Element | null {

  return (
    <Box sx={eventCardFooterSx}>
      {location && (
        <Box sx={eventCardFooterClusterSx}>
          <LocationOnIcon sx={getEventCardFooterIconSx()} />
          <Typography variant="caption" sx={eventCardFooterTextSx}>
            {location}
          </Typography>
        </Box>
      )}

      {groupName && (
        <Box sx={eventCardFooterClusterSx}>
          <GroupsIcon sx={getEventCardFooterIconSx()} />
          <Typography variant="caption" sx={eventCardFooterTextSx}>
            {groupName}
          </Typography>
        </Box>
      )}
      <Box sx={eventCardFooterClusterSx}>
        <RenderScheduleIcon
          isFutureDateOrNow={isFutureDateOrNow}
          scheduled_at={scheduled_at}
        />
        <Typography variant="caption" sx={eventCardFooterTextSx}>
          {scheduled_at}
        </Typography>
      </Box>
    </Box>
  );
}

export { CardFooter };

function RenderScheduleIcon({
  scheduled_at,
  isFutureDateOrNow,
}: {
  isFutureDateOrNow: boolean | undefined;
  scheduled_at?: string | undefined;
}) {
  switch (scheduled_at) {
    case undefined: {
      return null;
    }

    default: {
      if (isFutureDateOrNow) {
        return <EventAvailableIcon sx={getEventCardFooterIconSx(true)} />;
      } else {
        return <HistoryIcon sx={getEventCardFooterIconSx()} />;
      }
    }
  }
}
