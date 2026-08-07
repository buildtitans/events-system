"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import type { JSX } from "react";
import {
  StyledCard,
  StyledCardContent,
} from "@/src/client/styles/styledComponents/styledCard";
import {
  eventCardContentSx,
  eventCardFooterClusterSx,
  eventCardFooterSx,
  eventCardRootSx,
} from "@/src/client/styles/sx/eventCard";

const skeletonSx = {
  bgcolor: "rgba(255, 255, 255, 0.08)",
};

export default function EventStackCardSkeleton(): JSX.Element {
  return (
    <StyledCard
      variant="outlined"
      aria-hidden="true"
      sx={{
        ...eventCardRootSx,
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <StyledCardContent
        sx={{
          ...eventCardContentSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Skeleton
            variant="text"
            animation="wave"
            width="32%"
            sx={{ ...skeletonSx, fontSize: "0.76rem" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="68%"
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
              width="78%"
              sx={skeletonSx}
            />
          </Box>
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
  );
}
