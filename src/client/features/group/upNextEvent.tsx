"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

export type UpNextEventProps = {
  event: EventSchemaType;
  onAction: (eventId: EventSchemaType["id"]) => void;
  actionLabel?: string;
};

export default function UpNextEvent({ event, onAction }: UpNextEventProps) {
  const startsAt = new Date(event.starts_at);
  const month = startsAt.toLocaleDateString(undefined, { month: "short" });
  const day = startsAt.toLocaleDateString(undefined, { day: "numeric" });

  return (
    <Box
      component="article"
      sx={andHoverSx}
      onClick={() => onAction(event.id)}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          onAction(event.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <Box className="UpNextEvent-accent" sx={accentSx} />

      <Stack sx={contentSx}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={calendarIconSx}>
            <CalendarMonthRoundedIcon fontSize="small" />
          </Box>
          <Typography component="span" sx={eyebrowSx}>
            Up next
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="flex-start" gap={2}>
          <Stack sx={dateTileSx}>
            <Typography component="span" sx={dateMonthSx}>
              {month}
            </Typography>
            <Typography component="span" sx={dateDaySx}>
              {day}
            </Typography>
          </Stack>

          <Stack gap={1} minWidth={0}>
            {event.tag && <Chip label={event.tag} size="small" sx={tagSx} />}
            <Typography component="h3" sx={titleSx}>
              {event.title}
            </Typography>
          </Stack>
        </Stack>

        <Typography component="p" sx={descriptionSx}>
          {event.description}
        </Typography>

        <Stack gap={1.25} sx={detailsSx}>
          <Stack direction="row" alignItems="center" gap={1}>
            <CalendarMonthRoundedIcon sx={detailIconSx} />
            <Typography component="span" sx={detailTextSx}>
              {toMonthDayYearHour(event.starts_at)}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <LocationOnRoundedIcon sx={detailIconSx} />
            <Typography component="span" sx={detailTextSx}>
              {event.meeting_location}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

const rootSx = {
  position: "relative",
  width: "100%",
  maxWidth: { xs: 380, md: 520 },
  minHeight: { xs: 360, md: 430 },
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 100%)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.22)",
  overflow: "hidden",
  "&::before": {
    content: '\"\"',
    position: "absolute",
    inset: "-22% -18% auto auto",
    width: 250,
    height: 250,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.15) 0%, rgba(124, 198, 255, 0) 72%)",
    opacity: 0.78,
    pointerEvents: "none",
  },
};

const andHoverSx = {
  ...rootSx,
  cursor: "pointer",
  outline: "none",
  transform: "translateY(0)",
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  "&::before": {
    ...rootSx["&::before"],
    transition: "opacity 180ms ease",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(124, 198, 255, 0.2)",
    boxShadow:
      "0 22px 48px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 198, 255, 0.04)",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "&:hover .UpNextEvent-accent": {
    opacity: 1,
  },
  "&:focus-visible": {
    borderColor: "rgba(124, 198, 255, 0.34)",
    boxShadow:
      "0 22px 48px rgba(0, 0, 0, 0.28), 0 0 0 3px rgba(124, 198, 255, 0.12)",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": {
      transform: "none",
    },
  },
};

const accentSx = {
  height: 3,
  opacity: 0.78,
  transition: "opacity 180ms ease",
  background:
    "linear-gradient(90deg, #7cc6ff 0%, rgba(96, 162, 255, 0.72) 48%, transparent 100%)",
};

const contentSx = {
  position: "relative",
  zIndex: 1,
  height: "100%",
  p: { xs: 2.25, md: 3 },
  gap: { xs: 2, md: 2.5 },
};

const eyebrowSx = {
  color: "rgba(124, 198, 255, 0.88)",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const calendarIconSx = {
  display: "grid",
  placeItems: "center",
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.2)",
  backgroundColor: "rgba(124, 198, 255, 0.08)",
  color: "#7cc6ff",
};

const dateTileSx = {
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 68,
  minHeight: 76,
  borderRadius: 3,
  border: "1px solid rgba(124, 198, 255, 0.2)",
  backgroundColor: "rgba(124, 198, 255, 0.07)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

const dateMonthSx = {
  color: "#7cc6ff",
  fontSize: "0.7rem",
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const dateDaySx = {
  color: "#ffffff",
  fontSize: "1.9rem",
  fontWeight: 700,
  lineHeight: 1.05,
};

const tagSx = {
  alignSelf: "flex-start",
  height: 24,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleSx = {
  color: "#ffffff",
  fontSize: { xs: "1.35rem", md: "1.55rem" },
  fontWeight: 700,
  letterSpacing: "-0.025em",
  lineHeight: 1.2,
};

const descriptionSx = {
  color: "rgba(255, 255, 255, 0.62)",
  fontSize: "0.92rem",
  lineHeight: 1.65,
};

const detailsSx = {
  mt: "auto",
  p: 1.5,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.07)",
  backgroundColor: "rgba(255, 255, 255, 0.025)",
};

const detailIconSx = {
  color: "rgba(124, 198, 255, 0.82)",
  fontSize: 19,
};

const detailTextSx = {
  color: "rgba(255, 255, 255, 0.76)",
  fontSize: "0.84rem",
  fontWeight: 500,
};
