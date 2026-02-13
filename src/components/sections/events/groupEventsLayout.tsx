"use client"
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { RenderEventsLayout } from '@/src/components/pipelines/events/renderEventsLayout';
import { EventsPages } from '@/src/lib/store/slices/events/EventsSlice';


function GroupEventsLayout({ eventsPages }: { eventsPages: EventsPages }): JSX.Element | null {
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const page = useMemo(() => {
        const pg = eventsPages[currentPage];

        return pg ?? [];
    }, [eventsPages, currentPage]);

    console.log(page);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <>
            {(page) && <Grid
                key={currentPage}
                container
                spacing={2}
                columns={12}
                sx={{
                    willChange: "transform",
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                    contain: "layout paint style",
                }}
            >
                {
                    RenderEventsLayout(
                        page,
                        handleBlur,
                        handleFocus,
                        focusedCardIndex)
                }
            </Grid>}
        </>

    );
};

export default GroupEventsLayout;