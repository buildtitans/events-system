"use client";
import React, { useMemo } from "react";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import { CardFooter } from "@/src/client/components/ui/box/cards/cardFooter";
import type { JSX } from "react";
import type {
  EventDiscoverySummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import {
  eventCardContentSx,
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
  summary: EventDiscoverySummarySchemaType;
  variant: CardDesignation;
  index: number;
  handleOpenEvent: (
    event_id: EventDiscoverySummarySchemaType["event"]["id"],
  ) => void;
};

function EventHeroCard({
  handleFocus,
  handleBlur,
  focusedCardIndex,
  summary,
  variant,
  index,
  handleOpenEvent,
}: EventCardProps): JSX.Element {
  const { event, meta } = summary;
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
        className={focusedCardIndex === index ? "Mui-focused" : ""}
        sx={{
          ...eventCardRootSx,
          height: "100%",
          opacity: event.status === "cancelled" ? "55%" : "100%",
        }}
      >
        <Box sx={eventCardMediaWrapSx}>
          <CardMedia
            component="img"
            alt={event.title}
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

        <StyledCardContent
          sx={{
            ...eventCardContentSx,
            p: { xs: 2, sm: 2.5 },
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: "#9acff5", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", lineHeight: 1.5 }}
            >
              {meta.category_name}
            </Typography>
            {event.tag && (
              <Chip
                label={event.tag}
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  maxWidth: "100%",
                  height: 23,
                  border: "1px solid rgba(124, 198, 255, 0.16)",
                  backgroundColor: "rgba(124, 198, 255, 0.07)",
                  color: "rgba(205, 230, 255, 0.86)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              ...eventCardTitleSx,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              lineHeight: 1.3,
              overflowWrap: "anywhere",
              m: 0,
            }}
          >
            {event.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.58)", fontSize: "0.78rem", lineHeight: 1.5, overflowWrap: "anywhere" }}
          >
            Hosted by {meta.group_name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mt: "auto", pt: 1 }}>
            <GroupsRoundedIcon sx={{ fontSize: "1rem", color: "#7cc6ff" }} />
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.84)", fontWeight: 600 }}>
              {meta.attendance.going} going
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.48)" }}>
              · {meta.attendance.interested} interested
            </Typography>
          </Box>
        </StyledCardContent>
        <CardFooter
          isFutureDateOrNow={isFutureDateOrNow}
          scheduled_at={scheduled_at}
          location={meta.group_location}
        />
      </StyledCard>
    </Grid>
  );
}

export default React.memo(EventHeroCard);
