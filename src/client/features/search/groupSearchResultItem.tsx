"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type GroupSearchResultItemProps = {
  group: GroupSchemaType;
  onAction: (slug: GroupSchemaType["slug"]) => void;
  categoryName?: string | null;
};

export default function GroupSearchResultItem({
  group,
  onAction,
  categoryName,
}: GroupSearchResultItemProps) {
  const openGroup = () => onAction(group.slug);

  return (
    <Box
      component="article"
      role="button"
      tabIndex={0}
      aria-label={`Open ${group.name}`}
      onClick={openGroup}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          openGroup();
        }
      }}
      sx={rootSx}
    >
      <Box className="GroupSearchResultItem-accent" sx={accentSx} />

      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1.5, sm: 2 }}
        sx={contentSx}
      >
        <Box sx={groupIconSx}>
          <GroupsRoundedIcon />
        </Box>

        <Stack minWidth={0} flex={1} gap={0.75}>
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <Typography component="span" sx={eyebrowSx}>
              Community
            </Typography>
            {categoryName && (
              <Chip label={categoryName} size="small" sx={categoryChipSx} />
            )}
          </Stack>

          <Typography component="h2" sx={titleSx}>
            {group.name}
          </Typography>

          <Typography component="p" sx={descriptionSx}>
            {group.description ?? "No community description has been added yet."}
          </Typography>

          {group.location && (
            <Stack direction="row" alignItems="center" gap={0.75} sx={metaSx}>
              <LocationOnRoundedIcon sx={metaIconSx} />
              <Typography component="span" sx={metaTextSx}>
                {group.location}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box className="GroupSearchResultItem-arrow" sx={arrowSx}>
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
  "&:hover .GroupSearchResultItem-accent": {
    opacity: 1,
  },
  "&:hover .GroupSearchResultItem-arrow": {
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
    "& .GroupSearchResultItem-arrow": { transition: "none" },
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

const groupIconSx = {
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: { xs: 44, sm: 52 },
  height: { xs: 44, sm: 52 },
  borderRadius: 2.5,
  border: "1px solid rgba(124, 198, 255, 0.2)",
  backgroundColor: "rgba(124, 198, 255, 0.09)",
  color: "#7cc6ff",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  "& svg": { fontSize: { xs: 23, sm: 27 } },
};

const eyebrowSx = {
  color: "rgba(124, 198, 255, 0.88)",
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const categoryChipSx = {
  height: 22,
  border: "1px solid rgba(124, 198, 255, 0.17)",
  backgroundColor: "rgba(124, 198, 255, 0.07)",
  color: "rgba(205, 230, 255, 0.86)",
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
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
  alignSelf: "flex-start",
  mt: 0.25,
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
