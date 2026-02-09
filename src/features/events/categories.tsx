"use client"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";

type EventCategoriesProps = {
    handleClick: (category: PresentedCategory) => () => void
}

export function EventCategories({ handleClick }: EventCategoriesProps) {

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                gap: 3,
                overflow: 'auto',
            }}
        >
            <Chip onClick={handleClick("Upcoming events")} size="medium" label="Upcoming events" />
            <Chip
                onClick={handleClick("Popular Events")}
                size="medium"
                label="Local events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick("Popular Events")}
                size="medium"
                label="Online events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick("Popular Events")}
                size="medium"
                label="Categories"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick("Popular Events")}
                size="medium"
                label="Popular events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
        </Box>
    )
}
