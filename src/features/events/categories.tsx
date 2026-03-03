"use client"
import Box from "@mui/material/Box";
import CategoryChip from "./categoryChip";
import type { EventDisplayFilter } from "@/src/lib/store/slices/events/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { FILTERS } from "@/src/lib/tokens/categoryTokens";

export type EventCategoriesProps = {
    handleFilter: (filter: EventDisplayFilter) => void,
    pendingFilter: boolean
}

export function EventCategories({
    handleFilter,
    pendingFilter
}: EventCategoriesProps) {
    const active = useSelector((s: RootState) => s.events.displayed);

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                gap: 3,
                overflow: 'auto',
            }}
        >
            {FILTERS.map((filter) => (
                <CategoryChip
                    key={filter}
                    isActive={filter === active}
                    filter={filter}
                    handleFilter={handleFilter}
                    pendingFilter={pendingFilter}
                />
            ))}

        </Box>
    )
};