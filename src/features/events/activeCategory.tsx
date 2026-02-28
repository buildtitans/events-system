"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/src/lib/store"
import type { JSX } from "react";
import Box from '@mui/material/Box';
import { EventCategories } from "./categories";
import type { PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { PaginateEvents } from "@/src/components/ui/box/pagination/paginateEvents";
import { useFilterEvents } from "@/src/lib/hooks/filters/useFilterEvents";

function ActiveCategory(): JSX.Element {
    const eventsStatus = useSelector((s: RootState) => s.events.eventPages.status);
    const { setFilter } = useFilterEvents();

    const handleFilter = (filter: PresentedCategory) => {
        if (eventsStatus === "pending" || eventsStatus === "initial") return;
        setFilter(filter);
    }

    return (
        <Box
            sx={{

                display: 'flex',
                flexDirection: {
                    xs: 'column-reverse',
                    md: 'row'
                },
                width: '100%',
                justifyContent: 'space-between',
                alignItems: {
                    xs: 'start',
                    md: 'center'
                },
                gap: 2,
                overflow: 'auto',
            }}
        >
            <EventCategories handleFilter={handleFilter} />
            <PaginateEvents />
        </Box>
    );
}

export { ActiveCategory };