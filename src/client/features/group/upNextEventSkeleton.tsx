"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function UpNextEventSkeleton() {
  return (
    <Box aria-label="Loading next event" sx={rootSx}>
      <Box sx={accentSx} />

      <Stack sx={contentSx}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={34} height={34} sx={blueSx} />
          <Skeleton variant="text" width={72} height={18} sx={textSx} />
        </Stack>

        <Stack direction="row" alignItems="flex-start" gap={2}>
          <Skeleton
            variant="rounded"
            width={68}
            height={76}
            sx={{ ...blueSx, flexShrink: 0, borderRadius: 3 }}
          />

          <Stack gap={0.75} flex={1} minWidth={0}>
            <Skeleton
              variant="rounded"
              width={74}
              height={24}
              sx={{ ...textSx, borderRadius: 999 }}
            />
            <Skeleton variant="text" width="92%" height={30} sx={textSx} />
            <Skeleton variant="text" width="68%" height={30} sx={textSx} />
          </Stack>
        </Stack>

        <Stack gap={0.25}>
          <Skeleton variant="text" width="100%" height={22} sx={mutedSx} />
          <Skeleton variant="text" width="94%" height={22} sx={mutedSx} />
          <Skeleton variant="text" width="62%" height={22} sx={mutedSx} />
        </Stack>

        <Stack gap={1.25} sx={detailsSx}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={19} height={19} sx={blueSx} />
            <Skeleton variant="text" width="62%" height={20} sx={mutedSx} />
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={19} height={19} sx={blueSx} />
            <Skeleton variant="text" width="48%" height={20} sx={mutedSx} />
          </Stack>
        </Stack>

        <Skeleton
          variant="rounded"
          width={132}
          height={42}
          sx={{ ...blueSx, borderRadius: 999 }}
        />
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
    pointerEvents: "none",
  },
};

const accentSx = {
  height: 3,
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

const detailsSx = {
  mt: "auto",
  p: 1.5,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.07)",
  backgroundColor: "rgba(255, 255, 255, 0.025)",
};

const shimmerSx = {
  "&::after": {
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
  },
};

const textSx = {
  ...shimmerSx,
  bgcolor: "rgba(255, 255, 255, 0.12)",
};

const mutedSx = {
  ...shimmerSx,
  bgcolor: "rgba(255, 255, 255, 0.075)",
};

const blueSx = {
  ...shimmerSx,
  bgcolor: "rgba(124, 198, 255, 0.14)",
};
