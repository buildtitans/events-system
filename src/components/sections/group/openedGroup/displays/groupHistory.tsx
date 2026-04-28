"use client";
import List from "@mui/material/List";
import TimelineItem from "@/src/components/ui/list/timelineItem";
import Container from "@mui/material/Container";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { createAttendanceMessage } from "@/src/lib/utils/helpers/messages/createAttendanceMessage";

type HistoryTimelineProps = {
  history: EventsArraySchemaType;
  isMobile: boolean;
};

export default function HistoryTimeline({
  history,
  isMobile,
}: HistoryTimelineProps) {
  const attendance = useSelector((s: RootState) => s.viewer.viewerAttendance);
  const pastEventsRecords = useSelector((s: RootState) => s.openGroup.attendanceHistoryLookup);

  return (
    <Container
      sx={{
        minHeight: "600px",
        width: "100%",
        height: "100%",
      }}
      disableGutters
    >
      <Typography
        component={"h2"}
        sx={{
          fontSize: "32px",
          fontWeight: "light",
        }}
      >
        History
      </Typography>

      <List
        component={"ul"}
        sx={{
          width: "100%",
        }}
      >
        {history.map((log: EventSchemaType) => {
          const numberAttended = pastEventsRecords[log.id];

          return (
            <TimelineItem
              isMobile={isMobile}
              historyLog={log}
              key={log.id}
              rsvpStatus={attendance[log.id]}
              attendanceRecord={createAttendanceMessage(numberAttended)}
            />
          );
        })}
      </List>
    </Container>
  );
}
