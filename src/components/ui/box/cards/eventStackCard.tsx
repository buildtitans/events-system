"use client";
import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import {
  StyledCard,
  StyledCardContent,
  StyledTypography,
} from "@/src/styles/styledComponents/styledCard";
import { CardFooter } from "@/src/components/ui/box/cards/cardFooter";
import { EventCardProps } from "./eventHeroCard";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import Box from "@mui/material/Box";
import EventCancelledOverlay from "../../feedback/info/eventCancelledOverlay";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import {
  eventCardContentSx,
  eventCardDescriptionSx,
  eventCardGroupLabelSx,
  eventCardRootSx,
  eventCardTitleSx,
} from "@/src/styles/sx/eventCard";

type EventStackCardProps = {
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
  event: EventCardProps["event"];
  groupName: string;
  handleOpenEvent: (event_id: EventSchemaType["id"]) => void;
};

function EventStackCard({
  handleBlur,
  handleFocus,
  focusedCardIndex,
  event,
  groupName,
  handleOpenEvent,
}: EventStackCardProps) {
  const date = new Date(event.starts_at);
  const isFutureDateOrNow = isFutureOrNow(date);
  const scheduled_at = useMemo(() => {
    return toMonthDayYearHour(event.starts_at);
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
            {groupName}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" sx={eventCardTitleSx}>
            {event.title}
          </Typography>
          <StyledTypography variant="body2" gutterBottom sx={eventCardDescriptionSx}>
            {event.description}
          </StyledTypography>
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

export { EventStackCard };
