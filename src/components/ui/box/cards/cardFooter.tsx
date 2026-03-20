import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { JSX } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";

type CardFooterProps = {
  location?: EventSchemaType["meeting_location"] | GroupSchemaType["location"];
  authors?: { name: string; avatar: string }[];
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      {location && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <LocationOnIcon fontSize="medium" />
          <Typography variant="caption">{location}</Typography>
        </Box>
      )}

      {groupName && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <GroupsIcon />
          <Typography variant="caption">{groupName}</Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <RenderScheduleIcon
          isFutureDateOrNow={isFutureDateOrNow}
          scheduled_at={scheduled_at}
        />
        <Typography variant="caption">{scheduled_at}</Typography>
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
        return <EventAvailableIcon />;
      } else {
        return <HistoryIcon />;
      }
    }
  }
}
