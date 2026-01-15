"use client"
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { renderLayout } from '@/src/components/pipelines/events/renderLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
const MotionGrid = motion(Grid);


function EventCards(): JSX.Element | null {
    const eventsPages = useSelector((s: RootState) => s.events.eventPages);
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const page = eventsPages?.[currentPage];
    if (!page) return null;

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };


    return (
        <AnimatePresence mode='wait'>
            <MotionGrid
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
                {renderLayout(eventsPages[currentPage], handleBlur, handleFocus, focusedCardIndex)}
            </MotionGrid>
        </AnimatePresence>

    )
}

export default EventCards;