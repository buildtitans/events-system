"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function UpNextEventFallback() {
  return (
    <Box role="status" sx={rootSx}>
      <Box sx={accentSx} />

      <Stack sx={contentSx}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={calendarIconSx}>
            <CalendarMonthRoundedIcon fontSize="small" />
          </Box>
          <Typography component="span" sx={eyebrowSx}>
            Up next
          </Typography>
        </Stack>

        <Stack sx={messageSx}>
          <Box sx={emptyIconSx}>
            <EventAvailableRoundedIcon />
          </Box>
          <Typography component="h3" sx={titleSx}>
            Nothing scheduled yet
          </Typography>
          <Typography component="p" sx={descriptionSx}>
            New community events will appear here as soon as they are
            announced.
          </Typography>
        </Stack>

        <Box sx={detailsSx}>
          <Typography component="p" sx={detailsTextSx}>
            Check back soon for the next gathering.
          </Typography>
        </Box>
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
      "radial-gradient(circle, rgba(124, 198, 255, 0.11) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
};

const accentSx = {
  height: 3,
  opacity: 0.55,
  background:
    "linear-gradient(90deg, #7cc6ff 0%, rgba(96, 162, 255, 0.5) 48%, transparent 100%)",
};

const contentSx = {
  position: "relative",
  zIndex: 1,
  minHeight: { xs: 357, md: 427 },
  p: { xs: 2.25, md: 3 },
  gap: { xs: 2, md: 2.5 },
};

const calendarIconSx = {
  display: "grid",
  placeItems: "center",
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.18)",
  backgroundColor: "rgba(124, 198, 255, 0.06)",
  color: "rgba(124, 198, 255, 0.72)",
};

const eyebrowSx = {
  color: "rgba(124, 198, 255, 0.76)",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const messageSx = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  px: { xs: 1, md: 4 },
  textAlign: "center",
  gap: 1.5,
};

const emptyIconSx = {
  display: "grid",
  placeItems: "center",
  width: 58,
  height: 58,
  mb: 0.5,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.18)",
  backgroundColor: "rgba(124, 198, 255, 0.07)",
  color: "rgba(124, 198, 255, 0.78)",
};

const titleSx = {
  color: "#ffffff",
  fontSize: "1.4rem",
  fontWeight: 650,
  letterSpacing: "-0.02em",
};

const descriptionSx = {
  maxWidth: 340,
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "0.92rem",
  lineHeight: 1.65,
};

const detailsSx = {
  p: 1.5,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.07)",
  backgroundColor: "rgba(255, 255, 255, 0.025)",
  textAlign: "center",
};

const detailsTextSx = {
  color: "rgba(255, 255, 255, 0.48)",
  fontSize: "0.82rem",
  fontWeight: 500,
};
