"use client"
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { renderLayout } from '@/src/components/layout/engines/renderLayout';
import type { RootState } from "@/src/lib/store/root/store";

function EventCards(): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const eventsPages = useSelector((s: RootState) => s.events.eventPages);
    const currentPage = useSelector((s: RootState) => s.events.currentPage)

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <Grid container spacing={2} columns={12}>
            {renderLayout(eventsPages[currentPage], handleBlur, handleFocus, focusedCardIndex)}
        </Grid>
    )
}

export default EventCards;