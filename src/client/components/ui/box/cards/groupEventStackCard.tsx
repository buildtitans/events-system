"use client";
import type { EventCardProps } from "./eventHeroCard";
import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";
import React, { useMemo } from "react";
import Typography from "@mui/material/Typography";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import { CardFooter } from "@/src/client/components/ui/box/cards/cardFooter";
import Box from "@mui/material/Box";
import EventCancelledOverlay from "../../feedback/info/eventCancelledOverlay";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import {
  eventCardContentSx,
  eventCardGroupLabelSx,
  eventCardRootSx,
  eventCardTitleSx,
} from "@/src/client/styles/sx/eventCard";

type EventStackCardProps = {
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
  event: GroupEventSummarySchemaType["event"];
  meta: GroupEventSummarySchemaType["meta"];
  handleOpenEvent: (
    event_id: GroupEventSummarySchemaType["event"]["id"],
  ) => void;
};

function EventStackCard({
  handleBlur,
  handleFocus,
  focusedCardIndex,
  event,
  meta,
  handleOpenEvent,
}: EventStackCardProps) {
  const date = new Date(event.starts_at_ms);
  const isFutureDateOrNow = isFutureOrNow(date);
  const scheduled_at = useMemo(() => {
    return toMonthDayYearHour(event.starts_at_ms);
  }, [event]);

  return (
    <StyledCard
      variant="outlined"
      onClick={() => handleOpenEvent(event.id)}
      onFocus={() => handleFocus(3)}
      onBlur={handleBlur}
      tabIndex={0}
      className={focusedCardIndex === 3 ? "Mui-focused" : ""}
      sx={{ ...eventCardRootSx, height: "100%", position: "relative" }}
    >
      {event.status === "cancelled" && <EventCancelledOverlay />}
      <StyledCardContent
        sx={{
          ...eventCardContentSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "100%",
            width: "100%",
            opacity: event.status === "cancelled" ? 0.55 : 1,
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            component="div"
            sx={eventCardGroupLabelSx}
          >
            {meta.category_name}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={eventCardTitleSx}
          >
            {event.title}
          </Typography>
        </Box>
      </StyledCardContent>
      <CardFooter
        isFutureDateOrNow={isFutureDateOrNow}
        location={event.meeting_location}
        scheduled_at={scheduled_at}
      />
    </StyledCard>
  );
}

export default React.memo(EventStackCard);
