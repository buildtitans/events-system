"use client"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { useSelector } from "react-redux";

type EventCategoriesProps = {
    handleClick: (category: PresentedCategory) => void
}

export function EventCategories({ handleClick }: EventCategoriesProps) {
    const categories = ["Upcoming events", "Popular Events", "Local events", "Tech Events"];

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                gap: 3,
                overflow: 'auto',
            }}
        >

            {categories.map((category) => (
                <Chip key={category} onClick={() => handleClick("Popular Events")} size="medium" label={category} />
            ))}

        </Box>
    )
}
