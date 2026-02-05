"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { closeEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { useHydrateEventDrawer } from "@/src/lib/hooks/preload/usePreloadAttendance";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { AnimatePresence } from "framer-motion";
import OpenedEvent from "../stack/OpenedEvent";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import CheckOutGroupButton from "../buttons/checkOutGroupButton";

type EventDrawerProps = {
    open: boolean,
}

export default function OpenedEventDrawer({ open }: EventDrawerProps) {
    useHydrateEventDrawer();
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const dispatch = useDispatch<AppDispatch>();
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
            PaperProps={{
                elevation: 4,
                sx: {
                    width: 500,
                    backgroundColor: 'black',
                },
            }}
        >
            <AnimatePresence mode="wait">
                {(event) &&
                    <OpenedEvent
                        key={"event-opened"}
                        event={event}
                    />
                }

            </AnimatePresence>

            <CheckOutGroupButton
                event={event}
            />

            {(event) && <MembersOnlyAttendanceForm
                group_id={event.group_id}
            />}
        </Drawer>
    );
};