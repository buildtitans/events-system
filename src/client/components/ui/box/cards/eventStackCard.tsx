"use client";
import type { EventCardProps } from "./eventHeroCard";
import type { EventDiscoverySummarySchemaType } from "@/src/schemas/events/eventSchema";
import React, { useMemo } from "react";
import Typography from "@mui/material/Typography";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import { CardFooter } from "@/src/client/components/ui/box/cards/cardFooter";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
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
  event: EventDiscoverySummarySchemaType["event"];
  meta: EventDiscoverySummarySchemaType["meta"];
  handleOpenEvent: (
    event_id: EventDiscoverySummarySchemaType["event"]["id"],
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
            {meta.group_name}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={eventCardTitleSx}
          >
            {event.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.75,
              mt: "auto",
              pt: 1,
            }}
          >
            <GroupsRoundedIcon sx={{ fontSize: "1rem", color: "#7cc6ff" }} />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.84)", fontWeight: 600 }}
            >
              {meta.attendance.going} going
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.48)" }}
            >
              · {meta.attendance.interested} interested
            </Typography>
          </Box>
        </Box>
      </StyledCardContent>
      <CardFooter
        isFutureDateOrNow={isFutureDateOrNow}
        location={meta.group_location}
        scheduled_at={scheduled_at}
      />
    </StyledCard>
  );
}

export default React.memo(EventStackCard);
