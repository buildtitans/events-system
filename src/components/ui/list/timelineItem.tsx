import ListItem from "@mui/material/ListItem";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ListItemText from "@mui/material/ListItemText";
import { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";


type TimelineItemProps = {
  historyLog: EventSchemaType;
  rsvpStatus: EventAttendantsSchemaType["status"];
};

export default function TimelineItem({
  historyLog,
  rsvpStatus
}: TimelineItemProps): JSX.Element {
  
  const date = new Date(historyLog.starts_at);
  const current = isFutureOrNow(date);

  return (
    <ListItem
      sx={{
        height: "120px",
        width: "100%",
        borderRadius: 2,
        marginY: 2,
        cursor: "pointer",
                bgcolor: "rgba(255, 255, 255, 0.1)",
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.11)",
        },
        transition: "transform 0.2s ease-in-out",
        
      }}
    >
      <Stack
      direction={'row'}
      justifyContent={"space-between"}
      alignItems={"start"}
      sx={{
        width: "100%",
        height: "100%"
      }}
      >
<Box sx={{
  display:"flex",
  flexDirection: "row",
  alignItems: "center",

}} >
      
      <ListItemText
        slotProps={{
          primary: {
            sx: {
              fontSize: "22px",
            },
          },
          secondary: {
            sx: {
              fontSize: "20px",
            },
          },
        }}
        sx={{}}
        primary={historyLog.title}
        secondary={toMonthDayYearHour(historyLog.starts_at)}
      />
      </Box>
      <Box>
<ListItemText 
      primary={
        <Chip 
        size="small"
        color={(current) ? 'default' : 'warning'}
        label={(current) ? 'Upcoming' : 'Past'}
        icon={(current) ? <EventRoundedIcon /> : <EventBusyIcon />}
        />
      }
      />
      </Box>
      </Stack>
      
      
    </ListItem>
  );
}
