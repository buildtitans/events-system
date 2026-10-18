"use client";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { createArchivedEventHeadcount } from "@/src/lib/utils/helpers/messages/createAttendanceMessage";
import ArchivedEvent from "@/src/client/components/ui/list/archive/archivedEvent";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import { useCallback } from "react";
import { ArchivedEventSchemaType } from "@/src/schemas/groups/groupSchema";

type HistoryTimelineProps = {
  archivedEvents: ArchivedEventSchemaType[];
  isMobile: boolean;
};

export default function Archives({
  archivedEvents,
  isMobile,
}: HistoryTimelineProps) {
  const { handleOpenEvent } = useSelectEvent();
  const attendance = useSelector((s: RootState) => s.viewer.viewerAttendance);

  const openArchivedEvent = useCallback(
    async (event_id: EventSchemaType["id"]) => {
      await handleOpenEvent(event_id);
    },
    [handleOpenEvent],
  );

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
        {archivedEvents.map((archive) => {
          const attending =
            archive.attendance.interested + archive.attendance.going;

          return (
            <ArchivedEvent
              isMobile={isMobile}
              archivedEvent={archive.event}
              key={archive.event.id}
              rsvpStatus={attendance[archive.event.id]}
              attendanceRecord={createArchivedEventHeadcount(attending)}
              openArchivedEvent={openArchivedEvent}
            />
          );
        })}
      </List>
    </Container>
  );
}
