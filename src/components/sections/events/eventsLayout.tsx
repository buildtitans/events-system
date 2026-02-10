"use client"
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { RenderEventsLayout } from '@/src/components/pipelines/events/renderEventsLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
import { EventsPages } from '@/src/lib/store/slices/events/EventsSlice';
const MotionGrid = motion(Grid);


function EventsLayout({ eventsPages }: { eventsPages: EventsPages }): JSX.Element | null {
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const page = useMemo(() => {
        const pg = eventsPages[currentPage];

        return pg ?? [];
    }, [eventsPages, currentPage])

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <AnimatePresence initial={false} mode='wait'>
            {(page) && <MotionGrid
                key={currentPage}
                variants={fadeInOut}
                initial="initial"
                animate="animate"
                exit="exit"
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
            </MotionGrid>}
        </AnimatePresence>
    );
};

export default EventsLayout;