"use client";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useState } from "react";

export default function OpenedEventImage({ thumbnail }: {
    thumbnail: string | null
}) {
    const [loaded, setLoaded] = useState<boolean>(false);

    if (!thumbnail) return null;

    return (
        <Box sx={{
            width: "100%",
            height: "auto",
            maxWidth: 500,
            textAlign: "center",
            borderRadius: 2,
            overflow: "hidden",
        }} >
            <Card variant="elevation" >
                <CardMedia
                    sx={{
                        display: loaded ? "block" : "none",
                        width: "100%",
                        height: "auto"
                    }}
                    onLoad={() => setLoaded(true)}
                    component={"img"}
                    image={thumbnail}

                />
                {!loaded && <Skeleton
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                    variant="rectangular"
                    animation="wave"
                    width="100%"
                    height={300} />}

            </Card>

        </Box>
    )

}