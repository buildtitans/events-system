"use client"
import { type JSX, useCallback } from "react";
import Box from '@mui/material/Box';
import { EventCategories, EventCategoriesProps } from "./categories";
import type { EventDisplayFilter } from "@/src/lib/store/slices/events/types";
import { useChangeActiveCategory } from "@/src/lib/hooks/filters/useChangeActiveCategory";
import { RenderEventPagination } from "@/src/components/pipelines/buttons/renderEventPagination";
import { activeCategorySx } from "@/src/lib/tokens/sxTokens";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderCategoryChips } from "@/src/components/pipelines/buttons/renderCategoryChips";

function CategoryChips(): JSX.Element {
    const eventsPages = useSelector((s: RootState) => s.events.eventPages);
    const pages = eventsPages.status === "ready" ? eventsPages.data.length : 0;
    const {
        setFilter,
        mountStatus,
        eventStatus,
        pendingFilter
    } = useChangeActiveCategory();
    

    const handleFilter = useCallback((
        filter: EventDisplayFilter
    ) => {
        setFilter(filter);
    }, [setFilter]);

const chipProps: EventCategoriesProps = {
        handleFilter,
        pendingFilter
    }

    return (
        <Box sx={activeCategorySx}>
            {RenderCategoryChips({ status: mountStatus, rest: chipProps})}

            {RenderEventPagination(
                eventStatus,
                mountStatus,
                pages
            )}
        </Box>
    );
}

export { CategoryChips };