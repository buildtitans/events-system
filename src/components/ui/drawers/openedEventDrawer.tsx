"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { closeEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { useHydrateEventDrawer } from "@/src/lib/hooks/preload/usePreloadAttendance";
import { JSX } from "react";
import { renderEventDrawerContents } from "../../pipelines/drawers/renderEventDrawer";

type EventDrawerProps = {
    open: boolean
}

export default function OpenedEventDrawer({ open }: EventDrawerProps): JSX.Element | null {
    useHydrateEventDrawer();
    const dispatch = useDispatch<AppDispatch>();
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const closeDrawer = () => {
        dispatch(closeEventDrawer());
    };


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={closeDrawer}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}
            slotProps={{
                paper: {
                    elevation: 4,
                    sx: {
                        width: 500,
                        backgroundColor: 'black',
                    },
                }
            }}
        >
            {renderEventDrawerContents(event)}
        </Drawer>
    );
};