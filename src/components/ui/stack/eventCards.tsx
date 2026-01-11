"use client"
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { renderLayout } from '@/src/components/layout/rendering/renderLayout';

function EventCards(): JSX.Element | null {
    const eventsPages = useSelector((s: RootState) => s.events.eventPages);
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    if ((!eventsPages) || (eventsPages.length === 0)) return null;

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