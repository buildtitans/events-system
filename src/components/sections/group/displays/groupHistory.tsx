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

type HistoryTimelineProps = {
  history: EventsArraySchemaType;
};

export default function HistoryTimeline({ history }: HistoryTimelineProps) {
  const attendance = useSelector((s: RootState) => s.groupMembers.viewerAttendance);

  return (
    <Container
      sx={{
        minHeight: "600px",
        width: "100%",
        height: "100%",
      }}
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
          width: '100%'
        }}
        >
          {history.map((log: EventSchemaType) => { 
            
            return (
            <TimelineItem historyLog={log} key={log.id} rsvpStatus={attendance[log.id]}/>
          )})}
        </List>
    </Container>
  );
}
