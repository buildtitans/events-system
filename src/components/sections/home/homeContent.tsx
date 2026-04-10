"use client"
import Box from '@mui/material/Box';
import { type JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { loadGroupsPipeline } from '@/src/components/pipelines/groups/loadGroupsPipeline';
import { EventsPipeline } from '../../pipelines/events/eventsPipeline';
import { RenderEventPagination } from '../../pipelines/buttons/renderEventPagination';

export default function HomeContent({ isMobile }: {isMobile: boolean}): JSX.Element {
    const events = useSelector((s: RootState) => s.events.eventPages);
    const initialLoadStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const pages = events.status === "ready" ? events.data.length : 0;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: 'start',
                justifyContent: 'center',
            }}
        >
            {EventsPipeline(events)}

            {isMobile && RenderEventPagination(events.status, initialLoadStatus, pages)}

            {loadGroupsPipeline(initialLoadStatus)}

        </Box>

    )
}