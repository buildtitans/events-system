"use client"
import { type JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { EventsPipeline } from '../../pipelines/events/eventsPipeline';
import { RenderEventPagination } from '../../pipelines/buttons/renderEventPagination';
import LandingPageGroupSection from '../group/landingPageGroupSection';
import { Stack } from '@mui/material';

export default function HomeContent({ isMobile }: {isMobile: boolean}): JSX.Element {
    const events = useSelector((s: RootState) => s.events.eventPages);
    const initialLoadStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const pages = events.status === "ready" ? events.data.length : 0;

    return (
        <Stack
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: 'start',
                justifyContent: 'center',
            }}
        >
            <Stack
            minHeight={800}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            direction={"row"}
            >
            {EventsPipeline(events)}
            </Stack>
            

            {isMobile && RenderEventPagination(events.status, initialLoadStatus, pages)}

            <LandingPageGroupSection />

        </Stack>

    )
}