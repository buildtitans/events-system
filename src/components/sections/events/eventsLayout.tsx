"use client"
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import type { JSX } from 'react';
import { RenderEventsLayout } from '@/src/components/pipelines/events/renderEventsLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
import { EventsPages } from '@/src/lib/store/slices/events/EventsSlice';
const MotionGrid = motion(Grid);


function EventsLayout({ eventsPages, currentPage }: { eventsPages: EventsPages, currentPage: number }): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const page = useMemo(() => {
        const pg = eventsPages[currentPage];

        return pg ?? [];
    }, [eventsPages, currentPage]);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };


    return (
        <AnimatePresence >
            {(page) && <MotionGrid

                key={currentPage}
                variants={fadeInOut}
                initial="initial"
                animate="animate"
                exit="exit"
                container
                spacing={2}
                columns={12}
            >
                <RenderEventsLayout
                    slots={page}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                />
            </MotionGrid>}
        </AnimatePresence>
    );
};

export default EventsLayout;