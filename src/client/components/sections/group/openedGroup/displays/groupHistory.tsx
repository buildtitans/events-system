"use client";
import List from "@mui/material/List";
import TimelineItem from "@/src/client/components/ui/list/history/timelineItem";
import Container from "@mui/material/Container";
import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";
import { createAttendanceMessage } from "@/src/lib/utils/helpers/messages/createAttendanceMessage";

type HistoryTimelineProps = {
  history: GroupEventSummarySchemaType[];
};

export default function HistoryTimeline({ history }: HistoryTimelineProps) {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
      }}
      disableGutters
    >
      <List
        component="ul"
        sx={{
          width: "100%",
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {history.map((log: GroupEventSummarySchemaType) => {
          const headcount = log.meta.attendance.going;

          return (
            <TimelineItem
              historyLog={log.event}
              key={log.event.id}
              attendanceRecord={createAttendanceMessage(headcount)}
            />
          );
        })}
      </List>
    </Container>
  );
}
