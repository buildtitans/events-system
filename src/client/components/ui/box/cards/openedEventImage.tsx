"use client";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import CardMedia from "@mui/material/CardMedia";
import { useState } from "react";
import {
  openedEventImageMediaSx,
  openedEventImageSkeletonSx,
  openedEventImageWrapSx,
} from "@/src/client/styles/sx/openedEventDrawer";

export default function OpenedEventImage({ thumbnail }: {
    thumbnail: string | null
}) {
    const [loaded, setLoaded] = useState<boolean>(false);

    if (!thumbnail) return null;

    return (
        <Box sx={openedEventImageWrapSx} >
                <CardMedia
                    sx={{ 
                        ...openedEventImageMediaSx,
                        display: loaded ? "block" : "none",
                    }}
                    onLoad={() => setLoaded(true)}
                    component={"img"}
                    image={thumbnail}

                />
                {!loaded && <Skeleton
                    sx={openedEventImageSkeletonSx}
                    variant="rectangular"
                    animation="wave"
                    width="100%"
                    height={300} />}

        </Box>
    )

}
