"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

export type EventSearchResultItemProps = {
  event: EventSchemaType;
  onAction: (eventId: EventSchemaType["id"]) => void;
  groupName?: string | null;
};

export default function EventSearchResultItem({
  event,
  onAction,
  groupName,
}: EventSearchResultItemProps) {
  const startsAt = new Date(event.starts_at);
  const month = startsAt.toLocaleDateString(undefined, { month: "short" });
  const day = startsAt.toLocaleDateString(undefined, { day: "numeric" });
  const openEvent = () => onAction(event.id);

  return (
    <Box
      component="article"
      role="button"
      tabIndex={0}
      aria-label={`Open ${event.title}`}
      onClick={openEvent}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          openEvent();
        }
      }}
      sx={rootSx}
    >
      <Box className="EventSearchResultItem-accent" sx={accentSx} />

      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1.5, sm: 2 }}
        sx={contentSx}
      >
        <Stack sx={dateTileSx}>
          <Typography component="span" sx={dateMonthSx}>
            {month}
          </Typography>
          <Typography component="span" sx={dateDaySx}>
            {day}
          </Typography>
        </Stack>

        <Stack minWidth={0} flex={1} gap={0.75}>
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <Typography component="span" sx={eyebrowSx}>
              Event
            </Typography>
            {event.tag && <Chip label={event.tag} size="small" sx={tagSx} />}
            {groupName && (
              <Typography component="span" sx={groupNameSx}>
                Hosted by {groupName}
              </Typography>
            )}
          </Stack>

          <Typography component="h2" sx={titleSx}>
            {event.title}
          </Typography>

          <Typography component="p" sx={descriptionSx}>
            {event.description || "No event description has been added yet."}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            columnGap={2}
            rowGap={0.5}
            mt={0.25}
          >
            <Stack direction="row" alignItems="center" gap={0.75} sx={metaSx}>
              <CalendarMonthRoundedIcon sx={metaIconSx} />
              <Typography component="span" sx={metaTextSx}>
                {toMonthDayYearHour(event.starts_at)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.75} sx={metaSx}>
              <LocationOnRoundedIcon sx={metaIconSx} />
              <Typography component="span" sx={metaTextSx}>
                {event.meeting_location}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box className="EventSearchResultItem-arrow" sx={arrowSx}>
          <ArrowForwardRoundedIcon />
        </Box>
      </Stack>
    </Box>
  );
}

const rootSx = {
  position: "relative",
  width: "100%",
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(135deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 72%)",
  boxShadow: "0 14px 32px rgba(0, 0, 0, 0.18)",
  cursor: "pointer",
  outline: "none",
  overflow: "hidden",
  transform: "translateY(0)",
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  "&::before": {
    content: '\"\"',
    position: "absolute",
    inset: "-80px -70px auto auto",
    width: 190,
    height: 190,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.11) 0%, rgba(124, 198, 255, 0) 72%)",
    opacity: 0.65,
    pointerEvents: "none",
    transition: "opacity 180ms ease",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(124, 198, 255, 0.22)",
    boxShadow:
      "0 18px 38px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 198, 255, 0.04)",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "&:hover .EventSearchResultItem-accent": {
    opacity: 1,
  },
  "&:hover .EventSearchResultItem-arrow": {
    color: "#a9d8ff",
    borderColor: "rgba(124, 198, 255, 0.26)",
    backgroundColor: "rgba(124, 198, 255, 0.12)",
    transform: "translateX(2px)",
  },
  "&:focus-visible": {
    borderColor: "rgba(124, 198, 255, 0.38)",
    boxShadow:
      "0 18px 38px rgba(0, 0, 0, 0.24), 0 0 0 3px rgba(124, 198, 255, 0.12)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": { transform: "none" },
    "& .EventSearchResultItem-arrow": { transition: "none" },
  },
};

const accentSx = {
  position: "absolute",
  inset: "0 auto 0 0",
  width: 3,
  opacity: 0.72,
  background:
    "linear-gradient(180deg, #7cc6ff 0%, rgba(96, 162, 255, 0.6) 55%, transparent 100%)",
  transition: "opacity 180ms ease",
};

const contentSx = {
  position: "relative",
  zIndex: 1,
  p: { xs: 1.75, sm: 2.25 },
};

const dateTileSx = {
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: { xs: 48, sm: 58 },
  minHeight: { xs: 54, sm: 64 },
  borderRadius: 2.5,
  border: "1px solid rgba(124, 198, 255, 0.2)",
  backgroundColor: "rgba(124, 198, 255, 0.09)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

const dateMonthSx = {
  color: "#7cc6ff",
  fontSize: "0.64rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const dateDaySx = {
  color: "#ffffff",
  fontSize: { xs: "1.35rem", sm: "1.6rem" },
  fontWeight: 700,
  lineHeight: 1.05,
};

const eyebrowSx = {
  color: "rgba(124, 198, 255, 0.88)",
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const tagSx = {
  height: 22,
  border: "1px solid rgba(255, 255, 255, 0.09)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const groupNameSx = {
  color: "rgba(255, 255, 255, 0.48)",
  fontSize: "0.69rem",
  fontWeight: 600,
};

const titleSx = {
  color: "#ffffff",
  fontSize: { xs: "1rem", sm: "1.2rem" },
  fontWeight: 700,
  letterSpacing: "-0.018em",
  lineHeight: 1.25,
};

const descriptionSx = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  maxWidth: 760,
  color: "rgba(255, 255, 255, 0.62)",
  fontSize: { xs: "0.8rem", sm: "0.88rem" },
  lineHeight: 1.55,
};

const metaSx = {
  color: "rgba(255, 255, 255, 0.7)",
};

const metaIconSx = {
  color: "rgba(124, 198, 255, 0.78)",
  fontSize: 16,
};

const metaTextSx = {
  fontSize: "0.76rem",
  fontWeight: 600,
};

const arrowSx = {
  display: { xs: "none", sm: "grid" },
  placeItems: "center",
  flexShrink: 0,
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.025)",
  color: "rgba(255, 255, 255, 0.48)",
  transform: "translateX(0)",
  transition:
    "transform 180ms ease, color 180ms ease, border-color 180ms ease, background-color 180ms ease",
  "& svg": { fontSize: 20 },
};
