"use client";
import UpdateViewerAttendanceForm from "../forms/event/openedEventForm";
import { type JSX } from "react";
import { AnimatePresence } from "framer-motion";
import type { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import Box from "@mui/material/Box";
import { openedEventControlsSectionSx } from "@/src/client/styles/sx/openedEventDrawer";

type MembersOnlyAttendanceFormProps = {
  hydrated: HydratedEventSchemaType;
};

export default function MembersOnlyAttendanceForm({
  hydrated,
}: MembersOnlyAttendanceFormProps): JSX.Element | null {
  const isCurrent = isFutureOrNow(new Date(hydrated.event.starts_at));

  return (
    <AnimatePresence mode="wait">
      {isCurrent && hydrated.event.status === "scheduled" && (
        <Box sx={openedEventControlsSectionSx}>
          <UpdateViewerAttendanceForm
            key={"update-status-form"}
            currentStatus={hydrated.meta.user.status}
            event_id={hydrated.event.id}
          />
        </Box>
      )}
    </AnimatePresence>
  );
}
