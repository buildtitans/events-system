"use client";
import type { EventCardProps } from "../cards/eventHeroCard";
import type {
  EventSchemaType,
  EventSurfaceSchemaType,
} from "@/src/schemas/events/eventSchema";
import { lazy, Suspense, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EventStackCardSkeleton from "@/src/client/components/ui/box/cards/skeletons/eventStackCardSkeleton";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import GroupEventStackCard from "../cards/groupEventStackCard";
const EventStackCard = lazy(
  () => import("@/src/client/components/ui/box/cards/eventStackCard"),
);

type EventStackSlotProps = {
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
  stack: EventSurfaceSchemaType[];
  handleOpenEvent: (event_id: EventSchemaType["id"]) => void;
};

function EventStackSlot({
  handleBlur,
  handleFocus,
  focusedCardIndex,
  stack,
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
        {stack.map((slot) => {
          switch (slot.for) {
            case "discovery": {
              return (
                <Suspense fallback={<EventStackCardSkeleton />}>
                  <EventStackCard
                    key={slot.content.event.id}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                    event={slot.content.event}
                    meta={slot.content.meta}
                    handleOpenEvent={handleOpenEvent}
                  />
                </Suspense>
              );
            }
            case "withinGroup": {
              return (
                <GroupEventStackCard
                  key={slot.content.event.id}
                  event={slot.content.event}
                  meta={slot.content.meta}
                  focusedCardIndex={focusedCardIndex}
                  handleOpenEvent={handleOpenEvent}
                  handleBlur={handleBlur}
                  handleFocus={handleFocus}
                />
              );
            }

            default: {
              return assertNever(slot);
            }
          }
        })}
      </Box>
    </Grid>
  );
}

export { EventStackSlot };
