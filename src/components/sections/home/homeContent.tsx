"use client"
import Box from '@mui/material/Box';
import { type JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { loadGroupsPipeline } from '@/src/components/pipelines/groups/loadGroupsPipeline';
import { LoadEventsPipeline } from '@/src/components/pipelines/events/loadEventsPipeline';

export default function HomeContent(): JSX.Element {
    const events = useSelector((s: RootState) => s.events.eventPages);
    const initialLoadStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);

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


            {LoadEventsPipeline(initialLoadStatus, events)}

            {loadGroupsPipeline(initialLoadStatus)}
        </Box>

    )
}