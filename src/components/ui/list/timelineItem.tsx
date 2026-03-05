import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListItemText from "@mui/material/ListItemText";
import { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

type TimelineItemProps = {
  historyLog: EventSchemaType;
};

export default function TimelineItem({
  historyLog,
}: TimelineItemProps): JSX.Element {
  const date = new Date(historyLog.starts_at);
  const current = isFutureOrNow(date);

  return (
    <ListItem
      sx={{
        opacity: current ? 1 : 0.72,
        border: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 2,
        m: 1,
        cursor: "pointer",
           transition: 'transform 0.2s ease-in-out', 
        "&:hover": {
          transform: "scale(1.015)",
        },
      }}
    >
      <ListItemIcon>
        <EventRoundedIcon />
      </ListItemIcon>
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
