import ListItem from "@mui/material/ListItem";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ListItemText from "@mui/material/ListItemText";
import type { JSX } from "react";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { limitDescription } from "@/src/lib/utils/rendering/limitDescription";

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

  return (
    <ListItem
      sx={{
        position: "relative",
        width: "100%",
        p: 1.5,
        my: 2,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: "rgba(255, 255, 255, 0.1)",
        transition: "transform 0.2s ease-in-out",
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.11)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        sx={{
          width: "100%",
          pr: {
            xs: "112px",
            md: "144px",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flex: 1,
            minWidth: 0,
            gap: 1,
          }}
        >
          <ListItemText
            sx={{ m: 0 }}
            slotProps={{
              primary: {
                sx: {
                  fontSize: {
                    xs: "12px",
                    md: "22px",
                  },
                },
              },
            }}
            primary={historyLog.title}
          />

          <ListItemText
            sx={{ m: 0 }}
            slotProps={{
              primary: {
                sx: {
                  fontSize: {
                    xs: "11.5px",
                    md: "18px",
                  },
                  color: "rgba(255, 255, 255, 0.8)",
                  textWrap: "wrap",
                },
              },
            }}
            primary={isMobile ? description : historyLog.description}
          />

          <ListItemText
            sx={{ m: 0 }}
            slotProps={{
              secondary: {
                sx: {
                  fontSize: {
                    xs: "12px",
                    md: "18px",
                  },
                  color: "rgba(255, 255, 255, 0.6)",
                },
              },
            }}
            secondary={toMonthDayYearHour(historyLog.starts_at)}
          />
        </Box>
      </Stack>
      <Stack
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bottom: 12,
          minWidth: "fit-content",
        }}
      >
        <Chip
          size="small"
          variant="filled"
          color={current ? "default" : "warning"}
          label={current ? "Upcoming" : "Past"}
          icon={current ? <EventRoundedIcon /> : <EventBusyIcon />}
        />
        <Box
          sx={{
            fontSize: {
              xs: "11px",
              md: "14px",
            },
            textAlign: "right",
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: 1.3,
          }}
        >
          {attendanceRecord}
        </Box>
      </Stack>
    </ListItem>
  );
}
