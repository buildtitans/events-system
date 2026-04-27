"use client"
import Box from "@mui/material/Box";
import CategoryChip from "./categoryChip";
import type { EventDisplayFilter } from "@/src/lib/store/slices/events/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { FILTERS } from "@/src/lib/tokens/categoryTokens";

export type EventCategoriesProps = {
    handleFilter: (filter: EventDisplayFilter) => void,
    pendingFilter: boolean,
    isMobile: boolean
}

export function EventCategories({
    handleFilter,
    pendingFilter,
    isMobile
}: EventCategoriesProps) {
    const active = useSelector((s: RootState) => s.events.displayed);

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                overflowX: 'auto',
                overflowY: 'hidden',
                width: { xs: "100%", md: "fit-content"},
                maxWidth: '100%',
                p: 0.5,
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            {FILTERS.map((filter) => (
                <CategoryChip
                    key={filter}
                    isActive={filter === active}
                    filter={filter}
                    handleFilter={handleFilter}
                    pendingFilter={pendingFilter}
                    isMobile={isMobile}
                />
            ))}

        </Box>
    )
};
