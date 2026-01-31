import { AppDispatch, RootState } from "@/src/lib/store";
import { goToEventsPage, nextEventsPage, prevEventsPage } from "@/src/lib/store/slices/EventsSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import type { JSX } from "react";
import Pagination from "@mui/material/Pagination";

function PaginateEvents(): JSX.Element {
    const layoutSlots = useSelector((s: RootState) => s.events.eventPages);
    const dispatch = useDispatch<AppDispatch>();
    const count = layoutSlots.length;
    const handleClick = (e: React.ChangeEvent<unknown>, page: number) => {
        const pageClicked = page - 1;
        dispatch(goToEventsPage(pageClicked));
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            width: 'fit',
        }}>
            <Pagination onChange={handleClick} count={count} />

        </Box>
    )

}


export { PaginateEvents };