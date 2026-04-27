"use client"
import { type JSX, useCallback } from "react";
import Box from '@mui/material/Box';
import { EventCategoriesProps } from "./categories";
import type { EventDisplayFilter } from "@/src/lib/store/slices/events/types";
import { useChangeActiveCategory } from "@/src/lib/hooks/filters/useChangeActiveCategory";
import { activeCategorySx } from "@/src/lib/tokens/sxTokens";
import { RenderCategoryChips } from "@/src/components/pipelines/buttons/renderCategoryChips";

function CategoryChips({ isMobile }: { isMobile: boolean}): JSX.Element {
    const {
        setFilter,
        mountStatus,
        pendingFilter
    } = useChangeActiveCategory();
    

    const handleFilter = useCallback((
        filter: EventDisplayFilter
    ) => {
        setFilter(filter);
    }, [setFilter]);

const chipProps: EventCategoriesProps = {
        handleFilter,
        pendingFilter,
        isMobile
    }

    return (
        <Box sx={activeCategorySx}>
            {RenderCategoryChips({ status: mountStatus, rest: chipProps})}
        </Box>
    );
}

export { CategoryChips };
