"use client";

import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type SearchResultsEmptyFallbackProps = {
  query: string;
};

export default function SearchResultsEmptyFallback({
  query,
}: SearchResultsEmptyFallbackProps) {
  const trimmedQuery = query.trim();

  return (
    <Box role="status" sx={rootSx}>
      <Box sx={glowSx} />
      <Box sx={accentSx} />

      <Stack alignItems="center" textAlign="center" gap={1.25} sx={contentSx}>
        <Box aria-hidden sx={iconSx}>
          <SearchOffRoundedIcon />
        </Box>

        <Typography component="h2" sx={titleSx}>
          No matches found
        </Typography>

        <Typography component="p" sx={bodySx}>
          We couldn&apos;t find any events or communities matching
          {trimmedQuery ? (
            <Typography component="span" sx={querySx}>
              {` “${trimmedQuery}”`}
            </Typography>
          ) : (
            " your search"
          )}
          .
        </Typography>

        <Typography component="p" sx={hintSx}>
          Try a shorter phrase, check the spelling, or search for a different
          event, community, or location.
        </Typography>
      </Stack>
    </Box>
  );
}

const rootSx = {
  position: "relative",
  width: "100%",
  minHeight: { xs: 280, sm: 320 },
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(135deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 72%)",
  boxShadow: "0 14px 32px rgba(0, 0, 0, 0.18)",
};

const glowSx = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 300,
  height: 300,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(124, 198, 255, 0.1) 0%, rgba(124, 198, 255, 0) 70%)",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const accentSx = {
  position: "absolute",
  inset: "0 auto 0 0",
  width: 3,
  background:
    "linear-gradient(180deg, #7cc6ff 0%, rgba(96, 162, 255, 0.6) 55%, transparent 100%)",
};

const contentSx = {
  position: "relative",
  zIndex: 1,
  maxWidth: 520,
  px: { xs: 3, sm: 5 },
  py: { xs: 4, sm: 5 },
};

const iconSx = {
  display: "grid",
  placeItems: "center",
  width: 64,
  height: 64,
  mb: 0.5,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.2)",
  backgroundColor: "rgba(124, 198, 255, 0.09)",
  color: "#7cc6ff",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  "& svg": { fontSize: 31 },
};

const titleSx = {
  color: "#ffffff",
  fontSize: { xs: "1.2rem", sm: "1.4rem" },
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const bodySx = {
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: { xs: "0.88rem", sm: "0.95rem" },
  lineHeight: 1.6,
};

const querySx = {
  color: "rgba(205, 230, 255, 0.94)",
  fontWeight: 700,
  overflowWrap: "anywhere",
};

const hintSx = {
  maxWidth: 430,
  color: "rgba(255, 255, 255, 0.45)",
  fontSize: { xs: "0.78rem", sm: "0.82rem" },
  lineHeight: 1.55,
};
