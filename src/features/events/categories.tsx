"use client"
import Box from "@mui/material/Box";
import CategoryChip from "./categoryChip";
import type { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { FILTERS } from "@/src/lib/tokens/categoryTokens";

export type EventCategoriesProps = {
    handleFilter: (filter: PresentedCategory) => void
}

export function EventCategories({
    handleFilter
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
                />
            ))}

        </Box>
    )
};