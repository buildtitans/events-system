"use client";
import List from "@mui/material/List";
import TimelineItem from "@/src/components/ui/list/timelineItem";
import Container from "@mui/material/Container";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type HistoryTimelineProps = {
  history: EventsArraySchemaType;
};

export default function HistoryTimeline({ history }: HistoryTimelineProps) {
  return (
    <Container
      sx={{
        minHeight: "600px",
        width: "100%",
        height: "100%",
      }}
    >
      <Stack gap={2}>
        <Box>
          <Typography component={"h2"} sx={{ fontSize: "32px", fontWeight: "light"}}>History</Typography>
        </Box>
        <List
        
        >
          {history.map((log: EventSchemaType) => (
            <TimelineItem historyLog={log} key={log.id} />
          ))}
        </List>
      </Stack>
    </Container>
  );
}
