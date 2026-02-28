"use client"
import { type JSX, useCallback } from "react";
import Box from '@mui/material/Box';
import { EventCategories } from "./categories";
import type { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { useChangeActiveCategory } from "@/src/lib/hooks/filters/useChangeActiveCategory";
import { RenderEventPagination } from "@/src/components/pipelines/buttons/renderEventPagination";
import { activeCategorySx } from "@/src/lib/tokens/sxTokens";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

function CategoryChips(): JSX.Element {
    const eventsPages = useSelector((s: RootState) => s.events.eventPages);
    const pages = eventsPages.status === "ready" ? eventsPages.data.length : 0;
    const {
        setFilter,
        mountStatus,
        eventStatus
    } = useChangeActiveCategory();

    const handleFilter = useCallback((
        filter: PresentedCategory
    ) => {
        setFilter(filter);
    }, [setFilter]);

    return (
        <Box
            sx={activeCategorySx}
        >
            <EventCategories
                handleFilter={handleFilter}
            />
            {RenderEventPagination(eventStatus, mountStatus, pages)}
        </Box>
    );
}

export { CategoryChips };