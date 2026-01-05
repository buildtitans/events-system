"use client"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/src/store"
import { PresentedCategory } from "@/src/store/slices/EventCategorySlice";

type EventCategoriesProps = {
    handleClick: (category: PresentedCategory) => () => void
}

export function EventCategories({ handleClick }: EventCategoriesProps) {
    const displayed = useSelector((s: RootState) => s.categories.displayed);

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
