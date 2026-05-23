"use client";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { createArchivedEventHeadcount } from "@/src/lib/utils/helpers/messages/createAttendanceMessage";
import ArchivedEvent from "@/src/client/components/ui/list/archive/archivedEvent";
import { useHydrateEventDrawerFromRsvp } from "@/src/lib/hooks/hydration/event/useHydrateEventDrawerFromRsvp";
import { useCallback } from "react";


type HistoryTimelineProps = {
  archivedEvents: EventsArraySchemaType;
  isMobile: boolean;
};

export default function Archives({
  archivedEvents,
  isMobile,
}: HistoryTimelineProps) {
  const { handleOpenEditStatus } = useHydrateEventDrawerFromRsvp();
  const attendance = useSelector((s: RootState) => s.viewer.viewerAttendance);
  const archivedRecords = useSelector(
    (s: RootState) => s.openGroup.attendanceHistoryLookup,
  );

  const openArchivedEvent = useCallback(async (event_id: EventSchemaType["id"]) => {
      await handleOpenEditStatus(event_id);
  }, []);

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
        {archivedEvents.map((archive: EventSchemaType) => {
          const numberMarkedAttending = archivedRecords[archive.id];

          return (
            <ArchivedEvent
              isMobile={isMobile}
              archivedEvent={archive}
              key={archive.id}
              rsvpStatus={attendance[archive.id]}
              attendanceRecord={createArchivedEventHeadcount(numberMarkedAttending)}
              openArchivedEvent={openArchivedEvent}
            />
          );
        })}
      </List>
    </Container>
  );
}
