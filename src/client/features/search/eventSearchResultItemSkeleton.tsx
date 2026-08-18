"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function EventSearchResultItemSkeleton() {
  return (
    <Box component="article" aria-label="Loading event" sx={rootSx}>
      <Box sx={accentSx} />

      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1.5, sm: 2 }}
        sx={contentSx}
      >
        <Skeleton variant="rounded" sx={{ ...blueSkeletonSx, ...dateTileSx }} />

        <Stack minWidth={0} flex={1} gap={0.75}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Skeleton variant="text" width={42} height={18} sx={blueSkeletonSx} />
            <Skeleton variant="rounded" width={68} height={22} sx={chipSx} />
            <Skeleton variant="text" width={118} height={18} sx={mutedSkeletonSx} />
          </Stack>

          <Skeleton variant="text" width="56%" height={29} sx={textSkeletonSx} />

          <Stack gap={0.25}>
            <Skeleton variant="text" width="94%" height={20} sx={mutedSkeletonSx} />
            <Skeleton variant="text" width="72%" height={20} sx={mutedSkeletonSx} />
          </Stack>

          <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2} mt={0.25}>
            <MetaSkeleton width={164} />
            <MetaSkeleton width={112} />
          </Stack>
        </Stack>

        <Skeleton variant="circular" width={38} height={38} sx={arrowSx} />
      </Stack>
    </Box>
  );
}

function MetaSkeleton({ width }: { width: number }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75}>
      <Skeleton variant="circular" width={16} height={16} sx={blueSkeletonSx} />
      <Skeleton variant="text" width={width} height={18} sx={mutedSkeletonSx} />
    </Stack>
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
  overflow: "hidden",
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
  p: { xs: 1.75, sm: 2.25 },
};

const dateTileSx = {
  flexShrink: 0,
  width: { xs: 48, sm: 58 },
  height: { xs: 54, sm: 64 },
  borderRadius: 2.5,
};

const shimmerSx = {
  "&::after": {
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
  },
};

const textSkeletonSx = {
  ...shimmerSx,
  bgcolor: "rgba(255, 255, 255, 0.12)",
};

const mutedSkeletonSx = {
  ...shimmerSx,
  bgcolor: "rgba(255, 255, 255, 0.075)",
};

const blueSkeletonSx = {
  ...shimmerSx,
  bgcolor: "rgba(124, 198, 255, 0.14)",
};

const arrowSx = {
  ...mutedSkeletonSx,
  display: { xs: "none", sm: "block" },
  flexShrink: 0,
};

const chipSx = {
  ...mutedSkeletonSx,
  borderRadius: 999,
};
