"use client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListItemText from "@mui/material/ListItemText";
import { JSX } from "react";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useHydrateGroupHisory } from "@/src/lib/hooks/hydration/useHydrateGroupHistory";
import { EventsArraySchemaType, EventSchemaType } from "@/src/schemas/events/eventSchema";
import Spinner, { RelativeSpinner } from "@/src/components/ui/feedback/pending/spinner";
import NoScheduledEvents from "@/src/components/ui/feedback/info/suggestScheduleEvent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function GroupHistory(): JSX.Element {
  useHydrateGroupHisory();
  const history = useSelector((s: RootState) => s.openGroup.history);

  switch(history.status) {

    case "initial":
    case "pending": {
      return <RelativeSpinner />
    }
    case "ready": {
      return <HistoryTimeline history={history.data} />
    } 
    case "failed": {
      return <NoScheduledEvents />
    }

    default: {
      <NoScheduledEvents />
    }
  }

  return <Spinner />
};

type HistoryTimelineProps = {
  history: EventsArraySchemaType
}

function HistoryTimeline({ history }: HistoryTimelineProps) {

  return (
    <Container sx={{
      minHeight: "600px",
      width: '100%',
      height: '100%'
    }}>
      <Stack>
        <Box>
          <Typography component={"h2"} >
            History 
          </Typography>
        </Box>
        <List >
        {history.map((log: EventSchemaType) => (
          <TimelineItem historyLog={log} key={log.id} />
        ))}
      </List>
      </Stack>
      
    </Container>
  )
}

type TimelineItemProps = {
  historyLog: EventSchemaType
}

function TimelineItem({ historyLog }: TimelineItemProps): JSX.Element {

    return (
  <ListItem>
    <ListItemIcon>
      <EventRoundedIcon />
    </ListItemIcon>

    <ListItemText
      sx={{
        fontSize: '18px'
      }}
      primary={historyLog.title}
      secondary={historyLog.description}
    />
  </ListItem>
    )   
};
