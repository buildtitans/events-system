import { AppDispatch } from "@/src/lib/store";
import { nextEventsPage, prevEventsPage } from "@/src/lib/store/slices/EventsSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import type { JSX } from "react";

function PaginateEvents(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            width: 'fit',
        }}>
            <Button
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", fontWeight: 'light', borderRadius: 2 }}
                onClick={() => dispatch(prevEventsPage())}>
                Previous
            </Button>
            <Button
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", fontWeight: 'light', borderRadius: 2 }}
                onClick={() => dispatch(nextEventsPage())}>
                next
            </Button>
        </Box>
    )

}


export { PaginateEvents };