"use client";
import type { EventCardProps } from "../cards/eventHeroCard";
import type { NameSlugDescriptionLookup } from "@/src/lib/types/server/types";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { lazy, Suspense, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EventStackCardSkeleton from "@/src/client/components/ui/box/cards/skeletons/eventStackCardSkeleton";
const EventStackCard = lazy(
  () => import("@/src/client/components/ui/box/cards/eventStackCard"),
);

type EventStackSlotProps = {
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
  events: EventCardProps["event"][];
  groupNameLookup: NameSlugDescriptionLookup;
  handleOpenEvent: (event_id: EventSchemaType["id"]) => void;
};

function EventStackSlot({
  handleBlur,
  handleFocus,
  focusedCardIndex,
  events,
  groupNameLookup,
  handleOpenEvent,
}: EventStackSlotProps): ReactNode {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        {" "}
        {events.map((event) => (
          <Suspense key={event.id} fallback={<EventStackCardSkeleton />}>
            <EventStackCard
              groupName={groupNameLookup[event.group_id].name}
              handleBlur={handleBlur}
              handleFocus={handleFocus}
              focusedCardIndex={focusedCardIndex}
              event={event}
              handleOpenEvent={handleOpenEvent}
            />
          </Suspense>
        ))}
      </Box>
    </Grid>
  );
}

export { EventStackSlot };
