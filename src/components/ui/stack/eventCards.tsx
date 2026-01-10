"use client"
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { renderLayout } from '@/src/components/layout/engines/renderLayout';

function EventCards(): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const events = useSelector((s: RootState) => s.events.events);
    if ((!events) || (events.length === 0)) return null;

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <Grid container spacing={2} columns={12}>
            {renderLayout(events, handleBlur, handleFocus, focusedCardIndex)}
        </Grid>
    )
}

export default EventCards;