"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { EventStackCard } from "../cards/eventStackCard";
import { EventCardProps } from "../cards/eventHeroCard";
import { NameSlugDescriptionLookup } from "@/src/lib/types/server/types";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";

type EventStackSlotProps = {
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
  events: EventCardProps["event"][];
  groupNameLookup: NameSlugDescriptionLookup ;
  handleOpenEvent: (event_id: EventSchemaType["id"]) => void;
  cardKind?: LayoutSlotSchemaType["kind"];
};

function EventStackSlot({
  handleBlur,
  handleFocus,
  focusedCardIndex,
  events,
  groupNameLookup,
  handleOpenEvent,
  cardKind
}: EventStackSlotProps): React.ReactNode {
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
          <EventStackCard
            key={event.id}
            groupName={groupNameLookup[event.group_id].name}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            focusedCardIndex={focusedCardIndex}
            event={event}
            handleOpenEvent={handleOpenEvent}
            cardKind={cardKind}
          />
        ))}
      </Box>
    </Grid>
  );
}

export { EventStackSlot };
