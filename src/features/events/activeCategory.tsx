"use client"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/src/lib/store"
import { useCallback, type JSX } from "react";
import Box from '@mui/material/Box';
import { EventCategories } from "./categories";
import { selectCategory, type PresentedCategory } from "@/src/lib/store/slices/events/EventsSlice";
import { PaginateEvents } from "@/src/components/ui/box/pagination/paginateEvents";

function ActiveCategory(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>()


    const handleClick = useCallback((category: PresentedCategory) => {
        return () => {
            dispatch(selectCategory(category))
        }
    }, [dispatch]);

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
            <EventCategories handleClick={handleClick} />
            <PaginateEvents />
        </Box>
    );
}

export { ActiveCategory };