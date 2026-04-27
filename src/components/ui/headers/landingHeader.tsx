"use client";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { RenderEventPagination } from "@/src/components/pipelines/buttons/renderEventPagination";
import type { RootState } from "@/src/lib/store";

const metaPillSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(10px)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

function LandingHeader({ isMobile }: { isMobile: boolean }) {
  const displayed = useSelector((s: RootState) => s.events.displayed);
  const eventPages = useSelector((s: RootState) => s.events.eventPages);
  const mountStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);

  const pages = eventPages.status === "ready" ? eventPages.data.length : 0;
  const totalEvents =
    eventPages.status === "ready"
      ? eventPages.data.reduce((pageCount, page) => {
          return (
            pageCount +
            page.reduce((slotCount, slot) => {
              return slot.kind === "card"
                ? slotCount + 1
                : slotCount + slot.events.length;
            }, 0)
          );
        }, 0)
      : 0;

  const headerSummary =
    totalEvents > 0
      ? `${totalEvents} event${totalEvents === 1 ? "" : "s"} ready to explore`
      : "Fresh picks are on the way";
  const pagination = !isMobile
    ? RenderEventPagination(eventPages.status, mountStatus, pages)
    : null;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      justifyContent="space-between"
      gap={{ xs: 3, md: 4 }}
    >
      <Box sx={{ maxWidth: { xs: "100%", md: 720 } }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            mb: 1,
            color: "rgba(124, 198, 255, 0.88)",
            fontWeight: 700,
            letterSpacing: "0.22em",
          }}
        >
          Discover
        </Typography>
        <Typography
          variant={isMobile ? "h3" : "h2"}
          sx={{
            mb: 1.5,
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: "-0.04em",
          }}
        >
          Find your next{" "}
          <Box
            component="span"
            sx={{
              color: "#7cc6ff",
              textShadow: "0 0 32px rgba(124, 198, 255, 0.3)",
            }}
          >
            event
          </Box>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: { xs: "100%", md: "58ch" },
            color: "rgba(255, 255, 255, 0.72)",
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.7,
          }}
        >
          Browse talks, workshops, and meetups happening online and near you.
        </Typography>

        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1.25} sx={{ mt: 2.25 }}>
          <Box sx={metaPillSx}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.56)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Now showing
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 700 }}>
              {displayed}
            </Typography>
          </Box>

          <Box sx={metaPillSx}>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.88)" }}>
              {headerSummary}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {pagination ? (
        <Stack
          spacing={1.25}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          sx={{ minWidth: "fit-content" }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.56)",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Browse pages
          </Typography>
          <Box sx={metaPillSx}>{pagination}</Box>
        </Stack>
      ) : null}
    </Stack>
  );
}

export { LandingHeader };
