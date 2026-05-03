"use client";
import UpdateViewerAttendanceForm from "../forms/event/openedEventForm";
import { type JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import Box from "@mui/material/Box";
import { openedEventControlsSectionSx } from "@/src/styles/sx/openedEventDrawer";

type MembersOnlyAttendanceFormProps = {
  scheduleStatus: EventSchemaType["status"];
  role: GroupMemberSchemaType["role"];
};

export default function MembersOnlyAttendanceForm({
  scheduleStatus,
}: MembersOnlyAttendanceFormProps): JSX.Element | null {
  const event = useSelector((s: RootState) => s.eventDrawer.event);
  const attendanceStatus = useSelector(
    (s: RootState) => s.eventDrawer.viewerAttendanceStatus,
  );
  const isCurrent =
    event.status === "ready" && isFutureOrNow(new Date(event.data.starts_at));

  return (
    <AnimatePresence mode="wait">
      {attendanceStatus &&
        isCurrent &&
        event.status === "ready" &&
        scheduleStatus === "scheduled" && (
          <Box sx={openedEventControlsSectionSx}>
            <UpdateViewerAttendanceForm
              key={"update-status-form"}
              currentStatus={attendanceStatus}
              event_id={event.data.id}
            />
          </Box>
        )}
    </AnimatePresence>
  );
}
