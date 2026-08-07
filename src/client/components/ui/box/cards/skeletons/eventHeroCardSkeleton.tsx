"use client";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import type { JSX } from "react";
import {
  eventCardContentSx,
  eventCardFooterClusterSx,
  eventCardFooterSx,
  eventCardMediaOverlaySx,
  eventCardMediaSx,
  eventCardMediaWrapSx,
  eventCardRootSx,
} from "@/src/client/styles/sx/eventCard";
import type { CardDesignation } from "../eventHeroCard";

type EventHeroCardSkeletonProps = {
  variant: CardDesignation;
};

const skeletonSx = {
  bgcolor: "rgba(255, 255, 255, 0.08)",
};

export default function EventHeroCardSkeleton({
  variant,
}: EventHeroCardSkeletonProps): JSX.Element {
  return (
    <Grid
      size={{
        xs: variant.size.xs,
        md: variant.size.md,
      }}
      aria-hidden="true"
    >
      <StyledCard
        variant="outlined"
        sx={{
          ...eventCardRootSx,
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Box sx={eventCardMediaWrapSx}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="100%"
            sx={{
              ...skeletonSx,
              ...eventCardMediaSx,
              transform: "none",
            }}
          />
          <Box sx={eventCardMediaOverlaySx} />
        </Box>

        <StyledCardContent sx={eventCardContentSx}>
          <Skeleton
            variant="text"
            animation="wave"
            width="28%"
            sx={{ ...skeletonSx, fontSize: "0.76rem" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="72%"
            sx={{ ...skeletonSx, fontSize: "1.25rem" }}
          />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton
              variant="text"
              animation="wave"
              width="100%"
              sx={skeletonSx}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width="84%"
              sx={skeletonSx}
            />
          </Box>
        </StyledCardContent>

        <Box sx={eventCardFooterSx}>
          <Box sx={{ ...eventCardFooterClusterSx, flex: 1 }}>
            <Skeleton
              variant="circular"
              animation="wave"
              width={18}
              height={18}
              sx={{ ...skeletonSx, flexShrink: 0 }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width="58%"
              sx={skeletonSx}
            />
          </Box>
          <Box
            sx={{
              ...eventCardFooterClusterSx,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Skeleton
              variant="circular"
              animation="wave"
              width={18}
              height={18}
              sx={{ ...skeletonSx, flexShrink: 0 }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width="66%"
              sx={skeletonSx}
            />
          </Box>
        </Box>
      </StyledCard>
    </Grid>
  );
}
