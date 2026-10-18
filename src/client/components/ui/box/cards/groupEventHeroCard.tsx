"use client";
import React, { useMemo } from "react";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import { CardFooter } from "@/src/client/components/ui/box/cards/cardFooter";
import type { JSX } from "react";
import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import {
  eventCardContentSx,
  eventCardGroupLabelSx,
  eventCardMediaOverlaySx,
  eventCardMediaSx,
  eventCardMediaWrapSx,
  eventCardRootSx,
  eventCardTitleSx,
} from "@/src/client/styles/sx/eventCard";

export type MobileEventCard = 12;

export type DesktopEventCard = 6 | 4;

export type EventCardSizes = {
  xs: MobileEventCard;
  md: DesktopEventCard;
};

export type CardType = "hero" | "thumbnail";

export type CardDesignation = {
  size: EventCardSizes;
  type: CardType;
};

export type EventCardProps = {
  handleFocus: (index: number) => void;
  handleBlur: () => void;
  focusedCardIndex: number | null;
  event: GroupEventSummarySchemaType["event"];
  eventMetaData: GroupEventSummarySchemaType["meta"];
  variant: CardDesignation;
  index: number;
  location: string;
  handleOpenEvent: (
    event_id: GroupEventSummarySchemaType["event"]["id"],
  ) => void;
};

function GroupEventHeroCard({
  handleFocus,
  handleBlur,
  focusedCardIndex,
  eventMetaData,
  event,
  variant,
  index,
  location,
  handleOpenEvent,
}: EventCardProps): JSX.Element {
  const scheduled_at = useMemo(() => {
    return toMonthDayYearHour(event.starts_at_ms);
  }, [event]);

  const date = new Date(event.starts_at_ms);
  const isFutureDateOrNow = isFutureOrNow(date);

  return (
    <Grid
      size={{
        xs: variant.size.xs,
        md: variant.size.md,
      }}
    >
      <StyledCard
        onClick={() => handleOpenEvent(event.id)}
        variant="outlined"
        onFocus={() => handleFocus(index)}
        onBlur={handleBlur}
        tabIndex={0}
        className={focusedCardIndex === 2 ? "Mui-focused" : ""}
        sx={{
          ...eventCardRootSx,
          height: "100%",
          opacity: event.status === "cancelled" ? "55%" : "100%",
        }}
      >
        <Box sx={eventCardMediaWrapSx}>
          <CardMedia
            component="img"
            alt="green iguana"
            loading="lazy"
            decoding="async"
            image={event.img ?? undefined}
            sx={{
              ...eventCardMediaSx,
              filter: event.status === "cancelled" ? "grayscale(40%)" : "none",
            }}
          />
          <Box sx={eventCardMediaOverlaySx} />
        </Box>

        <StyledCardContent sx={eventCardContentSx}>
          {
            <Typography
              gutterBottom
              variant="caption"
              component="div"
              sx={eventCardGroupLabelSx}
            >
              {eventMetaData.category_name}
            </Typography>
          }
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={eventCardTitleSx}
          >
            {event.title}
          </Typography>
        </StyledCardContent>
        <CardFooter
          isFutureDateOrNow={isFutureDateOrNow}
          scheduled_at={scheduled_at}
          location={location}
        />
      </StyledCard>
    </Grid>
  );
}

export default React.memo(GroupEventHeroCard);
