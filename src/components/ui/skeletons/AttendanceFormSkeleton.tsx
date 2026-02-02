"use client";
import FadeInOutBox from "../box/fadeInOutBox";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { JSX } from "react";

export default function AttendanceFormSkeleton(): JSX.Element {

    return (
        <FadeInOutBox>
            <Stack spacing={1}>
                <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={"100%"}
                    height={200}
                />
            </Stack>
        </FadeInOutBox>
    )
}