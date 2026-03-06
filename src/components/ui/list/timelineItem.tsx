import ListItem from "@mui/material/ListItem";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ListItemText from "@mui/material/ListItemText";
import { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


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

  console.log({
    "Current": current,
    "RSVP Status": rsvpStatus
  })  

  return (
    <ListItem
      sx={{
        opacity: current ? 1 : 0.62,
        height: "120px",
        width: "100%",
        border: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 2,
        marginY: 2,
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.015)",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar 
        sx={{
          bgcolor: 'white'
        }}
        >
          {(!current) && <EventBusyIcon />}
          {(current) && (rsvpStatus !== "going") && <EventRoundedIcon />}
          {(current) && (rsvpStatus === "going") && <CheckCircleOutlineIcon/>}
        </Avatar>
      </ListItemAvatar>

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
    </ListItem>
  );
}
