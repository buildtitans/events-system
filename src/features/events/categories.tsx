"use client"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { CATEGORIES } from "@/src/lib/tokens/categoryTokens";

type EventCategoriesProps = {
    handleClick: (category: PresentedCategory) => void
}

export function EventCategories({
    handleClick
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

            {CATEGORIES.map((category) => (
                <Chip
                    color={(active === category) ? 'primary' : "default"}
                    clickable={true}
                    key={category}
                    onClick={() => handleClick(category)}
                    size="medium"
                    label={category}
                />
            ))}

        </Box>
    )
}
