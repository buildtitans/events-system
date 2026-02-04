"use client";
import Drawer from "@mui/material/Drawer";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { closeEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { usePreloadAttendance } from "@/src/lib/hooks/preload/usePreloadAttendance";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { AnimatePresence } from "framer-motion";
import OpenedEvent from "../stack/OpenedEvent";


export default function OpenedEventDrawer({ open }: { open: boolean }) {
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const viewer = useSelector((s: RootState) => s.eventDrawer.viewerAttendanceInfo);
    const viewerType = useSelector((s: RootState) => s.groupMembers.viewerKind);
    usePreloadAttendance();
    const dispatch = useDispatch<AppDispatch>()



    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => dispatch(closeEventDrawer())}
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
                {(event) && <OpenedEvent key={"event-opened"} event={event} />}
            </AnimatePresence>

            <MembersOnlyAttendanceForm
                viewer={viewer}
                viewerType={viewerType}
            />

        </Drawer>
    )


}